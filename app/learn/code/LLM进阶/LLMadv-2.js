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
  placeholder: "你好，小明，去玩么",
  isTitle: false,
};

let content = "";
let agent = new P5GLM();
let response = '...' ;
let ifHappy = false;
let affection = 0;
let xiaoming;

let jsonData;

// 接收到GPT完整的消息时会调用的函数
function whenComplete(text) {
  content = text.replace(/\n/g, ""); // 删去换行，以免格式错误
  const chineseCommaRegex = /(?<=":)\s*，|(?<=",)\s*(?=\s*[{])/g; // 可能误用中文逗号
  content = content.replace(chineseCommaRegex, ',');  
  content = content.match(/{[^{}]*}/); // 提取回答中的json格式
 
  jsonData = JSON.parse(content);
  response = jsonData["回复"];
  ifHappy = jsonData["是否开心"];
  affection = jsonData["好感度"]
  button.visible = true;
}

function setup() {
  createCanvas(400, 800); // 创建管理GUI的系统
  gui = createGui();
  button = createButton("与小明对话", 20, 130,150,30);
  textSize(20);
  xiaoming = new Sprite(200,400,100,100);
  

  agent.setSystemPrompt(`我们来做角色扮演游戏，你扮演小明，用户和你对话，你每次回复请用JSON格式，三个key分别"回复"，"是否开心"和"好感度"。
  "回复"为文本格式，为小明的回复，简短不超过20个字。
  "是否开心"为true/false格式，true代表小明回复时开心，false表不开心，请只输出true或者false
  "好感度"为数字格式，请只输出1-5之间的一个数，代表小明对用户的好感度。
  请根据严格按照以下格式{"回复":,"是否开心":,"好感度":}。`);
  textArea.text = textArea.placeholder;
}

function draw() {
  background(220);
  textSize(16);
  noStroke();
  fill("white");
  textArea = createTextArea(textArea);
  fill("black");
  if(ifHappy) xiaoming.image = '😀';
  else xiaoming.image = '😐';
  textSize(50);
  text('💛'.repeat(affection),50,300);

  textWrap(CHAR);
  textSize(18);
  fill(150,150,150);
  text(content, 30, 510, 350);
  fill(110,110,0);
  text(response,30,200,320);
 
  drawGui();

  if (button.isPressed) {
    content = "";
    button.visible = false;
    
    agent.send(textArea.text, false);
    agent.onComplete = whenComplete;
  }
}
