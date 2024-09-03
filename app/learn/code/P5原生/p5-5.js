let x, y, d;
function setup() {
  createCanvas(600, 400);
  x = 300;
  y = 200;
  d = 50;
}

function draw() {
  clear();
  background(220);
  fill(200, 0, 0);
  circle(x, y, d);

  if (mouseIsPressed === true) {
    if (mouseInsideCircle()) d++;
  }

}

function mouseInsideCircle() {
  if (dist(mouseX, mouseY, x, y) < d / 2)
    return true; // dist calcautes distance between two points
  else return false;
}
