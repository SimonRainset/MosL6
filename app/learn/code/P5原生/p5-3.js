let x;

function setup() {
  createCanvas(720, 400);
  background(220);
  x = 540;
}

function draw() {
  clear();
  square(20, 20, 100);
  rect(100, 40, 200, 100);
  ellipse(x, 130, 200, 120);
  circle(560, 100, 100);
  line(60, 200, 200, 350);
  push();
  fill(200, 0, 0);
  triangle(150, 350, 350, 200, 450, 350);
  stroke(0, 200, 200);
  strokeWeight(3);
  quad(500, 250, 550, 200, 700, 300, 650, 350);
  pop();
  x--;
}

//试一试：只让三角形颜色随时间变化？
//改编自 https://p5js.org/examples/shapes-and-color-shape-primitives/
