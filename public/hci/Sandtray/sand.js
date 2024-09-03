const SIZE = 0.18;
const imWidth = 70;
const imHeight = 60;
const x1 = 940;
const y1 = 90;

// 沙盘背景尺寸
const backX = 995;
const backY = 664;

const spriteData = [
  ["elephant", "dog", "bird", "chicken", "cow", "horse", "fish"],
  ["apartment", "bank", "castle", "church", "home", "mall", "school"],
  ["babystroller", "bike", "boat", "bus", "motorcycle", "sedan", "train"],
  ["girl", "boy", "chef", "engineer", "old", "police", "teacher"],
  ["computer", "ashcan", "ball", "gift", "mailbox", "poker", "suitcase"],
  ["rainbow", "moon", "rain", "smog", "snow", "storm", "sun"],
  ["fruiter", "ginkgo", "grass", "leaf", "lotus", "rose", "sunflower"],
];
const spriteData_C = [
  [
    "一头大象",
    "一条小狗",
    "一只小鸟",
    "一只小鸡",
    "一头牛",
    "一匹马",
    "一条鱼",
  ],
  [
    "一座公寓楼",
    "一间银行",
    "一座城堡",
    "一座教堂",
    "一个家",
    "一个商场",
    "一个学校",
  ],
  [
    "一辆婴儿车",
    "一辆自行车",
    "一艘船",
    "一辆公交车",
    "一辆电动车",
    "一辆小轿车",
    "一列火车",
  ],
  [
    "一个女生",
    "一个男生",
    "一名厨师",
    "一名工程师",
    "一位老人",
    "一名警察",
    "一名老师",
  ],
  [
    "一台电脑",
    "一个垃圾桶",
    "一束气球",
    "一份礼物",
    "一个邮箱",
    "一张扑克牌",
    "一个行李箱",
  ],
  [
    "一轮彩虹",
    "一个月亮",
    "一个下雨天",
    "一阵烟雾",
    "一片雪花",
    "一阵狂风",
    "一轮太阳",
  ],
  [
    "一棵果树",
    "一片银杏叶",
    "草",
    "一片树叶",
    "一片荷叶",
    "一朵玫瑰",
    "一朵向日葵",
  ],
];

const BackGround = ["land", "lawn", "sea", "sand"];
const BackGround_C = ["土地", "草坪", "大海", "沙滩"];

const classes = [
  "animal",
  "building",
  "traffic",
  "character",
  "daily",
  "weather",
  "plant",
];

// 元件陈列位置
function createPositionsMatrix(rows, cols, startX, startY, stepX, stepY) {
  let positions = new Array(rows);
  for (let i = 0; i < rows; i++) {
    positions[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      positions[i][j] = {
        x: startX + j * stepX,
        y: startY + i * stepY,
      };
    }
  }
  return positions;
}

let positions = createPositionsMatrix(7, 7, x1, y1, imWidth, imHeight);
let isDragging = false;
let alertShown = false;
let thinking = false;
let gui;
let dots;
let dotColors = ["#FFFFFF", "#F0E0FF", "#E0C0FF", "#D0A0FF", "#C080FF"];

let currentDotColorIndex = 0;
let dotTimer; // 添加定时器变量

let allelements = [];

let draggingIndex = [];

let buttonpressed;

let leftup = new Set();
let midup = new Set();
let rightup = new Set();
let leftmid = new Set();
let center = new Set();
let rightmid = new Set();
let leftdown = new Set();
let middown = new Set();
let rightdown = new Set();
let sanditem = new Set();

let sandItem = ["", "", "", "", "", "", ""];
let chosenBack;

// let agent = new P5Spark();
let agent = new P5GPT();
let layout = "";
let result = "";
let mbti = "";
let promptContent = "";
let content;

function whenComplete(text) {
  content = text.replace(/[\n`json]/g, ""); // 删去换行，以免格式错误
  parsedData = JSON.parse(content);
  result = parsedData["心理特征"];
  mbti = parsedData["MBTI"];
  // 输出格式处理
  result = result
    .toString()
    .replace(/[；。]/g, "。\n")
    .replace(/,/g, "\n")
    .replace(/\n{2,}/g, "\n");
  mbti = mbti.toString().replace(/,/g, " ");
  if (result == "[object Object]" || result == "") {
    result = "出错啦，请点击“分析”按钮重试～";
  }
  if (mbti == "[object Object]" || mbti == "") {
    mbti = "出错啦，请点击“分析”按钮重试～";
  }
  resultTextArea.html(result);
  mbtiTextArea.html(mbti);
  thinking = false;
  clearInterval(dotTimer); // 分析完成后停止定时器
  dots.forEach((dot) => (dot.color = "Mauve")); // 分析完成后恢复dot颜色
  leftup.clear();
  leftmid.clear();
  leftdown.clear();
  midup.clear();
  center.clear();
  middown.clear();
  rightup.clear();
  rightmid.clear();
  rightdown.clear();
  sanditem.clear();
}

// 版面绘制
function elements() {
  for (let i = 0; i < spriteData.length; i++) {
    allelements[i] = [];
    for (let j = 0; j < spriteData[i].length; j++) {
      let ele = new Sprite();
      ele.scale = SIZE;
      ele.x = positions[i][j].x;
      ele.y = positions[i][j].y;
      ele.image = loadImage(`elements/${spriteData[i][j]}.png`);
      ele.collider = "static";
      allelements[i].push(ele);
    }
  }
}

// 文字提示
function mouseNote() {
  for (let i = 0; i < allelements.length; i++) {
    for (let j = 0; j < allelements[i].length; j++) {
      let element = allelements[i][j];
      if (
        mouseX > element.x - imWidth / 2 &&
        mouseX < element.x + imWidth / 2 &&
        mouseY > element.y - imHeight / 2 &&
        mouseY < element.y + imHeight / 2
      ) {
        textSize(15);
        fill("black");
        text(spriteData[i][j], mouseX, mouseY - imHeight / 2);
      }
    }
  }
}

function mousePressed() {
  // 检查是否点击了任何沙具
  for (let i = 0; i < allelements.length; i++) {
    for (let j = 0; j < allelements[i].length; j++) {
      let element = allelements[i][j];
      if (
        mouseX > element.x - imWidth / 2 &&
        mouseX < element.x + imWidth / 2 &&
        mouseY > element.y - imHeight / 2 &&
        mouseY < element.y + imHeight / 2
      ) {
        // 左键拖拽
        if (mouseButton === LEFT) {
          // 开始拖动
          isDragging = true;
          draggingIndex = [i, j];
          offsetX = mouseX - element.x;
          offsetY = mouseY - element.y;
        }
        break;
      }
    }
  }
}

function mouseDragged() {
  if (isDragging) {
    // 更新沙具的位置
    allelements[draggingIndex[0]][draggingIndex[1]].x = mouseX - offsetX;
    allelements[draggingIndex[0]][draggingIndex[1]].y = mouseY - offsetY;
  }
}

function mouseReleased() {
  if (
    allelements[draggingIndex[0]][draggingIndex[1]].x >
      positions[draggingIndex[0]][draggingIndex[1]].x - imWidth / 2 &&
    allelements[draggingIndex[0]][draggingIndex[1]].x <
      positions[draggingIndex[0]][draggingIndex[1]].x + imWidth / 2 &&
    allelements[draggingIndex[0]][draggingIndex[1]].y >
      positions[draggingIndex[0]][draggingIndex[1]].y - imHeight / 2 &&
    allelements[draggingIndex[0]][draggingIndex[1]].y <
      positions[draggingIndex[0]][draggingIndex[1]].y + imHeight / 2
  ) {
    allelements[draggingIndex[0]][draggingIndex[1]].x =
      positions[draggingIndex[0]][draggingIndex[1]].x;
    allelements[draggingIndex[0]][draggingIndex[1]].y =
      positions[draggingIndex[0]][draggingIndex[1]].y;
    allelements[draggingIndex[0]][draggingIndex[1]].rotation = 0;
  }
  // 结束拖动和旋转
  isDragging = false;
  draggingIndex = [];
}

function positionText() {
  if (buttonpressed) {
    layout +=
      "沙具在沙盘的位置由如下坐标给出,坐标的具体含义定义如下：" +
      "横坐标与纵坐标分别从左到右与从上到下递增,而沙盘的四个角坐标给出为:(76.6,64.2),(723.3,64.2),(76.6,495.8),(723.3,495.8)。以下是用户的测试数据：\n";
    if (sanditem.size != 0) {
      for (item of sanditem) {
        layout =
          layout +
          spriteData_C[item[0]][item[1]] +
          "," +
          "(" +
          allelements[item[0]][item[1]].x +
          "," +
          allelements[item[0]][item[1]].y +
          ")" +
          ";" +
          "\n";
      }
      log(layout);
    }
  }
  return layout;
}

function preload() {
  promptContent = loadStrings("prompt.txt");
}

function setup() {
  createCanvas(1440, 780);
  gui = createGui();
  alertShown = false;

  // chatgpt
  promptContent = promptContent.join("\n"); // 将数组转换为字符串
  console.log("Loaded prompt:", promptContent);

  agent.setSystemPrompt(promptContent);

  // 分隔点点
  dots = new Group();
  dots.color = "Mauve";
  dots.y = 555;
  dots.diameter = 6;
  while (dots.length < 50) {
    let dot = new dots.Sprite();
    dot.x = dots.length * 20;
    dot.collider = "static";
  }

  // 沙盘
  sand = new Sprite();
  sand.x = 400;
  sand.y = 280;
  sand.scale = 0.65;
  sand.image = loadImage("sand.png");
  sand.collider = "static";
  chosenBack = "sand";

  console.log(`Sand width: ${sand.width}, Sand height: ${sand.height}`);

  // 背景选择
  const gap = (backX * sand.scale) / 4;
  let backx0 = 120;
  let backy0 = 500;
  let backsizex = 80;
  let backsizey = 40;

  const landButton = createImg("land.png", "土地");
  landButton.position(backx0, backy0);
  landButton.size(backsizex, backsizey);
  landButton.mousePressed(() => handleButtonPress(landButton, landBack));

  const lawnButton = createImg("lawn.png", "草坪");
  lawnButton.position(backx0 + gap, backy0);
  lawnButton.size(backsizex, backsizey);
  lawnButton.mousePressed(() => handleButtonPress(lawnButton, lawnBack));

  const seaButton = createImg("sea.png", "草坪");
  seaButton.position(backx0 + 2 * gap, backy0);
  seaButton.size(backsizex, backsizey);
  seaButton.mousePressed(() => handleButtonPress(seaButton, seaBack));

  const sandButton = createImg("sand.png", "沙盘");
  sandButton.position(backx0 + 3 * gap, backy0);
  sandButton.size(backsizex, backsizey);
  sandButton.mousePressed(() => handleButtonPress(sandButton, sandBack));

  // title
  title = new Sprite();
  title.x = 550;
  title.y = 25;
  title.scale = 0.7;
  title.image = loadImage("title.jpg");
  title.collider = "static";

  title = new Sprite();
  title.x = 850;
  title.y = 25;
  title.scale = 0.75;
  title.image = loadImage("title2.jpg");
  title.collider = "static";

  // 类别
  for (let i = 0; i < classes.length; i++) {
    c = new Sprite();
    c.x = 850;
    c.y = y1 + i * imHeight;
    c.scale = 0.7;
    c.image = loadImage(`${classes[i]}.jpg`);
    c.collider = "static";
  }

  // 元素
  elements();

  // 提示
  tip = new Sprite();
  tip.x = 1200;
  tip.y = 510;
  tip.scale = 0.55;
  tip.image = loadImage("tips.jpg");
  tip.collider = "static";

  // 按钮
  const conformButtonImg = createImg("analysis.jpg", "分析");
  conformButtonImg.position(1200, 570);
  conformButtonImg.size(100, 35);
  conformButtonImg.mousePressed(() =>
    handleButtonPress(conformButtonImg, conform)
  );

  const resetButtonImg = createImg("reset.jpg", "重置");
  resetButtonImg.position(1200, 650);
  resetButtonImg.size(100, 35);
  resetButtonImg.mousePressed(() => handleButtonPress(resetButtonImg, reset));

  const saveButtonImg = createImg("save.jpg", "保存");
  saveButtonImg.position(1200, 730);
  saveButtonImg.size(100, 35);
  saveButtonImg.mousePressed(() =>
    handleButtonPress(saveButtonImg, takeScreenshot)
  );

  // 结果框
  resultTitle = new Sprite();
  resultTitle.x = 150;
  resultTitle.y = 580;
  resultTitle.scale = 0.7;
  resultTitle.image = loadImage("result.jpg");
  resultTitle.collider = "static";

  mbtiTitle = new Sprite();
  mbtiTitle.x = 630;
  mbtiTitle.y = 580;
  mbtiTitle.scale = 0.7;
  mbtiTitle.image = loadImage("mbti.jpg");
  mbtiTitle.collider = "static";

  resultTextArea = createElement("textarea");
  resultTextArea.position(80, 600);
  resultTextArea.size(width - 1000, 150);
  resultTextArea.style("overflow-y", "scroll");
  resultTextArea.attribute("readonly", true);

  mbtiTextArea = createElement("textarea");
  mbtiTextArea.position(580, 600);
  mbtiTextArea.size(width - 1000, 150);
  mbtiTextArea.style("overflow-y", "scroll");
  mbtiTextArea.attribute("readonly", true);
}

function conform() {
  layout = "";
  //原版conform函数

  let left = sand.x - (backX * sand.scale) / 2;
  let right = sand.x + (backX * sand.scale) / 2;
  let top = sand.y - (backY * sand.scale) / 2;
  let bottom = sand.y + (backY * sand.scale) / 2;

  for (let i = 0; i < allelements.length; i++) {
    for (let j = 0; j < allelements[i].length; j++) {
      let element = allelements[i][j];
      if (
        element.x > left &&
        element.x <= right &&
        element.y > top &&
        element.y <= bottom
      ) {
        sanditem.add([i, j]);
      }
    }
  }
  let num = sanditem.size;
  if (num == 0 && !alertShown) {
    alert("请拖拽沙具到沙盘上～");
    return;
  } else {
    for (let k = 0; k < BackGround.length; k++) {
      if (chosenBack == BackGround[k]) {
        layout = "用户选择的沙盘背景是" + BackGround_C[k] + "\n";
        break;
      }
    }
    content = "";
    result = "";
    mbti = "";
    thinking = true;
    layout += positionText();
    agent.clearAllMessage();
    agent.send(layout, false);
    agent.onComplete = whenComplete;
    currentDotColorIndex = 0;
    dotTimer = setInterval(changeDotColor, 500);
    setButtonOpacity(conformButtonImg, 0.5);
  }
}

function reset() {
  // 元件归位
  for (let i = 0; i < allelements.length; i++) {
    for (let j = 0; j < allelements[i].length; j++) {
      allelements[i][j].x = positions[i][j].x;
      allelements[i][j].y = positions[i][j].y;
      allelements[i][j].rotation = 0;
    }
  }
  isDragging = false;
  draggingIndex = [];
  resultTextArea.html("");
  mbtiTextArea.html("");
  thinking = false;
  clearInterval(dotTimer); // 分析完成后停止定时器
  dots.forEach((dot) => (dot.color = "Mauve")); // 分析完成后恢复dot颜色
  sand.image = loadImage("sand.png");
  chosenBack = "sand";
  layout = "";
  leftup.clear();
  leftmid.clear();
  leftdown.clear();
  midup.clear();
  center.clear();
  middown.clear();
  rightup.clear();
  rightmid.clear();
  rightdown.clear();
  sanditem.clear();
  agent.clearAllMessage();
}

//截图
function takeScreenshot() {
  html2canvas(document.body).then(function (canvas) {
    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "screenshot.png";
    link.click();
  });
}

function landBack() {
  sand.image = loadImage("land.png");
  chosenBack = "land";
}

function lawnBack() {
  sand.image = loadImage("lawn.png");
  chosenBack = "lawn";
}

function seaBack() {
  sand.image = loadImage("sea.png");
  chosenBack = "sea";
}

function sandBack() {
  sand.image = loadImage("sand.png");
  chosenBack = "sand";
}

function handleButtonPress(buttonImg, callback) {
  setButtonOpacity(buttonImg, 0.5);
  buttonpressed = true;
  setTimeout(() => {
    setButtonOpacity(buttonImg, 1.0);
    callback();
    buttonpressed = false;
  }, 200); // 延迟200毫秒后恢复透明度并调用回调函数
}

function setButtonOpacity(button, opacity) {
  button.style("opacity", opacity);
}

function changeDotColor() {
  dots.forEach((dot) => (dot.color = dotColors[currentDotColorIndex]));
  currentDotColorIndex = (currentDotColorIndex + 1) % dotColors.length;
}

function draw() {
  background(color(255, 255, 255));
  drawGui();
  title.draw();
  sand.draw();
  // resultTextArea.draw();
  for (let i = 0; i < allelements.length; i++) {
    for (let j = 0; j < allelements[i].length; j++) {
      allelements[i][j].draw();
    }
  }
  mouseNote();
}
