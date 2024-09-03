let gui;
let checkbox;
let input;
let button;

let textArea = {
    x: 20,
    y: 20,
    width: 500,
    height: 50,
    placeholder: "输入你的问题",
    isTitle: false,
   
  };

let content = "";
let agent = new P5GLM();

// 接收到GPT完整的消息时会调用的函数
function whenComplete(text) {

  content = text;

}

// 接收到GPT流传输单个消息时会调用的函数
function whenStream(text) {
  content += text;
//  content += '!';
  
}

function setup() {
  createCanvas(600, 400);

  // 创建管理GUI的系统
  gui = createGui();

  // 创建一个复选框
  checkbox = createCheckbox("流传输", 20, 75, 20, 20, true);
  button = createButton("提问", 20, 100);
  textSize(20);

}

function draw() {
    background(220);
   fill('white');
  textArea = createTextArea(textArea);
  fill('black');
  text("是否流式输出",50,90);

  textWrap(CHAR);
  text(content, 20, 150,550);

  // 每帧重绘GUI
  drawGui();

  if (button.isPressed) {
    content = "";
    agent.clearAllMessage();
    agent.send(textArea.text, checkbox.val);
    
    if (checkbox.val) {
      agent.onStream = whenStream;
      
    } 
    agent.onComplete = whenComplete;
    
  }
}
