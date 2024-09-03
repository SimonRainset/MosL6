// 创建一个P5GLM对象
let agent = new P5GLM();
let ifWaiting = false;
let answer = "";

// 接收到GPT消息时会调用的函数
function whenComplete(content) {
  clear();
  answer = content;
  ifWaiting = false;
}

function setup() {
  new Canvas(600, 400);
  
}

function draw()
{
    clear();
    background(220);
    textSize(100);
    text("hi", 50, 100);
    textSize(25);
    if (ifWaiting) text('等待回复中',200,200); 
    textWrap(CHAR);
    text(answer, 50, 150,350);
    
}
// 鼠标点击时调用的函数
function mousePressed() {
    answer = "";
  // 发送消息给GPT，参数是消息内容
  agent.send("你好");
  ifWaiting = true;

  // 设置接收到消息时调用的函数
  agent.onComplete = whenComplete;
}