let gui;
let button;
let backgroundColor = 220;
let textArea = {
  x: 20,
  y: 150,
  width: 350,
  height: 80,
  placeholder: "请输入Prompt",
  isTitle: false,
};

let content = "";
let agent = new P5GPT();

// 接收到GPT完整的消息时会调用的函数
function whenComplete(text) {

  content = text.replace(/\n/g, ""); // 删去换行，以免格式错误

}

function setup() {
  createCanvas(600, 500); // 创建管理GUI的系统
  gui = createGui();
  button = createButton("生成", 20, 240);
  textSize(20);
}

function draw() {
  background(220);
  textWrap(CHAR);
  textSize(16);
  noStroke();
  fill("white");
  textArea = createTextArea(textArea);
  fill("black");

  textWrap(CHAR);
  text(`你的任务是设计提示词（Prompt），让大模型生成类似下文的一段描述鲁迅的话，神似即可：`, 20, 20,500);
  fill(100,100,0);
  text(`鲁迅，这位天资聪明的小伙子，幼时热爱读书，长大成为了文学巨匠。他不但写稿如山，还提倡改革，真是个让人佩服的儿郎啊！他的著作很多，文风犀利，字里行间毒舌横飞。不过，不要对他的颜值期望太高，毕竟他不是颜值担当啦！`, 20, 70,500);
  
  text(content, 20, 300,500);
  drawGui();

  if (button.isPressed) {
    content = "";
    agent.clearAllMessage();
    agent.send(textArea.text, false);
    agent.onComplete = whenComplete;
  }
}