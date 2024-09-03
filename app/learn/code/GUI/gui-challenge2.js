let gui;
let slider;
let sprite;

function setup() {
    createCanvas(400, 400);

    // 创建管理GUI的系统
    gui = createGui();

}

function draw() {
    background(220);

    // 每帧重绘GUI
    drawGui();

}