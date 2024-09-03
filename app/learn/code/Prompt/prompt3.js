let gui;
let button;
let button1,button2;
let backgroundColor = 220;
let prompt;
let input = "   ";
let answer = "";
let content = "";
let agent = new P5GPT();

// 接收到GPT完整的消息时会调用的函数
function whenComplete(text) {

  content = text.replace(/\n/g, ""); // 删去换行，以免格式错误

}

function setup() {
  createCanvas(600, 500); // 创建管理GUI的系统
  gui = createGui();
  button = createButton("生成", 320, 250);
  button1 = createButton("1", 80, 50,20,20);
  button2 = createButton("2",110, 50,20,20);
  textSize(20);
   input = `泡一杯茶很容易。首先，需要把水烧开。在等待期间，拿一个杯子并把茶包放进去。一旦水足够热，就把它倒在茶包上。等待一会儿，让茶叶浸泡。几分钟后，取出茶包。如果您愿意，可以加一些糖或牛奶调味。就这样，您可以享受一杯美味的茶了。`;
    answer = `第一步 - 把水烧开。\n第二步 - 拿一个杯子并把茶包放进去。\n第三步 - 把烧开的水倒在茶包上。\n第四步 - 等待几分钟，让茶叶浸泡。\n第五步 - 取出茶包。\n第六步 - 如果需要，加入糖或牛奶调味。\n第七步 - 就这样，您可以享受一杯美味\n的茶了。`;
 
}

function draw() {

  /////// 黄金公式 Prompt = 指令 + 输入 ////////////
  // 请提升下面的Prompt，使得其大模型可以给出相应的预期输出  
  prompt = "请分一下类：" + input + ":)"; 
  
  background(220);
  textWrap(CHAR);
  textSize(16);
  noStroke();
  fill("white");

  fill("black");

  textWrap(CHAR);
  text(`你的任务是设计提示词（Prompt），让大模型对用户输入进行分类`, 20, 20,500);
  text(`输入 = ` + input, 20,90,500 );
  fill(100,0,0);
  text(`prompt = `+ prompt.replace(new RegExp(input, 'g'), `【输入】`),20,180,500);
  text(`实际输出`,320, 300,250)
  text(content, 320, 320,250);
  fill(100,100,0);
  text(`预期输出：`, 20, 300,250);
  text(answer, 20, 340);
  
  
  drawGui();

  if (button.isPressed) {
    content = "";
    agent.clearAllMessage();
    agent.send(prompt, false);
    agent.onComplete = whenComplete;
  }
  if (button1.isPressed){
    input = `泡一杯茶很容易。首先，需要把水烧开。在等待期间，拿一个杯子并把茶包放进去。
一旦水足够热，就把它倒在茶包上。等待一会儿，让茶叶浸泡。几分钟后，取出茶包。如果您愿意，可以加一些糖或牛奶调味。就这样，您可以享受一杯美味的茶了。`;
    answer = `第一步 - 把水烧开。\n第二步 - 拿一个杯子并把茶包放进去。\n第三步 - 把烧开的水倒在茶包上。\n第四步 - 等待几分钟，让茶叶浸泡。\n第五步 - 取出茶包。\n第六步 - 如果需要，加入糖或牛奶调味。\n第七步 - 就这样，您可以享受一杯美味\n的茶了。`;
  }
  if (button2.isPressed){
    input = `今天阳光明媚，鸟儿在歌唱。这是一个去公园散步的美好日子。鲜花盛开，树枝在微风中轻轻摇曳。人们外出享受着这美好的天气，有些人在野餐，有些人在玩游戏或者在草地上放松。这是一个完美的日子，可以在户外度过并欣赏大自然的美景。`;
    answer = `没有什么步骤可言`
  }

}