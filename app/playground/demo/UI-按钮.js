let gui;
let button;

function setup() {
  createCanvas(400, 400);

  // 创建管理GUI的系统
  gui = createGui();

  // 创建一个按钮
  // createButton(label, x, y, [w], [h])
  // label: 按钮的标签
  // x, y: 按钮的位置
  // w, h: 按钮的宽高, 默认128和32
  button = createButton("按钮", 50, 50);
}

function draw() {
  // 每帧重绘GUI
  drawGui();

  // 如果按钮被按下
  if (button.isPressed) {
    // 设置背景颜色为随机颜色
    let backgroundColor = color(random(255), random(255), random(255));
    background(backgroundColor);
  }
}
