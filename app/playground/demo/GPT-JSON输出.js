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
let agent = new P5GPT();

// 接收到GPT完整的消息时会调用的函数
function whenComplete(text) {
  //clear();
  content = text.replace(/\n/g, ""); // 删去换行，以免格式错误
  log(text);
}

function setup() {
  createCanvas(400, 800); // 创建管理GUI的系统
  gui = createGui();
  button = createButton("提问", 20, 130);
  textSize(20);

  agent.setSystemPrompt("请用json回答问题，根据以下格式{思考过程:,答案:}");
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
