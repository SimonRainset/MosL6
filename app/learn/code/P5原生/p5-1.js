let backgroundColor;

function setup() {
  createCanvas(600, 400);
  backgroundColor = 0;
  background(backgroundColor);
}

function draw() {
  backgroundColor++; // 即 backgroundColor = backgroundColor+1
  background(backgroundColor);
}

// 试一试：如何让变淡效果在一秒钟之内实现？