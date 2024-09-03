let gui;
let toggle;

function setup() {
  createCanvas(400, 400);

  gui = createGui();

  toggle = createToggle("开关", 100, 50, 200, 50, false);
}

function draw() {
  background(220);

  drawGui();

  if (toggle.isPressed) {
    log("Toggle is pressed");
  }

  if (toggle.val) {
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}
