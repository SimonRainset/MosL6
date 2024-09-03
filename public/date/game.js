const gptAgent = new P5GPT();
var gptFirst = new P5GPT();
var gptSecond = new P5GPT();
var gptScene = new P5GPT();
var rag = new RAG();

let allMessages = [];
var firstMessages = [];
var secondMessages = [];
let currentPage = 0;
let pageStartList = [0];

var memoriesArray1 = []; // 存储第一个文件处理后的结果
var memoriesArray2 = []; // 存储第二个文件处理后的结果

let person1X, person2X;
let person1Offset = 200; // 距离中轴线的距离
let person2Offset = 200; // 距离中轴线的距离
let step = 0;

let cards = [];
let cardWidth = 120;
let cardHeight = 80;
let cardSpacing = 30;
let nextX = 0; // 下一个卡牌的横向位置
let cardY = 600 - 100; // 卡牌在画面底部，高度600减去100保证底部空间

const canvasWidth = 1400;
const canvasHeight = 700;
const canvasX = 100;
const canvasY = 100;

let gui;
let CA;

function setup() {

  ////////////////////////// GUI ///////////////////////
  CA = createCanvas(canvasWidth, canvasHeight);
  CA.position(canvasX,canvasY);
  gui = createGui();
  //createCanvas(400, 400);
  background(128)

  textSize(16);
  textFont('Monospace');

  person1X = width / 2 - person1Offset;
  person2X = width / 2 + person2Offset;

  ////////////////////////////////////////////////// GPT AGENT /////////////////////////////////////////
  gptAgent.setModel(3);
  gptFirst.setModel(3);
  gptSecond.setModel(3);
  gptScene.setModel(3);
  //updateSystempromptFirstTime();
  
  //gptSlowAgent.setModel(3);
  //gptActionAgent.setModel(3);
  //gptMemoAgent.setModel(3);

  ////////////////////////////////////// GUI    ////////////////////////////////////////////////
  CA = createCanvas(canvasWidth, canvasHeight);
  CA.position(canvasX, canvasY);
  gui = createGui();


  //////////////////////////////////// INPUT AREA ////////////////////////////////////////////////////

  

  /////////////////////////////////////////////////////////////////////////////////////////////////



}

//################################################ DRAW ##############################################

function draw() {



  background(235, 235, 235);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 绘制中轴线
  stroke(0);
  beginShape();
  vertex(width / 2, 0);
  vertex(width / 2, height);
  endShape();
  
  // 绘制小人1
  drawPerson(person1X, height / 2);
  
  // 绘制小人2
  drawPerson(person2X, height / 2);
  
  // 更新步数
  step = (step + 0.1) % 360; // 控制小人的动画速度

  ////////////////////////////////////// INPUT AREA /////////////////////////////////////////////////
  //push();
  translate(0, scrollY); // 应用滚动位置
  drawMessages();
  //pop();
  //drawTextByLine(displayText, 10, 30, width - 20);

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  for (let card of cards) {
    card.draw();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  drawGui();

}

//let array1 = [{role: 'assistant', content: 'Hello from assistant on left.'}]; // 示例数据
//let array2 = [{role: 'assistant', content: 'Hi from assistant on right.'}]; // 示例数据
let scrollY = 0; // 滚动位置
let currentMessage = ""; // 当前正在显示的消息
let side = "left"; // 当前消息应该显示在哪一侧
let array1Index = 0; // 跟踪第一个数组中已处理的消息
let array2Index = 0; // 跟踪第二个数组中已处理的消息
let messages = []; // 存储所有消息

var currentText = ""; // 当前的消息内容
var lines = []; // 存储分行后的消息内容

function updateMessages() {
  // 检查并处理第一个数组的更新
  print("开始处理输出");
  while (array1Index < firstMessages.length) {
    print("此时index1是"+array1Index)
    print("此时array1index中的内容是"+firstMessages[array1Index])
    let msg = firstMessages[array1Index];
    array1Index ++;
    if(msg.role == 'assistant'){
      messages.push({ content: msg.content, side: 'left' });
    }
  }

  // 检查并处理第二个数组的更新
  while (array2Index < secondMessages.length) {
    print("此时index2是"+array2Index)
    print("此时array2index中的内容是"+secondMessages[array2Index])
    let msg = secondMessages[array2Index];
    
    array2Index++;
    if(msg.role == 'assistant'){
      messages.push({ content: msg.content, side: 'right' });
    }
  }
}

function mouseWheel(event) {
  scrollY += event.delta;
  scrollY = constrain(scrollY, -((messages.length) * 20 + 100 - height), 0);
  return false; // 阻止页面滚动
}

async function performAsyncTask() {
  return new Promise(resolve => setTimeout(resolve, 1000)); // 延迟1秒模拟异步操作
}


// 添加新卡牌的函数
function addCard(text) {
  let x = nextX; // 使用下一个可用的横向位置
  if(firstStartflag){
    cards.push(new Card(1,text, x, cardY, cardWidth, cardHeight)); // 创建新卡牌并添加到数组
  }
  else{
    cards.push(new Card(2,text, x, cardY, cardWidth, cardHeight)); // 创建新卡牌并添加到数组
  }
  updateNextPosition();
}

// 更新下一个卡牌位置的函数
function updateNextPosition() {
  nextX = cards.length * (cardWidth + cardSpacing);
}

// 卡牌类
class Card {
  constructor(index,text, x, y, w, h) {
    this.character = index;
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // 绘制卡牌
  draw() {
    push(); // 保存当前的设置
    fill(255);
    stroke(0);
    rect(this.x, this.y, this.w, this.h, 10);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER); // 设置文本对齐方式
    textSize(16); // 设置文本大小
    text(this.text, this.x + this.w / 2, this.y + this.h / 2);
    pop(); // 恢复之前的设置
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
  }
}

// 处理鼠标点击事件
function mousePressed() {
  for (let i = cards.length - 1; i >= 0; i--) {
    if (cards[i].contains(mouseX, mouseY)) {
      OnUseCard(cards[i].text,cards[i].character)
      cards.splice(i, 1); // 从数组中移除卡牌
      updateNextPosition(); // 更新卡牌位置
      break;
    }
  }
}

// 预定义的OnUseCard函数
function OnUseCard(text,characterNum) {
  console.log("Card used!");
  topic = text
  updateSystemprompt(characterNum)
}

// 绘制消息的函数，确保不与卡牌冲突
function drawMessages() {
  let y = 20; // 初始 y 坐标
  lines.forEach(line => {
      if (typeof line.content === "string") {
          let x = line.side === 'left' ? 10 : width - textWidth(line.content) - 10;
          text(line.content, x, y);
          y += 20; // 每条消息之间的间距
      } else {
          console.error("Error: Non-string content", line);
      }
  });
}


//##########################################################################################################

function drawPerson(x, y) {
  // 绘制头部
  fill(255, 0, 0);
  ellipse(x, y - 30, 30, 30);
  
  // 绘制身体
  fill(0, 0, 255);
  rect(x - 15, y, 30, 50);
  
  // 绘制腿
  let legY = y + 50;
  let legLength = 30;
  let angle = radians(sin(step) * 30); // 控制腿的摆动
  let leg1X = x - 10 * cos(angle);
  let leg1Y = legY - 10 * sin(angle);
  let leg2X = x + 10 * cos(angle);
  let leg2Y = legY + 10 * sin(angle);
  stroke(0);
  beginShape();
  vertex(x - 10, legY);
  vertex(leg1X, leg1Y);
  endShape();
  beginShape();
  vertex(x + 10, legY);
  vertex(leg2X, leg2Y);
  endShape();
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}


async function buttonOKRelease() {
  let iR = inputRect.input.elt.querySelector('textarea').value;
  iR = iR.trim();
  allMessages.push({
    role: "user",
    content: iR,
  });

  if (random(0, 100) > 40) gptAgent.setModel(4);
  else gptAgent.setModel(3); 

  let tempEmbedding = new RAG();
  let latestMsg = allMessages.slice(-1)
  let lastUserMsg = ''
  latestMsg.forEach(element => {
    if (element.role === 'user') lastUserMsg += 'User说' + element.content + '；';
    else lastUserMsg += '角色' +'说' + element.content + '；';
  });
  console.log("短时上下文" + lastUserMsg);

  tempEmbedding.findMostSimilar(lastUserMsg, memoriesNew).then(result => {

    justRemembered = result

    gptMemoAgent.setModel(3);

    updateSystemprompt()

    gptAgent.dialog(iR)
      .then(response => {
        // 处理 ChatGPT 的回复，你可以在这里做任何你想要的操作
        console.log(response);

        buttonOK.enabled = true;
        buttonOK.visible = true;
        allMessages.push({
          role: "assistant",
          content: response,
        });
        console.log(allMessages);

        countChatTimes++;
        //console.log("countChat"+countChatTimes);
        // if (countChatTimes >= 2) {
        //   countChatTimes = 0;
        //   MemoryAgentThink();
        // }

        
        //每2次对话进行一次总结
      })

    buttonOK.enabled = false;
    buttonOK.visible = false;
    inputRect.input.elt.querySelector('textarea').value = '';

    // switch to last page;
    currentPage = pageStartList.length - 1;

    let am = '';
    for (let m of allMessages) {
      if (m.role === 'user') am += 'user';
      else am += '方可';

      am += (':' + m.content + "\n");

    }
    console.log(am);
  })
}

function buttonPageUpRelease() {
  currentPage--;
  if (currentPage < 0) currentPage = 0;
}

function buttonPageDownRelease() {
  currentPage++;
  if (currentPage >= pageStartList.length) currentPage--;

}

function parseMsg(str, type) {

  str = str.replace(/（（/g, '((');
  str = str.replace(/））/g, '))');
  str = str.replace(/【【/g, '[[');
  str = str.replace(/】】/g, ']]');

  let thoughts, actions;

  // 使用正则表达式匹配 [[...]] 形式的子串
  let pattern = /\[\[(.*?)\]\]/g;
  let matches = str.match(pattern);

  // 如果找到匹配的子串，提取内容并合并为一个字符串
  if (matches) {
    // 提取内容，移除外围的 [[ 和 ]]
    matches = matches.map(match => match.slice(2, -2));
    
  }


  str = str.replace(pattern, ""); // delete action 

  pattern = /\(\((.*?)\)\)/g;
  matches = str.match(pattern);

  // 如果找到匹配的子串，提取内容并合并为一个字符串
  if (matches) {
    // 提取内容，移除外围的 [[ 和 ]]
    matches = matches.map(match => match.slice(2, -2));
    // 合并为一个字符串，不使用分隔符
    thoughts = matches.join('；');
  }

  str = str.replace(pattern, "");

  switch (type) {
    case 'thoughts':
      return thoughts; // 返回双圆括号内的内容
    case 'words':
      return str; // 返回后续的所有内容
    default:
      console.log("无效的类型");
      return str;
  }
}

async function createMemories(contentArray) {
  const promises = contentArray.map(async item => {
    let tempMemo = new NewMemo();
    let tempRAG = new RAG();
    tempMemo.content = item;
    tempMemo.embedding = await tempRAG.getEmbeddingArray(item);
    //console.log("存入的embedding是" + tempMemo.embedding);
    return tempMemo;
  });

  // 使用Promise.all等待所有的异步操作完成
  const memoriesNew = await Promise.all(promises);
  return memoriesNew;
}

function randomScene(){
  let combinedMemoArray = memoriesArray1.concat(memoriesArray2);
  rag.findMostSimilar('他们会经过哪些地方或者看到哪些事物',combinedMemoArray).then(result => {

  })
}
