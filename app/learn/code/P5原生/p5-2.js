function setup() {
  createCanvas(720, 400);
  background(220);
  square(20, 20, 100);
  rect(100, 40, 200, 100);
  ellipse(540, 130, 200, 120);
  circle(560, 100, 100);
  line(60, 200, 200, 350);
  fill(200, 0, 0);
  triangle(150, 350, 350, 200, 450, 350);
  stroke(0, 200, 200);
  strokeWeight(3);
  quad(500, 250, 550, 200, 700, 300, 650, 350);
}

//试一试1：如何让图中重叠在一起的图形分开？
//试一试2：如何让三角形有黄色的边？
//改编自 https://p5js.org/examples/shapes-and-color-shape-primitives/
