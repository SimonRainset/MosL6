let myInput;

function setup() {
  createCanvas(100, 100);

  // 这个不需要touchgui就可以实现
  // 为P5原生的输入
  myInput = createInput();
  myInput.position(0, 100);
}

function draw() {
  background(200);

  let msg = myInput.value();
  text(msg, 25, 55);
}
