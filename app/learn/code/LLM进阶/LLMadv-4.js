
let joker;

function setup() {
  createCanvas(500, 500); 
  gui = createGui();
  joker= new Sprite(250,100,50,50);
  joker.image = '🤡';
  textSize(20);
}

function draw() {

  background(220);
  drawGui();

}