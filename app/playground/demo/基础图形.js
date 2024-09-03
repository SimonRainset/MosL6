let square;
let circle;

function setup() {
  new Canvas(400, 100);

  // 创建一个Sprite对象
  square = new Sprite();

  // 设置宽高
  square.width = 120;
  square.height = 50;

  // 创建一个Sprite对象
  circle = new Sprite();

  // 设置直径，圆的直径是指圆的外切正方形的边长
  circle.diameter = 50;

  // 设置圆的位置
  circle.x = 50;
}

function draw() {
  // clear()不会清空Sprite对象
  clear();
}
