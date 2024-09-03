let gui;
let button;
let upgradeButton;
let coins = 0;
let delta = 1;

function setup() {
  createCanvas(400, 400);

  gui = createGui();
  button = createButton("金币", 50, 50, 60, 30);
  upgradeButton = createButton("升级金币获取", 150, 50, 150, 30);
}

function draw() {
  background(255);
  drawGui();
  text(`Coins: ${coins}`, 50, 100);

  if (upgradeButton.isPressed) {
    delta++;
  }

  if (button.isPressed) {
    coins = coins + delta;
  }
}
