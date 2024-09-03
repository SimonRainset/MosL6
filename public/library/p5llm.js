function addAxios() {
  let scriptTag = document.createElement("script");
  scriptTag.setAttribute("type", "text/javascript");
  scriptTag.src = "https://fastly.jsdelivr.net/npm/axios/dist/axios.min.js";
  document.head.appendChild(scriptTag);
}

addAxios();

class P5LLM {
  messages = [];
  maxMessage = 16;
  systemPrompt = "";
  onComplete = null;
  onStream = null;
  onError = null;

  clearAllMessage() {
    this.messages = [];
  }

  setMaxMessage(max) {
    try {
      max = parseInt(max);
    } catch (error) {
      return;
    }
    this.maxMessage = max;
  }

  setSystemPrompt(systemPrompt) {
    this.systemPrompt = systemPrompt;
  }

  // 发送前包装
  preSend() {
    // trim to max message
    if (this.maxMessage > 0) {
      if (this.messages.length > this.maxMessage) {
        this.messages.splice(1, this.messages.length - this.maxMessage);
      }
    }

    let exactMessages = [
      {
        role: "system",
        content: this.systemPrompt,
      },
      ...this.messages,
    ];

    return exactMessages;
  }

  promptCheck(userPrompt) {
    if (typeof userPrompt === "string") {
      this.messages.push({
        role: "user",
        content: userPrompt,
      });
    } else {
      this.messages = [...this.messages, ...userPrompt];
    }
  }

  send(userPrompt, stream) {
    if (stream) {
      this.stream(userPrompt);
    } else {
      this.dialog(userPrompt);
    }
  }

  dialog(userPrompt) {
    this.promptCheck(userPrompt);
  }

  stream(userPrompt) {
    // 请根据不同模型重写
    this.promptCheck(userPrompt);
  }
}

class P5Spark extends P5LLM {
  appID = "f623e299";

  Spark() {}
  setModel(model) {}

  generateRandomAPPID() {
    const min = 10000;
    const max = 99999;
    const randomFourDigitNumber =
        Math.floor(Math.random() * (max - min + 1)) + min;
    return randomFourDigitNumber.toString();
  }

  async send(userPrompt, stream) {
    let spark = this; // 匿名函数里会丢失this
    super.dialog(userPrompt);

    let sendMessages = this.preSend();

    let toSend = {
      header: {
        app_id: this.appID,
        uid: this.generateRandomAPPID(),
      },
      parameter: {
        chat: {
          domain: "generalv3.5",
          temperature: 0.5,
          max_tokens: 8192,
        },
      },
      payload: {
        message: {
          text: sendMessages,
        },
      },
    };

    try {
      let res = await axios.get("https://morethanchat.club/server/getSparkURL");
      const socket = new WebSocket(res.data);
      socket.storage = [];
      socket.onopen = function (event) {
        console.log("WebSocket连接已打开");
        socket.send(JSON.stringify(toSend));
      };
      socket.onmessage = function (event) {
        let jsonMessage = JSON.parse(event.data);
        console.log(jsonMessage);
        let content = jsonMessage.payload.choices.text[0].content;
        socket.storage.push(content);
        if (spark.onStream) {
          spark.onStream(content);
        }
      };
      socket.onclose = function (event) {
        const jointedString = socket.storage.join("");
        console.log(jointedString);
        spark.messages.push({
          role: "assistant",
          content: jointedString,
        });
        console.log("WebSocket连接已关闭", event.code, event.reason);
        console.log(spark.messages);
        if (spark.onComplete) {
          spark.onComplete(jointedString);
        }
      };
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }
}


class P5GLM extends P5LLM {
  // glm-4-0520、glm-4 、glm-4-air、glm-4-airx、 glm-4-flash
  model = "glm-4-air";
  temp = 0.5;
  P5GLM() {}

  setModel(model) {
    // 目前只有一个模型
    this.model = model;
  }

  setTemperature(t){
    this.temp = t;
  }

  // 发送前包装
  preSend() {
    // trim to max message
    if (this.maxMessage > 0) {
      if (this.messages.length > this.maxMessage) {
        this.messages.splice(1, this.messages.length - this.maxMessage);
      }
    }

    let exactMessages = this.messages;

    if (this.systemPrompt || this.systemPrompt.length > 0) {
      exactMessages = [
        {
          role: "system",
          content: this.systemPrompt,
        },
        ...this.messages,
      ];
    }

    return exactMessages;
  }

  async dialog(userPrompt) {
    super.dialog(userPrompt);
    let sendMessages = this.preSend();
    let content;

    try {
      let res = await axios({
        method: "post",
        url: "https://morethanchat.club/server/dialogGLM",
        data: {
          model: this.model,
          messages: sendMessages,
        },
        temperature:this.temp
      });

      console.log(res);
      content = res.data.choices[0].message.content;
      this.messages.push({
        role: "assistant",
        content: content,
      });

      if (this.onComplete) {
        this.onComplete(content);
      }

      return content;
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  async stream(userPrompt) {
    super.stream(userPrompt);
    let sendMessages = this.preSend();
    let agent = this;

    let toSend = {
      model: this.model,
      messages: sendMessages,
    };

    let fullContent = "";

    const socket = new WebSocket("wss://morethanchat.club/server/streamGLM");

    try {
      socket.onopen = function (event) {
        console.log("WebSocket连接已打开");
        socket.send(JSON.stringify(toSend));
      };
      socket.onmessage = function (event) {
        console.log(event.data);
        if (agent.onStream) {
          agent.onStream(event.data);
          fullContent += event.data;
        }
      };
      socket.onclose = function (event) {
        if (agent.onComplete) {
          agent.onComplete(fullContent);
        }
        console.log("WebSocket连接已关闭", event.code, event.reason);
      };
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }
}

class P5GLM4V extends P5LLM {
  model = "glm-4v";
  temp = 0.5;
  P5GLM() {}

  setModel(model) {
    // 目前只有一个模型
    this.model = model;
  }

  setTemperature(t){
    this.temp = t;
  }

  promptCheck(userPrompt) {
    if (typeof userPrompt === "string") {
      // 正则表达式匹配以 'http:' 开头，以 '.jpg' 或 '.png' 结尾的 URL
      const imageRegex = /https?:\/\/[^\s]+\.(jpg|png)/i;
      let imageUrl = '';
      let remainingText = userPrompt;

      // 检查是否有匹配的 URL
      if (imageRegex.test(userPrompt)) {
        // 找到第一个匹配的 URL
        imageUrl = userPrompt.match(imageRegex)[0];
        // 移除 URL 部分，保留剩余的文本
        remainingText = userPrompt.replace(imageRegex, '');
      }

      // 构建新的消息对象
      const newMessage = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: remainingText.trim() // 去除可能的前后空格
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      };

      // 推送新的消息对象到 messages 数组
      this.messages.push(newMessage);
    } else {
      this.messages = [...this.messages, ...userPrompt];
    }
    console.log(this.messages);
  }


  async dialog(userPrompt) {
    super.dialog(userPrompt);
    let sendMessages = this.preSend();
    console.log(sendMessages);
    let content;

    try {
      let res = await axios({
        method: "post",
        url: "https://morethanchat.club/server/dialogGLM",
        data: {
          model: this.model,
          messages: sendMessages,
        },
        temperature:this.temp
      });

      console.log(res);
      content = res.data.choices[0].message.content;
      this.messages.push({
        role: "assistant",
        content: content,
      });

      if (this.onComplete) {
        this.onComplete(content);
      }

      return content;
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  async stream(userPrompt) {
    super.stream(userPrompt);
    let sendMessages = this.preSend();
    let agent = this;

    let toSend = {
      model: this.model,
      messages: sendMessages,
    };

    let fullContent = "";

    const socket = new WebSocket("wss://morethanchat.club/server/streamGLM");

    try {
      socket.onopen = function (event) {
        console.log("WebSocket连接已打开");
        socket.send(JSON.stringify(toSend));
      };
      socket.onmessage = function (event) {
        console.log(event.data);
        if (agent.onStream) {
          agent.onStream(event.data);
          fullContent += event.data;
        }
      };
      socket.onclose = function (event) {
        if (agent.onComplete) {
          agent.onComplete(fullContent);
        }
        console.log("WebSocket连接已关闭", event.code, event.reason);
      };
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }
}



class P5GPT extends P5LLM {
  model = "gpt-3.5-turbo";
  P5GPT() {}

  setModel(model) {
    if (model === 4) {
      this.model = "gpt-4";
    } else {
      this.model = "gpt-3.5-turbo";
    }
  }

  async embedding(input) {
    try {
      let res = await axios({
        method: "post",
        url: "https://morethanchat.club/server/embeddingGPT",
        data: {
          input: input,
        },
      });

      let content = res.data["data"][0]["embedding"];

      if (this.onComplete) {
        this.onComplete(content);
      }

      return content;
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  async dialog(userPrompt) {
    super.dialog(userPrompt);
    let sendMessages = this.preSend();
    let content;
    try {
      let res = await axios({
        method: "post",
        url: "https://morethanchat.club/server/dialogGPT",
        data: {
          model: this.model,
          messages: sendMessages,
        },
      });

      console.log(res);
      content = res.data.choices[0].message.content;
      this.messages.push({
        role: "assistant",
        content: content,
      });

      if (this.onComplete) {
        this.onComplete(content);
      }

      return content;
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  stream(userPrompt) {
    super.stream(userPrompt);
    let sendMessages = this.preSend();
    let agent = this;

    const socket = new WebSocket("wss://morethanchat.club/server/streamGPT");

    let toSend = {
      model: this.model,
      messages: sendMessages,
    };

    let fullContent = "";

    try {
      socket.onopen = function (event) {
        console.log("WebSocket连接已打开");
        socket.send(JSON.stringify(toSend));
      };
      socket.onmessage = function (event) {
        console.log(event.data);
        if (agent.onStream) {
          agent.onStream(event.data);
          fullContent += event.data;
        }
      };
      socket.onclose = function (event) {
        if (agent.onComplete) {
          agent.onComplete(fullContent);
        }
        console.log("WebSocket连接已关闭", event.code, event.reason);
      };
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }
}


