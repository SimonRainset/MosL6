let sBox;
let sCircle;

function setup() {
   new Canvas(500, 400);
   sBox = new Sprite(120,50,40,80);
   sBox.color = color(200,0,0);

   sBox.text = '福'
   sBox.textSize = 30;
  
 
   
   sCircle = new Sprite(120,250,50);
   sCircle.image = '🤖'

}

function draw() {
    background(220)
    sBox.rotation +=1;
    sCircle.rotation = 10;
 
        
}