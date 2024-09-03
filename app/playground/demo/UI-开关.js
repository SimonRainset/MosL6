let gui;
let toggle;

function setup() {
  createCanvas(400, 400);

  // 创建管理GUI的系统
  gui = createGui();

  // 创建一个开关
  // createToggle(label, x, y, [w], [h], [defaultVal])
  // label: 开关的标签
  // x, y: 开关的位置
  // w, h: 开关的宽高, 默认128和32
  // defaultVal: 开关的默认值, 默认为false
  toggle = createToggle("开关", 100, 50, 200, 50);
}

function draw() {
  background(220);

  // 每帧重绘GUI
  drawGui();

  // 当开关按下时候
  if (toggle.isPressed) {
    // 输出信息到控制台
    log("Toggle is pressed");
  }

  if (toggle.val) {
    // 当开关打开时绘制一个圆
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}
