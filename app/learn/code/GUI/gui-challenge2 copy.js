let gui;
let slider;
let sprite;

function setup() {
    createCanvas(400, 400);

    // 创建管理GUI的系统
    gui = createGui();

    sliderR = createSlider("SliderR", 50, 50, 300, 28, 0, 255);
    sliderG = createSlider("SliderG", 50, 90, 300, 28, 0, 255);
    sliderB = createSlider("SliderB", 50, 130, 300, 28, 0, 255);

    sprite = new Sprite();
    sprite.color = color(255, 255, 255);
}

function draw() {
    background(220);
    textSize(20);
    text("R", 20, 70);
    text("G", 20, 110);
    text("B", 20, 150);

    // 每帧重绘GUI
    drawGui();

    // 如果滑条的值被改变
    if (sliderR.isChanged || sliderG.isChanged || sliderB.isChanged) {
        // slider.val 是滑条的值
        sprite.color = color(sliderR.val, sliderG.val, sliderB.val);
    }
}