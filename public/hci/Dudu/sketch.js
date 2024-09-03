
let gui;
let button;
let like1;
let like2;
let like3;
let hunger1;
let hunger2;
let hunger3;
let time1;
let time2;
let time3;
let nutrition1;
let nutrition2;
let nutrition3;
let pet;
let food;
let isClick = false;
let foodnum = 0;
let reset;
let hungerRemoved = false;
let likeRemoved = false;
let timeout = false;
let box;

let meet;
let fish;
let foodid = 0;
let getfoodid = 0;
let getfoodduration = 0;

let agent = new P5GPT();
let content = "汪汪汪，我是一直流浪小狗，现在很饿，如果好感度足够，会跟你走。";
let textArea = {
  x: 600,
  y: 920,
  width: 700,
  height: 130,
  placeholder: "请输入对话",
  isTitle: false,
};
let chatbotton;
let chattime = 3;
let alertflag = false;
let timestamp = 0;
let costtime = 0;

function whenComplete(text) {
  clear();
  content = text.replace(/\n/g, "");
}

function whenStream(text) {
  content += text;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gui = createGui();

  chatbotton = createButton("对话", 1500, 920);
  textSize(20);
  textArea.text = textArea.placeholder;

  agent.setSystemPrompt("你是一个游戏中的宠物狗，在这个游戏中有这样的设定：1、玩家需要投喂小狗，当小狗的饥饿值在500到700之间，营养值在300以上时，小狗的好感度会上升，当好感度到达1000时获胜。2、投喂的东西有肉骨头和营养食物两种，投喂肉骨头会增加大量饥饿值（100）和少量营养值（30），投喂营养食物会增加大量营养值（120）。3、当小狗的营养值低于300时，小狗营养不足，好感度会下降。4、当小狗的饥饿值低于500时，小狗会太饿，好感度下降5、当小狗的饥饿值高于700时，小狗会太饱，好感度下降。6、当小狗饥饿值在500到700之间，营养值分别超过500、700、900时好感度上升会加快。玩家可能会和你聊天或者询问关于游戏的信息，你要作为被投喂的小狗，用诙谐风趣并且不太直接语言暗示玩家该如何游戏。");

  box = loadImage("./box.jpg");
  

  meet = createButton("🍗", 50, 50);
  meet.setStyle({
    textSize: 20,
  });
  meet.x = 1600;
  meet.y = 280;
  meet.h = 60;
  meet.w = 60;

  fish = createButton("💊", 50, 50);
  fish.setStyle({
    textSize: 20,
  });
  fish.x = 1600;
  fish.y = 350;
  fish.h = 60;
  fish.w = 60;

  pet = new Sprite();
  pet.x = 1000;
  pet.y = 300;
  pet.image = './cry.jpg';
  pet.scale = 1;

  hunger3 = new Sprite();
  hunger3.x = 400;
  hunger3.y = 800;
  hunger3.w = 10;
  hunger3.h = 10;
  hunger3.image = './food.jpg';
  hunger3.scale = 0.1;

 
  time3 = new Sprite();
  time3.x = 400;
  time3.y = 640;
  time3.w = 10;
  time3.h = 10; 
  time3.image = './time.jpg';
  time3.scale = 0.1;

  like3 = new Sprite();
  like3.x = 400;
  like3.y = 720;
  like3.w = 10;
  like3.h = 10; 
  like3.image = './heart.jpg';
  like3.scale = 0.1;

  nutrition3 = new Sprite() ;
  nutrition3.x = 400;
  nutrition3.y = 880;
  nutrition3.w = 10;
  nutrition3.h = 10;
  nutrition3.image = './nutrition.jpg';
  nutrition3.scale = 0.05;



  reset = createButton("重置", 50, 50);
  reset.setStyle({
    textSize: 20,
  });
  reset.x = 1600;
  reset.y = 130;
  reset.h = 60;
  reset.w = 60;

  like2 = new Sprite();
  like2.h = 20;
  like2.w = 1000;
  like2.x = 1000;
  like2.y = 720;
  like2.color = 'white';

  hunger2 = new Sprite();
  hunger2.h = 20;
  hunger2.w = 1000;
  hunger2.x = 1000;
  hunger2.y = 800;
  hunger2.color = 'white';

  nutrition2 = new Sprite();
  nutrition2.h = 20;
  nutrition2.w = 1000;
  nutrition2.x = 1000;
  nutrition2.y = 880;
  nutrition2.color = 'white';

  time2 = new Sprite();
  time2.h = 20;
  time2.w = 1000;
  time2.x = 1000;
  time2.y = 640;
  time2.color = 'white';

  time1 = new Sprite();
  time1.h = 20;
  time1.w = 1000;
  time1.x = time2.x - time2.w / 2 + time1.w / 2;
  time1.y = 640;
  time1.color = 'blue';

  time2.overlaps(time1);
  like1 = new Sprite();
  like1.h = 20;
  like1.w = 0.01;
  like1.x = like2.x - like2.w / 2 + like1.w / 2;
  like1.y = 720;
  like1.color = 'red';
  like2.overlaps(like1);

  hunger1 = new Sprite();
  hunger1.h = 20;
  hunger1.w = 0.01;
  hunger1.x = hunger2.x - hunger2.w / 2 + hunger1.w / 2;
  hunger1.y = 800;
  hunger1.color = 'yellow';
  hunger2.overlaps(hunger1);

  nutrition1 = new Sprite();
  nutrition1.h = 20;
  nutrition1.w = 0.01;
  nutrition1.x = nutrition2.x - nutrition2.w / 2 + nutrition1.w / 2;
  nutrition1.y = 880;
  nutrition1.color = 'green';
  nutrition2.overlaps(nutrition1);

}


function draw() {
  clear();
  drawGui();
  text("选择小狗的食物", 1600, 250);

  textWrap(CHAR);
  textSize(20);
  text("PS:可以问问小狗该怎么做", 600, 1080);
  textArea = createTextArea(textArea);

  timestamp ++ ;
  if (alertflag == false) {
    costtime ++ ;
  }
  image(box, 20, 120);
  text(content, 60, 180, 550, 150);


  res = "用时：" + (costtime / 60).toPrecision(3).toString();
  text(res, 1600, 500);
  

  text("时间", 330, 640);
  text("好感度", 330, 720);
  text("饥饿值", 330, 800);
  text("营养", 330, 880);

  if (chatbotton.isPressed) {
    content = "";
    agent.clearAllMessage();
    agent.send(textArea.text, false);
    agent.onComplete = whenComplete;
    timestamp = 0;
  }

  if (!alertflag && like1.w == 1000) {
    alert("小狗喜欢你")
    alertflag = true;
  }
  if (!alertflag && time1.w < 1) {
    alert("小狗不喜欢你")
    alertflag = true;
  }
  

  if (reset.isPressed) {
    time1.w = 1000;
    time1.x = time2.x - time2.w / 2 + time1.w / 2;
    hunger1.w = 0.01;
    hunger1.x = hunger2.x - hunger2.w / 2 + hunger1.w / 2;
    hungerRemoved = true;
    like1.w = 0.01;
    like1.x = like2.x - like2.w / 2 + like1.w / 2;
    likeRemoved = true;
    nutrition1.w = 0.01;
    nutrition1.x = nutrition2.x - nutrition2.w / 2 + nutrition1.w / 2;
    alertflag = false;
    chattime = 3;
    timestamp = 0;
    costtime = 0;
  }

  if (hunger1 instanceof Sprite && like1 instanceof Sprite && hunger1.w == 200 && like1.w == 200) {
    time1.w = Math.min(200, time1.w + 50);
    time1.x = time2.x - time2.w / 2 + time1.w / 2;
  }
  
  time1.w -= 0.15;
  time1.x = time2.x - time2.w / 2 + time1.w / 2;
  hunger1.w = Math.max(0.01, hunger1.w - 0.4);
  hunger1.x = hunger2.x - hunger2.w / 2 + hunger1.w / 2;
  nutrition1.w = Math.max(0.01, nutrition1.w - 0.2);
  nutrition1.x = nutrition2.x - nutrition2.w / 2 + nutrition1.w / 2;
  if (hunger1.w >= 500 && hunger1.w <= 700 && nutrition1.w >= 300) {
    let value = 0.3;
    if (nutrition1.w >= 500) value = 0.4;
    if (nutrition1.w >= 700) value = 0.5;
    if (nutrition1.w >= 900) value = 0.6;
    like1.w = Math.min(1000, like1.w + value);
    like1.x = like2.x - like2.w / 2 + like1.w / 2;
    if (timestamp == 360) {
      agent.send("现在你刚好饱，营养值也足够，好感度正在上升，增加营养值可以加快好感度提升速度");
      agent.onComplete = whenComplete;
      timestamp = 0;
    }
  } else {
    if (timestamp == 360) {
      if (nutrition1.w < 300 && hunger1.w < 500) {
        agent.send("现在你的营养值不足，也很饿");
      } else if (nutrition1.w < 300 && hunger1.w > 800) {
        agent.send("现在你的营养值不足，并且太饱了");
      } else if (nutrition1.w < 300) {
        agent.send("现在你刚好饱，但是营养值不足");
      } else {
        if (hunger1.w < 500) {
          agent.send("现在你营养值充足，但是太饿了");
        } else if (hunger1.w > 800) {
          agent.send("现在你营养值充足，但是太饱了");
        } else {
          agent.send("现在你刚好饱，营养值也足够，好感度正在上升，增加营养值可以加快好感度提升速度");
        }
      }
      agent.onComplete = whenComplete;
      timestamp = 0;
    }
    like1.w = Math.max(0.1, like1.w - 0.4);
    like1.x = like2.x - like2.w / 2 + like1.w / 2;
  }

  if (meet.isPressed) {
    pet.image = './dog2.jpg';
    pet.image.scale = 1.2;
    isClick = true;
    foodid = 1;
  } else if (fish.isPressed) {
    pet.image = './dog2.jpg';
    pet.image.scale = 1.2;
    isClick = true;
    foodid = 2;
  }
  if (isClick) {
    if (foodnum == 0) {
      food = new Sprite();
      if (foodid == 1) food.image = './food.jpg';
      else if (foodid == 2) food.image = './fish.jpg';
      food.scale = 0.15;
      foodnum ++ ;
    }
    food.x = mouse.x;
    food.y = mouse.y;
  }


  if (food instanceof Sprite && Math.abs(food.x - pet.x) < 50 && Math.abs(food.y - pet.y) < 50) {
    if (!(hunger1 instanceof Sprite) || hunger1.w <= 500 || hunger1.w >= 700) {
      pet.image = './cry.jpg';
    } else {
      pet.image = './dog.jpg';
    }
    food.remove();
    if (isClick) {
      if (foodid == 1) {
        hunger1.w = Math.min(hunger1.w + 100, 1000);
        hunger1.x = hunger2.x - hunger2.w / 2 + hunger1.w / 2;
        nutrition1.w = Math.min(nutrition1.w + 30, 1000);
        nutrition1.x = nutrition2.x - nutrition2.w / 2 + nutrition1.w / 2;
        getfoodid = 1;
        getfoodduration = 240;
      } else if (foodid == 2) {
        nutrition1.w = Math.min(nutrition1.w + 120, 1000);
        nutrition1.x = nutrition2.x - nutrition2.w / 2 + nutrition1.w / 2;
        getfoodid = 2;
        getfoodduration = 240;
      }
      foodnum -- ;
    }
    isClick = false;
    foodid = 0;
  }
}
