let gui;
let checkbox;
let input;
let button;
let backgroundColor = 220;
let textArea = {
  x: 20,
  y: 20,
  width: 350,
  height: 100,
  placeholder: "妈妈的爸爸叫什么",
  isTitle: false,
};

let content = "";
let agent = new P5GLM();
let thoughts = '思考中' ;
let answer = '不知道呢';
let jsonData;

// 接收到GPT完整的消息时会调用的函数
function whenComplete(text) {
  content = text.replace(/\n/g, ""); // 删去换行，以免格式错误
  const chineseCommaRegex = /(?<=":)\s*，|(?<=",)\s*(?=\s*[{])/g; // 可能误用中文逗号
  content = content.replace(chineseCommaRegex, ',');  
  content = content.match(/{[^{}]*}/); // 提取回答中的json格式
  jsonData = JSON.parse(content);
  thoughts = jsonData["思考过程"];
  answer = jsonData["答案"];
}

function setup() {
  createCanvas(400, 800); // 创建管理GUI的系统
  gui = createGui();
  button = createButton("提问", 20, 130);
  textSize(20);

  agent.setSystemPrompt(`请用JSON格式回答问题，两个key为"思考过程"和"答案"。请根据严格按照以下格式{"思考过程":,"答案":}。`);
  textArea.text = textArea.placeholder;
}

function draw() {
  background(220);
  textSize(16);
  noStroke();
  fill("white");
  textArea = createTextArea(textArea);
  fill("black");

  textWrap(CHAR);
  text(content, 20, 200, 350);
  text("思考过程", 20, 390);
  text("答案", 20, 540);
  text(thoughts,30,410,320);
  fill('red');
  text(answer,30,560,320);
  
  noFill();
  stroke(0);
  rect(20, 400, 350, 100);
  rect(20, 550, 350, 100); // rect() // 每帧重绘GUI
  drawGui();

  if (button.isPressed) {
    content = "";
    agent.clearAllMessage();
    agent.send(textArea.text, false);
    agent.onComplete = whenComplete;
  }
}
