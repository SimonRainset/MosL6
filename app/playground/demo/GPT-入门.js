// 创建一个P5GPT对象
let agent = new P5GPT();

// 接收到GPT消息时会调用的函数
function whenComplete(content) {
  clear();
  textSize(25);
  text(content, 50, 100);
}

function setup() {
  new Canvas(500, 500);
  background(256);
  textSize(100);
  text("hi", 50, 100);
}

// 鼠标点击时调用的函数
function mousePressed() {
  // 发送消息给GPT
  // 第一个参数是消息内容
  // 第二个参数是是否使用流式API
  agent.send("你好", false);

  // 设置接收到消息时调用的函数
  agent.onComplete = whenComplete;
}
