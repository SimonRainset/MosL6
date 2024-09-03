// 创建一个P5GLM对象
let agent = new P5GLM();

// 接收到GPT消息时会调用的函数
function whenComplete(content) {
  clear();
  textSize(25);
  textWrap(CHAR);
  text(content, 50, 100,300);
}

function setup() {
  new Canvas(600, 400);
  background(256);
  textSize(100);
  text("hi", 50, 100);
}

// 鼠标点击时调用的函数
function mousePressed() {
  // 发送消息给GPT，参数是消息内容
  agent.send("你好");

  // 设置接收到消息时调用的函数
  agent.onComplete = whenComplete;
}