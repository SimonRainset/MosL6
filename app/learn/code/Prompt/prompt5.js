
let animal;

function setup() {
  createCanvas(500, 500); 
  gui = createGui();
  animal = new Sprite(250,100,50,50);
  animal.image = '🐔';
  textSize(20);
}

function draw() {

  background(220);
  drawGui();

}