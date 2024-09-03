let myInput;

function setup() {
  createCanvas(100, 100);

  myInput = createInput();
  myInput.position(0, 100);
}

function draw() {
  background(200);

  let msg = myInput.value();
  text(msg, 25, 55);
}
