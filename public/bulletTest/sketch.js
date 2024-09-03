let textObj;
let bullets = [];
let bulletScatter;
let bulletSpeed;
let wandX, wandY;
let isAllowGenerate = false;

//使用正则表达式匹配并提取参数
const oneCircleRegex = /oneCircle\((-?\d+),(-?\d+),(-?\d+)\)/g;
const oneBoxRegex = /oneBox\((-?\d+),(-?\d+),(-?\d+),(-?\d+)\)/g;
const speedRegex = /speed\((-?\d+)\)/;
const scatterRegex = /scatter\((-?\d+)\)/;

let match;

/*
let command = `
    speed(3)
    scatter(3)
    oneCircle(0,0,10)
    oneCircle(3,5,15)
    oneCircle(-2,7,12)
    oneCircle(8,13,8)
    oneCircle(-5,10,13)
`;

 */


//单颗子弹属性定义
function defineBullet(baseX, baseY){
    //匹配oneCircle(x,y,r)
    while ((match = oneCircleRegex.exec(command)) !== null) {
        const x = parseInt(match[1]);
        const y = parseInt(match[2]);
        const r = parseInt(match[3]);
        createCircle(x, y, r, baseX, baseY);
    }

    //匹配oneBox(x,y,w,h)
    while ((match = oneBoxRegex.exec(command)) !== null) {
        const x = parseInt(match[1]);
        const y = parseInt(match[2]);
        const w = parseInt(match[3]);
        const h = parseInt(match[4]);

        // 调用createBox函数
        createBox(x, y, w, h, baseX, baseY);
    }
}


function Bullet(angle) {
    this.x = wandX;
    this.y = wandY;
    this.speed = bulletSpeed;
    this.angle = angle;

    this.update = function() {
        // 根据角度和速度计算新的位置
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
    };

    this.display = function() {
        // 绘制bullet
        defineBullet(this.x, this.y);
    };
}

function generateBullets() {
    //匹配speed(s)
    let speedMatch = command.match(speedRegex);
    if (speedMatch) {
        bulletSpeed = parseInt(speedMatch[1]);
    } else{
        bulletSpeed = 1;
    }

    //匹配scatter(degree)
    let scatterMatch = command.match(scatterRegex);
    if (scatterMatch) {
        bulletScatter = 10 - parseInt(scatterMatch[1]);
    } else{
        bulletScatter = 9;
    }

    for (let i = 0; i < bulletScatter; i++) {
        // 根据scatter计算每个bullet的角度
        let angle = i * (TWO_PI / bulletScatter);

        // 创建Bullet对象并添加到bullets数组中
        bullets.push(new Bullet(angle));
    }
}

function setup() {
    createCanvas(800, 600);
    submitButton = createButton('确认');
    submitButton.position(250,30)
    submitButton.size(50,50)
    submitButton.mouseClicked(updateDesign);
    textObj = {
        x: 30,
        y: 30,
        width: 200,
        height: 150,
        placeholder: '输入伪代码',
        isTitle: false,
    }
}

function draw() {
    background(250);
    push()
    fill('pink')
    createTextArea(textObj)
    pop()

    if(isAllowGenerate){
        // 在每一帧更新并绘制所有的bullet
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].update();
            bullets[i].display();
        }
    }

}

function mousePressed() {
    wandX = mouseX;
    wandY = mouseY;
    generateBullets();
}

function createCircle(x, y, r, baseX, baseY){
    ellipse(x + baseX, y + baseY, r * 2, r * 2);
}

function createBox(x, y, w, h, baseX, baseY){
    rect(x + baseX, y + baseY, w, h);
}

function updateDesign(){
    isAllowGenerate = true;
    command = textObj.text;
}