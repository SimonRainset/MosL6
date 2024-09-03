let gui;
let button;
let backgroundColor = 220;
let textArea = {
  x: 80,
  y: 150,
  width: 100,
  height: 50,
  placeholder: "XX",
  isTitle: false,
};
let prompt;
let input = "XX";

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

  /////// 黄金公式 Prompt = 指令 + 输入 ////////////
  //下面的 Prompt就融合了指令与输入
  // 其中，指令是：请介绍一下XX，不超过100字; 而输入是：XX
  // 因此，如果用户输入【鲁迅】
  // 则Prompt为：请介绍一下鲁迅，不超过100字
  
  prompt = "请介绍一下" + input + "，不超过100字"; 
  
  // 你可以利用下面的案例修改上面的Prompt，使其可以实现类似语气。
  // 案例：鲁迅，这位天资聪明的小伙子，幼时热爱读书，长大成为了文学巨匠。他不但写稿如山，还提倡改革，真是个让人佩服的儿郎啊！他的著作很多，文风犀利，字里行间毒舌横飞。不过，不要对他的颜值期望太高，毕竟他不是颜值担当啦！

  background(220);
  textWrap(CHAR);
  textSize(16);
  noStroke();
  fill("white");
  textArea = createTextArea(textArea);
  fill("black");

  textWrap(CHAR);
  text(`你的任务是设计提示词（Prompt），让大模型生成类似下文的一段话，描述用户输入的人物（如用户输入鲁迅）：`, 20, 20,500);
  text(`输入 = `, 20,180 );
  text(`prompt = `+ prompt,20,210,500);
  fill(100,100,0);
  text(`鲁迅，这位天资聪明的小伙子，幼时热爱读书，长大成为了文学巨匠。他不但写稿如山，还提倡改革，真是个让人佩服的儿郎啊！他的著作很多，文风犀利，字里行间毒舌横飞。不过，不要对他的颜值期望太高，毕竟他不是颜值担当啦！`, 20, 70,500);
  
  text(content, 20, 300,500);
  drawGui();

  if (button.isPressed) {
    content = "";
    agent.clearAllMessage();
    agent.send(prompt, false);
    agent.onComplete = whenComplete;
  }
  if (textArea.text) input = textArea.text;
}