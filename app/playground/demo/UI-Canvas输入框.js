let textObjWithTitle;
let textObjWithoutTitle;

function setup() {
  createCanvas(800, 600);
  // 必须有的：x, y, width, height, isTitle, 顺序可以不固定，其余参数可有可无
  textObjWithTitle = {
    x: 50,
    y: 50,
    width: 200,
    height: 50,
    placeholder: "粉色对话框",
    isTitle: true,
    title: "这是一个输入框",
  };
  textObjWithoutTitle = {
    x: 50,
    y: 150,
    width: 200,
    height: 50,
    placeholder: "黄色对话框",
    isTitle: false,
  };
}

function draw() {
  background(240);

  // 先fill设置颜色再调用函数才是正确的
  fill("pink");
  textObjWithTitle = createTextArea(textObjWithTitle);
  fill("black");
  text(textObjWithTitle.text, 50, 170);

  fill("yellow");
  textObjWithoutTitle = createTextArea(textObjWithoutTitle);
  fill("black");
  text(textObjWithoutTitle.text, 350, 170);
}
