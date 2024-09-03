let gui;
let button;
let upgradeButton;
let coins = 0;
let delta = 1;

function setup() {
  createCanvas(400, 400);

  gui = createGui();

}

function draw() {
  background(255);
  drawGui();

}
