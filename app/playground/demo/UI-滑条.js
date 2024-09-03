let gui;
let slider;
let sprite;

function setup() {
  createCanvas(400, 400);

  // 创建管理GUI的系统
  gui = createGui();

  // 创建一个滑条
  // createSlider(label, x, y, [w], [h], [min], [max])
  // label: 滑条的标签
  // x, y: 滑条的位置
  // w, h: 滑条的宽高, 默认128和32
  // min, max: 滑条的最小值和最大值，默认值分别为0和1
  slider = createSlider("Slider", 50, 50, 300, 32, 0, 255);

  sprite = new Sprite();
  sprite.color = color(255, 255, 255);
}

function draw() {
  background(220);

  // 每帧重绘GUI
  drawGui();

  // 如果滑条的值被改变
  if (slider.isChanged) {
    // slider.val 是滑条的值
    sprite.color = color(slider.val);
  }
}
