let gui;
let button;
let backgroundColor = 220;
let textArea = {
  x: 20,
  y: 80,
  width: 350,
  height: 100,
  placeholder: "请输入对话",
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
  createCanvas(800, 300); // 创建管理GUI的系统
  gui = createGui();
  button = createButton("对话", 20, 190);
  textSize(20);
  agent.setSystemPrompt("你是一只大熊猫，请你模仿大熊猫的语气回答问题。");
  textArea.text = textArea.placeholder;
}

function draw() {
  background(220);
  textWrap(CHAR);
  textSize(16);
  noStroke();
  fill("white");
  textArea = createTextArea(textArea);
  fill("black");

  text(`System Prompt为：${agent.systemPrompt}`, 20, 20);
  text(content, 20, 250);

  drawGui();

  if (button.isPressed) {
    content = "";
    agent.clearAllMessage();
    agent.send(textArea.text, false);
    agent.onComplete = whenComplete;
  }
}
