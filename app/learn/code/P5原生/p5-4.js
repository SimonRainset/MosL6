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

  if (keyIsPressed === true) {
    if (keyCode === UP_ARROW) {
      y -= 1;
    } else if (keyCode === DOWN_ARROW) {
      y += 1;
    } else if (keyCode === LEFT_ARROW) {
      x -= 1;
    } else if (keyCode === RIGHT_ARROW) {
      x += 1;
    }
  }
}

function mouseInsideCircle() {
  if (dist(mouseX, mouseY, x, y) < d / 2)
    return true; // dist calcautes distance between two points
  else return false;
}
