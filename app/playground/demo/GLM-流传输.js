let gui;
let checkbox;
let input;
let button;

let content = "";
let agent = new P5GLM();

// 接收到GPT完整的消息时会调用的函数
function whenComplete(text) {
  clear();
  content = text;
}

// 接收到GPT流传输单个消息时会调用的函数
function whenStream(text) {
  content += text;
}

function setup() {
  createCanvas(400, 400);

  // 创建管理GUI的系统
  gui = createGui();

  myInput = createInput();
  myInput.position(80, 20);

  // 创建一个复选框
  checkbox = createCheckbox("流传输", 20, 20, 50, 50, true);
  button = createButton("提问", 20, 80);

  textSize(20);
}

function draw() {
  background(220);

  text(content, 20, 220);

  // 每帧重绘GUI
  drawGui();

  if (button.isPressed) {
    content = "";
    agent.send(myInput.value(), checkbox.val);
    if (checkbox.val) {
      agent.onStream = whenStream;
    } else {
      agent.onComplete = whenComplete;
    }
  }
}
