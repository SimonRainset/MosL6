function sendUserMessage() {
    let message = chatInput.value();
    if (message.trim() !== '') {
      displayMessage('me', message);
      chatInput.value('');
      // 系统回复

      if (chatAgent.systemPrompt!==(''))
        {
            chatAgent.send(message);
            chatAgent.onComplete = (t)=>{
                 // 使用正则表达式提取JSON字符串
                const jsonRegex = /({[^}]*})/g;
                const match = t.match(jsonRegex);
                let r;

                if (match) {
                const jsonString = match[0];

                // 替换掉字段中的额外文本
                let cleanedJsonString = jsonString.replace(/(\(1-5\))/g, '');
                cleanedJsonString = cleanedJsonString.replace(/(\（1-5\）)/g, '');
                console.log(cleanedJsonString);

                // 解析处理过的JSON字符串
                const parsedResult = JSON.parse(cleanedJsonString);
                r = parsedResult.对话内容;
                
                }

                displayMessage('you',r);

            };
        }
        else setTimeout(() => displayMessage('you', '收到'), 1000);
    }
  }
  function displayMessage(sender, message) {
    let bubbleClass = sender === 'me' ? 'bubble me' : 'bubble you';
    let timeString = `第${gameTime.day}天${String(gameTime.hour).padStart(2, '0')}时${String(gameTime.minute).padStart(2, '0')}分`;
    let messageElement = `<div class="${bubbleClass}">${message}<div class="time">${timeString}</div></div>`;
    chatLog.html(chatLog.html() + messageElement);
    // 自动滚动到底部
    chatLog.elt.scrollTop = chatLog.elt.scrollHeight;
  }
  
  // 模拟游戏时间流逝
function updateTime() {
    gameTime.minute += 1;
    if (gameTime.minute >= 60) {
      gameTime.minute = 0;
      gameTime.hour += 1;
    }
    if (gameTime.hour >= 24) {
      gameTime.hour = 0;
      gameTime.day += 1;
    }
  }

  function generateLogEntry(logXiake,logType) {

    let targetContent = '';
    if (logXiake.target)
            targetContent = '位于('+Math.floor(logXiake.target.x)+','+Math.floor(logXiake.target.y)+')的'+logXiake.target.name;


    let gameLog = {
        time: gameTime,
        type: logType, // 假设这是事件消息类型
        content: logXiake.name + '开始' + logXiake.action + targetContent
      };

    gameLogs.push(gameLog);


    
    // 生成日志条目的标签（例如：系统消息、玩家行动等）
    let label = `<span class="label-${logType}">${logType}</span>`;
 

    let timeString = `第${gameTime.day}天${String(gameTime.hour).padStart(2, '0')}时${String(gameTime.minute).padStart(2, '0')}分`;

   
    
    // 将日志条目添加到日志显示区域
    let logEntries = `<div>${timeString}: ${label} ${gameLog.content}</div>`;
    document.getElementById('logDisplay').innerHTML += logEntries;
    
    // 确保日志记录区域可滚动
    document.getElementById('logDisplay').scrollTop = document.getElementById('logDisplay').scrollHeight;
  }
  
  