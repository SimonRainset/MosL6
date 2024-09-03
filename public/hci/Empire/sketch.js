// 声明变量和对象
let gui;
let button1;
let button2;
let button3;

let sysprompt = "现在我们在设计一个互动游戏，游戏玩家扮演一个刚登基的皇帝，在他治理国家的过程中会面临各种重要抉择，这些抉择对于国家的稳定与繁荣至关重要。游戏场景包括[朝堂、后宫、御花园、战场、市集、边境、练武场]，游戏中的NPC人物有[妃子、将军、文臣、宦官、刺客、商人、农夫、边防士兵]。请注意，在后续json格式的回复中，scenario和person中的内容是上述场景和人物的小写字母，如\"feizi\"\"jiangjun\"等。你需要先简单介绍一下本次游戏的背景设定，包括皇帝情况、国号、以及登场的NPC和基本人物关系，字数严格控制在300字以内。随后，在每一轮的回复中，给出游戏中的抉择背景，严格约束在40字以内，例如：“天元十三年，连年大旱，庄稼欠收，民不聊生。你选择：”，并给出两个选择对应的内容，例如“开仓放粮，赈济灾民”和“熟视无睹，无所作为”，请注意每个选择字数不得超过十个字，同时请你借鉴我的说法，但务必不要直接使用我提供的示例内容。此外，游戏有几个数值设定[国运值、武力值、民心值、繁荣度]，初始均为50。当国运值满100时，游戏胜利；为0时，游戏失败，你需要记录这些数值，并在“游戏开始”保持不变，在玩家抉择后根据赋分情况进行运算更新。若玩家死亡（被刺杀或在战争中死亡等，则国运值直接清零）。你需要给出每个选择对应的赋分情况并完成运算。注意！无论输赢请务必控制游戏在10轮以内结束，故赋分分值可以适当加大。尽量贴合数值设定制造一些不符合直觉的后果和赋分，比如赈济灾民时本身繁荣度较低，则国库短缺导致无法赈济，起到了更加恶化的效果；与敌国交战时武力值太低，故导致战争失利等，同时可以考虑几个参数之间的关联，比如民心值低的时候，国运值会固定下降等，务必禁止构造相同或相似的剧情，以增加游戏趣味性。同时可以考虑一些连贯的阴谋设计，如邻国请求和亲，如不同意则下一轮借口发起战争等，可以参照其他游戏剧情。游戏设定要符合历史规律，即登基时是国号的元年，每轮事件放在不同的时间，中途也可以换国号，请拟定游戏国号，不要使用“天元”。游戏难度有三个档次，简单，适中和困难，越简单越容易活动正向得分，越困难越难以获得正向得分，本次游戏难度为：“困难”。首次回复严格控制在300字以内的游戏背景设定。当我发送“游戏开始”后，你回复我的格式为json格式（注意要加双引号）：{\"Guoyun\":50,\"Wuli\":50,\"Minxin\":50,\"Fanrong\":50,\"scenario\":Chaotang,\"person\":zaixiang,\"decision_background\":\"天元十三年连年大旱，庄稼歉收，民不聊生。你选择：\",\"decision1\":\"开仓放粮，赈济灾民\",\"decision2\":\"熟视无睹，无所作为\"}其中的数值设定直接输出现有数值，不需要运算更新。我会回复玩家选择的抉择，如：\"玩家选择抉择1\"，你则回复该抉择的后果和赋分情况，格式仍然为json格式如：{\"Guoyun\":55,\"Wuli\":47,\"Minxin\":60,\"Fanrong\":45,\"decision_effect\":\"虽然灾情严重，但你积极组织赈灾，获得了民众的认可和爱戴，国运值+5，武力值-3，民心值+10，繁荣度-5\"}，在其中需要说明选择的后果和详细的赋分变化情况，并对数值设定进行更新，务必再次确认你的计算是正确的。之后请等待我再次发送“游戏开始”，你再回复下一轮的抉择设定。当国运值达到0或者100时，请宣布游戏的结果，并回复一段300字以内的文本，复盘总结玩家的行为。但现在请你先回复本次游戏的背景设定，不要回复除了背景设定以外的内容，之后等待我发送“游戏开始”。"
let imgBox1 = {
  x: 350,
  y: 50,
  width: 200,
  height: 200,
  img: null,
};

let imgBox2 = {
  x: 50,
  y: 50,
  width: 700,
  height: 300,
  img: null,
};
let imgBox3 = {
  x: 50,
  y: 50,
  width: 700,
  height: 300,
  img: null,
};

let backgroundPath = '0.jpg';
let imgFilePath1 = "3.jpg";
let imgFilePath2 = '1.jpg';

let stage = 0;
let content = "";
let content1 = "";
let decision1 = "";
let decision2 = "";
let decision_effect = "";
let game_status = "游戏尚未开始";
let Wuli = 50;
let Minxin = 50;
let Fanrong = 50;

let agent = new P5GPT();

function clear_decision() {
  content = "";
  content1 = "";
  decision1 = "";
  decision2 = "";
}

// 接收到GPT完整的消息时会调用的函数
function whenComplete(text) {

  // clear(); // 清空画布
  if (stage == 0) {
    clear_decision(); // 先清空决策内容
    log("stage: " + stage)
    stage = 1;
    clear();
    log(text);
    let parsedText = JSON.parse(text);
    content = parsedText.decision_background.replace(/\n/g, "");
    decision1 = parsedText.decision1.replace(/\n/g, "");
    decision2 = parsedText.decision2.replace(/\n/g, "");
    Wuli = parsedText.Wuli;
    Minxin = parsedText.Minxin;
    Fanrong = parsedText.Fanrong;
    Guoyun = parsedText.Guoyun;
    game_status = "国运:  " + Guoyun + '\n' + "武力:  " + Wuli + '\n' + "民心:  " + Minxin + '\n' + "繁荣:  " + Fanrong;
    log(game_status);
  } else if (stage == 1) {
    clear(); // 清空画布
    log("stage: " + stage)
    stage = 2;
    clear_decision();
    let parsedText = JSON.parse(text);

    decision_effect = parsedText.decision_effect.replace(/\n/g, "");
    Guoyun = parsedText.Guoyun;
    Wuli = parsedText.Wuli;
    Minxin = parsedText.Minxin;
    Fanrong = parsedText.Fanrong;
    game_status = "国运:  " + Guoyun + '\n' + "武力:  " + Wuli + '\n' + "民心:  " + Minxin + '\n' + "繁荣:  " + Fanrong;
    content1 = decision_effect;
    log(game_status);
    log(text)
  } else if (stage == 2) {
    clear(); // 清空画布
    log("stage: " + stage)
    stage = 1;
    clear_decision();
    load_stage1();
    clear();
    let parsedText = JSON.parse(text);
    content = parsedText.decision_background.replace(/\n/g, "");
    decision1 = parsedText.decision1.replace(/\n/g, "");
    decision2 = parsedText.decision2.replace(/\n/g, "");
    Wuli = parsedText.Wuli;
    Minxin = parsedText.Minxin;
    Fanrong = parsedText.Fanrong;
    Guoyun = parsedText.Guoyun;
    game_status = "国运:  " + Guoyun + '\n' + "武力:  " + Wuli + '\n' + "民心:  " + Minxin + '\n' + "繁荣:  " + Fanrong;
    log(game_status);
    log(text)

  }
  if (Guoyun >= 70) {
    fill(255);
    textSize(40);
    content1 = "国运值达到巅峰，游戏胜利！";
    game_status = "游戏结束";
    stage = 3;
    goto_end();
  }
  if (Minxin <= 25 || Fanrong <= 25 ||Guoyun <= 25) {
    fill(255);
    textSize(40);
    content1 = "民心不在，一片萧瑟，游戏失败！";
    game_status = "游戏结束";
    stage = 4;
    goto_end2();
  }
}

function setup() {
  // 创建画布
  createCanvas(800, 400);
  // 创建 GUI
  gui = createGui();
  // 加载图片文件到图片框对象
  imgBox1.img = loadImage(imgFilePath1);
  imgBox2.img = loadImage(imgFilePath2);
  agent.setSystemPrompt(sysprompt);
  stage = 0;
  // 创建按钮1
  button1 = createButton("开始游戏", 350, 300);
  // 按钮1的点击事件
  button1.onPress = function () {
    content = "";
    agent.clearAllMessage();
    agent.send("开始游戏", false);
    agent.onComplete = whenComplete;
    load_stage1();
  };
}

function draw() {
  background(255);
  let bgImg = loadImage(backgroundPath);
  image(bgImg, 0, 0, width, height);

  // 绘制图片框
  if (stage == 0) {
    imgBox2.img = loadImage(imgFilePath2);
    if (imgBox2.img) {
      image(imgBox2.img, imgBox2.x, imgBox2.y, imgBox2.width, imgBox2.height);
      if (imgBox1.img) {
        image(imgBox1.img, imgBox1.x, imgBox1.y, imgBox1.width, imgBox1.height);
      }
    }
  } else if (stage == 1) {
    imgBox2.img = loadImage('5.jpg');
    if (imgBox2.img) {
      image(imgBox2.img, imgBox2.x, imgBox2.y, imgBox2.width, imgBox2.height);
      if (imgBox1.img) {
        image(imgBox1.img, imgBox1.x, imgBox1.y, imgBox1.width, imgBox1.height);
      }
    }
  } else if (stage == 2) {
    // imgBox3.img = loadImage('2.jpg');
    imgBox2.img = loadImage('6.jpg');
    if (imgBox2.img) {
      image(imgBox2.img, imgBox2.x, imgBox2.y, imgBox2.width, imgBox2.height);
      if (imgBox1.img) {
        image(imgBox1.img, imgBox1.x, imgBox1.y, imgBox1.width, imgBox1.height);
      }
    }
  } else if (stage == 3) {
    imgBox2.img = loadImage('end.png');
    if (imgBox2.img) {
      image(imgBox2.img, imgBox2.x, imgBox2.y, imgBox2.width, imgBox2.height);
      if (imgBox1.img) {
        image(imgBox1.img, imgBox1.x, imgBox1.y, imgBox1.width, imgBox1.height);
      }
    }
  } else if (stage == 4) {
    imgBox2.img = loadImage('end2.png');
    if (imgBox2.img) {
      image(imgBox2.img, imgBox2.x, imgBox2.y, imgBox2.width, imgBox2.height);
      if (imgBox1.img) {
        image(imgBox1.img, imgBox1.x, imgBox1.y, imgBox1.width, imgBox1.height);
      }
    }
  }
  // 绘制文字
  if (stage != 3 && stage != 4) {
    fill(255);
    rect(width - 220, 20, 200, 150);
    fill(0);
    textSize(16);
    text(game_status, width - 200, 50, 100);
    imgBox1.img = loadImage('');
  }

  // 绘制文字
  // fill(255,0,0);
  // 设置文字阴影和背景色的函数
  function drawTextWithBackground(size, textContent, x, y, textWidth, bgColor, textColor, n) {
    textAlign(LEFT, TOP);
    textSize(size);

    // 将文本按每20个字符分割成多行
    let lines = [];
    for (let i = 0; i < textContent.length; i += n) {
      lines.push(textContent.substring(i, i + n));
    }

    let textHeight = (textAscent() + textDescent()) * lines.length;
    if (size != 18) {
      // 绘制背景框
      fill(bgColor);
      rect(x - 5, y - 5, textWidth + 50, textHeight + 20 * (lines.length - 1));
    }

    // 绘制文字
    fill(textColor);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], x, y + i * (textAscent() + textDescent()), textWidth);
    }
  }

  let bgColor = color(200, 200, 200, 150); // 浅灰色透明背景
  let textColor = color(0); // 黑色文字

  // 绘制带背景的文字内容
  if (content) {
    drawTextWithBackground(22, content, 80, 50, 400, bgColor, textColor, 20);
  }

  if (stage == 3 || stage == 4) {
    if (content1) {
      drawTextWithBackground(22, content1, 100, 265, 500, bgColor, 255, 35);
    }
  } else {
    if (content1) {
      drawTextWithBackground(18, content1, 100, 265, 500, bgColor, textColor, 35);
    }
  }

  // 绘制带背景的抉择1
  if (decision1) {
    drawTextWithBackground(20, decision1, 100, 200, 250, bgColor, textColor, 30);
  }

  // 绘制带背景的抉择2
  if (decision2) {
    drawTextWithBackground(20, decision2, 420, 200, 250, bgColor, textColor, 30);
  }
  // if (stage == 2) {
  //   load_stage1();
  // }

  // 绘制 GUI
  drawGui();
}

function createButton2And3() {
  // 创建按钮2和按钮3
  let button2 = createButton("选择一", 200, 300);
  let button3 = createButton("选择二", 400, 300);

  // 按钮2点击事件
  button2.onPress = function () {
    // agent.clearAllMessage();
    agent.send("玩家选择抉择1", false);
    agent.onComplete = whenComplete;
    button2.visible = false;
    button3.visible = false;
    imgBox2.img = loadImage('6.jpg');
    createButton4();
  };

  // 按钮3点击事件
  button3.onPress = function () {
    // agent.clearAllMessage();
    agent.send("玩家选择抉择2", false);
    agent.onComplete = whenComplete;
    button2.visible = false;
    button3.visible = false;
    imgBox2.img = loadImage('6.jpg');
    createButton4();
  };
}

function createButton4() {
  // 创建按钮4
  let button4 = createButton("继续游戏", 350, 350);
  // 按钮4点击事件
  button4.onPress = function () {
    button4.visible = false;
    // agent.clearAllMessage();
    agent.send("继续游戏", false);
    agent.onComplete = whenComplete;
  };
}

function load_stage1() {
  // load_stage1
  imgBox2.img = loadImage('5.jpg');
  button1.visible = false;
  createButton2And3();
}

function reload_stage1() {
  imgBox2.img = loadImage('5.jpg');
  button1.visible = false;
  createButton2And3();
}

function playing2() {
  // playing2函数逻辑
  imgBox2.img = loadImage('5.jpg');
  createButton2And3();
}
function goto_end() {
  imgBox2.img = loadImage('end.png');
  button4.visible = false;

}

function goto_end2() {
  imgBox2.img = loadImage('end2.png');
  button4.visible = false;

}