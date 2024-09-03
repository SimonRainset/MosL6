// let gptAgent = new P5GPT();
// let gptSlowAgent = new P5GPT();
// let gptActionAgent = new P5GPT();
let gptAgent = new P5Spark();
let gptSlowAgent = new P5Spark();
let gptActionAgent = new P5Spark();

let player, memories;
const canvasWidth = 900;
const canvasHeight = 700;
const canvasX = 100;
const canvasY = 100;

let gui;
let buttonOK, buttionPageUp, buttonPageDown;
let CA;
let rects;
let c;
let inputRect;
let intentions;
let links;
let objects;
let dj = [,];
let centerOfIntentions;
let allMessages = [];
let allThoughts = [];
let allActions = [];
let allWords = [];
let currentPage = 0;
let pageStartList = [0];
let zoomin = false;
let focusedItem = null;
let currentState = 1;
let currentState2 = 1;
let cowX = 0,
  cowY = 0;
//let previousMsgCnt = 0;

let buttonMoreAction;
let buttonActions = [];
let actionEnabled = [];

let BDIStates = [
  {
    id: 0,
    name: "noTalk",
    intentions: "有个木工的活要做，不能聊天了。",
    nextStates: [],
    life: 99,
  },
  {
    id: 1,
    name: "start",
    intentions:
      "谈论婚姻的看法：Adda想要自由恋爱，但是他家里给他安排了婚姻，他不想要。",
    nextStates: [2, 4, 8],
    life: 4,
  },
  {
    id: 2,
    name: "reasonOfParents",
    intentions:
      "展示婚契，结婚时间很早，与USER讨论父母想要Adda早点婚姻的理由。输出中的[[Adda的动作]]变成[[contractPresent + Adda的动作]]",
    nextStates: [1, 3, 0],
    life: 2,
  },
  {
    id: 3,
    name: "difficultyOfParents",
    intentions: "谈论父亲的困境，家庭有点困难，想要Adda早点成家立业",
    nextStates: [1, 4, 0],
    life: 2,
  },
  {
    id: 4,
    name: "girl",
    intentions:
      "谈论河对岸的女孩，经常看到她在做饭，并喜欢哼哼小曲。给USER看一下女孩的画像。输出中[[Adda的动作]]变成[[picGive + Adda的动作]]",
    nextStates: [1, 2, 3, 5, 6],
    life: 3,
  },
  {
    id: 5,
    name: "girlChase",
    intentions:
      "与USER讨论如何追女孩才最有效，Adda觉得应该不打扰对方，含蓄的表达",
    nextStates: [4, 0],
    life: 3,
  },
  {
    id: 6,
    name: "girlOther",
    intentions: "与USER讨论女孩的一个独特的服饰，好像是异乡的服饰，有蓝白条纹",
    nextStates: [4, 0],
    life: 2,
  },
  {
    id: 7,
    name: "CarpenterKnife",
    intentions:
      "觉得USER喜欢木工，送给他一把木工刀。输出中[[Adda的动作]]变成[[knifeGive + Adda的动作]]",
    nextStates: [8],
    life: 1,
  },
  {
    id: 8,
    name: "CarpenterCase",
    intentions:
      "与USER探讨自己下一份木工作品，自己想做一个木琴，但是对于音乐不是很懂",
    nextStates: [4, 7, 0],
    life: 3,
  },
];

let BDIActions = [
  {
    trigger: "knifeGive",
    action: () => {
      let knifeS = new objects.Sprite();
      knifeS.text = "小刀";
      BDIStates[7].intentions = "觉得USER喜欢木工，送给他一把木工刀。";
    },
  },
  {
    trigger: "picGive",
    action: () => {
      let picS = new objects.Sprite();
      picS.text = "画像";
      BDIStates[4].intentions =
        "谈论河对岸的女孩，经常看到她在做饭，并喜欢哼哼小曲。";
    },
  },
  {
    trigger: "contractPresent",
    action: () => {
      let dmS = new objects.Sprite();
      dmS.text = "婚契";
      BDIStates[2].intentions =
        "与USER讨论父母想要Adda早点婚姻的理由可能是什么。";
    },
  },
];

function setup() {
  ////////////////////////////////////////////////// GPT AGENT /////////////////////////////////////////
  gptAgent.setModel(3);
  updateSystemprompt();
  allMessages.push({
    role: "assistant",
    content:
      "((看到USER感到新鲜))[[停下手中的活]]你好，我是Adda，一个木匠，你在干嘛呀？",
  });
  gptAgent.messages.push(allMessages[0]);
  gptSlowAgent.setModel(3);
  gptActionAgent.setModel(3);

  ////////////////////////////////////// GUI    ////////////////////////////////////////////////
  CA = createCanvas(canvasWidth, canvasHeight);
  CA.position(canvasX, canvasY);
  gui = createGui();

  buttonOK = createButton("OK", canvasWidth - 100, canvasHeight - 100, 90, 90);
  buttonOK.onRelease = buttonOKRelease;
  buttonOK.setStyle({
    fillBg: color("#AAAAAA00"),
    rounding: 2,
    textSize: 40,
    strokeWeight: 1,
  });

  buttionPageUp = createButton("<<<", 20, canvasHeight - 130, 100, 20);
  buttionPageDown = createButton(">>>", 150, canvasHeight - 130, 100, 20);
  buttionPageUp.onRelease = buttonPageUpRelease;
  buttionPageDown.onRelease = buttonPageDownRelease;
  buttionPageUp.setStyle({
    fillBg: color("#AAAAAA00"),
    rounding: 2,
    textSize: 20,
    strokeWeight: 0,
  });
  buttionPageDown.setStyle({
    fillBg: color("#AAAAAA00"),
    rounding: 2,
    textSize: 20,
    strokeWeight: 0,
  });

  for (let i = 0; i < 3; i++) {
    let buttonText = ["抬起头", "微笑", "看着他", "站起来"];

    buttonActions.push(
      createButton(
        buttonText[Math.floor(random(0, 4))],
        canvasWidth - 270 - 180 * i,
        canvasHeight - 130,
        160,
        25
      )
    );
    buttonActions[i].setStyle({
      fillBg: color("#FF000000"),
      rounding: 1,
      textSize: 15,
      strokeWeight: 0,
    });
    actionEnabled.push(false);
    buttonActions[i].onPress = bottonActionsPress;
    buttonActions[i].val = false;
  }

  buttonMoreAction = createButton(
    "More Action",
    canvasWidth - 100,
    canvasHeight - 130,
    90,
    25
  );
  buttonMoreAction.setStyle({
    fillBg: color("#FF000000"),
    rounding: 1,
    textSize: 15,
    strokeWeight: 1,
  });
  buttonMoreAction.onRelease = bottonMoreActionRelease;

  ////////////////////////////////////// SPRITES /////////////////////////////////////////////////

  world.gravity.y = 0;
  intentions = new Group();
  intentions.color = "white";
  intentions.diameter = 80;
  intentions.x = () => random(canvasWidth / 3, canvasWidth);
  intentions.y = () => random(canvasHeight / 5, canvasHeight - 200);

  intentions.strokeWeight = 0.5;
  intentions.text = (a) => BDIStates[a].name;
  intentions.textSize = 10;
  intentions.rotationLock = true;
  intentions.drag = 2;
  intentions.type = "intention";
  intentions.layer = 2;
  intentions.id = (i) => i;
  intentions.amount = BDIStates.length;

  links = new Group();
  links.overlaps(allSprites);

  links.color = "grey";
  links.strokeWeight = 0.5;
  links.layer = 1;
  for (let i = 0; i < intentions.length; i++) {
    for (let j of BDIStates[i].nextStates) {
      let link = new links.Sprite([
        [intentions[i].x, intentions[i].y],
        [intentions[j].x, intentions[j].y],
      ]);
    }
  } // establish links

  objects = new Group();
  objects.x = () => random(canvasWidth / 3, canvasWidth);
  objects.y = () => random(canvasHeight / 5, canvasHeight - 200);
  objects.color = () => color(random(200, 255));
  objects.w = 40;
  objects.h = 40;
  objects.overlaps(intentions);
  objects.amount = 0;
  objects.rotationLock = true;
  objects.type = "object";
  objects.layer = 3;
  objects.id = (i) => i;
  objects.defaultActions = ["送出", "展示", "看着"]; // 3 default actions
  let guita = new objects.Sprite();
  guita.text = "吉他";

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////// INPUT AREA ////////////////////////////////////////////////////

  inputRect = {
    x: 10,
    y: canvasHeight - 100,
    width: canvasWidth - 120,
    height: 90,
    text: "请输入对话内容，输入后点击[More Action]可能会有更符合对话意图的动作，点击[OK]发送",
    input: null,
    id: "rect1",
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////

  //bottonMoreActionRelease();
}

//################################################ DRAW ##############################################

function draw() {
  background(235, 235, 235);
  ////////////////////////////////////// P5 PLAY TEST /////////////////////////////////////////////////
  camera.on();

  intentions.color = "white";
  intentions[currentState].color = "pink";
  intentions[currentState2].color = "pink";
  for (let i = 0; i < intentions.length; i++)
    if (BDIStates[i].life === 0) intentions[i].text = "";

  // FDG and random force
  forceDirectedGraph(2.5, 3.5);
  if (frameCount % 30 === 0) {
    for (let i of intentions) {
      if (random(0, 100) > 80) {
        i.bearing = random(-179, 180);
        i.applyForce(random(200, 400));
      }
    }
  }

  // draw connecting lines
  let lineIndex = 0;
  for (let i = 0; i < intentions.length; i++) {
    for (let j of BDIStates[i].nextStates) {
      links[lineIndex].vertices = [
        [intentions[i].x, intentions[i].y],
        [intentions[j].x, intentions[j].y],
      ];

      lineIndex++;
    }
  }

  allSprites.draw();
  // links.draw();
  // objects.draw();
  // intentions.draw();

  //update cowX and object positoins
  cowX = 0;
  cowY = 0;
  for (let i of intentions) {
    cowX += i.x;
    cowY += i.y;
  }
  cowX /= intentions.length;
  cowY /= intentions.length;
  for (let i = 0; i < objects.length; i++) {
    objects[i].x = -80 + cowX + 80 * i;
    objects[i].y = cowY - 280;
  }

  // for (i of intentions) i.x -= cowX;
  // for (i of intentions) i.y -= cowY;
  // //for (let i = 0; i<objects.length; i++) {objects[i].x = 60*i; objects[i].y= 200;}

  // state machine
  // 1.  state = no focus : camera = cow, action = '' ; transition to object:  default action ; transition to
  // 2.  state = object focus: camera = object.center, more action + object.label ; transition to no focus : clear action
  // 3.  state = intention focus: camera = center; show description

  if (focusedItem === null) {
    // state === no focus
    camera.x = cowX - canvasWidth / 6;
    camera.y = cowY;
    intentions.textSize = 10;
    intentions.text = (i) => BDIStates[i].name;

    if (
      mouse.presses() &&
      mouseY < canvasHeight - 130 &&
      whichSpritePressed() !== null
    ) {
      // transition to intention/object
      focusedItem = whichSpritePressed();

      if (focusedItem.type === "object") {
        buttonActions[0].label =
          focusedItem.defaultActions[0] + focusedItem.text;
        buttonActions[1].label =
          focusedItem.defaultActions[1] + focusedItem.text;
        buttonActions[2].label =
          focusedItem.defaultActions[2] + focusedItem.text;
      }
      camera.zoomTo(7);
    }
  } // state === i/o
  else {
    camera.x = focusedItem.x;
    camera.y = focusedItem.y;

    if (focusedItem.type === "intention") {
      focusedItem.textSize = 3;
      focusedItem.text = BDIStates[focusedItem.id].intentions.replace(
        /(.{20})/g,
        "$1\n"
      ); // 每隔20个字符加一个回车
    }

    if (
      mouse.presses() &&
      mouseY < canvasHeight - 130 &&
      whichSpritePressed() === null
    ) {
      // transition to no focuse
      focusedItem = null;
      for (
        let i = 0;
        i < 3;
        i++ // clear action
      ) {
        buttonActions[i].label = "";
        actionEnabled[i] = false;
        buttonActions[i].setStyle({
          fillBg: color("#FF000000"),
          fillBgHover: color("#CCCCCCCC"),
        });
      }
      camera.zoomTo(1);
    }
  }

  camera.off();
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  //Enter INPUT
  if (
    kb.presses("enter") &&
    inputRect.input.elt.querySelector("textarea").value.length > 0
  )
    buttonOKRelease();

  /////////////////////////////////////// TEXT //////////////////////////////////////////////////////
  noStroke();
  let line = 1;
  let pageStart, pageEnd; // 当前显示页的开始message序号和结束message序号
  pageStart = pageStartList[currentPage];
  if (currentPage === pageStartList.length - 1)
    pageEnd = allMessages.length; // 当前显示页为最后一页
  else pageEnd = pageStartList[currentPage + 1]; // 当前显示页不是最后一页
  for (let i = pageStart; i < pageEnd; i++) {
    let msgAgent = allMessages[i];
    let t = msgAgent.content;

    if (msgAgent.role === "user") {
      fill(100, 20, 20);
      textAlign(RIGHT);
      t = parseMsg(t, "words");
    } else {
      fill("black");
      textAlign(LEFT);
      t = parseMsg(t, "words");
    }
    let fontSize = 14;
    textSize(fontSize);
    textWrap(CHAR);
    text(t, 20, fontSize * 1.2 * line, canvasWidth / 3);
    line += 1 + (fontSize * t.length) / (canvasWidth / 3); // 段落换行增加的行数
    if (fontSize * 1.2 * line > canvasHeight - 130) {
      // start new page
      pageStartList.push(i); //将当前message index作为翻页序号存入翻页序号数组pageStartList
      currentPage++;
      break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////// INPUT AREA /////////////////////////////////////////////////

  fill(color(235, 235, 235, 230));

  strokeWeight(1);
  stroke(0);

  rect(inputRect.x, inputRect.y, inputRect.width, inputRect.height);

  let inputX = inputRect.x + 10;
  let inputY = inputRect.y + 10;
  let inputWidth = inputRect.width - 28;
  let inputHeight = inputRect.height - 26;

  // 创建或更新文本框，并将其置于长方形之上
  if (inputRect.input) {
    inputRect.input.position(canvasX + inputX, canvasY + inputY);
    inputRect.input.size(inputWidth, inputHeight);
  } else {
    inputRect.input = createDiv(
      `<textarea style="height: 100%; width: 100%; border: none; background-color: transparent; outline: none; resize:none;" placeholder="${inputRect.text}" id="${inputRect.id}"></textarea>`
    );
    //inputRect.input = createDiv(`<textarea style="height: 100%; width: 100%; border: none; background-color: transparent; outline: none; resize:none;" id="${inputRect.id}">${inputRect.text}</textarea>`);
    inputRect.input.position(200 + inputX, 200 + inputY);
    inputRect.input.elt.style.zIndex = "0";
    // 添加事件监听器监听文本变化
    inputRect.input.elt
      .querySelector("textarea")
      .addEventListener("input", function () {
        inputRect.text = this.value;
      });
  }
  strokeWeight(1);

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  drawGui();
}

//##########################################################################################################

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}

async function buttonOKRelease() {
  let iR = inputRect.input.elt.querySelector("textarea").value;
  for (let i = 0; i < 3; i++) {
    if (actionEnabled[i]) iR = "[[" + buttonActions[i].label + "]]" + iR;
  } // 加入动作
  iR = iR.trim();
  allMessages.push({
    role: "user",
    content: iR,
  });

  if (random(0, 100) > 40) gptAgent.setModel(3);
  else gptAgent.setModel(3); // 省40%的钱也是钱 ps gpt3真是烂啊

  if (BDIStates[currentState].intentions.includes("[[")) gptAgent.setModel(4); //意图中包括一些规定动作，如[[giveKnife]]，gpt3做不好
  if (BDIStates[currentState2].intentions.includes("[[")) gptAgent.setModel(4);

  gptAgent.send(iR);
  gptAgent.onComplete = (response) => {
    // 处理 ChatGPT 的回复，你可以在这里做任何你想要的操作
    console.log(response);

    buttonOK.enabled = true;
    buttonOK.visible = true;
    allMessages.push({
      role: "assistant",
      content: response,
    });
    console.log(allMessages);
    for (let a of BDIActions) {
      let s = parseMsg(response, "actions");

      if (s.length > 0) if (s.includes(a.trigger)) a.action();
    }
    SlowAgentThink(); //每对话进行一次slowAgent
  };

  gptAgent.onError = (error) => {
    console.error(error);
    buttonOK.enabled = true;
    buttonOK.visible = true;
  };

  buttonOK.enabled = false;
  buttonOK.visible = false;
  inputRect.input.elt.querySelector("textarea").value = "";
  for (let i = 0; i < 3; i++) {
    buttonActions[i].label = "";
    actionEnabled[i] = false;
    buttonActions[i].setStyle({
      fillBg: color("#FF000000"),
      fillBgHover: color("#CCCCCCCC"),
    });
  }
  bottonMoreActionRelease();

  // switch to last page;
  currentPage = pageStartList.length - 1;

  let am = "";
  for (let m of allMessages) {
    if (m.role === "user") am += "alex";
    else am += "adda";

    am += ":" + m.content + "\n";
  }
  console.log(am);
}

function buttonPageUpRelease() {
  currentPage--;
  if (currentPage < 0) currentPage = 0;
}

function buttonPageDownRelease() {
  currentPage++;
  if (currentPage >= pageStartList.length) currentPage--;
}

async function bottonMoreActionRelease() {
  buttonMoreAction.visible = false;

  let objectPrompt = "";
  if (focusedItem)
    if (focusedItem.type === "object")
      objectPrompt = "与物品:" + focusedItem.text + "相关的";
  let actionPrompt =
    "请根据三引号中的对话内容，给出接下来Alex在最后一句最有可能发生的三个" +
    objectPrompt +
    "动作（动作不包括说话或语言，只包括肢体动作，表情，眼神等，如：敲了一下桌子）：\n";

  actionPrompt += "'''\n";
  let lastMsg = allMessages.slice(-6); // last 6 messages
  lastMsg.forEach((element) => {
    if (element.role === "user")
      actionPrompt += "Alex:" + element.content + "\n";
    else actionPrompt += "Adda:" + element.content + "\n";
  });
  let iR = inputRect.input.elt.querySelector("textarea").value;
  actionPrompt += "Alex:" + iR + "'''\n";
  if (focusedItem)
    if (focusedItem.type === "object")
      objectPrompt = ",宾语必须为" + focusedItem.text;
  actionPrompt +=
    "动作中间用逗号（','）隔开，不要给出理由或解释，所有动作不超过10个汉字，不要有标点，不要有主语" +
    objectPrompt;

  gptActionAgent.send(actionPrompt);
  gptActionAgent.onComplete = (response) => {
    console.log("action:" + response);
    response = response.replace(/，/g, ",");
    let parts = response.split(",");
    buttonActions[0].label = parts[0];
    buttonActions[1].label = parts[1];
    buttonActions[2].label = parts[2];
    buttonMoreAction.visible = true;
  };
  gptActionAgent.onError = (error) => {
    console.error(error);
    buttonMoreAction.visible = true;
  };

  for (let i = 0; i < 3; i++) {
    actionEnabled[i] = false;
    buttonActions[i].setStyle({
      fillBg: color("#FF000000"),
      fillBgHover: color("#CCCCCCCC"),
    });
  }
}

function bottonActionsPress() {
  let presssingButton = 0;
  for (; presssingButton < 3; presssingButton++)
    if (buttonActions[presssingButton].val) break;
  for (let i = 0; i < 3; i++) {
    if (i !== presssingButton) actionEnabled[i] = false;
    else actionEnabled[i] = !actionEnabled[i];
  }
  for (let i = 0; i < 3; i++) {
    if (actionEnabled[i]) {
      buttonActions[i].setStyle({
        fillBg: color("pink"),
        fillBgHover: color("pink"),
      });
    } else {
      buttonActions[i].setStyle({
        fillBg: color("#FF000000"),
        fillBgHover: color("#CCCCCCCC"),
      });
    }
  }
}

// V1测试规则：
// 1. 每4次对话进行一次slowAgent
// 2. 判断进入nextstate的哪一个，并根据给出的状态切换system Prompt

// V1问题：比较机械，尤其是有时候一个话题可以结束了，但是因为没有到8次对话，所以还在绕圈圈，不会发起新的话题

// V2 规则
// 每次对话都进行慢思考（gpt3）
// 每次更新到system prompt中的意图有两个
// 意图更新的时候加上自己，然后联合其next state，选择两个。
// 每个意图有个life，到零的时候意图消失，选择意图时候就不会被选择。

// V2问题：如果是多意图，容易聊多=>多选一
// 每句话更新有点多

async function SlowAgentThink() {
  let state = BDIStates[currentState];
  let state2 = BDIStates[currentState2];
  state.life--;
  if (state !== state2) state2.life--;
  for (let s of BDIStates)
    console.log("Intention " + s.id + "'s life:" + s.life + "\n"); // log intentions' life
  let possibleIntentions = [];
  if (state.life > 0) possibleIntentions.push(state.id);
  if (state2.life > 0) possibleIntentions.push(state2.id);
  for (let iS of state.nextStates)
    if (BDIStates[iS].life > 0) possibleIntentions.push(iS);
  for (let iS of state2.nextStates)
    if (BDIStates[iS].life > 0) possibleIntentions.push(iS);
  possibleIntentions.sort((a, b) => a - b); // sort
  let uniquePossibleIntentions = possibleIntentions.filter(
    (value, index, arr) => arr.indexOf(value) === index
  ); // delete repeat
  if (uniquePossibleIntentions.length <= 1) {
    let newState = 0;
    if (uniquePossibleIntentions.length === 1)
      newState = uniquePossibleIntentions[0];
    currentState = currentState2 = newState;
    updateSystemprompt();
    return;
  }

  //pick up two most possible intentions if there are more than one intentions, with gpt3
  let slowPrompt =
    "请根据三引号中的对话内容，选择接下来Adda最有可能的两个谈话意图。可供选择的意图如下：\n";
  for (let iS of uniquePossibleIntentions) {
    slowPrompt += "" + BDIStates[iS].id + "." + BDIStates[iS].intentions + "\n";
  }
  slowPrompt += "'''\n";
  let lastMsg = allMessages.slice(-10); // last 10 messages
  lastMsg.forEach((element) => {
    if (element.role === "user") slowPrompt += "Alex:" + element.content + "\n";
    else slowPrompt += "Adda:" + element.content + "\n";
  });
  slowPrompt +=
    "'''\n请只用意图的数字编号回答，两个意图中间用逗号（','）隔开，不要给出理由或解释";
  console.log(slowPrompt);

  gptSlowAgent.send(slowPrompt);
  gptSlowAgent.onComplete = (response) => {
    console.log("GPTSlowAgent:" + response);
    let parts = response.split(",");
    currentState = parseInt(parts[0]);
    currentState2 = parseInt(parts[1]);
    updateSystemprompt();
  };
  gptSlowAgent.onError = (error) => {
    console.error(error);
  };
}

function updateSystemprompt() {
  if (currentState === currentState2) {
    systemPrompt =
      "请你做角色扮演的游戏，你扮演战国时期的一个木匠Adda。USER将与Adda进行日常对话 \
  【Adda的角色设定】\
  Adda喜欢做木工活，喜欢河对面的女生,但父母给他安排了婚事\
  【角色扮演规则】\
  1.  不要说自己是人工智能\
  2. 用符合Adda角色设定的方式对话，并符合Adda此时的【意图】\
  3.严格按照Adda当前【语言风格】进行对话\
  4.每次输出使用如下格式:\
  ((Adda心理活动))[[Adda的动作]]Adda的回答\
  【Adda的意图】" +
      BDIStates[currentState].intentions +
      "\n【Adda的语言风格】\
  简洁，口语化,甚至有些粗陋，不多于40字";
  } else {
    systemPrompt =
      "请你做角色扮演的游戏，你扮演战国时期的一个木匠Adda。USER将与Adda进行日常对话 \
  【Adda的角色设定】\
  Adda喜欢做木工活，喜欢河对面的女生,但父母给他安排了婚事\
  【角色扮演规则】\
  1.  不要说自己是人工智能\
  2. 用符合Adda角色设定的方式对话，并符合Adda此时的【意图】，有多个【意图】时，请判断并只选择其中一个适当的【意图】\
  3.严格按照Adda当前【语言风格】进行对话\
  4.每次输出使用如下格式:\
  ((Adda心理活动))[[Adda的动作]]Adda的回答\
  【Adda的意图1】:" +
      BDIStates[currentState].intentions +
      "\n【Adda的意图2】:" +
      BDIStates[currentState2].intentions +
      "\n【Adda的语言风格】\
  简洁，口语化，甚至有些粗陋，不多于40字";
  }

  gptAgent.setSystemPrompt(systemPrompt);
}

function forceDirectedGraph(repel, attract) {
  // FDG每个节点之间都有排斥力，相连的节点之间有吸引力
  for (let i = 0; i < intentions.length; i++) {
    for (let j = 0; j < intentions.length; j++) {
      let dis =
        (intentions[i].x - intentions[j].x) *
          (intentions[i].x - intentions[j].x) +
        (intentions[i].y - intentions[j].y) *
          (intentions[i].y - intentions[j].y);
      if (i !== j)
        intentions[i].attractTo(intentions[j], (-repel / dis) * 300000);
    }
    for (let j of BDIStates[i].nextStates) {
      let dis =
        (intentions[i].x - intentions[j].x) *
          (intentions[i].x - intentions[j].x) +
        (intentions[i].y - intentions[j].y) *
          (intentions[i].y - intentions[j].y);
      intentions[i].attractTo(intentions[j], attract * 0.0005 * dis);
    }
  }
}

function whichSpritePressed() {
  for (let o of objects) if (o.mouse.presses()) return o;
  for (let i of intentions) if (i.mouse.presses()) return i;
  return null;
}

function parseMsg(str, type) {
  str = str.replace(/（（/g, "((");
  str = str.replace(/））/g, "))");
  str = str.replace(/【【/g, "[[");
  str = str.replace(/】】/g, "]]");

  let thoughts = "",
    actions = "";

  // 使用正则表达式匹配 [[...]] 形式的子串
  let pattern = /\[\[(.*?)\]\]/g;
  let matches = str.match(pattern);

  // 如果找到匹配的子串，提取内容并合并为一个字符串
  if (matches) {
    // 提取内容，移除外围的 [[ 和 ]]
    matches = matches.map((match) => match.slice(2, -2));
    // 合并为一个字符串，不使用分隔符
    actions = matches.join("；");
  }

  str = str.replace(pattern, ""); // delete action

  pattern = /\(\((.*?)\)\)/g;
  matches = str.match(pattern);

  // 如果找到匹配的子串，提取内容并合并为一个字符串
  if (matches) {
    // 提取内容，移除外围的 [[ 和 ]]
    matches = matches.map((match) => match.slice(2, -2));
    // 合并为一个字符串，不使用分隔符
    thoughts = matches.join("；");
  }

  str = str.replace(pattern, "");

  switch (type) {
    case "thoughts":
      return thoughts; // 返回双圆括号内的内容
    case "actions":
      return actions; // 返回双方括号内的内容
    case "words":
      return str; // 返回后续的所有内容
    default:
      console.log("无效的类型");
      return str;
  }
}
//////////////////////////////////////////     LJY Demo //////////////////////////////////////////

// for(let rectObj of rects){
//   fill('white')

//   strokeWeight(2);
//   stroke(0);

//   rect(rectObj.x, rectObj.y, rectObj.width, rectObj.height);

//   // 计算文本框的位置，使其在长方形内，比长方形小10像素
//   let inputX = constrain(rectObj.x + 10, 0, width - rectObj.width - 20);
//   let inputY = constrain(rectObj.y + 10, 0, height - rectObj.height - 20);
//   let inputWidth = rectObj.width - 28;
//   let inputHeight = rectObj.height - 26;

//   // 创建或更新文本框，并将其置于长方形之上
//   if(rectObj.input){
//       rectObj.input.position(200+inputX, 200+inputY);
//       rectObj.input.size(inputWidth, inputHeight);
//   }else{
//       // rectObj.input = createDiv(`<textarea style="height: 100%; width: 100%; border: none; background-color: transparent; outline: none; resize:none;" placeholder="${rectObj.text}" id="${rectObj.id}"></textarea>`);
//       rectObj.input = createDiv(`<textarea style="height: 100%; width: 100%; border: none; background-color: transparent; outline: none; resize:none;" id="${rectObj.id}">${rectObj.text}</textarea>`);
//       rectObj.input.position(200+inputX, 200+inputY);
//       rectObj.input.elt.style.zIndex = "0";
//       // 添加事件监听器监听文本变化
//       rectObj.input.elt.querySelector('textarea').addEventListener('input', function() {
//           rectObj.text = this.value;
//       });
//   }
//   strokeWeight(1);

//在这里
//rects[0].input.elt.querySelector('textarea').value = 'test3'

// //或者凭借id找
// for(let rectObj of rects){
//     if(rectObj.id === 'rect2'){
//         rectObj.input.elt.querySelector('textarea').value = 'test2'
//     }
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
