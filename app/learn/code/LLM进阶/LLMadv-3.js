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

let content = "...";
let xiaomingAgent = new P5GLM();
let sceneAgent = new P5GPT();
let sceneSprite; 
let sceneJson;
let ifChangeScene = false;
let dialog = '';
let xiaoming;
let jsonData;

// 接收到GPT完整的消息时会调用的函数
function sceneWhenComplete(text) {
  sceneJson = text.replace(/\n/g, ""); // 删去换行，以免格式错误
  const chineseCommaRegex = /(?<=":)\s*，|(?<=",)\s*(?=\s*[{])/g; // 可能误用中文逗号
  sceneJson = sceneJson.replace(chineseCommaRegex, ',');  
  sceneJson = sceneJson.match(/{[^{}]*}/); // 提取回答中的json格式
  jsonData = JSON.parse(sceneJson);
  ifChangeScene = jsonData["是否更换场景"];
  if (ifChangeScene)
  {
    sceneSprite.scene = jsonData["新场景"];
    sceneSprite.image = jsonData["新场景emoji"]
  
  } 
 
}

function xmWhenComplete(text){
    content  = text.replace(/\n/g, ""); // 删去换行，以免格式错误
    let lastSixMessages= xiaomingAgent.messages.slice(-6); // 取最后六句对话为对话背景
    dialog = lastSixMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    //messages 数组内容为：{ role: "assistant"或"user",content: 对话内容} 其中"user"代表用户输入，"assistant"代表llm输出
  
    sceneAgent.send(`目前场景：${sceneSprite.scene} ,对话：${dialog}`);
    sceneAgent.onComplete = sceneWhenComplete;
    
     button.visible = true;
}

function setup() {
  createCanvas(400, 800); // 创建管理GUI的系统
  gui = createGui();
  button = createButton("与小明对话", 20, 130,150,30);
  textSize(20);
  sceneSprite= new Sprite(220,350,200,200);
  sceneSprite.scene = '家';
  sceneSprite.image = '🏠';
  xiaomingAgent.setSystemPrompt(`我们来做角色扮演游戏，你扮演小明，目前正在家中，用户和你对话。你每次的回复扮演小明与用户对话，请简洁，不要超过20字。`);
  sceneAgent.setSystemPrompt(`请你帮我做场景生成的工作。用户将发送一段对话，请你根据对话内容和目前场景来判断是否需要更换场景，并给出新的场景emoji。你每次回复请用JSON格式。三个key分别"是否更换创景"，"新场景"和"新场景emoji"。
  "是否更换场景"为true/false格式，true代表需要更换场景，false代表不更换，请只输出true或者false。
  "新场景"为需要更换时输出的新场景名，如操场。只输出一个场景。
  "新场景emoji"为新生成的场景emoji，请只输出一个emoji字符
  请根据严格按照以下格式{"是否更换场景":,"新场景":,"新场景emoji":}。`);
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
  textSize(18);
  text(sceneSprite.scene,200,490);
  fill(150,150,150);
  text(sceneJson, 30, 510, 350);
  fill(110,110,0);
  text(content,30,200,320);
 
  drawGui();

  if (button.isPressed) {
    content = "";
    button.visible = false;
    
    xiaomingAgent.send(textArea.text, false);
    xiaomingAgent.onComplete = xmWhenComplete;
  }
}
