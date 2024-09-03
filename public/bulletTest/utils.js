let bullets = [];
let scatter = 5;
let speed = 5;
let wandX, wandY;

function setup() {
    createCanvas(400, 400);
    wandX = width / 2;
    wandY = height / 2;
}

function draw() {
    background(255);

    // 在每一帧更新并绘制所有的bullet
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
        bullets[i].display();
    }
}

function Bullet(angle) {
    this.x = wandX;
    this.y = wandY;
    this.speed = speed;
    this.angle = angle;

    this.update = function() {
        // 根据角度和速度计算新的位置
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
    };

    this.display = function() {
        // 绘制bullet
        oneCircle(this.x, this.y, 5);
    };
}

function generateBullets() {
    for (let i = 0; i < scatter; i++) {
        // 根据scatter计算每个bullet的角度
        let angle = i * (TWO_PI / scatter);

        // 创建Bullet对象并添加到bullets数组中
        bullets.push(new Bullet(angle));
    }
}

// 调用generateBullets
function mousePressed() {
    generateBullets();
}
