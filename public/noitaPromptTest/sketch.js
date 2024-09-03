// let gptAgent = new P5GPT();
// let gptWandMovie = new P5GPT();
// let gptWandResult = new P5GPT();
// let gptWandFailure = new P5GPT();
let gptAgent = new P5GLM();
let gptWandMovie = new P5GLM();
let gptWandResult = new P5GLM();
let gptWandFailure = new P5GLM();
const canvasWidth = 900;
const canvasHeight = 700;
const canvasX = 100;
const canvasY = 100;
let CA;
let gui;
let buttonReset, buttonWand, buttonWandMake;
let gems, bullets;
let objects, sparks;
let wandCoreMat, wandStickMat;
let wandCoreObject = -1;
let wandStickObject = -1;
let gameStatus = "start"; //
let previousGameStatus = "start";
let makingWand = false;
let sceneDescription,
  enemyName,
  enemyDescription,
  enemyWeaknesses = [],
  objectNames = [],
  superiorObjectNames = [];
let wandMovieText = "";
let wandMovieFin = false;
let wandMovieTextPointer = 0;
let wandCoreArea, wandStickArea, wandEnhanceArea;
let wandName = "",
  wandMissile = "",
  wandProjectile = "";
let backgroundLightness = 235;
let noitaWorld = "水族馆";

function setup() {
  ////////////////////////////////////////////////// GPT AGENT /////////////////////////////////////////
  gptAgent.setModel(3);
  CA = createCanvas(canvasWidth, canvasHeight);
  CA.position(canvasX, canvasY);
  gui = createGui();
  updateSceneSetting();

  // !!!! Sprites !!!!
  gems = new Group();
  gems.diameter = 10;
  gems.x = () => random(0.1 * canvasWidth, 0.9 * canvasWidth);
  gems.y = () => random(0.3 * canvasHeight, 0.7 * canvasHeight);
  gems.amount = 900;
  bullets = new Group();
  bullets.overlaps(allSprites);
  bullets.overlaps(gems, collect);
  bullets.direction = () => random(0, 360);
  bullets.w = 10;
  bullets.h = 10;
  bullets.speed = 3;

  objects = new Group();
  objects.color = "pink";
  objects.w = 50;
  objects.h = 30;
  objects.overlaps(allSprites);
  objects.text = (i) => i;
  objects.id = (i) => i;
  objects.type = "normal"; // normal object or special object
  objects.rotationLock = true;

  sparks = new Group();
  sparks.x = () => random(0.3 * canvasWidth, 0.7 * canvasWidth);
  sparks.y = () => random(0.5 * canvasHeight, 0.9 * canvasHeight);
  sparks.overlaps(allSprites);
  sparks.r = 10;
  sparks.color = "white";
  //sparks.amount = 2;
  //sparks.strokeWeight = 0.5;

  //sparks.debug = true;
  sparks.overlaps(objects, sparkCollect);

  wandCoreArea = new Sprite(0.3 * canvasWidth, 0.6 * canvasHeight, 200);
  wandCoreArea.color = "white";
  wandCoreArea.text = "\n\n\n\n\n魔杖芯材料\n（影响弹药）";
  wandCoreArea.overlaps(allSprites);

  wandStickArea = new Sprite(0.7 * canvasWidth, 0.6 * canvasHeight, 200);
  wandStickArea.color = "white";
  wandStickArea.text = "\n\n\n\n\n魔杖柄材料\n（影响弹道）";
  wandStickArea.overlaps(allSprites);

  //  !!!! Button !!!!
  buttonReset = createButton(
    "Reset",
    canvasWidth - 200,
    canvasHeight - 50,
    90,
    40
  );
  buttonReset.onRelease = buttonResetRelease;
  buttonWand = createButton(
    "Wand",
    canvasWidth - 100,
    canvasHeight - 50,
    90,
    40
  );
  buttonWand.onRelease = buttonWandRelease;
  buttonWandMake = createButton(
    "Make",
    canvasWidth - 300,
    canvasHeight - 50,
    90,
    40
  );
  buttonWandMake.onRelease = buttonWandMakeRelease;
  buttonWandMake.setStyle({
    fillBg: color("#FF0000"),
    fillBgHover: color("#AA0000"),
  });
  buttonWandMake.visible = false;
}

function draw() {
  background(backgroundLightness);

  if (gameStatus === "start") {
    allSprites.visible = false;
    buttonReset.visible = false;
    buttonWand.visible = false;
    text(
      "GAME STARTING\n" + "=".repeat((frameCount / 4) % 12),
      canvasWidth / 2,
      canvasHeight / 2
    );
  } else if (gameStatus === "bulleting") {
    allSprites.visible = false;
    gems.visible = true;
    bullets.visible = true;
    objects.visible = true;
    buttonReset.visible = true;
    buttonWand.visible = true;
    buttonWand.label = "Wand";
    buttonWandMake.visible = false;

    if (frameCount % 3 === 0) new bullets.Sprite();
  } else if (gameStatus.includes("wandMaking")) {
    allSprites.visible = false;
    wandCoreArea.visible = true;
    wandStickArea.visible = true;
    objects.visible = true;
    buttonReset.visible = false;
    buttonWandMake.visible = true;
    buttonWand.visible = true;
    buttonWand.label = "Back";
    bullets.amount = 0; // stop bulleting
    sparks.visible = true;
    if (
      gameStatus === "wandMaking.prepare" ||
      gameStatus === "wandMaking.done"
    ) {
      for (
        let i = 0;
        i < objects.amount;
        i++ // moving objects
      ) {
        if (objects[i].mouse.hovering()) mouse.cursor = "grab";
        else mouse.cursor = "default";
        if (objects[i].mouse.dragging())
          objects[i].moveTo(mouse.x, mouse.y, 50);
        else {
          if (
            dist(objects[i].x, objects[i].y, wandCoreArea.x, wandCoreArea.y) <
            wandCoreArea.r
          ) {
            //console.log(objects[i].overlapped(wandCoreArea));
            if (wandCoreObject !== -1) {
              objects[wandCoreObject].x = 100 + wandCoreObject * 100;
              objects[wandCoreObject].y = canvasHeight - 100;
            }
            wandCoreObject = i;
            objects[i].x = wandCoreArea.x;
            objects[i].y = wandCoreArea.y;
          } else if (
            dist(objects[i].x, objects[i].y, wandStickArea.x, wandStickArea.y) <
            wandStickArea.r
          ) {
            if (wandStickObject !== -1) {
              objects[wandStickObject].x = 100 + wandStickObject * 100;
              objects[wandStickObject].y = canvasHeight - 100;
            }
            wandStickObject = i;
            objects[i].x = wandStickArea.x;
            objects[i].y = wandStickArea.y;
          } else {
            objects[i].x = 100 + i * 100;
            objects[i].y = canvasHeight - 100;
          }
        }
      }
    } else if (gameStatus.includes("wandMaking.process")) {
      let core = objects[wandCoreObject];
      let stick = objects[wandStickObject];

      if (previousGameStatus !== gameStatus) {
        // entering status
        wandMovieTextPointer = 0;
        core.vel.y = 7;
        stick.vel.y = -7;
        // core.rotationLock = false;
        // stick.rotationLock = false;
        // let sparkNum = 2;
        // if (core.type === 'special') sparkNum++; if (stick.type === 'special') sparkNum++;
        // sparks.amount += sparkNum;
      }
      allSprites.visible = false;
      buttonWand.visible = false;
      buttonWandMake.visible = false;
      //core.visible = true; stick.visible = true;
      //sparks.visible = true;

      for (let i = 0; i < sparks.amount; i++) {
        //sparks[i].debug = true;
        // if (sparks[i].overlaps(core)) console.log('^^^^');
        // if (sparks[i].overlaps(stick)) console.log('!!!!');
        // if (Math.round(frameCount/(30+i*11))%2 === 1) sparks[i].r+=0.08;
        // else if (sparks[i].r>2) sparks[i].r-=0.08;
      }
      //core.moveTowards(mouse);

      core.attractTo(stick, 15);
      stick.attractTo(core, 15);
      //core.collides(stick);stick.collides(core);

      if (backgroundLightness > 0) backgroundLightness--;
      wandMovieText = wandMovieText.replace(/[\r\n]+/g, "");
      // console.log(wandMovieText);
      if (
        frameCount % 5 === 0 &&
        wandMovieTextPointer < wandMovieText.length - 1
      )
        wandMovieTextPointer++; //pointer keeps increase with time
      if (
        frameCount % 7 === 0 &&
        wandMovieTextPointer < wandMovieText.length - 1
      )
        wandMovieTextPointer++;
      let showText = wandMovieText.substring(0, wandMovieTextPointer); //
      textWrap(CHAR);
      fill("white");
      push()
      textSize(15);
      text(showText, 0.1 * canvasWidth, 0.15 * canvasHeight, 0.8 * canvasWidth);
      pop()
      if (gameStatus === "wandMaking.process.spark") {
        // core.sleeping = true; stick.sleeping = true;
      }
      if (wandMovieFin && wandMovieTextPointer === wandMovieText.length - 1) {
        // exiting status
        gameStatus = "wandMaking.done";
        backgroundLightness = 235;
        core.remove();
        stick.remove();
        wandCoreObject = -1;
        wandStickObject = -1;
        sparks.amount = 0;
      }
    }
    if (gameStatus === "wandMaking.done") {
      text(
        "Making wand from:" +
          wandCoreMat +
          "as core, and" +
          wandStickMat +
          "as Stick",
        0.1 * canvasWidth,
        0.1 * canvasHeight
      );
      textWrap(CHAR);
      fill("purple");
      text(wandName, 0.5 * canvasWidth, 0.6 * canvasHeight);
      text(
        wandMissile,
        0.05 * canvasWidth,
        0.5 * canvasHeight,
        0.12 * canvasWidth
      );
      text(
        wandProjectile,
        0.83 * canvasWidth,
        0.5 * canvasHeight,
        0.12 * canvasWidth
      );
      fill("black");
      text(
        wandMovieText,
        0.1 * canvasWidth,
        0.15 * canvasHeight,
        0.8 * canvasWidth
      );
    }
  }

  previousGameStatus = gameStatus; // update this
  drawGui();
}

function sparkCollect(spark, object) {
  spark.remove();
  gameStatus = "wandMaking.process.spark";
  console.log("spark " + object.text);
}

function collect(bullet, gem) {
  if (random(0, 100) > 93 && objects.amount < 8) {
    let o = new objects.Sprite();
    let i = o.id;
    o.moveTo(100 + i * 100, canvasHeight - 100, 30);
    let r = Math.round(random(0, 200));
    if (r < 20) {
      o.color = "yellow";
      o.text = superiorObjectNames[r % 2];
      console.log(o.text);
      o.type = "special";
    } // 2高级物品
    else {
      o.text = objectNames[r % 8];
      console.log(o.text);
    } // 8物品
  }

  bullet.remove();
  gem.remove();
}

function updateSceneSetting() {
  gptAgent.clearAllMessage();
  let scenePrompt =
    "你是一个探险家，你在探索一个未知的世界，世界场景为" +
    noitaWorld +
    '。请给出这个场景的描述，这个场景中的一个角色以及其两个弱点（每个弱点不超过五个字），以及可以在这个场景中收集到的8个普通物品与2两个高级物品（物品名不超过五个字）。请根据以下json格式输出\
{"场景描述":""\
"角色名称":""\
"角色描述":""\
"角色弱点1":""\
"角色弱点2":""\
"物品1":""\
"物品2:""\
"物品3":""\
"物品4":""\
"物品5":""\
"物品6":""\
"物品7":""\
"物品8":""\
"高级物品9":""\
"高级物品10":""\
}';
  gptAgent.send(scenePrompt);
  gptAgent.onComplete = (response) => {
    console.log("11");
    console.log("GPTAgent:" + response);
    let obj;
    try {
      response =  response.match(/{[^{}]*}/); // 提取回答中的json格式
      obj = JSON.parse(response);
      // 现在可以访问对象中的任何属性，并将它们存储在变量中
      sceneDescription = obj.场景描述;
      enemyName = obj.角色名称;
      enemyDescription = obj.角色描述;
      enemyWeaknesses = [];
      enemyWeaknesses.push(obj.角色弱点1);
      enemyWeaknesses.push(obj.角色弱点2);
      objectNames = [];
      superiorObjectNames = [];
      objectNames.push(obj.物品1);
      objectNames.push(obj.物品2);
      objectNames.push(obj.物品3);
      objectNames.push(obj.物品4);
      objectNames.push(obj.物品5);
      objectNames.push(obj.物品6);
      objectNames.push(obj.物品7);
      objectNames.push(obj.物品8);
      superiorObjectNames.push(obj.高级物品9);
      superiorObjectNames.push(obj.高级物品10);

      // console.log(sceneDescription);
      // console.log(enemyName);
      // for( let e of objectNames) console.log(e);

      if (gameStatus === "start") gameStatus = "bulleting";
    } catch (error) {
      console.log("parse error");
      updateSceneSetting();
    }
  };
}

function buttonResetRelease() {
  objects.amount = 0;
  gems.amount = 0;
  gems.amount = 900;
  wandCoreObject = -1;
  wandStickObject = -1;

  updateSceneSetting();
}

function buttonWandRelease() {
  if (gameStatus === "bulleting") gameStatus = "wandMaking.prepare";
  else if (gameStatus.includes("wandMaking")) {
    gameStatus = "bulleting";
    for (let o of objects) {
      o.x = 100 + o.id * 100;
      o.y = canvasHeight - 100;
    }
    wandCoreObject = -1;
    wandStickObject = -1;
  }
}

function buttonWandMakeRelease() {
  console.log(wandCoreObject);
  console.log(wandStickObject);
  if (wandCoreObject === -1 || wandStickObject === -1) return;
  console.log("!!");

  let core = objects[wandCoreObject];
  let stick = objects[wandStickObject];
  wandCoreMat = core.text;
  wandStickMat = stick.text;

  gameStatus = "wandMaking.process";
  gptWandMovie.clearAllMessage();
  gptWandMovie.setSystemPrompt(
    "你是一个魔杖制作师，你在库斯坦佐的魔杖工作坊里，正忙于一项前所未有的挑战：需要使用一种【魔杖芯材料】和一种【魔杖柄材料】制作一种材料。【魔杖芯材料】会影响魔杖弹药的属性与威力，【魔杖柄材料】会影响魔杖的弹道。请生成生成合成时的情景，加入一些细节生动的细节描写，提到一些神奇的工具，中间有一些曲折的过程。最终结果为成功。全程使用第二人称'你'指代魔杖制作师。\
三引号内是一个成功的参考案例:\
'''\
你开始准备制作一根新魔杖，芯材料为熔岩，柄材料则来源于传说中的烈焰之剑。\
你首先集中精力于熔岩，这个强大且不稳定的元素。普通的工具无法承受这种高温，于是你从仓库深处取出了一件神奇的工具：涅槃凤凰的羽毛镶嵌的钳子。只有这种被涅槃火焰锻造过的工具，才能安全地操纵这样的高温物质。你小心翼翼地将一小团熔岩从你的保险箱中取出。这保险箱是用龙息石打造的，唯一能够容纳并隔绝熔岩高温的物品。\
随后，你把熔岩放入已经设置好的魔力场中，开始慢慢地用心灵之力塑形，让它逐渐成为你想要的芯材形态。这个过程充满了不确定性和危险，稍有不慎就可能导致爆炸。然而，在你的精心操作下，熔岩芯逐渐成形，发出令人着迷的橘红色光泽。\
接下来是烈焰之剑柄的制作。这件传说中的武器，据说是在太古火神的熔炉中锻造而成，其中蕴含的力量无穷无尽。你从一位冒险家那里得到了这件珍贵的宝物，现在要将它融入魔杖之中。使用特制的魔法熔炉，你开始逐渐将烈焰之剑融解。这个过程异常困难，因为烈焰之剑抵抗着被融化的命运，几次差点让整个工作坊陷入火海。但通过你的巧妙控制和不懈坚持，终于得到了一条流动着像是火焰般的金属条。\
将熔岩芯与烈焰之剑柄合而为一的那一刻，整个工作坊都被一道耀眼的光芒照亮。当一切光芒散去，你的面前现出了一根美丽而强大的魔杖。'''"
  );

  wandMovieFin = false;
  wandMovieText = "";
  gptWandMovie.send(
    "【魔杖芯材料】为" + wandCoreMat + "，【魔杖柄材料】为" + wandStickMat,
    true
  );
  gptWandMovie.onStream = (streamText) => {
    wandMovieText += streamText;
  };
  gptWandMovie.onComplete = (response) => {
    wandMovieFin = true;
    console.log("endmovie");
  };

  // gptWandMovie.dialog("【魔杖芯材料】为"+ wandCoreMat+ "，【魔杖柄材料】为"+wandStickMat)
  // .then((response) => {
  //     wandMoiveText = response.replace(/[\r\n]+/g, "");
  //     gameStatus = 'wandMaking.done';

  // })
  // .catch((error) => {

  //   console.error(error);
  // });
  gptWandResult.clearAllMessage();
  gptWandResult.setSystemPrompt(
    '你是一个魔杖制作师，需要使用一种【魔杖芯材料】和一种【魔杖柄材料】制作一种材料。【魔杖芯材料】会影响魔杖弹药的属性与威力（如不同属性的攻击，每次攻击威力大小，发射频率等），【魔杖柄材料】会影响魔杖的弹道（弹道可以参考直线，曲线，锥形，圆形等形态）。请生成魔杖的名称，魔杖弹药与弹道的描述，使用如下json格式（请勿输出```json的字符，直接以"{"开始）\
    {\
    "魔杖名称":""\
    "魔杖芯材料对魔杖弹药的影响"\
    "魔杖弹药描述":""\
    "魔杖柄材料对魔杖弹道的影响"\
    "魔杖弹道描述":""\
    }\
    以下三引号内为一个案例。\
    \'\'\'\
    USER:魔杖芯材料为闪光球，魔杖芯材料为蛛网\
    ASSISTANT:\
    {\
    "魔杖名称":"星光蛛语杖",\
    "魔杖芯材料对魔杖弹药的影响":"闪光球的映入使得魔杖发射的弹药拥有高能量的光辉，能够在漆黑的环境中造成强烈的照明效果，并具有致盲敌人的能力。",\
    "魔杖弹药描述":"魔杖发射的弹药类似于仿生的光球，发射时伴随着耀眼的闪光，具有一定的穿透力和高能量释放，能够在击中目标时释放出强烈的光芒，暂时使敌人失去视觉，同时产生轻微的物理冲击。",\
    "魔杖柄材料对魔杖弹道的影响":"蛛网材质的魔杖柄使得魔杖发射的弹药呈现出独特的网状弹道，能够在空中迅速扩散，形成一个网状的光波，捕捉和限制目标的移动。",\
    "魔杖弹道描述":"魔杖发射的光球在飞出后会迅速展开，形成一张独特的光之网，这张网能够在一定范围内扩散，不仅能够将光和热量覆盖至更广的区域，还能够在瞬间构建出一个光辉的屏障，用以捕捉或缓冲敌人的攻击。"\
    }\
    \'\'\'\
    '
  );
  gptWandResult.send(
    "【魔杖芯材料】为" + wandCoreMat + "，【魔杖柄材料】为" + wandStickMat
  );
  gptWandResult.onComplete = (response) => {
    let obj = JSON.parse(response);
    console.log(obj.魔杖名称);
    console.log(obj.魔杖芯材料对魔杖弹药的影响);
    console.log(obj.魔杖弹药描述);
    console.log(obj.魔杖柄材料对魔杖弹道的影响);
    console.log(obj.魔杖弹道描述);
    wandName = obj.魔杖名称;
    wandMissile = obj.魔杖芯材料对魔杖弹药的影响 + obj.魔杖弹药描述;
    wandMissile = wandMissile.replace(/[\r\n]+/g, "");
    wandProjectile = obj.魔杖柄材料对魔杖弹道的影响 + obj.魔杖弹道描述;
    wandProjectile = wandProjectile.replace(/[\r\n]+/g, "");

    //gameStatus = 'wandMaking.done';
  };
}

// 魔杖 描述
// next step making wand juiciness
//design: 按空格键改变材料轨迹，碰撞spark 可以加强魔杖等级，但也会增加魔杖失败概率，高级材料会产生更多的spark
//
