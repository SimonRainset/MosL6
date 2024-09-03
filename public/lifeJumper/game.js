//Die Timer = 5s
let dieTimer = 0;
const dieThreshold = 5 * 60;

let itemProbability = 1;

let playerVisible = true;

let instructions = "Use AD to move and W/Space to jump.";
let platformGroups = [];
let items = [];

let itemTextDiv;

let firstPlatform;
let novelDiv;

let happyColors = [
  "#f38dc3",
  "#f5e498",
  "#b9f5a2",
  "#d9b6f1",
  "#a3e4fa",
  "#f3bf69",
  "#C09AFF",
  "#f58a91",
  "#92bdf1",
  "#98F45F",
];
let depressedColors = ["#959595", "#C1C2C0", "#565854", "#E5E5E5"];
let itemColors = [
  "#f38dc3",
  "#f5e498",
  "#b9f5a2",
  "#d9b6f1",
  "#a3e4fa",
  "#f3bf69",
  "#C09AFF",
  "#f58a91",
  "#92bdf1",
  "#98F45F",
];

let itemTypes = ["violin", "sunshine", "sea", "friend", "piano"];
let tmpItemPrompt;

let dataBarWidth;

//0 - depressed (80%), 1 - happy (20%)
let randomValue = Math.random();
let promptEmotionIndicator = randomValue < 0.8 ? 0 : 1;
let depressedPrompt =
  "故事表示夏天忧郁的心情，每天故事不超过20个字。以日期：故事的格式撰写，故事的上文为：";
let happyPrompt =
  "故事表示夏天开朗的心情，每天故事不超过20个字。以日期：故事的格式撰写，故事的上文为：";
let novelGeneralPrompt =
  "你是一个小说家，你在写一个忧郁的青春期男孩夏天的故事，你会根据故事的上下文对小说进行续写，请你每次只续写之后一天的故事，";
let itemPrompt =
  "你是一个小说家，你在写一个忧郁的青春期男孩夏天的故事，你会根据故事的上下文对小说进行续写，请你每次只续写之后一天的故事，故事表示夏天开朗的心情，每天故事不超过20个字。以日期：故事的格式撰写，故事的上文为：";
let mood = 0; //Max 100;

function generateItem(groupX, groupY) {
  let itemXOffset = Math.floor(Math.random() * (121 - -110 + 1)) + -110;
  let itemYOffset;
  if (Math.random() < 0.5) {
    // 50% 的概率在 -40 到 -70 之间生成随机整数
    itemYOffset = Math.floor(Math.random() * (-39 - -70 + 1)) + -70;
  } else {
    // 50% 的概率在 150 到 200 之间生成随机整数
    itemYOffset = Math.floor(Math.random() * (200 - 150 + 1)) + 150;
  }
  const itemX = groupX - itemXOffset;
  const itemY = groupY - itemYOffset;
  let item = new Sprite(
    itemX,
    itemY,
    itemConfig.width,
    itemConfig.height,
    itemConfig.collider
  );
  let itemColorIndex = Math.floor(Math.random() * 10);
  item.color = itemColors[itemColorIndex];
  let itemTypeIndex = Math.floor(Math.random() * 5);
  item.type = itemTypes[itemTypeIndex];

  items.push(item);
}

function itemCollideHandler(player, item) {
  changeBackgroundColor();
  let itemText = getItemText(item);
  console.log(itemText);
  // 显示文本
  showItemText(itemText);
  generateItemPrompt(itemText).then(() => {
    changeNovelText(item.color);
  });

  console.log("novel:", novelResult);

  item.remove();
}

function changeNovelText(itemColor) {
  /*
        let lastNewlineIndex = novelResult.lastIndexOf('\n');

        // 如果存在换行符，则替换最后一个换行符后的文本为 tmpItemPrompt
        if (lastNewlineIndex !== -1) {
            novelResult = novelResult.substring(0, lastNewlineIndex + 1) + tmpItemPrompt;
        }

     */
  // 获取碰撞时 player 的 x 坐标
  const playerX = player.position.x;

  // 找到 player 位于哪个 platformGroup
  let currentGroupIndex = -1;
  for (let i = 0; i < platformGroups.length; i++) {
    const currentGroup = platformGroups[i];
    if (
      playerX >= currentGroup.xLeft - 5 &&
      playerX <= currentGroup.xRight + 55
    ) {
      currentGroupIndex = i;
      break;
    }
  }

  // 如果找到了当前 group
  if (currentGroupIndex !== -1) {
    // 获取当前 group 的下一个 group
    const nextGroupIndex = currentGroupIndex + 1;
    if (nextGroupIndex < platformGroups.length) {
      const nextGroup = platformGroups[nextGroupIndex];

      console.log("upNovel:", nextGroup.upNovel);

      // 设置下一个 group 的上平台的 upNovel 文本为 tmpItemPrompt
      nextGroup.upNovel = tmpItemPrompt;
      nextGroup.upPlatform.color = itemColor;
    }
  }
}

function getItemText(item) {
  // 根据不同的 item 类型返回相应的文本
  // 这里假设 item 类型是字符串，你可以根据实际情况修改
  console.log(item.type);
  switch (item.type) {
    case "violin":
      return "小提琴";
    case "piano":
      return "钢琴";
    case "sunshine":
      return "阳光";
    case "sea":
      return "大海";
    case "friend":
      return "朋友";
    default:
      return "";
  }
}

function showItemText(text) {
  itemTextDiv.html(text); // 设置文本内容
  itemTextDiv.style("display", "block"); // 显示文本
}

function getNewPlatformGroupData(index) {
  return {
    index: index,
    upperPlatformLanded: false,
    lowerPlatformLanded: false,
  };
}

const playerConfig = {
  horizontalSpeed: 5,
  jumpHeight: 10,
  horizontalAccer: 1,
  verticalAccer: 0.1,
  damp: 0.7,
};

const itemConfig = {
  width: 20,
  height: 20,
  collider: "static",
};

const platformConfig = {
  width: 150,
  height: 30,
  collider: "static",
  xGap: 300,
  yGap: 92,
};

const cameraOffset = {
  x: 150,
  y: 50,
};

const PlayerStatus = {
  AIR: "air",
  GROUNDED: "grounded",
  JUMPING: "jumping",
  LANDING: "landing",
};

let player, groundSensor;
let platformGroup;
let novelPrompt =
  "你是一个小说家，你在写一个忧郁的青春期男孩夏天的故事，你会根据故事的上文对小说进行续写，请你每次只续写之后一天的故事，故事大概率表现夏天忧郁的心情，小概率心情不错，每天故事不超过20个字。以日期：故事的格式撰写，故事的上文为：";
let novelAndStatusPrompt =
  "你是一个小说家，你在写一个忧郁的青春期男孩夏天的故事，你会根据故事的上下文对小说进行续写，请你每次只续写之后一天的故事，故事大概率表现夏天开朗的心情，小概率心情忧郁，每天故事不超过20个字。以日期(心情)：故事的格式进行撰写，心情包括忧郁和开朗两种，故事的上文为：";

let gptAgent = new P5GPT();
let novelResult = "";
let novelResultTmp = "";
let novelResultNextdayTmp = "";
let upNovelResultNextDay = "";
let downNovelResultNextDay = "";
let showNovel = 0;
let showNovelSpeed = 9;
let showNovelTodayIndex = 0;
let playerGrounded = true;
let playerGroundedLastFrame = true;
let playerJumpStartX = 0;
let playerJumpEndX = 0;
let isGoodMood = false;
const regex = /\(([^)]+)\)/;
let isChangedColor = false;

//let backgroundColor = 240;
let topLayer;
let backgroundColor = 150;

function createPlatformGroup(
  upPlatform,
  downPlatform,
  upValue,
  downValue,
  upNovel,
  downNovel
) {
  const xLeft = min(upPlatform.position.x, downPlatform.position.x);
  const xRight = max(
    upPlatform.position.x + upPlatform.width,
    downPlatform.position.x + downPlatform.width
  );
  const upPlatformTop = upPlatform.position.y - upPlatform.height / 2;
  const upPlatformBottom = upPlatform.position.y + upPlatform.height / 2;
  const downPlatformTop = downPlatform.position.y - downPlatform.height / 2;
  const downPlatformBottom = downPlatform.position.y + downPlatform.height / 2;

  return {
    upPlatform: upPlatform,
    upPlatformValue: upValue,
    upNovel: upNovel,
    downPlatform: downPlatform,
    downPlatformValue: downValue,
    downNovel: downNovel,
    xLeft: xLeft,
    xRight: xRight,
    upPlatformTop: upPlatformTop,
    upPlatformBottom: upPlatformBottom,
    downPlatformTop: downPlatformTop,
    downPlatformBottom: downPlatformBottom,
    landed: false,
    colorChanged: false,
  };
}

function getPlayerStatus() {
  if (playerGrounded && playerGroundedLastFrame) return PlayerStatus.GROUNDED;
  else if (playerGrounded && !playerGroundedLastFrame)
    return PlayerStatus.LANDING;
  else if (!playerGrounded && playerGroundedLastFrame)
    return PlayerStatus.JUMPING;
  else return PlayerStatus.AIR;
}

function getNewPlatformData() {
  return {
    landed: false,
  };
}

function createNextTwoOption(
  lastX,
  lastY,
  upValue,
  downValue,
  upNovel,
  downNovel
) {
  let depressIndex = Math.floor(Math.random() * 4);
  let happyIndex = Math.floor(Math.random() * 10);
  // up platform
  let up = new Sprite(
    lastX + platformConfig.xGap + 40 * Math.random() - 20,
    lastY - platformConfig.yGap + 40 * Math.random() - 20,
    platformConfig.width,
    platformConfig.height,
    platformConfig.collider
  );
  if (upValue) {
    up.color = happyColors[happyIndex];
  } else {
    up.color = depressedColors[depressIndex];
  }
  up.data = getNewPlatformData();
  platformGroup.push(up);

  depressIndex = Math.floor(Math.random() * 4);
  happyIndex = Math.floor(Math.random() * 10);

  // down platform
  let down = new Sprite(
    lastX + platformConfig.xGap + 40 * Math.random() - 20,
    lastY + platformConfig.yGap + 40 * Math.random() - 20,
    platformConfig.width,
    platformConfig.height,
    platformConfig.collider
  );

  if (downValue) {
    down.color = happyColors[happyIndex];
  } else {
    down.color = depressedColors[depressIndex];
  }
  down.data = getNewPlatformData();
  platformGroup.push(down);

  // 创建 platformGroup 对象并加入数组
  const group = createPlatformGroup(
    up,
    down,
    upValue,
    downValue,
    upNovel,
    downNovel
  );
  platformGroups.push(group);
  if (Math.random() < itemProbability) {
    generateItem(group.upPlatform.position.x, group.upPlatform.position.y);
  }
  console.log(platformGroups);
}

function changeBackgroundColor() {
  backgroundColor =
    backgroundColor < 256 ? backgroundColor + 20 : backgroundColor;
}

async function generateItemPrompt(keyword) {
  let singleItemPrompt =
    itemPrompt +
    "新的一天的内容中需要包含关键词[" +
    keyword +
    "]" +
    novelResult;
  console.log("prompt:", singleItemPrompt);
  tmpItemPrompt = await gptAgent.dialog(singleItemPrompt);
  console.log(tmpItemPrompt);
}

async function setup() {
  new Canvas(800, 700);
  topLayer = createGraphics(width, height);
  itemTextDiv = createDiv("");
  itemTextDiv.position(width + 88, 70);
  itemTextDiv.style("color", "yellow");
  itemTextDiv.style("font-size", "13px");

  const playerConfig = {
    spawnX: width * 0.3,
    spawnY: height * 0.5 - 200,
    width: 30,
    height: 30,
  };

  world.gravity.y = 10;

  platformGroup = new Group();
  // first platform
  firstPlatform = new Sprite(
    width * 0.3,
    height * 0.5,
    platformConfig.width,
    platformConfig.height,
    platformConfig.collider
  );
  firstPlatform.data = getNewPlatformData();
  platformGroup.push(firstPlatform);
  console.log(firstPlatform.y);

  player = new Sprite(
    playerConfig.spawnX,
    playerConfig.spawnY,
    playerConfig.width,
    playerConfig.height
  );
  player.rotationLock = true;

  // ground Sensor and stick to the player by joint
  groundSensor = new Sprite(
    playerConfig.spawnX,
    playerConfig.spawnY + playerConfig.height / 2,
    10,
    10
  );
  groundSensor.mass = 0.01;
  groundSensor.visible = true;
  groundSensor.overlaps(allSprites);
  new GlueJoint(player, groundSensor);
  textAlign(CENTER);

  novelResult =
    "2022年10月23日：夏天感到自己像是一个被遗忘的角色，演绎着一场无声的孤独戏。"; // update novel
  let upIndicator = Math.random() > 0.6 ? 1 : 0;
  let downIndicator = Math.random() > 0.6 ? 1 : 0;

  let upPromptNextDay =
    novelGeneralPrompt +
    (upIndicator ? happyPrompt : depressedPrompt) +
    novelResult;
  let downPromptNextDay =
    novelGeneralPrompt +
    (downIndicator ? happyPrompt : depressedPrompt) +
    novelResult;
  upNovelResultNextDay = await gptAgent.dialog(upPromptNextDay);
  downNovelResultNextDay = await gptAgent.dialog(downPromptNextDay);

  createNextTwoOption(
    firstPlatform.x,
    firstPlatform.y,
    upIndicator,
    downIndicator,
    upNovelResultNextDay,
    downNovelResultNextDay
  );
}

async function draw() {
  background(backgroundColor);

  const numNewlines = (novelResult.match(/\n/g) || []).length;

  // 如果换行符数量大于等于3，每个换行符向上移动20像素
  let textY = 60;
  if (numNewlines >= 3) {
    textY -= (numNewlines - 2) * 15;
  }

  // 显示novelResult的text
  text(novelResult.substring(0, showNovel / showNovelSpeed), width / 2, textY);

  push();
  fill(backgroundColor);
  noStroke();
  rect(0, 0, 800, 50);

  // 画外部长方形
  fill(0); // 填充白色
  stroke(0); // 边框黑色
  rect(20, 16, 200, 16); // 外部长方形的位置和大小

  // 计算内部长方形的长度
  let innerRectLength = map(backgroundColor, 150, 255, 0, 200);
  innerRectLength = constrain(innerRectLength, 0, 200); // 确保长度在合理范围内

  // 画内部长方形
  stroke(255);
  fill("#FFFFFF");
  rect(20, 16, innerRectLength, 16); // 内部长方形的位置和大小

  // 恢复之前保存的样式设置

  pop();

  if (backgroundColor >= 256) {
    clear();
    firstPlatform.color = "#FFE4E4";
    firstPlatform.strokeColor = color("#FFE4E4");
    platformGroups.forEach((group) => {
      group.upPlatform.remove();
      group.downPlatform.remove();
      // 可以根据实际情况添加其他需要清除的 Sprite 对象
    });
    for (let i = items.length - 1; i >= 0; i--) {
      items[i].remove();
      items.splice(i, 1); // 从数组中移除对应的元素
    }
    player.remove();

    /*
        // 当背景颜色达到250时，在画布最顶层绘制小粉色框和文字
        fill('#FFE4E4'); // 粉色填充

        noStroke(); // 无边框
        const boxWidth = width / 2; // 框的宽度为画布宽度的1/2
        const boxHeight = height / 3; // 框的高度为画布高度的1/3
        const boxX = (width - boxWidth) / 2; // 使框在水平方向居中
        const boxY = (height - boxHeight) / 2; // 使框在垂直方向居中
        rect(boxX, boxY, boxWidth, boxHeight); // 绘制小矩形框

        // 在粉色框内部设置字体大小
        push();
        fill(0); // 黑色文字
        textSize(24); // 文字大小
        textAlign(CENTER, CENTER); // 文字居中
        text("夏天已不再忧郁", width / 2, height / 2); // 在画布中央绘制文字
        pop(); // 恢复字体设置，以免影响其他元素


         */
    topLayer.clear();
    topLayer.fill(255);
    topLayer.noStroke();
    topLayer.rect(0, 0, width, height);

    topLayer.fill("#FFE4E4");
    const pinkRectWidth = 560;
    const pinkRectHeight = 420;
    const pinkRectX = 120;
    const pinkRectY = 140;
    topLayer.rect(pinkRectX, pinkRectY, pinkRectWidth, pinkRectHeight);

    // 在粉色框内部设置字体大小
    topLayer.push();
    topLayer.fill(0); // 黑色文字
    topLayer.textSize(24); // 文字大小
    topLayer.textAlign(CENTER, CENTER); // 文字居中
    topLayer.text(
      "夏天已不再忧郁",
      width / 2,
      pinkRectY + pinkRectHeight * 0.1
    ); // 在画布中央绘制文字
    topLayer.pop(); // 恢复字体设置，以免影响其他元素

    novelDiv = createDiv("");
    novelDiv.style("width", 520 + "px"); // 设置 div 元素的宽度
    novelDiv.style("height", 300 + "px"); // 设置 div 元素的高度
    novelDiv.style("overflow-y", "auto"); // 设置 div 元素为垂直滚动
    novelDiv.style("background-color", "#FFE4E4"); // 设置 div 元素的背景颜色
    novelDiv.style("font-size", "12px");
    // 在粉色框内显示novelResult
    // 设置 novelDiv 的位置
    novelDiv.position((windowWidth - 520) / 2, (windowHeight - 300) / 2 + 16);

    // 将 novelResult 放入 novelDiv 中
    novelDiv.html(novelResult.replace(/\n/g, "<br>"));

    // 将顶层图层绘制到主画布
    image(topLayer, 0, 0);
  }

  text(instructions, width / 2, 30);
  /*
    const numNewlines = (novelResult.match(/\n/g) || []).length;

    // 如果换行符数量大于等于3，每个换行符向上移动20像素
    let textY = 60;
    if (numNewlines >= 3) {
        textY -= (numNewlines - 2) * 20;
    }

    // 显示novelResult的text
    text(novelResult.substring(0, showNovel / showNovelSpeed), width / 2, textY);
*/

  //text(novelResult.substring(0,showNovel/showNovelSpeed), width/2, 60);
  playerGroundedLastFrame = playerGrounded;
  playerGrounded = groundSensor.overlapping(platformGroup);

  if (kb.pressing("left")) {
    player.vel.x -= playerConfig.horizontalAccer;
  } else if (kb.pressing("right")) {
    player.vel.x += playerConfig.horizontalAccer;
  } else {
    player.vel.x *= playerConfig.damp;
  }
  if (player.vel.x < -playerConfig.horizontalSpeed)
    player.vel.x = -playerConfig.horizontalSpeed;
  else if (player.vel.x > playerConfig.horizontalSpeed)
    player.vel.x = playerConfig.horizontalSpeed;

  if (kb.pressing("up") || kb.pressing("space")) {
    if (getPlayerStatus() === PlayerStatus.GROUNDED) {
      player.vel.y = -playerConfig.jumpHeight;
    }
  }

  if (getPlayerStatus() === PlayerStatus.JUMPING) {
    playerJumpStartX = player.x;
  }

  if (getPlayerStatus() === PlayerStatus.LANDING) {
    console.log(2);
    dieTimer = 0;
    playerJumpEndX = player.x;

    //console.log("novelResult:", novelResult);

    // console.log("showNovel:", showNovel);

    if (showNovel > novelResult.length * showNovelSpeed) {
      console.log("yes1");
      /*
           if (playerJumpEndX - playerJumpStartX > platformConfig.width)
           {
               showNovelTodayIndex = showNovel ;
               novelResult = novelResult + '\n' + novelResultNextdayTmp;
               //console.log("novelResult: ", novelResult);

           }

             */
    }

    const playerX = player.position.x + platformConfig.width / 2;

    for (let i = items.length - 1; i >= 0; i--) {
      let item = items[i];
      // 玩家与 item 碰撞检测
      player.collide(item, itemCollideHandler);
    }

    for (let i = 0; i < platformGroups.length; i++) {
      // 遍历所有 platformGroups 进行碰撞检测
      const currentGroup = platformGroups[i];
      if (playerX >= currentGroup.xLeft && playerX <= currentGroup.xRight) {
        // 判断玩家是否在当前 platformGroup 范围内

        // UP Platform Collide
        player.collides(currentGroup.upPlatform, async (player, platform) => {
          // 在当前 platformGroup 上执行碰撞检测逻辑
          if (!currentGroup.landed) {
            if (!currentGroup.colorChanged) {
              if (currentGroup.upPlatformValue) {
                changeBackgroundColor();
                currentGroup.colorChanged = true;
              } else {
                currentGroup.colorChanged = true;
              }
            }
            console.log("碰撞上平台");
            currentGroup.landed = true;
            novelResultNextdayTmp = currentGroup.upNovel;
            showNovelTodayIndex = showNovel;
            novelResult = novelResult + "\n" + currentGroup.upNovel;
            let upIndicator = Math.random() > 0.8 ? 1 : 0;
            let downIndicator = Math.random() > 0.8 ? 1 : 0;
            let upPromptNextDay =
              novelGeneralPrompt +
              (upIndicator ? happyPrompt : depressedPrompt) +
              novelResultNextdayTmp;
            let downPromptNextDay =
              novelGeneralPrompt +
              (downIndicator ? happyPrompt : depressedPrompt) +
              novelResultNextdayTmp;
            upNovelResultNextDay = await gptAgent.dialog(upPromptNextDay);
            downNovelResultNextDay = await gptAgent.dialog(downPromptNextDay);
            createNextTwoOption(
              currentGroup.xRight,
              currentGroup.upPlatformTop,
              upIndicator,
              downIndicator,
              upNovelResultNextDay,
              downNovelResultNextDay
            );
          }
          player.vel.y = 0; // 防止弹跳
        });

        // Down Platform Collide
        player.collides(currentGroup.downPlatform, async (player, platform) => {
          if (!currentGroup.landed) {
            if (!currentGroup.colorChanged) {
              if (currentGroup.downPlatformValue) {
                changeBackgroundColor();
                currentGroup.colorChanged = true;
              } else {
                currentGroup.colorChanged = true;
              }
            }
            console.log("碰撞下平台");
            currentGroup.landed = true;
            novelResultNextdayTmp = currentGroup.downNovel;
            showNovelTodayIndex = showNovel;
            novelResult = novelResult + "\n" + currentGroup.downNovel;
            let upIndicator = Math.random() > 0.8 ? 1 : 0;
            let downIndicator = Math.random() > 0.8 ? 1 : 0;
            let upPromptNextDay =
              novelGeneralPrompt +
              (upIndicator ? happyPrompt : depressedPrompt) +
              novelResultNextdayTmp;
            let downPromptNextDay =
              novelGeneralPrompt +
              (downIndicator ? happyPrompt : depressedPrompt) +
              novelResultNextdayTmp;
            upNovelResultNextDay = await gptAgent.dialog(upPromptNextDay);
            downNovelResultNextDay = await gptAgent.dialog(downPromptNextDay);
            createNextTwoOption(
              currentGroup.xRight,
              currentGroup.downPlatformBottom,
              upIndicator,
              downIndicator,
              upNovelResultNextDay,
              downNovelResultNextDay
            );
          }
          player.vel.y = 0; // 防止弹跳
        });
        break;
      }
    }
  }

  if (getPlayerStatus() === PlayerStatus.AIR) {
    player.vel.y += playerConfig.verticalAccer;
    showNovel++;

    if (!playerGrounded && !playerGroundedLastFrame) {
      if (backgroundColor < 256) {
        dieTimer++;
        if (dieTimer >= dieThreshold) {
          background("#2B2B2B");
          fill("#DBDBDB");
          textSize(50);
          textAlign(CENTER, CENTER);
          textFont("Times New Roman");
          text("LOST IN DEPRESSION", width / 2, height / 2);
          playerVisible = false;
          noLoop();
        }
      }
    } else {
      dieTimer = 0;
      playerVisible = true;
    }
  }

  // camera follow player
  camera.x = player.x + cameraOffset.x;
  camera.y = player.y + cameraOffset.y;
  player.visible = playerVisible;
  groundSensor.visible = playerVisible;
}
