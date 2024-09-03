let timer;

// 初始化函数，只会在页面加载时调用一次
function setup() {
  // 创建一个500x500像素的画布
  new Canvas(500, 500);

  // 设置背景颜色
  background("white");

  timer = 0;
}

// 渲染函数，会在每一帧都调用
function draw() {
  // 清空画布
  clear();

  // deltaTime 是两帧之间的时间间隔，单位是毫秒
  timer += deltaTime;

  // 设置文字大小
  textSize(20);

  // 设置文字颜色
  fill("black");

  text("计时器: " + (timer / 1000).toFixed(2), 10, 30);
}
