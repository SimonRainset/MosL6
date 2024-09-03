let gui;
let slider;
let sprite;

function setup() {
  createCanvas(400, 400);

  gui = createGui();

  slider = createSlider("Slider", 50, 50, 300, 32, 0, 255);

  sprite = new Sprite();
  sprite.color = color(255, 255, 255);
}

function draw() {
  background(220);

  drawGui();

  if (slider.isChanged) {
    sprite.color = color(slider.val);
  }
}
