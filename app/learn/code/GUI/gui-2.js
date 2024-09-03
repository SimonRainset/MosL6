let gui;
let button;

function setup() {
  createCanvas(400, 400);

  gui = createGui();

  button = createButton("按钮", 50, 50);
}

function draw() {
  drawGui();

  if (button.isPressed) {
    let backgroundColor = color(random(255), random(255), random(255));
    background(backgroundColor);
  }
}
