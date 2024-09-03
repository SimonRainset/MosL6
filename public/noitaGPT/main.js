let player;
let controller;
let hud;
let gameInstance;
let gameSetting;
let tagManager;

let noitaWorld = "黑暗森林";
let sceneDescription;
let enemyName;
let enemyDescription;

let enemySpawnMultiplier = 2;
let enemySizeMultiplier = 2;
let targetTimer = 0;
let aliveEnemies = [];
let superiorObjectNames;
let materials;
let enemyWeaknesses;
let retry = null;
let particleSystem;
let enemyFactory;
let craftTable;
let bulletSystem;
let laser;
let gui;
let lastDeltaTime = 0;
const GAME_STATE = {
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
  INVENTORY: "INVENTORY",
};
let gameState = GAME_STATE.PLAYING;

const MAX_MATERIALS = 8;

let gpt = new P5GPT();

let dropTipFunc = () => {};
let dropTipTimer = 2000;

function outOfBounds(x, y, widthA, heightA, widthB, heightB) {
  return x < widthA || x > widthB || y < heightA || y > heightB;
  //  return x < widthA-10 || x > widthB + 10 || y < heightA-10 || y > heightB + 10;
}

function printState(tips) {
  console.log(tips);
  console.log("gameInstance:", gameInstance);
}

function getMouseVector() {
  let mouseXalt = mouseX - player.sprite.x;
  let mouseYalt = mouseY - player.sprite.y;
  let mouseDir = createVector(mouseXalt, mouseYalt);
  mouseDir.normalize();
  return mouseDir;
}

function drawReticle() {
  noFill();
  strokeWeight(1.5);
  stroke(0, 100, 125, 125);
  ellipse(mouseX, mouseY, 20);
  stroke(80, 160, 200, 125);
  line(mouseX - 14, mouseY - 14, mouseX + 14, mouseY + 14);
  line(mouseX + 14, mouseY - 14, mouseX - 14, mouseY + 14);
  stroke(80, 160, 200, 125);
  line(player.sprite.x, player.sprite.y, mouseX, mouseY);
}

class Enemy {
  sprite;
  velocity = [];
  hp;
  dead;
  damage;

  damageMultiplier;

  dropExpAddend = 5;

  constructor() {
    let side = int(random(4));
    this.sprite = new Sprite();
    this.sprite.color = "red";
    this.sprite.stroke = "red";
    this.sprite.collider = "kinematic";
    switch (side) {
      case 0:
        this.sprite.x = 0;
        this.sprite.y = int(random(height));
        break;
      case 1:
        this.sprite.x = int(random(width));
        this.sprite.y = 0;
        break;
      case 2:
        this.sprite.x = width;
        this.sprite.y = int(random(height));
        break;
      case 3:
        this.sprite.x = int(random(width));
        this.sprite.y = height;
        break;
    }
    let targetX = player.sprite.x;
    let targetY = player.sprite.y;
    let targetDir = createVector(
      targetX - this.sprite.x,
      targetY - this.sprite.y
    );
    targetDir.normalize();
    this.velocity[0] = targetDir.x * enemySpawnMultiplier;
    this.velocity[1] = targetDir.y * enemySpawnMultiplier;
    this.sprite.diameter = 24;

    this.dead = false;
  }

  Die() {
    this.dead = true;
    particleSystem.addCircleBurst(
      this.sprite.x,
      this.sprite.y,
      10,
      10,
      1000 * enemySizeMultiplier
    );

    player.exp += int(this.dropExpAddend);

    dropTipTimer = 2000;

    /*
    dropTipFunc = () => {
      if (dropTipTimer < 0 && player.inventory.items.length >= 8) {
        return;
      }
      dropTipTimer -= lastDeltaTime;

      let randomOne = Math.random();
      console.log("randomOne: ",randomOne);
      if(randomOne <= 0.07){
        randomOne = Math.random();
        let dropArray = [];
        if(randomOne<0.8){
          dropArray = materials;
        }
        else{
          dropArray = superiorObjectNames;
        }
        let drop = random(dropArray);

        push();
        fill(255);
        textSize(20);
        textAlign(CENTER);
        text(`获得 ${drop}`, width / 2, 50);
        pop();

        player.inventory.addItem(drop);
        hud.gamePanel.collect([this.sprite.x,this.sprite.y],drop);
      }
      
    };
    */

    this.dropItems();
  }

  dropItems() {
    if (dropTipTimer < 0 && player.inventory.items.length >= 8) {
      return;
    }
    dropTipTimer -= lastDeltaTime;

    let randomOne = Math.random();
    if (randomOne <= 0.07) {
      randomOne = Math.random();
      let dropArray = [];
      if (randomOne < 0.7) {
        dropArray = materials;
      } else {
        dropArray = superiorObjectNames;
      }
      let drop = random(dropArray);

      push();
      fill(255);
      textSize(20);
      textAlign(CENTER);
      text(`获得 ${drop}`, width / 2, 50);
      pop();

      let canAdd = player.inventory.addItem(drop);
      if (canAdd) {
        hud.gamePanel.collect([this.sprite.x, this.sprite.y], drop);
      }
    }
  }

  update() {
    this.sprite.x += this.velocity[0];
    this.sprite.y += this.velocity[1];
  }
}

class BoomEnemy extends Enemy {
  chaseVelocity = 3;
  explosionDistance = 100;

  constructor() {
    super();
    this.sprite.color = "orange";
    this.sprite.stroke = "orange";
    this.damageMultiplier = 2;
  }

  update() {
    let target = createVector(
      player.sprite.x - this.sprite.x,
      player.sprite.y - this.sprite.y
    );

    if (target.mag() > this.explosionDistance) {
      target.normalize();
      this.sprite.x += target.x * this.chaseVelocity;
      this.sprite.y += target.y * this.chaseVelocity;
    } else {
      this.Die();
    }
  }
}

class DashEnemy extends Enemy {
  isDashing = false;
  pauseDuration = 3000;
  dashDuration = 1500;
  dashVelocity = 8;

  constructor() {
    super();
    this.sprite.color = "cyan";
    this.sprite.stroke = "cyan";
    this.damageMultiplier = 1.2;
  }

  update() {
    if (this.isDashing) {
      this.dashDuration -= lastDeltaTime;
      this.sprite.x += this.velocity[0];
      this.sprite.y += this.velocity[1];
      if (this.dashDuration < 0) {
        this.isDashing = false;
        this.dashDuration = 1000;
      }
    } else {
      this.pauseDuration -= lastDeltaTime;
      if (this.pauseDuration < 0) {
        this.isDashing = true;
        let target = createVector(
          player.sprite.x - this.sprite.x,
          player.sprite.y - this.sprite.y
        );
        target.normalize();
        this.velocity[0] = target.x * this.dashVelocity;
        this.velocity[1] = target.y * this.dashVelocity;
        this.pauseDuration = 3000;
      }
    }
  }
}

class HangingEnemy extends Enemy {
  monsterSpeed = 5;
  counter = 100;

  constructor() {
    super();
    this.sprite.color = "green";
    this.sprite.stroke = "green";
    this.velocity[0] = random(-1, 1) * this.monsterSpeed;
    this.velocity[1] = random(-1, 1) * this.monsterSpeed;
    this.damageMultiplier = 0.5;
  }

  update() {
    this.counter--;
    if (this.counter <= 0) {
      this.counter = Math.random() * 50 + 100;
      let targetX = Math.random() * 0.8 * width + 0.1 * width;
      let targetY = Math.random() * 0.6 * height + 0.2 * height;
      let targetDir = createVector(
        targetX - this.sprite.x,
        targetY - this.sprite.y
      );
      targetDir.normalize();
      this.velocity[0] = targetDir.x * this.monsterSpeed;
      this.velocity[1] = targetDir.y * this.monsterSpeed;
    }

    /*
    let angle = random(360) * (PI / 180);
    if (this.sprite.x < 0 || this.sprite.x > width) {
      this.velocity[0] *= -1 * cos(angle) * this.monsterSpeed;
    }
    if (this.sprite.y < 0 || this.sprite.y > height) {
      this.velocity[1] *= -1 * sin(angle) * this.monsterSpeed;
    }
    */

    this.sprite.x += this.velocity[0];
    this.sprite.y += this.velocity[1];
  }
}

class AvoidEnemy extends Enemy {
  maxSpeed = 8;
  minSpeed = 3;
  evasionDistance = 100;
  stopEvadingDistance = 400;
  evading = false;
  maxRandomAngle = PI;

  constructor() {
    super();
    this.sprite.color = "purple";
    this.sprite.stroke = "purple";
    this.damageMultiplier = 0.8;
  }

  avoidEdge() {
    let buffer = 10; // 靠近边界前开始转向的距离
    let turnSpeed = this.maxSpeed * 1.5;

    if (this.sprite.x < buffer) {
      this.sprite.x += turnSpeed;
    } else if (this.sprite.x > width - buffer) {
      this.sprite.x -= turnSpeed;
    }

    if (this.sprite.y < buffer) {
      this.sprite.y += turnSpeed;
    } else if (this.sprite.y > height - buffer) {
      this.sprite.y -= turnSpeed;
    }
  }

  update() {
    let distance = dist(
      this.sprite.x,
      this.sprite.y,
      player.sprite.x,
      player.sprite.y
    );

    let speed = map(distance, 0, width, this.maxSpeed, this.minSpeed);
    speed = constrain(speed, this.minSpeed, this.maxSpeed);
    let angleOffset = (Math.random() * 2 - 1) * this.maxRandomAngle;

    if (this.evading) {
      if (distance > this.stopEvadingDistance) {
        this.evading = false;
      }
      let angle =
        atan2(
          this.sprite.y - player.sprite.y,
          this.sprite.x - player.sprite.x
        ) + angleOffset;
      this.sprite.x += cos(angle) * speed;
      this.sprite.y += sin(angle) * speed;
    } else {
      if (distance < this.evasionDistance) {
        this.evading = true;
      } else {
        this.evading = false;
        let targetDir = createVector(
          player.sprite.x - this.sprite.x,
          player.sprite.y - this.sprite.y
        );
        targetDir.normalize();
        this.velocity[0] = targetDir.x * speed;
        this.velocity[1] = targetDir.y * speed;
        this.sprite.x += this.velocity[0];
        this.sprite.y += this.velocity[1];
      }
    }

    this.avoidEdge();
  }
}

class Bullet {
  xSpeed;
  ySpeed;
  sprite;
  bulletSizeScale;
  bulletSpeedScale;

  center;
  speed;
  angle;
  timeForceArray;

  birthFrame;

  constructor(
    positionX,
    positionY,
    xSpeed,
    ySpeed,
    bulletSizeScale,
    bulletSpeedScale
  ) {
    this.sprite = new Sprite();
    this.sprite.collider = "d";
    this.sprite.overlaps(allSprites);
    this.sprite.color = "white";
    this.sprite.stroke = "white";
    this.sprite.x = positionX;
    this.sprite.y = positionY;

    this.sprite.diameter = 10 * bulletSizeScale + 3;
    this.xSpeed = xSpeed; // * bulletSpeedScale;
    this.ySpeed = ySpeed; // * bulletSpeedScale;
    this.birthFrame = frameCount;

    this.bulletSizeScale = bulletSizeScale;
    this.bulletSpeedScale = bulletSpeedScale;

    this.timeForceArray = [];
  }

  update() {
    this.sprite.x += this.xSpeed;
    this.sprite.y += this.ySpeed;
  }

  hitCheck() {
    for (let i = 0; i < aliveEnemies.length; i++) {
      let oneEnemy = aliveEnemies[i];
      let hitOrNot = collideCircleCircle(
        this.sprite.x,
        this.sprite.y,
        10,
        oneEnemy.sprite.x,
        oneEnemy.sprite.y,
        oneEnemy.sprite.diameter
      );
      if (hitOrNot) {
        let damage = player.damage + player.inventory.currentWeapon.damage;
        if (oneEnemy.hp - damage < 0) {
          oneEnemy.Die();
        } else {
          oneEnemy.hp -= damage;
        }
        return true;
      }
    }
    return false;
  }

  setTraceParams(center, timeForceArray, speed, angle) {
    this.center = center;
    this.timeForceArray = timeForceArray;
    this.speed = speed;
    this.angle = angle;
    this.xSpeed = this.xSpeed * speed;
    this.ySpeed = this.ySpeed * speed;
    this.sprite.velocity.x = speed * cos(angle);
    this.sprite.velocity.y = speed * sin(angle);
  }

  applyForceOverTime() {
    let bulletAge = frameCount - this.birthFrame;
    if (this.timeForceArray != []) {
      for (let i = 0; i < this.timeForceArray.length; i++) {
        if (bulletAge === this.timeForceArray[i].targetFrame) {
          let toCenterDirection = p5.Vector.sub(
            this.center,
            this.sprite.position
          );
          let force = toCenterDirection
            .normalize()
            .mult(
              this.timeForceArray[i].intensity *
                this.timeForceArray[i].forceDirection
            );
          //console.log(force);
          this.sprite.collider = "d";
          this.sprite.applyForce(force);

          this.timeForceArray.splice(i, 1);
        } else {
          //this.sprite.collider = "n";
        }
      }
      //this.sprite.collider = "n";
    } else {
      this.sprite.collider = "n";
      let index = player.bulletsFired.indexOf(this);
      player.bulletsFired.splice(index, 1);
      oneBullet.sprite.remove();
    }
  }
}

/*
class BulletGroups {
  groupType;
  bullets;
  forceArray;

  center;
  speed;
  angle;
  timeForceArray;

  birthFrame;

  constructor(groupType,center,speed,angle,timeForceArray){
    this.groupType = groupType;
    this.bullets = [];
    this.birthFrame = frameCount;

    this.center = center;
    this.speed = speed;
    this.angle = angle;
    this.timeForceArray = timeForceArray;

    if(groupType == "zigzag"){
      this.timeForceArray = gameSetting.zigzagForceArray;
    }
    else if(groupType == "twisted"){
      this.timeForceArray = gameSetting.twistedForceArray;
    }
    else if(groupType == "split"){
      this.timeForceArray = gameSetting.splitForceArray;
    }
    else if(groupType == "fanScan"){
      this.timeForceArray = gameSetting.fanScanForceArray;
    }
  }

}
*/

class BulletSystem {
  bulletsGroups;
  // 向心力

  presetConfig = {
    zigzag: gameSetting.zigzagConfig,
    fanScan: gameSetting.fanScanConfig,
    twisted: gameSetting.twistedConfig,
    split: gameSetting.splitConfig,
  };

  presetForceArray = {
    zigzag: gameSetting.zigzagForceArray,
    fanScan: gameSetting.fanScanForceArray,
    twisted: gameSetting.twistedForceArray,
    split: gameSetting.splitForceArray,
  };

  intervalId = -1;

  fireCounter = 0;
  shootPosition = createVector(0, 0);

  createBulletWave(
    x,
    y,
    type,
    scatter,
    number,
    speed,
    toCenterDistance,
    centerPosition,
    timeForceArray,
    isRandomFrame,
    targetAngle
  ) {
    let leftAngle = -90 - scatter;
    let rightAngle = -90 + scatter;
    let scatterSection = rightAngle - leftAngle;
    let singleSection = scatterSection / number;

    //Add by zzm
    //let oneBulletGroup = new BulletGroups(,);constructor(groupType,center,speed,angle,timeForceArray)

    for (let i = 0; i < number; i++) {
      let min = leftAngle + i * singleSection;
      let max = min + singleSection;
      let angle = (min + max) / 2 + targetAngle;
      if (type === "curve") {
        if (isRandomFrame) {
          randomFrame = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
          timeForceArray[0].targetFrame = randomFrame;
        }
        //generateCurveBullet(x, y, speed, angle, centerPosition, toCenterDistance, timeForceArray);
        let offsetAngle;
        if (centerPosition === "right") {
          offsetAngle = angle + 90;
        } else if (centerPosition === "left") {
          offsetAngle = angle - 90;
        } else if (centerPosition === "inlineFront") {
          offsetAngle = angle;
        } else if (centerPosition === "inlineBehind") {
          offsetAngle = angle + 180;
        }
        let xSpeed = Math.cos(angle);
        let ySpeed = Math.sin(angle);
        let weaponParams = player.getWeapon().weaponParams;
        let oneBullet = new Bullet(
          x,
          y,
          xSpeed,
          ySpeed,
          weaponParams.bulletSizeScale,
          weaponParams.bulletSpeedScale
        );
        let center = createVector(
          x + toCenterDistance * cos(offsetAngle),
          y + toCenterDistance * sin(offsetAngle)
        );
        oneBullet.setTraceParams(
          center,
          Array.from(timeForceArray),
          speed,
          angle
        );
        player.bulletsFired.push(oneBullet);
        //oneBulletGroup.bullets.push(oneBullet);
        //this.bulletsGroups.push(oneBulletGroup);
      }
    }
  }

  spawnBulletWave(shapeConfig, shapeForceArray, targetAngle) {
    let targetShapeConfig = shapeConfig;
    let targetForceArray = shapeForceArray;
    let isRandomFrame = false;
    let presetConfig = this.presetConfig;
    //const traceConfig = JSON.parse(presetConfig[traceType]);
    const traceConfig = targetShapeConfig;
    //const bulletConfig = JSON.parse(zigzagConfig);
    //bulletType = traceConfig.type;
    const traceArray = targetForceArray; //this.presetForceArray[traceType];

    //必填字段
    let type = traceConfig.type;
    let scatter = Number(traceConfig.scatter);
    let speed = Number(traceConfig.speed);
    let number = Number(traceConfig.number);
    let toCenterDistance = Number(traceConfig.toCenterDistance);
    let waveInterval = Number(traceConfig.waveInterval);

    //curve字段
    let centerPosition;

    if (traceConfig.centerPosition) {
      centerPosition = traceConfig.centerPosition;
    } else {
      centerPosition = "right";
    }

    if (this.intervalId == -1) {
      if (centerPosition === "randomLeftRight") {
        centerPosition = Math.random() < 0.5 ? "left" : "right";
      }
      this.intervalId = setInterval(() => {
        if (!gameInstance.state.checkTagField("gameState.playing")) {
          return;
        }
        if (this.fireCounter == 0) {
          this.shootPosition.x = player.sprite.x;
          this.shootPosition.y = player.sprite.y;
        }
        this.createBulletWave(
          this.shootPosition.x,
          this.shootPosition.y,
          type,
          scatter,
          number,
          speed,
          toCenterDistance,
          centerPosition,
          traceArray,
          isRandomFrame,
          targetAngle
        );
        this.fireCounter++;
        if (this.fireCounter >= 5) {
          clearInterval(this.intervalId);
          this.intervalId = -1;
          this.fireCounter = 0;
        }
      }, waveInterval);
    }
  }

  update() {
    for (let i = 0; i < player.bulletsFired.length; i++) {
      let oneBullet = player.bulletsFired[i];
      oneBullet.center.x += oneBullet.speed * cos(oneBullet.angle);
      oneBullet.center.y += oneBullet.speed * sin(oneBullet.angle);
      oneBullet.applyForceOverTime();
    }
  }

  clearTimer() {
    if (this.intervalId != -1) {
      clearInterval(this.intervalId);
      this.intervalId = -1;
    }
  }
}

class Particle {
  sprite;
  lifeSpan; // ms
  alive = true;

  constructor(x, y, xSpeed, ySpeed, lifeSpan) {
    this.sprite = new Sprite();
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.diameter = random(3, 8);
    this.lifeSpan = lifeSpan;
    this.sprite.color = "red";
    this.sprite.stroke = "red";
    this.sprite.vel.x = xSpeed;
    this.sprite.vel.y = ySpeed;
  }

  update() {
    this.lifeSpan -= lastDeltaTime;
    if (this.lifeSpan <= 0) {
      this.alive = false;
    }
  }

  isAlive() {
    return this.alive;
  }
}

class ParticleSystem {
  particles;

  constructor() {
    this.particles = [];
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      let oneParticle = this.particles[i];
      oneParticle.update();
      if (!oneParticle.isAlive()) {
        this.particles.splice(i, 1);
        oneParticle.sprite.remove();
      }
    }
  }

  addCircleBurst(x, y, maxNumParticles, maxSpeed, maxLifeSpan) {
    let numParticles = int(random(maxNumParticles));
    if (numParticles < 4) {
      numParticles = 4;
    }
    for (let i = 0; i < numParticles; i++) {
      let oneParticle = new Particle(
        x,
        y,
        random(-maxSpeed, maxSpeed),
        random(-maxSpeed, maxSpeed),
        random(0, maxLifeSpan)
      );
      this.particles.push(oneParticle);
    }
  }
}

SHOOTING_MODE = {
  MANUAL: "MANUAL",
  VAMPIRE: "VAMPIRE",
};

const SHOOTING_SHAPE = {
  burst: "burst",
  point: "point",
  trident: "trident",
};

class Player {
  sprite;

  moveVelocity = 5;

  bulletsFired = [];

  shootingMode;
  //shootTimerId;

  target = null;

  // 背包
  inventory = null;

  // 等级
  level;
  levelUpExp;
  exp;
  hp;
  maxHp;
  damage;

  // 射击参数
  nextShootingTime = 0;

  // 武器参数
  //weaponParams;
  //bulletTraceParams;

  constructor() {
    this.playerLevelSetting = gameSetting.playerLevelSetting;

    this.sprite = new Sprite();
    this.sprite.diameter = 50;
    this.sprite.color = "yellow";
    this.sprite.stroke = "yellow";
    this.sprite.collider = "none";
    this.sprite.x = width / 2;
    this.sprite.y = (height - this.sprite.diameter) / 2;

    this.weaponParams = {
      shootingShape: SHOOTING_SHAPE.burst,
      shootingInterval: 1500,
      bulletSpeedScale: 1,
      bulletSizeScale: 1,
      bulletTrace: {
        fatherMultiplier: 0.5,
        fatherShapeConfig: "zigzag",
        motherMultiplier: 0.5,
        motherShapeConfig: "fanScan",
      },
    };

    this.inventory = new Inventory();
    this.level = 0;
    this.setLevelAttribute(0);
    this.isPressed = false;

    this.shootingMode = SHOOTING_MODE.VAMPIRE;
    //this.shootTimerId = -1;
  }

  move() {
    let targetLocation = createVector(this.sprite.x, this.sprite.y);
    if (kb.pressing("left")) {
      targetLocation.x = this.sprite.x - this.moveVelocity;
    }

    if (kb.pressing("right")) {
      targetLocation.x = this.sprite.x + this.moveVelocity;
    }
    if (kb.pressing("up")) {
      targetLocation.y = this.sprite.y - this.moveVelocity;
    }
    if (kb.pressing("down")) {
      targetLocation.y = this.sprite.y + this.moveVelocity;
    }

    if (
      !outOfBounds(
        targetLocation.x,
        targetLocation.x,
        this.sprite.diameter,
        this.sprite.diameter,
        width - this.sprite.diameter,
        height - this.sprite.diameter
      )
    ) {
      this.sprite.x = targetLocation.x;
      this.sprite.y = targetLocation.y;
    }
  }

  shoot() {
    if (
      mouse.pressed() &&
      millis() > this.nextShootingTime &&
      this.pressed == false
    ) {
      this.pressed = true;
      let mouseVector = getMouseVector();

      this.weaponParams = this.getWeapon().weaponParams;
      if (this.weaponParams.shootingShape == SHOOTING_SHAPE.point) {
        let targetX = mouseVector.x;
        let targetY = mouseVector.y;
        let targetDir = createVector(
          targetX, //- this.sprite.x,
          targetY //- this.sprite.y
        );
        targetDir.normalize();
        let oneBullet = new Bullet(
          player.sprite.x,
          player.sprite.y,
          targetDir.x,
          targetDir.y,
          this.weaponParams.bulletSizeScale,
          this.weaponParams.bulletSpeedScale
        );
        player.bulletsFired.push(oneBullet);
      } else if (this.weaponParams.shootingShape == SHOOTING_SHAPE.burst) {
        let speeds = [
          [1, 0],
          [1, 1],
          [0, 1],
          [-1, 1],
          [-1, 0],
          [-1, -1],
          [0, -1],
          [1, -1],
        ];
        let speed = speeds[0];
        let dotProduct = speed.x * mouseVector.x + speed.y * mouseVector.y;
        let angleBias = Math.acos(dotProduct);
        for (let i = 0; i < speeds.length; i++) {
          speed = speeds[i];
          let shootingDir = createVector(speed[0], speed[1]).rotate(angleBias);
          shootingDir.normalize();
          let oneBullet = new Bullet(
            player.sprite.x,
            player.sprite.y,
            shootingDir.x,
            shootingDir.y,
            this.weaponParams.bulletSizeScale,
            this.weaponParams.bulletSpeedScale
          );
          player.bulletsFired.push(oneBullet);
        }
      } else if (this.weaponParams.shootingShape == SHOOTING_SHAPE.trident) {
        let tridentNum = 3;

        const tridentShooting = () => {
          {
            let targetX = mouseVector.x;
            let targetY = mouseVector.y;
            let targetDir = createVector(
              targetX, //- this.sprite.x,
              targetY //- this.sprite.y
            );
            targetDir.normalize();

            let perpendicular = createVector(-targetDir.y, targetDir.x);
            let scale = 0.2;

            for (let i = 0; i < tridentNum; i++) {
              let oneBullet = new Bullet(
                player.sprite.x,
                player.sprite.y,
                targetDir.x + perpendicular.x * scale,
                targetDir.y + perpendicular.y * scale,
                this.weaponParams.bulletSizeScale,
                this.weaponParams.bulletSpeedScale
              );
              player.bulletsFired.push(oneBullet);
              scale -= 0.2;
            }
          }
        };

        tridentShooting();
        setTimeout(tridentShooting, 150);
      }
      this.nextShootingTime = millis() + this.weaponParams.shootingInterval;
    } else if (!mouse.pressed()) {
      this.pressed = false;
    }
  }

  autoShoot() {
    if (millis() < this.nextShootingTime) {
      return;
    }

    this.weaponParams = this.getWeapon().weaponParams;
    if (this.weaponParams.shootingShape == SHOOTING_SHAPE.point) {
      let target = this.findTarget();
      if (target != null) {
        let targetX = target.sprite.x;
        let targetY = target.sprite.y;
        let targetDir = createVector(
          targetX - this.sprite.x,
          targetY - this.sprite.y
        );
        targetDir.normalize();
        let oneBullet = new Bullet(
          player.sprite.x,
          player.sprite.y,
          targetDir.x,
          targetDir.y,
          this.weaponParams.bulletSizeScale,
          this.weaponParams.bulletSpeedScale
        );
        player.bulletsFired.push(oneBullet);
        this.nextShootingTime = millis() + this.weaponParams.shootingInterval;
      }
    } else if (this.weaponParams.shootingShape == SHOOTING_SHAPE.burst) {
      let speeds = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
      ];
      for (let i = 0; i < speeds.length; i++) {
        let speed = speeds[i];
        let shootingDir = createVector(speed[0], speed[1]);
        shootingDir.normalize();
        let oneBullet = new Bullet(
          player.sprite.x,
          player.sprite.y,
          shootingDir.x,
          shootingDir.y,
          this.weaponParams.bulletSizeScale,
          this.weaponParams.bulletSpeedScale
        );
        player.bulletsFired.push(oneBullet);
      }

      this.nextShootingTime = millis() + this.weaponParams.shootingInterval;
    } else if (this.weaponParams.shootingShape == SHOOTING_SHAPE.trident) {
      let tridentNum = 3;

      const tridentShooting = () => {
        let target = this.findTarget();
        if (target != null) {
          let targetX = target.sprite.x;
          let targetY = target.sprite.y;
          let targetDir = createVector(
            targetX - this.sprite.x,
            targetY - this.sprite.y
          );
          targetDir.normalize();

          let perpendicular = createVector(-targetDir.y, targetDir.x);
          let scale = 0.2;

          for (let i = 0; i < tridentNum; i++) {
            let oneBullet = new Bullet(
              player.sprite.x,
              player.sprite.y,
              targetDir.x + perpendicular.x * scale,
              targetDir.y + perpendicular.y * scale,
              this.weaponParams.bulletSizeScale,
              this.weaponParams.bulletSpeedScale
            );
            player.bulletsFired.push(oneBullet);
            scale -= 0.2;
          }

          this.nextShootingTime = millis() + this.weaponParams.shootingInterval;
        }
      };

      tridentShooting();
      //this.shootTimerId =
      setTimeout(tridentShooting, 150);
    }
  }

  shootBulltWave() {
    if (millis() < this.nextShootingTime) {
      return;
    }
    let target = this.findTarget();
    if (target != null) {
      let targetX = target.sprite.x;
      let targetY = target.sprite.y;
      let targetDir = createVector(
        targetX - this.sprite.x,
        targetY - this.sprite.y
      );
      targetDir.normalize();

      let shapeConfig = this.getWeapon().shapeConfig;
      let shapeForceArray = player.getWeapon().shapeForceArray;
      let speed = createVector(0, -1);
      let dotProduct = speed.x * targetDir.x + speed.y * targetDir.y;
      let angleBias = (Math.acos(dotProduct) * 180) / PI;
      let rotateDir = speed.rotate(angleBias);
      if (Math.abs(rotateDir.x - targetDir.x) >= 0.0001) {
        angleBias *= -1;
      }
      bulletSystem.spawnBulletWave(shapeConfig, shapeForceArray, angleBias);
      this.nextShootingTime = millis() + this.weaponParams.shootingInterval;
    }
  }

  toggleWeapon() {
    let index = this.inventory.weapons.indexOf(this.inventory.currentWeapon);
    let length = this.inventory.weapons.length;
    let flag = false;

    if (kb.pressing("q") && this.isPressed == false) {
      this.isPressed = true;
      index = (index - 1 + length) % length;
      flag = true;
    } else if (kb.released("q")) {
      this.isPressed = false;
    }

    if (kb.pressing("e") && this.isPressed == false) {
      this.isPressed = true;
      index = (index + 1 + length) % length;
      flag = true;
    } else if (kb.released("e")) {
      this.isPressed = false;
    }

    if (flag) {
      this.inventory.currentWeapon = this.inventory.weapons[index];
    }
  }

  findTarget() {
    if (this.target != null) {
      return this.target;
    }
    let closestEnemy = null;
    let closestDistance = 999999999;
    for (let i = 0; i < aliveEnemies.length; i++) {
      let oneEnemy = aliveEnemies[i];
      let distance = dist(
        this.sprite.x,
        this.sprite.y,
        oneEnemy.sprite.x,
        oneEnemy.sprite.y
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = oneEnemy;
      }
    }
    return closestEnemy;
  }

  getWeapon() {
    if (this.inventory.weapons.length <= 0) {
      let oneWeapon = Weapon.GetDefaultWeapon();
      this.inventory.weapons.push(oneWeapon);
      this.inventory.currentWeapon = oneWeapon;
    }
    return this.inventory.currentWeapon;
  }

  input() {
    if (kb.pressing("r") && this.isPressed == false) {
      this.isPressed = true;
      if (this.shootingMode == SHOOTING_MODE.MANUAL) {
        this.shootingMode = SHOOTING_MODE.VAMPIRE;
        console.log("change to vampire mode");
        this.nextShootingTime = millis() + this.weaponParams.shootingInterval;
      } else if (this.shootingMode == SHOOTING_MODE.VAMPIRE) {
        //clearTimeout(this.shootTimerId);
        this.shootingMode = SHOOTING_MODE.MANUAL;
        console.log("change to manual mode");
      }
    } else if (kb.released("r")) {
      this.isPressed = false;
    }

    if (kb.pressing("f") && this.isPressed == false) {
      this.isPressed = true;
      gameInstance.pauseGame();
      craftTable.state = tagManager.getTagByPath("craft.prepare");
    } else if (kb.released("f")) {
      this.isPressed = false;
    }
  }

  hitCheck() {
    for (let i = 0; i < aliveEnemies.length; i++) {
      let oneEnemy = aliveEnemies[i];
      let hitOrNot = collideCircleCircle(
        this.sprite.x,
        this.sprite.y,
        this.sprite.diameter,
        oneEnemy.sprite.x,
        oneEnemy.sprite.y,
        oneEnemy.sprite.diameter
      );
      if (hitOrNot) {
        return true;
      }
    }
    return false;
  }

  checkBeDamaged() {
    let hitOrNot = false;
    for (let i = 0; i < aliveEnemies.length; i++) {
      let oneEnemy = aliveEnemies[i];
      hitOrNot = collideCircleCircle(
        this.sprite.x,
        this.sprite.y,
        this.sprite.diameter,
        oneEnemy.sprite.x,
        oneEnemy.sprite.y,
        oneEnemy.sprite.diameter
      );
      if (hitOrNot) {
        let damage = oneEnemy.damage * oneEnemy.damageMultiplier;
        this.hp -= damage;
        oneEnemy.Die();
        return true;
      }
    }
    return hitOrNot;
  }

  upgrade() {
    if (this.exp >= this.levelUpExp) {
      this.level++;

      this.setLevelAttribute(this.level);

      /*
      if(this.inventory.items.length > 2){
        gameInstance.state = tagManager.getTagByPath("gameState.pause");
        craftTable.state = tagManager.getTagByPath("craft.prepare");
        //gameInstance.pauseGame();
        //hud.createCraftPanel();
      }
      */
    }
  }

  setLevelAttribute(level) {
    let playerLevelSetting = this.playerLevelSetting;
    let step = int(level / playerLevelSetting.levelStep);
    let stepMultipliterAddend = step * playerLevelSetting.stepMultiplierAddend;
    this.levelUpExp =
      playerLevelSetting.baseLevelUpExp *
      Math.pow(
        stepMultipliterAddend + playerLevelSetting.baseLevelUpMultiplier,
        level
      );
    this.exp = 0;

    this.maxHp =
      playerLevelSetting.baseMaxHp +
      playerLevelSetting.hpAddend * (1 + stepMultipliterAddend) * level;
    this.hp = this.maxHp;
    this.damage =
      playerLevelSetting.baseDamage +
      playerLevelSetting.damageAddend * (1 + stepMultipliterAddend) * level;
  }

  update() {
    // 经验条
    this.upgrade();

    this.move();

    this.checkBeDamaged();

    this.toggleWeapon();

    this.input();

    if (this.shootingMode == SHOOTING_MODE.VAMPIRE) {
      //this.autoShoot();
      this.shootBulltWave();
    } else if (this.shootingMode == SHOOTING_MODE.MANUAL) {
      this.shoot();
    }
  }
}

class Controller {
  constructor() {
    this.isPressed = false;
  }
  shortcutInput() {
    // 快捷键输入
    if (kb.pressing("1") && this.isPressed == false) {
      this.isPressed = true;
      //if(gameInstance.state == gameInstance.GAMEINSTANCE_STATE.PLAYING){
      if (gameInstance.state.checkTagField("gameState.playing")) {
        gameInstance.pauseGame();
      }
      //else if(gameInstance.state == gameInstance.GAMEINSTANCE_STATE.PAUSE){
      else if (gameInstance.state.checkTagField("gameState.pause")) {
        gameInstance.resumeGame();
      }
      GameClocker.onPause = !GameClocker.onPause;
    } else if (kb.released("1")) {
      this.isPressed = false;
    }

    if (kb.pressing("2") && this.isPressed == false) {
      this.isPressed = true;
      if (enemyFactory) {
        enemyFactory.spawnEnemyGroup({
          isCheating: true,
          enemyType: enemyFactory.ENEMY_TYPE.HANGING,
          enemySpawnCount: 5,
          enemyGroupType: enemyFactory.ENEMY_GROUP_TYPE.LINE,
        });
      }
    } else if (kb.released("2")) {
      this.isPressed = false;
    }

    if (kb.pressing("3") && this.isPressed == false) {
      this.isPressed = true;
      player.hp = 0;
    } else if (kb.released("3")) {
      this.isPressed = false;
    }

    if (kb.pressing("4") && this.isPressed == false) {
      this.isPressed = true;
      let shapeConfig = player.getWeapon().shapeConfig;
      let shapeForceArray = player.getWeapon().shapeForceArray;
      console.log(shapeConfig);
      bulletSystem.spawnBulletWave(shapeConfig, shapeForceArray, 90);
    } else if (kb.released("4")) {
      this.isPressed = false;
    }
  }
}

class Inventory {
  items;
  //itemsNumMap;
  weapons;
  currentWeapon;
  chosenItems;
  maxWeaponsNum;

  constructor() {
    this.items = [];
    //this.itemsNumMap = {};
    this.weapons = [];
    this.chosenItems = [];
    this.maxWeaponsNum = 2;
  }

  addItem(item) {
    /*
    if(this.itemsNumMap[item] == null){
      this.itemsNumMap[item] = 1;
      this.items.push(item);
    }
    else{
      this.itemsNumMap[item] += 1;
    }

    */
    if (this.items.indexOf(item) == -1) {
      this.items.push(item);
      return true;
    }
    return false;
  }

  removeChosenItem() {
    /*
    for(let i = 0; i < this.chosenItems.length; i++){
      let item = this.chosenItems[i];
      if(this.itemsNumMap[item] == 1){
        delete this.itemsNumMap[item];
        let index = this.items.indexOf(item);
        this.items.splice(index, 1);
      }
      else{
        this.itemsNumMap[item] -= 1;
      }
    }
    this.chosenItems = [];
    */

    for (let i = 0; i < this.chosenItems.length; i++) {
      let item = this.chosenItems[i];
      let index = this.items.indexOf(item);
      if (index != -1) {
        this.items.splice(index, 1);
      }
    }
    this.chosenItems = [];
  }

  addChosenItem(item) {
    for (let i = 0; i < this.chosenItems.length; i++) {
      let chosenItem = this.chosenItems[i];
      if (chosenItem == item) {
        return;
      }
    }
    this.chosenItems.push(item);
  }

  addWeapon(weapon) {
    if (this.weapons.length < this.maxWeaponsNum) {
      this.weapons.push(weapon);
    } else {
      for (let i = 0; i < this.weapons.length; i++) {
        if (this.weapons[i] != this.currentWeapon) {
          this.weapons.splice(i, 1);
          this.weapons.push(weapon);
        }
      }
    }
    hud.gamePanel.refresh();
  }

  removeWeapon(weapon) {
    let index = this.weapons.indexOf(weapon);
    this.weapons.splice(index, 1);
    this.currentWeapon = this.weapons[0];
  }

  findSameKindWeapon(materialsIn) {
    let sortedMaterials1 = materialsIn.sort();
    for (let i = 0; i < this.weapons.length; i++) {
      let oneWeapon = this.weapons[i];
      let sortedMaterials2 = oneWeapon.materials.sort();
      let flag = true;
      if (sortedMaterials1.length == sortedMaterials2.length) {
        for (let j = 0; j < sortedMaterials1.length; j++) {
          if (sortedMaterials1[j] != sortedMaterials2[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          console.log("findSameKindWeapon Success");
          return oneWeapon;
        }
      }
    }
    return null;
  }
}

class CraftTable {
  state;

  wandStick;
  wandCore;

  gptWandMovie;
  gptWandResult;
  gptWandParams;
  craftMoviePrompt;
  craftResultPrompt;

  wandMovieFin;
  wandParamsFin;
  wandResultFin;
  wandMovieText;

  wandName;
  wandMissile;
  wandProjectile;

  craftedWeapon;

  constructor() {
    this.state = tagManager.getTagByPath("craft.done");

    this.gptWandMovie = new P5Spark();
    this.gptWandResult = new P5Spark();
    this.gptWandParams = new P5GPT();
    this.craftResultPrompt = gameSetting.craftResultPrompt;
    this.craftMoviePrompt = gameSetting.craftMoviePrompt;

    this.wandStick = "";
    this.wandCore = "";

    this.reset();
  }

  reset() {
    this.wandMovieFin = false;
    this.wandParamsFin = false;
    this.wandResultFin = false;
    this.wandMovieText = "";
    this.wandName = "";
    this.wandMissile = "";
    this.wandProjectile = "";
  }

  craft() {
    this.reset();

    let gptWandParams = new P5GPT();
    let gptWandMovie = this.gptWandMovie;
    let gptWandResult = this.gptWandResult;

    let wandCoreMat = this.wandCore;
    let wandStickMat = this.wandStick;
    /*

    
    */
    gptWandParams
      .dialog([
        {
          role: "system",
          content: `以下需要你帮助我在p5.js和p5.play的基础上实现一个随机性游戏，请你用编程性语言回复我。现在我想用${[
            wandCoreMat,
            wandStickMat,
          ].join(
            ","
            /*
        )}作为材料合成一个武器，现在请你以json的形式赋予你认为这两个材料合成的武器的属性，属性包括[bulletSizeScale, bulletSpeedScale, shootingInterval, shootingShape]，其中shootingShape有[burst, point, trident]三种，当前的参数为${JSON.stringify(
          player.weaponParams
        */
          )}作为材料合成一个武器，现在请你以json的形式赋予你认为这两个材料合成的武器的属性，属性包括[bulletSizeScale, bulletSpeedScale, shootingInterval, shootingShape，bulletTrace]，其中shootingShape有[burst, point, trident]三种。bulletTrace = [fatherMultiplier, fatherShapeConfig, motherMultiplier, motherShapeConfig]，其中fatherMultiplier和motherMultiplier都是0.3至0.8的小数，fatherShapeConfig和motherShapeConfig从["zigzag", "fanScan", "twisted","split"]四种中随机选取。当前的参数为${JSON.stringify(
            player.weaponParams
          )}，请合成，不要多余的话。`,
        },
        {
          role: "assistant",
          content: `{bulletSpeedScale: 2,bulletSpeedScale: 1.2,shootingInterval: 1000,shootingShape: "circle"}`,
        },
        {
          role: "user",
          content: "格式正确，但内容不符合要求，请重新输入，不要多余的话。",
        },
      ])
      .then((res) => {
        console.log("craft res is: ", res);
        let sameWeapon = player.inventory.findSameKindWeapon(
          player.inventory.chosenItems
        );
        if (sameWeapon != null) {
          //升级旧法杖
          sameWeapon.upgrade();
        } else {
          let weaponParams = JSON.parse(res);
          console.log("craft weaponParams is: ", res);
          console.log("this.chosenItems", player.inventory.chosenItems);
          this.craftedWeapon = new Weapon(
            player.inventory.chosenItems,
            weaponParams
          );
          player.inventory.addWeapon(this.craftedWeapon);
        }
        this.wandParamsFin = true;

        //gameInstance.resumeGame();
      });

    gptWandMovie.clearAllMessage();
    gptWandMovie.setSystemPrompt(
      "你是一个魔杖制作师，你在库斯坦佐的魔杖工作坊里，正忙于一项前所未有的挑战：需要使用一种【魔杖芯材料】和一种【魔杖柄材料】制作一种材料。【魔杖芯材料】会影响魔杖弹药的属性与威力，【魔杖柄材料】会影响魔杖的弹道。请生成生成合成时的情景，加入一些细节生动的细节描写，提到一些神奇的工具，中间有一些曲折的过程。最终结果为成功。全程使用第二人称'你'指代魔杖制作师。\
三引号内是一个成功的参考案例:\
'''\
你开始准备制作一根新魔杖，芯材料为熔岩，柄材料则来源于传说中的烈焰之剑。\
你首先集中精力于熔岩，这个强大且不稳定的元素。普通的工具无法承受这种高温，于是你从仓库深处取出了一件神奇的工具：涅槃凤凰的羽毛镶嵌的钳子。只有这种被涅槃火焰锻造过的工具，才能安全地操纵这样的高温物质。你小心翼翼地将一小团熔岩从你的保险箱中取出。这保险箱是用龙息石打造的，唯一能够容纳并隔绝熔岩高温的物品。\
随后，你把熔岩放入已经设置好的魔力场中，开始慢慢地用心灵之力塑形，让它逐渐成为你想要的芯材形态。这个过程充满了不确定性和危险，稍有不慎就可能导致爆炸。然而，在你的精心操作下，熔岩芯逐渐成形，发出令人着迷的橘红色光泽。\
接下来是烈焰之剑柄的制作。这件传说中的武器，据说是在太古火神的熔炉中锻造而成，其中蕴含的力量无穷无尽。你从一位冒险家那里得到了这件珍贵的宝物，现在要将它融入魔杖之中。使用特制的魔法熔炉，你开始逐渐将烈焰之剑融解。这个过程异常困难，因为烈焰之剑抵抗着被融化的命运，几次差点让整个工作坊陷入火海。但通过你的巧妙控制和不懈坚持，终于得到了一条流动着像是火焰般的金属条。\
将熔岩芯与烈焰之剑柄合而为一的那一刻，整个工作坊都被一道耀眼的光芒照亮。当一切光芒散去，你的面前现出了一根美丽而强大的魔杖。'''"
    );

    this.wandMovieFin = false;
    this.wandMovieText = "";
    gptWandMovie.send(
      "【魔杖芯材料】为" + wandCoreMat + "，【魔杖柄材料】为" + wandStickMat,
      true
    );
    gptWandMovie.onStream = (streamText) => {
      this.wandMovieText += streamText;
    };
    gptWandMovie.onComplete = (response) => {
      this.wandMovieFin = true;
      console.log("endmovie");
    };

    gptWandResult.clearAllMessage();
    gptWandResult.setSystemPrompt(
      '你是一个魔杖制作师，需要使用一种【魔杖芯材料】和一种【魔杖柄材料】制作一种材料。【魔杖芯材料】会影响魔杖弹药的属性与威力（如不同属性的攻击，每次攻击威力大小，发射频率等），【魔杖柄材料】会影响魔杖的弹道（弹道可以参考直线，曲线，锥形，圆形等形态）。请生成魔杖的名称，魔杖弹药与弹道的描述，使用如下json格式（请勿输出```json的字符，直接以"{"开始）\
    {\
    "魔杖名称":""\
    "魔杖芯材料对魔杖弹药的影响"\
    "魔杖弹药描述":""\
    "魔杖柄材料对魔杖弹道的影响"\
    "魔杖弹道描述":""\
    }\
    以下三引号内为一个案例。\
    \'\'\'\
    USER:魔杖芯材料为闪光球，魔杖芯材料为蛛网\
    ASSISTANT:\
    {\
    "魔杖名称":"星光蛛语杖",\
    "魔杖芯材料对魔杖弹药的影响":"闪光球的映入使得魔杖发射的弹药拥有高能量的光辉，能够在漆黑的环境中造成强烈的照明效果，并具有致盲敌人的能力。",\
    "魔杖弹药描述":"魔杖发射的弹药类似于仿生的光球，发射时伴随着耀眼的闪光，具有一定的穿透力和高能量释放，能够在击中目标时释放出强烈的光芒，暂时使敌人失去视觉，同时产生轻微的物理冲击。",\
    "魔杖柄材料对魔杖弹道的影响":"蛛网材质的魔杖柄使得魔杖发射的弹药呈现出独特的网状弹道，能够在空中迅速扩散，形成一个网状的光波，捕捉和限制目标的移动。",\
    "魔杖弹道描述":"魔杖发射的光球在飞出后会迅速展开，形成一张独特的光之网，这张网能够在一定范围内扩散，不仅能够将光和热量覆盖至更广的区域，还能够在瞬间构建出一个光辉的屏障，用以捕捉或缓冲敌人的攻击。"\
    }\
    \'\'\'\
    '
    );
    gptWandResult.send(
      "【魔杖芯材料】为" + wandCoreMat + "，【魔杖柄材料】为" + wandStickMat
    );
    gptWandResult.onComplete = (response) => {
      let obj = JSON.parse(response);
      console.log(obj);
      console.log(obj.魔杖名称);
      console.log(obj.魔杖芯材料对魔杖弹药的影响);
      console.log(obj.魔杖弹药描述);
      console.log(obj.魔杖柄材料对魔杖弹道的影响);
      console.log(obj.魔杖弹道描述);
      this.wandName = obj.魔杖名称;
      this.wandMissile = obj.魔杖芯材料对魔杖弹药的影响 + obj.魔杖弹药描述;
      this.wandMissile = this.wandMissile.replace(/[\r\n]+/g, "");
      this.wandProjectile = obj.魔杖柄材料对魔杖弹道的影响 + obj.魔杖弹道描述;
      this.wandProjectile = this.wandProjectile.replace(/[\r\n]+/g, "");

      this.wandResultFin = true;

      //gameStatus = 'wandMaking.done';
    };
  }
}

class Weapon {
  weaponParams;
  damage;
  materials;
  shapeConfig;
  shapeForceArray;
  constructor(materials, weaponParams) {
    this.weaponParams = weaponParams;
    this.materials = [];
    for (let i = 0; i < materials.length; i++) {
      this.materials.push(materials[i]);
    }
    console.log();
    switch (this.weaponParams.shootingShape) {
      case "burst":
        this.damage = 50;
        break;
      case "point":
        this.damage = 40;
        break;
      case "trident":
        this.damage = 20;
    }

    let bulletTraceParams = weaponParams.bulletTrace;

    let fatherShapeConfig = JSON.parse(
      bulletSystem.presetConfig[bulletTraceParams.fatherShapeConfig]
    );
    let motherShapeConfig = JSON.parse(
      bulletSystem.presetConfig[bulletTraceParams.motherShapeConfig]
    );
    let fatherForceArray =
      bulletSystem.presetForceArray[bulletTraceParams.fatherShapeConfig];
    let motherForceArray =
      bulletSystem.presetForceArray[bulletTraceParams.motherShapeConfig];
    let fatherMultiplier = bulletTraceParams.fatherMultiplier;
    let motherMultiplier = bulletTraceParams.motherMultiplier;

    //console.log(bulletTraceParams);

    let targetShapeConfig, otherConfig, targetForceArray;

    if (
      bulletTraceParams.fatherShapeConfig == "twisted" ||
      bulletTraceParams.motherShapeConfig == "twisted"
    ) {
      targetShapeConfig = JSON.parse(bulletSystem.presetConfig["twisted"]);
      targetShapeConfig.number = Math.max(
        int(
          Math.random() *
            (fatherShapeConfig.number * fatherMultiplier +
              motherMultiplier.number * motherMultiplier) +
            Math.min(fatherShapeConfig.number, motherMultiplier.number)
        ),
        1
      );
      targetShapeConfig.waveInterval = Math.min(
        fatherShapeConfig.waveInterval,
        motherMultiplier.waveInterval
      );
      this.shapeConfig = targetShapeConfig;
      this.shapeForceArray = bulletSystem.presetForceArray["twisted"];
      return;
    }

    targetShapeConfig = fatherShapeConfig;
    if (fatherForceArray.length > motherForceArray.length) {
      targetShapeConfig = fatherShapeConfig;
      otherConfig = motherShapeConfig;
      targetForceArray = fatherForceArray;
    } else {
      targetShapeConfig = motherShapeConfig;
      otherConfig = fatherShapeConfig;
      targetForceArray = motherForceArray;
    }

    targetShapeConfig.speed =
      fatherMultiplier * targetShapeConfig.speed +
      motherMultiplier * otherConfig.speed;
    targetShapeConfig.scatter =
      fatherMultiplier * targetShapeConfig.scatter +
      motherMultiplier * otherConfig.scatter;
    targetShapeConfig.toCenterDistance =
      fatherMultiplier * targetShapeConfig.toCenterDistance +
      motherMultiplier * otherConfig.toCenterDistance;
    if (
      targetShapeConfig.targetShapeConfig == "randomLeftRight" ||
      otherConfig.targetShapeConfig == "randomLeftRight"
    ) {
      targetShapeConfig.targetShapeConfig = "randomLeftRight";
    }
    targetShapeConfig.number = Math.max(
      int(
        Math.random() *
          (targetShapeConfig.number * fatherMultiplier +
            otherConfig.number * motherMultiplier) +
          Math.min(targetShapeConfig.number, otherConfig.number)
      )
    );
    targetShapeConfig.waveInterval = Math.min(
      targetShapeConfig.waveInterval,
      otherConfig.waveInterval
    );
    this.shapeConfig = targetShapeConfig;
    //this.shapeConfig = fatherShapeConfig;//待定
    //this.shapeForceArray = fatherForceArray;
    this.shapeForceArray = targetForceArray;
  }

  static GetDefaultWeapon() {
    let weaponParams = {
      shootingShape: SHOOTING_SHAPE.point,
      shootingInterval: 400,
      bulletSpeedScale: 1,
      bulletSizeScale: 1,
      bulletTrace: {
        fatherMultiplier: 0.5,
        fatherShapeConfig: "zigzag",
        motherMultiplier: 0.5,
        motherShapeConfig: "fanScan",
      },
    };
    let res = new Weapon(["木头", "木头"], weaponParams);
    return res;
  }

  upgrade() {
    this.damage += int(Math.random() * 20 + 10);
  }

  getWeaponInfo() {
    let paramStr = "";
    for (let key in this.weaponParams) {
      paramStr += key + ":" + this.weaponParams[key] + ",\n  ";
    }
    let materialsStr = "";
    for (let i = 0; i < this.materials.length; i++) {
      materialsStr += this.materials[i] + ",\n  ";
    }
    let res = `Damage:\n  ${this.damage}\nMaterials:\n  ${this.materials}\nParams:\n  ${paramStr}`;
    return res;
  }
}

function setup() {
  new Canvas(1024, 1024);
  frameRate(60);

  // GUI
  gui = createGui();
  gameInstance = new GameInstance();
  gameInstance.setupGameInstance();
}

function draw() {
  lastDeltaTime = deltaTime;

  clear();
  background(20);
  drawGui();

  controller.shortcutInput();
  hud.show();

  //if(gameInstance.state == gameInstance.GAMEINSTANCE_STATE.PLAYING){
  if (gameInstance.state.checkTagField("gameState.playing")) {
    if (!hud.getWidgetVisible(hud.gamePanel)) {
      allSprites.visible = true;
      hud.createGamePanel();
    }
    if (hud.getWidgetVisible(hud.startMenu)) {
      hud.removeWidget(hud.startMenu);
    }
    if (hud.getWidgetVisible(hud.craftPanel)) {
      hud.removeWidget(hud.craftPanel);
    }
    if (hud.craftPanel != null) {
      hud.craftPanel.hide();
    }
    gameInstance.game();
  }

  //if(gameInstance.state == gameInstance.GAMEINSTANCE_STATE.START){
  if (gameInstance.state.checkTagField("gameState.start")) {
    if (!hud.getWidgetVisible(hud.startMenu)) {
      hud.createStartMenu();
    }
    if (hud.getWidgetVisible(hud.gameOverMenu)) {
      hud.removeWidget(hud.gameOverMenu);
    }
  }
  //else if(gameInstance.state == gameInstance.GAMEINSTANCE_STATE.GAME_OVER){
  else if (gameInstance.state.checkTagField("gameState.gameOver")) {
    if (!hud.getWidgetVisible(hud.gameOverMenu)) {
      hud.createGameOverMenu();
    }
    if (hud.getWidgetVisible(hud.gamePanel)) {
      hud.removeWidget(hud.gamePanel);
    }
  }
  //else if(gameInstance.state == gameInstance.GAMEINSTANCE_STATE.PAUSE){
  else if (gameInstance.state.checkTagField("gameState.pause")) {
    if (craftTable.state.checkTagField("craft.prepare")) {
      if (!hud.getWidgetVisible(hud.craftPanel)) {
        hud.createCraftPanel();
        allSprites.visible = false;
      }
      if (hud.getWidgetVisible(hud.gamePanel)) {
        hud.removeWidget(hud.gamePanel);
      }
    }
  }
}

class GameInstance {
  GAMEINSTANCE_STATE = {
    START: 0,
    PLAYING: 1,
    PAUSE: 2,
    RETRY: 3,
    GAME_OVER: 4,
  };

  controller;
  gameSetting;
  TagManager;
  state;
  hud;

  failtureTime;

  savedData = {
    inventory: null,
    playerLevel: 0,
  };

  constructor() {
    this.controller = new Controller();
    this.gameSetting = new GameSetting();
    this.hud = new HUD();
    this.tagManager = new TagManager();
  }

  setupGameInstance() {
    this.failtureTime = 0;

    hud = this.hud;
    controller = this.controller;
    gameSetting = this.gameSetting;
    tagManager = this.tagManager;

    /*
    let tagSettings = gameSetting.tagSettings;
    for(let i = 0; i < tagSettings.length; i++){
      tagManager.registerTag('root',tagSettings[i]);
    }
    */
    let tagSettings = gameSetting.tagSettings;
    for (let i = 0; i < tagSettings.length; i++) {
      tagManager.registerTag("root", tagSettings[i]);
    }
    this.state = tagManager.getTagByPath("gameState.start");

    //this.state = this.GAMEINSTANCE_STATE.START;
  }

  //开始游戏
  startGame() {
    //if(this.state == this.GAMEINSTANCE_STATE.START)
    if (this.state.checkTagField("gameState.start")) {
      noLoop();

      gpt
        .dialog([
          {
            role: "system",
            content: `以下需要你帮助我在p5.js和p5.play的基础上实现一个随机性游戏，请你用编程性语言回复我。设想你来到了一个神秘的世界，请以${Date.now()}随机种子，给出${MAX_MATERIALS.toString()}个不同的来自这个世界基础材料，其中前两个材料为比较高级的材料，请将这些材料以逗号的形式分隔，并用大括号包装，不加其它说明，内容为中文。`,
          },
          {
            role: "assistant",
            content: "{金箔,木棍,水球,火焰,黑土,暴风,电子,鱼骨}",
          },
          {
            role: "user",
            content: "格式正确，但内容不符合要求，请重新输入，不要多余的话。",
          },
        ])
        .then((res) => {
          console.log(res);
          materials = [];
          superiorObjectNames = [];

          let matches = res.match(/{(.*?)}/);
          if (matches != null) {
            if (matches.length >= 2) {
              materials = matches[1].split(",");
            } else {
              materials = matches[0].split(",");
            }
          } else {
            console.log("GPT : old matches is not valid.");
            let substrings = res.split(",");

            let regexWithColon = /: *"([^"]+)"/;
            let regexChineseOnly = /[\u4e00-\u9fa5]+/g;

            substrings.forEach((substring) => {
              substring = substring.trim();

              if (substring.includes(":")) {
                let match = substring.match(regexWithColon);
                if (match && match[1]) {
                  let chineseMatches = match[1].match(regexChineseOnly);
                  if (chineseMatches) {
                    chineseMatches.forEach((match) => materials.push(match));
                  }
                }
              } else {
                let chineseMatches = substring.match(regexChineseOnly);
                if (chineseMatches) {
                  chineseMatches.forEach((match) => materials.push(match));
                }
              }
            });
          }
          console.log(materials);
          superiorObjectNames.push(materials[0]);
          superiorObjectNames.push(materials[1]);
          materials.splice(0, 1);
          materials.splice(0, 1);
          console.log(materials, " and ", superiorObjectNames);

          // 初始化游戏
          //this.state = this.GAMEINSTANCE_STATE.PLAYING;
          this.state = tagManager.getTagByPath("gameState.playing");
          player = new Player();
          particleSystem = new ParticleSystem();
          bulletSystem = new BulletSystem();
          enemyFactory = new EnemyFactory();
          craftTable = new CraftTable();
          if (gameInstance.failtureTime > 0) {
            gameInstance.loadLastGameData();
          }

          loop();
        });

      /*
      let scenePrompt = "你是一个探险家，你在探索一个未知的世界，世界场景为"+noitaWorld+"。请给出这个场景的描述，这个场景中的一个角色以及其两个弱点（每个弱点不超过五个字），以及可以在这个场景中收集到的8个普通物品与2两个高级物品（物品名不超过五个字）。请根据以下json格式输出\
        {\"场景描述\":\"\"\
        \"角色名称\":\"\"\
        \"角色描述\":\"\"\
        \"角色弱点1\":\"\"\
        \"角色弱点2\":\"\"\
        \"物品1\":\"\"\
        \"物品2\:\"\"\
        \"物品3\":\"\"\
        \"物品4\":\"\"\
        \"物品5\":\"\"\
        \"物品6\":\"\"\
        \"物品7\":\"\"\
        \"物品8\":\"\"\
        \"高级物品9\":\"\"\
        \"高级物品10\":\"\"\
        \}";
      let gptAgent = new P5Spark();
      gptAgent.send(scenePrompt);
      gptAgent.onComplete = (response) => {
        console.log('11');
        console.log("GPTAgent:" + response);
        let obj;
        try {
          obj = JSON.parse(response);
          console.log(obj);
        // 现在可以访问对象中的任何属性，并将它们存储在变量中
          sceneDescription = obj.场景描述;
          enemyName = obj.角色名称; 
          enemyDescription = obj.角色描述;
          enemyWeaknesses = [];
          enemyWeaknesses.push(obj.角色弱点1);
          enemyWeaknesses.push(obj.角色弱点2);
          materials = [];
          superiorObjectNames = [];
          materials.push( obj.物品1);materials.push( obj.物品2);materials.push( obj.物品3);materials.push( obj.物品4);
          materials.push( obj.物品5);materials.push( obj.物品6);materials.push( obj.物品7);materials.push( obj.物品8);
          superiorObjectNames.push( obj.高级物品9);superiorObjectNames.push( obj.高级物品10);
          
          
          
        } catch (error) {
          console.log("parse error");
        }
        
          
        console.log(superiorObjectNames);
        console.log(materials);
        console.log(enemyWeaknesses);
        // 初始化游戏
        //this.state = this.GAMEINSTANCE_STATE.PLAYING;
        this.state = tagManager.getTagByPath("gameState.playing");
        player = new Player();
        particleSystem = new ParticleSystem();
        bulletSystem = new BulletSystem();
        bulletSystem.controlBulletWave('fanScan');
        enemyFactory = new EnemyFactory();
        craftTable = new CraftTable();
        if(gameInstance.failtureTime > 0){
          gameInstance.loadLastGameData();
        }

        loop();
      }
      */
    }
  }

  //游戏界面
  game() {
    if (player.hp <= 0) {
      this.gameOver();
      return;
    }

    if (player.shootingMode == SHOOTING_MODE.MANUAL) {
      // 瞄准线
      drawReticle();
    }

    // 敌人生成
    targetTimer++;
    let spawnInterval = int(100 / enemySpawnMultiplier);
    if (targetTimer % spawnInterval == 0) {
      //aliveEnemies.push(oneEnemy);

      let enemyGroup = enemyFactory.spawnEnemyGroup({ isCheating: false });
      aliveEnemies.push(...enemyGroup);
    }

    // 敌人
    for (let i = 0; i < aliveEnemies.length; i++) {
      let oneEnemy = aliveEnemies[i];
      oneEnemy.update();
      if (
        outOfBounds(
          oneEnemy.sprite.x,
          oneEnemy.sprite.y,
          -2 * oneEnemy.sprite.diameter,
          -2 * oneEnemy.sprite.diameter,
          width + 2 * oneEnemy.sprite.diameter,
          height + 2 * oneEnemy.sprite.diameter
        )
      ) {
        aliveEnemies[i].dead = true;
      }
    }

    for (let i = 0; i < aliveEnemies.length; i++) {
      let oneEnemy = aliveEnemies[i];
      if (oneEnemy.dead) {
        aliveEnemies.splice(i, 1);
        oneEnemy.sprite.remove();
        i--;
      }
    }

    enemySpawnMultiplier += 0.001;
    if (enemySizeMultiplier < 5) {
      enemySizeMultiplier += 0.001;
    }

    // 子弹
    for (let i = 0; i < player.bulletsFired.length; i++) {
      let oneBullet = player.bulletsFired[i];
      //oneBullet.update();
      if (
        outOfBounds(oneBullet.sprite.x, oneBullet.sprite.y, 0, 0, width, height)
      ) {
        player.bulletsFired.splice(i, 1);
        oneBullet.sprite.remove();
      } else if (oneBullet.hitCheck()) {
        player.bulletsFired.splice(i, 1);
        oneBullet.sprite.remove();
      }
    }

    bulletSystem.update();

    // 粒子系统
    particleSystem.update();

    // 主角
    player.update();
    // 掉落提示
  }

  pauseGame() {
    /*
    if(this.state == this.GAMEINSTANCE_STATE.PLAYING)
    {
      this.state = this.GAMEINSTANCE_STATE.PAUSE;
      if(enemyFactory != null)
      {
        clearInterval(enemyFactory.timerId);
      }
    }
    */

    if (this.state.checkTagField("gameState.playing")) {
      this.state = tagManager.getTagByPath("gameState.pause");
      if (enemyFactory != null) {
        clearInterval(enemyFactory.timerId);
      }
      if (bulletSystem != null) {
        bulletSystem.clearTimer();
      }
    }
  }

  resumeGame() {
    if (this.state.checkTagField("gameState.pause")) {
      this.state = tagManager.getTagByPath("gameState.playing");
      if (enemyFactory != null) {
        enemyFactory.setLevelUpTimer();
      }
    }
  }

  //游戏结束
  gameOver() {
    this.state = tagManager.getTagByPath("gameState.gameOver");
    for (let i = 0; i < aliveEnemies.length; i++) {
      let oneEnemy = aliveEnemies[i];
      oneEnemy.sprite.remove();
    }

    for (let i = 0; i < player.bulletsFired.length; i++) {
      let oneBullet = player.bulletsFired[i];
      oneBullet.sprite.remove();
    }
    bulletSystem.clearTimer();
    hud.gamePanel.clearItemsSprite();
    player.bulletsFired = [];
    aliveEnemies = [];
    player.sprite.x = width / 2;
    player.sprite.y = height / 2;
    targetTimer = 0;
    //    balloonSpawnMultiplier = 2;
    //    balloonSizeMultiplier = 2;
    enemySpawnMultiplier = 2;
    enemySizeMultiplier = 2;

    // 清除所有粒子
    for (let i = 0; i < particleSystem.particles.length; i++) {
      let oneParticle = particleSystem.particles[i];
      oneParticle.sprite.remove();
    }
    particleSystem.particles = [];

    enemyFactory.clearLevelUpTimer();

    // 清空掉落提示
    dropTipFunc = () => {};
    this.saveLastGameData();
    player.sprite.remove();
    player = null;
  }

  saveLastGameData() {
    // 保存游戏数据
    this.savedData.inventory = player.inventory;
    this.savedData.playerLevel = player.level;
    this.weaponParams = player.weaponParams;
  }

  loadLastGameData() {
    // 加载游戏数据
    player.inventory = this.savedData.inventory;
    player.inventory.items = [];
    player.inventory.maxWeaponsNum++;
    player.level = this.savedData.playerLevel;
    player.weaponParams = this.weaponParams;
  }
}

class Tag {
  tagName;
  tagPath;
  parentTag;
  childrenTags;
  constructor(tagPath) {
    let parts = tagPath.split(".").filter(Boolean);
    if (typeof tagPath !== "string") {
      throw new Error("tagPath must be a string");
    }

    this.tagPath = tagPath;
    this.tagName = parts[parts.length - 1];
    this.parentTag = null;
    this.childrenTags = [];
  }

  addChildTag(tag) {
    if (this.childrenTags.indexOf(tag) === -1) {
      this.childrenTags.push(tag);
    } else {
      throw new Error("childTag have been existed");
    }
  }

  checkTagField(targetField) {
    return this.tagPath.includes(targetField);
  }
}

class TagManager {
  tags;
  rootTag;
  noneTag;
  constructor() {
    this.tags = [];
    this.rootTag = new Tag("root");
    this.noneTag = new Tag("none");
    this.tags.push(this.rootTag);
  }

  registerTag(parentTagName, tagPath) {
    let parts = tagPath.split(".").filter(Boolean);
    if (parentTagName != "") {
      if (parts.indexOf("none") != -1) {
        throw new Error('tagPath can not contain "none"');
      }
      if (parts.indexOf("root") != -1) {
        throw new Error('tagPath can not contain "root"');
      }
    }

    let parentTag = this.getTagByName(parentTagName);
    if (parentTag == this.noneTag) {
      parentTag = this.rootTag;
    }
    for (let i = 0; i < parts.length; i++) {
      let oneTag = this.getTagByName(parts[i]);
      if (oneTag == this.noneTag) {
        let targetPath = parentTag.tagPath + "." + parts[i];
        oneTag = new Tag(targetPath);
        parentTag.addChildTag(oneTag);
        this.tags.push(oneTag);
      }
      oneTag.parentTag = parentTag;
      parentTag = oneTag;
    }
    this.adjustTags();
  }

  getTagByName(tagName) {
    for (let i = 0; i < this.tags.length; i++) {
      let tag = this.tags[i];
      if (tag.tagName == tagName) {
        return tag;
      }
    }
    return this.noneTag;
  }

  getTagByPath(tagPath) {
    let parts = tagPath.split(".").filter(Boolean);
    let root = parts[0];
    let index = 1;
    let oneTag = this.noneTag;
    for (let i = 0; i < this.tags.length; i++) {
      oneTag = this.tags[i];
      if (oneTag.tagName == root) {
        break;
      }
    }
    if (oneTag == this.noneTag) {
      console.error("can not find tagPath: " + tagPath);
      return this.noneTag;
    }

    for (let j = 0; j < oneTag.childrenTags.length; j++) {
      let childTag = oneTag.childrenTags[j];
      if (childTag.tagName == parts[index]) {
        oneTag = childTag;
        index++;
        j = -1;
        if (index == parts.length) {
          return oneTag;
        }
      }
    }

    console.error("can not find tag: " + tagPath);
    return this.noneTag;

    return this.noneTag;
  }

  checkTag(tagPath, targetTagName) {
    let targetTag = this.getTagByName(targetTagName);
    return targetTag.tagPath.includes(tagPath);
  }

  adjustTags() {
    let newTags = [];
    if (this.tags.length == 0) {
      return;
    }
    let rootTag = this.tags[0];
    let index = 0;
    newTags.push(rootTag);
    for (let i = 0; i < rootTag.childrenTags.length; i++) {
      newTags.push(rootTag.childrenTags[i]);
      if (i == rootTag.childrenTags.length - 1) {
        index++;
        if (index == newTags.length) {
          this.tags.length = newTags;
          return;
        }
        rootTag = newTags[index];
      }
    }
  }

  printAllTags() {
    console.log("printAllTags");
    for (let i = 0; i < this.tags.length; i++) {
      let oneTag = this.tags[i];
      console.log(i + ": " + oneTag.tagPath);
    }
  }
}

class GameSetting {
  playerLevelSetting = {
    baseMaxHp: 100,
    hpAddend: 50,
    baseDamage: 50,
    damageAddend: 10,
    baseLevelUpExp: 150,
    levelStep: 5, // 每5级显著提升一次

    baseLevelUpMultiplier: 1.1,
    stepMultiplierAddend: 0.5,
  };

  factoryLevelSetting = {
    baseEnemyHp: 120,
    hpAddend: 5,
    baseDamage: 15,
    damageAddend: 5,
    basedropExp: 5,
    dropExpAddend: 10,

    enemyLargenMultiplier: 1.5,
    baseLargenPossibility: 0.4,
    maxLargenPossibility: 0.7,
    largenPossibilityAddend: 0.008,

    baseMaxEnemyNum: 20,
    baseEnemyNumAddend: 2,
    levelUpTimeInterval: 10000,
  };

  tagSettings = [
    // 游戏状态
    "gameState.start",
    "gameState.playing",
    "gameState.pause",
    "gameState.retry",
    "gameState.gameOver",
    "gameState.gameOver.retry",
    "gameState.gameOver.exit",

    //工作台状态
    "craft",
    "craft.prepare",
    "craft.process",
    "craft.done",
  ];

  zigzagConfig =
    '{"type": "curve", "speed": "3", "scatter": "90", "number": "1", "toCenterDistance": "40", "centerPosition":"right", "waveInterval": "150"}';
  zigzagForceArray = [
    { targetFrame: 20, forceDirection: 1, intensity: 14 },
    { targetFrame: 40, forceDirection: 2, intensity: 14 },
    { targetFrame: 60, forceDirection: 2, intensity: 14 },
    { targetFrame: 80, forceDirection: 2, intensity: 14 },
    { targetFrame: 100, forceDirection: 2, intensity: 14 },
    { targetFrame: 120, forceDirection: 2, intensity: 14 },
    { targetFrame: 140, forceDirection: 2, intensity: 14 },
    { targetFrame: 160, forceDirection: 2, intensity: 14 },
    { targetFrame: 180, forceDirection: 2, intensity: 14 },
    { targetFrame: 200, forceDirection: 2, intensity: 14 },
    { targetFrame: 220, forceDirection: 2, intensity: 14 },
    { targetFrame: 240, forceDirection: 2, intensity: 14 },
  ];

  fanScanConfig =
    '{"type": "curve", "speed": "3", "scatter": "60", "number": "6", "toCenterDistance": "30", "centerPosition":"randomLeftRight", "waveInterval": "150"}';
  fanScanForceArray = [{ targetFrame: 50, forceDirection: 1, intensity: 14 }];

  twistedConfig =
    '{"type": "curve", "speed": "3", "scatter": "90", "number": "2", "toCenterDistance": "40", "centerPosition":"randomLeftRight", "waveInterval": "120"}';
  twistedForceArray = [
    { targetFrame: 20, forceDirection: 1, intensity: 14 },
    { targetFrame: 40, forceDirection: 2, intensity: 14 },
    { targetFrame: 60, forceDirection: 2, intensity: 14 },
    { targetFrame: 80, forceDirection: 2, intensity: 14 },
    { targetFrame: 100, forceDirection: 2, intensity: 14 },
    { targetFrame: 120, forceDirection: 2, intensity: 14 },
    { targetFrame: 140, forceDirection: 2, intensity: 14 },
    { targetFrame: 160, forceDirection: 2, intensity: 14 },
    { targetFrame: 180, forceDirection: 2, intensity: 14 },
    { targetFrame: 200, forceDirection: 2, intensity: 14 },
    { targetFrame: 220, forceDirection: 2, intensity: 14 },
    { targetFrame: 240, forceDirection: 2, intensity: 14 },
  ];

  splitConfig =
    '{"type": "curve", "speed": "5", "scatter": "90", "number": "3", "toCenterDistance": "40", "centerPosition":"randomLeftRight", "waveInterval": "80"}';
  splitForceArray = [
    {
      targetFrame: Math.floor(Math.random() * (60 - 30 + 1)) + 30,
      forceDirection: 1,
      intensity: 14,
    },
  ];

  materialsPrompt = [
    {
      role: "system",
      content: `以下需要你帮助我在p5.js和p5.play的基础上实现一个随机性游戏，请你用编程性语言回复我。设想你来到了一个神秘的世界，请以${Date.now()}随机种子，给出${MAX_MATERIALS.toString()}个不同的来自这个世界基础材料，请将这些材料以逗号的形式分隔，并用大括号包装，不加其它说明，内容为中文。`,
    },
    {
      role: "assistant",
      content: "{金箔,木棍,水球,火焰,黑土,暴风,电子,鱼骨}",
    },
    {
      role: "user",
      content: "格式正确，但内容不符合要求，请重新输入，不要多余的话。",
    },
  ];

  craftMoviePrompt =
    "你是一个魔杖制作师，你在库斯坦佐的魔杖工作坊里，正忙于一项前所未有的挑战：需要使用一种【魔杖芯材料】和一种【魔杖柄材料】制作一种材料。【魔杖芯材料】会影响魔杖弹药的属性与威力，【魔杖柄材料】会影响魔杖的弹道。请生成生成合成时的情景，加入一些细节生动的细节描写，提到一些神奇的工具，中间有一些曲折的过程。最终结果为成功。全程使用第二人称'你'指代魔杖制作师。\
  三引号内是一个成功的参考案例:\
  '''\
  你开始准备制作一根新魔杖，芯材料为熔岩，柄材料则来源于传说中的烈焰之剑。\
  你首先集中精力于熔岩，这个强大且不稳定的元素。普通的工具无法承受这种高温，于是你从仓库深处取出了一件神奇的工具：涅槃凤凰的羽毛镶嵌的钳子。只有这种被涅槃火焰锻造过的工具，才能安全地操纵这样的高温物质。你小心翼翼地将一小团熔岩从你的保险箱中取出。这保险箱是用龙息石打造的，唯一能够容纳并隔绝熔岩高温的物品。\
  随后，你把熔岩放入已经设置好的魔力场中，开始慢慢地用心灵之力塑形，让它逐渐成为你想要的芯材形态。这个过程充满了不确定性和危险，稍有不慎就可能导致爆炸。然而，在你的精心操作下，熔岩芯逐渐成形，发出令人着迷的橘红色光泽。\
  接下来是烈焰之剑柄的制作。这件传说中的武器，据说是在太古火神的熔炉中锻造而成，其中蕴含的力量无穷无尽。你从一位冒险家那里得到了这件珍贵的宝物，现在要将它融入魔杖之中。使用特制的魔法熔炉，你开始逐渐将烈焰之剑融解。这个过程异常困难，因为烈焰之剑抵抗着被融化的命运，几次差点让整个工作坊陷入火海。但通过你的巧妙控制和不懈坚持，终于得到了一条流动着像是火焰般的金属条。\
  将熔岩芯与烈焰之剑柄合而为一的那一刻，整个工作坊都被一道耀眼的光芒照亮。当一切光芒散去，你的面前现出了一根美丽而强大的魔杖。'''";

  craftResultPrompt =
    '你是一个魔杖制作师，需要使用一种【魔杖芯材料】和一种【魔杖柄材料】制作一种材料。【魔杖芯材料】会影响魔杖弹药的属性与威力（如不同属性的攻击，每次攻击威力大小，发射频率等），【魔杖柄材料】会影响魔杖的弹道（弹道可以参考直线，曲线，锥形，圆形等形态）。请生成魔杖的名称，魔杖弹药与弹道的描述，使用如下json格式（请勿输出```json的字符，直接以"{"开始）\
  {\
  "魔杖名称":""\
  "魔杖芯材料对魔杖弹药的影响"\
  "魔杖弹药描述":""\
  "魔杖柄材料对魔杖弹道的影响"\
  "魔杖弹道描述":""\
  }\
  以下三引号内为一个案例。\
  \'\'\'\
  USER:魔杖芯材料为闪光球，魔杖芯材料为蛛网\
  ASSISTANT:\
  {\
  "魔杖名称":"星光蛛语杖",\
  "魔杖芯材料对魔杖弹药的影响":"闪光球的映入使得魔杖发射的弹药拥有高能量的光辉，能够在漆黑的环境中造成强烈的照明效果，并具有致盲敌人的能力。",\
  "魔杖弹药描述":"魔杖发射的弹药类似于仿生的光球，发射时伴随着耀眼的闪光，具有一定的穿透力和高能量释放，能够在击中目标时释放出强烈的光芒，暂时使敌人失去视觉，同时产生轻微的物理冲击。",\
  "魔杖柄材料对魔杖弹道的影响":"蛛网材质的魔杖柄使得魔杖发射的弹药呈现出独特的网状弹道，能够在空中迅速扩散，形成一个网状的光波，捕捉和限制目标的移动。",\
  "魔杖弹道描述":"魔杖发射的光球在飞出后会迅速展开，形成一张独特的光之网，这张网能够在一定范围内扩散，不仅能够将光和热量覆盖至更广的区域，还能够在瞬间构建出一个光辉的屏障，用以捕捉或缓冲敌人的攻击。"\
  }\
  \'\'\'\
  ';

  constructor() {}
}

class EnemyFactory {
  enemyGroupCounter = 0;
  lastEnemysNum = 0;

  factoryLevel = 0;
  maxEnemysNum;
  enemyMaxHp;
  enemyDamage;
  largenPossibility;

  timerId;

  ENEMY_TYPE = {
    BOOM: "BOOM",
    DASH: "DASH",
    HANGING: "HANGING",
    AVOID: "AVOID",
  };

  ENEMY_GROUP_TYPE = {
    RANDOM: "RANDOM",
    LINE: "LINE",
    SURROUND: "SURROUND",
  };

  constructor() {
    this.factoryLevelSetting = gameSetting.factoryLevelSetting;
    this.enemyGroupCounter = 0;
    this.factoryLevel = 0;
    this.setLevelAttribute();
    this.setLevelUpTimer();
  }

  spawnEnemyGroup(params) {
    let res = [];

    if (!params.isCheating && aliveEnemies.length < this.maxEnemysNum * 0.66) {
      const keys = Object.keys(this.ENEMY_GROUP_TYPE);
      const randomIndex = Math.floor(Math.random() * keys.length);
      const randomKey = keys[randomIndex];
      let enemyGroupType = this.ENEMY_GROUP_TYPE[randomKey];
      let randomIt;
      let spawnNum =
        (this.maxEnemysNum - aliveEnemies.length) * Math.random(1.2, 1.5);
      this.enemyGroupCounter++;

      switch (enemyGroupType) {
        case this.ENEMY_GROUP_TYPE.RANDOM:
          for (let i = 0; i < spawnNum; i++) {
            let oneEnemy;
            let random = Math.random();
            if (random < 0.25) {
              oneEnemy = new AvoidEnemy();
            } else if (random < 0.5) {
              oneEnemy = new BoomEnemy();
            } else if (random < 0.75) {
              oneEnemy = new HangingEnemy();
            } else {
              oneEnemy = new DashEnemy();
            }
            res.push(oneEnemy);
          }
          break;
        case this.ENEMY_GROUP_TYPE.LINE:
          for (let i = 0; i < spawnNum; i++) {
            let oneEnemy;
            if (Math.random() < 0.5) {
              oneEnemy = new AvoidEnemy();
            } else {
              oneEnemy = new HangingEnemy();
            }
            res.push(oneEnemy);
          }

          randomIt = Math.random();
          for (let i = 0; i < res.length; i++) {
            let oneEnemy = res[i];
            if (randomIt < 0.25) {
              oneEnemy.sprite.x = i * 100;
              oneEnemy.sprite.y = 0;
            } else if (randomIt < 0.5) {
              oneEnemy.sprite.x = i * 100;
              oneEnemy.sprite.y = height;
            } else if (randomIt < 0.75) {
              oneEnemy.sprite.x = 0;
              oneEnemy.sprite.y = i * 100;
            } else {
              oneEnemy.sprite.x = width;
              oneEnemy.sprite.y = i * 100;
            }
          }
          break;
        case this.ENEMY_GROUP_TYPE.SURROUND:
          for (let i = 0; i < spawnNum; i++) {
            let oneEnemy;
            if (Math.random() < 0.5) {
              oneEnemy = new HangingEnemy();
            } else {
              oneEnemy = new BoomEnemy();
            }
            res.push(oneEnemy);
          }

          randomIt = Math.random();
          let angleStart = randomIt * TWO_PI;
          let localDistance = Math.min(width, height) / 2.5;
          for (let i = 0; i < res.length; i++) {
            let oneEnemy = res[i];
            let angleOne = angleStart + (i * TWO_PI) / res.length;
            oneEnemy.sprite.x = width / 2 + Math.sin(angleOne) * localDistance;
            oneEnemy.sprite.y = height / 2 + Math.cos(angleOne) * localDistance;
          }
          break;
      }
    } else {
      let enemySpawnCount = params.enemySpawnCount;
      let enemyType = params.enemyType;
      let enemyGroupType = params.enemyGroupType;
      for (let i = 0; i < enemySpawnCount; i++) {
        let oneEnemy = this.createEnemy(enemyType);
        res.push(oneEnemy);
      }
    }
    for (let i = 0; i < res.length; i++) {
      let oneEnemy = res[i];
      oneEnemy.damage = this.enemyDamage;
      oneEnemy.hp = this.enemyMaxHp;
      let randomIt = Math.random();
      if (randomIt < this.largenPossibility) {
        let largenSize =
          Math.random() * this.factoryLevelSetting.enemyLargenMultiplier + 1;
        oneEnemy.sprite.diameter = oneEnemy.sprite.diameter * largenSize;
        oneEnemy.dropExpAddend *= largenSize;
        oneEnemy.damage *= largenSize;
        oneEnemy.hp *= largenSize;
        oneEnemy.velocity[0] = oneEnemy.velocity[0] / largenSize;
        oneEnemy.velocity[1] = oneEnemy.velocity[1] / largenSize;
      }
    }
    return res;
  }

  createEnemy(enemyType) {
    if (enemyType == this.ENEMY_TYPE.AVOID) {
      return new AvoidEnemy();
    } else if (enemyType == this.ENEMY_TYPE.BOOM) {
      return new BoomEnemy();
    } else if (enemyType == this.ENEMY_TYPE.HANGING) {
      return new HangingEnemy();
    } else {
      console.log("未知敌人类型");
      return null;
    }
  }

  setLevelAttribute() {
    let factoryLevelSetting = this.factoryLevelSetting;
    this.maxEnemysNum =
      factoryLevelSetting.baseMaxEnemyNum +
      factoryLevelSetting.baseEnemyNumAddend * this.factoryLevel;
    this.enemyDamage =
      factoryLevelSetting.baseDamage +
      factoryLevelSetting.damageAddend * this.factoryLevel;
    this.enemyMaxHp =
      factoryLevelSetting.baseEnemyHp +
      factoryLevelSetting.hpAddend * this.factoryLevel;
    let largenPossibility =
      factoryLevelSetting.baseLargenPossibility +
      factoryLevelSetting.largenPossibilityAddend * this.factoryLevel;
    this.largenPossibility = Math.min(
      factoryLevelSetting.maxLargenPossibility,
      largenPossibility
    );
  }

  setLevelUpTimer() {
    let intervalTime = this.factoryLevelSetting.levelUpTimeInterval;
    this.timerId = setInterval(() => {
      if (player.level > this.factoryLevel) {
        this.factoryLevel++;
      }
      this.factoryLevel++;
      console.log("factory upgrates.", this.factoryLevel);
      this.setLevelAttribute();
    }, intervalTime);
  }

  clearLevelUpTimer() {
    if (this.timerId != -1) {
      clearInterval(this.timerId);
    }
  }
}

class GameClocker {
  static onPause = false;
  static startTime = 0;
  static currentTime = 0;
  static lastTime = 0;
  static scheduledEvevtPoints = [];

  static start() {
    GameClocker.startTime = millis();
    GameClocker.onPause = false;
  }

  static update() {
    if (!this.onPause) {
      GameClocker.currentTime = millis();
      GameClocker.lastTime = GameClocker.currentTime;

      for (let i = 0; i < GameClocker.ScheduledEvevtPoints.length; i++) {
        let onePoint = GameClocker.ScheduledEvevtPoints[i];
        let timeSeconds = 1000 * (onePoint.time - GameClocker.currentTime);
        if (onePoint.time == timeSeconds) {
          onePoint.callback();
          this.ScheduledEvevtPoints.splice(i, 1);
          i--;
        }
      }
    }
  }

  static addScheduledEvent(time, callback) {
    GameClocker.scheduledEvevtPoints.push({ time, callback });
  }
}

class HUD {
  startMenu;
  settingMenu;
  commandBox;
  inventoryPanel;
  craftPanel;
  levelUpPanel;
  gameOverMenu;
  gamePanel;
  widgets;
  spareWidgets;
  constructor() {
    this.widgets = [];
    this.spareWidgets = [];
  }

  createStartMenu() {
    if (this.startMenu == null) {
      this.startMenu = new StartMenu();
    }
    if (!this.widgets.includes(this.startMenu)) {
      this.widgets.push(this.startMenu);
    }
    return this.startMenu;
  }

  createGamePanel() {
    if (this.gamePanel == null) {
      this.gamePanel = new GamePanel();
    }
    if (!this.widgets.includes(this.gamePanel)) {
      this.widgets.push(this.gamePanel);
    }
    this.gamePanel.refresh();
    this.gamePanel.refreshItemsSprite();
    return this.gamePanel;
  }

  createSettingMenu() {}

  createLevelUpPanel() {
    if (this.levelUpPanel == null) {
      this.levelUpPanel = new LevelUpPanel();
    }
    if (!this.widgets.includes(this.levelUpPanel)) {
      this.widgets.push(this.levelUpPanel);
    }
    this.levelUpPanel.refresh();
    return this.levelUpPanel;
  }

  createCraftPanel() {
    if (this.craftPanel == null) {
      this.craftPanel = new CraftPanel();
    }
    if (!this.widgets.includes(this.craftPanel)) {
      this.widgets.push(this.craftPanel);
    }
    this.craftPanel.refresh();
    return this.craftPanel;
  }

  createGameOverMenu() {
    if (this.gameOverMenu == null) {
      this.gameOverMenu = new GameOverMenu();
    }
    if (!this.widgets.includes(this.gameOverMenu)) {
      this.widgets.push(this.gameOverMenu);
    }
    return this.gameOverMenu;
  }

  removeWidget(widget) {
    let index = this.widgets.indexOf(widget);
    widget.hide();
    this.widgets.splice(index, 1);
    this.spareWidgets.push(widget);
    /*
    switch(widget){
      case this.startMenu:
        this.startMenu = null; 
        break;
      case this.gamePanel:
        this.gamePanel = null;
        break;
      case this.settingMenu:
        this.settingMenu = null;
        break;
      case this.commandBox:
        this.commandBox = null;
        break;
      case this.inventoryPanel:
        this.inventoryPanel = null;
        break;
      case this.levelUpPanel:
        this.levelUpPanel = null;
        break;
      case this.gameOverMenu:
        this.gameOverMenu = null;
        break;
    }
    */
    console.log("remove widget", widget, " then :", this.widgets);
  }

  show() {
    let widget = this.widgets[this.widgets.length - 1];
    if (widget != null) {
      widget.show();
    }
    for (let i = 0; i < this.spareWidgets; i++) {
      let oneWidget = spareWidgets[i];
      if (oneWidget.hide) {
        oneWidget.hide();
      }
    }
  }

  getWidgetVisible(widget) {
    return this.widgets.indexOf(widget) != -1;
  }
}

class StartMenu {
  startButton;
  //settingButton;
  childWidgets;
  childWidgetsPosition;
  constructor() {
    this.childWidgets = [];
    this.childWidgetsPosition = [];
    this.startButton = createButton(
      "Start",
      width / 2 - 100,
      height / 2,
      200,
      50
    );
    this.startButton.setStyle("fillBg", color("#202020"));
    this.startButton.setStyle("fillLabel", color("#FFFFFF"));
    this.startButton.visible = false;

    /*
    this.settingButton = createButton(
      "Setting",
      width / 2 - 100,
      height / 2 + 80,
      200,
      50
    );
    this.settingButton.setStyle("fillBg", color("#202020"));
    this.settingButton.setStyle("fillLabel", color("#FFFFFF"));
    this.settingButton.visible = false;
    */

    this.childWidgets.push(this.startButton);
    //this.childWidgets.push(this.settingButton);
    this.childWidgetsPosition.push([this.startButton.x, this.startButton.y]);
    //this.childWidgetsPosition.push([this.settingButton.x,this.settingButton.y]);
    //this.childWidgetsPosition.push(this.settingButton);

    this.startButton.onRelease = () => {
      gameInstance.startGame();
    };

    /*
    this.settingButton.onRelease=() => {
      console.log("setting");
    };
    */
  }

  show() {
    push();
    fill(255);
    fill("white");
    textSize(50);
    textAlign(CENTER);
    text("Start Menu", width / 2, height / 2 - 350); // 位置
    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      let position = this.childWidgetsPosition[i];
      oneItem.x = position[0];
      oneItem.y = position[1];
      oneItem.visible = true;
    }
  }

  hide() {
    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      oneItem.x = 0;
      oneItem.y = 0;
      oneItem.visible = false;
    }
  }

  destroy() {
    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      oneItem.visible = false;
      this.childWidgets.splice(i, 1);
    }
    this.childWidgets = [];
    if (this.startButton != null) {
      this.startButton = null;
    }
    /*
    if(this.settingButton != null){
      this.settingButton = null;
    }
    */
  }
}
class LevelUpPanel {
  items = [];
  weapons = [];
  selectedWeapon;

  // widget
  craftButton;
  exitButton;
  itemTogglePool = [];
  weaponTogglePool = [];

  //调整位置用
  childWidgets = [];
  childWidgetsPosition = [];

  constructor() {
    this.craftButton = createButton(
      "Crafting",
      width / 2 - 210,
      height / 2 + 300,
      200,
      50
    );
    this.craftButton.setStyle("fillBg", color("#202020"));
    this.craftButton.setStyle("fillLabel", color("#FFFFFF"));
    this.craftButton.visible = false;
    this.craftButton.onRelease = () => {
      player.inventory.craft();
    };

    this.exitButton = createButton(
      "Give Up",
      width / 2 + 10,
      height / 2 + 300,
      200,
      50
    );
    this.exitButton.setStyle("fillBg", color("#202020"));
    this.exitButton.setStyle("fillLabel", color("#FFFFFF"));
    this.exitButton.visible = false;
    this.exitButton.onRelease = () => {
      gameInstance.resumeGame();
    };

    this.childWidgets.push(this.craftButton);
    this.childWidgets.push(this.exitButton);
    this.childWidgetsPosition.push([this.craftButton.x, this.craftButton.y]);
    this.childWidgetsPosition.push([this.exitButton.x, this.exitButton.y]);

    this.refresh();
  }

  refresh() {
    this.items = player.inventory.items;
    this.weapons = player.inventory.weapons;
    for (let i = this.itemTogglePool.length; i < MAX_MATERIALS; i++) {
      let x = width / 2 - 200 + (i % 4) * 100;
      let y = height / 2 - 100 + int(i / 4) * 100;
      let itemToggle = createToggle("空", x, y, 100, 50);
      this.itemTogglePool.push(itemToggle);
      itemToggle.visible = false;

      this.childWidgets.push(itemToggle);
      this.childWidgetsPosition.push([itemToggle.x, itemToggle.y]);
    }
    for (
      let i = this.weaponTogglePool.length;
      i < player.inventory.maxWeaponsNum;
      i++
    ) {
      let x = width / 2 - 180 + (i % 4) * 90;
      let y = height / 2 - 210;
      let weaponToggle = createToggle("空", x, y, 90, 90);
      this.weaponTogglePool.push(weaponToggle);
      weaponToggle.visible = false;

      this.childWidgets.push(weaponToggle);
      this.childWidgetsPosition.push([weaponToggle.x, weaponToggle.y]);
    }

    for (let i = 0; i < MAX_MATERIALS; i++) {
      let oneItemToggle = this.itemTogglePool[i];
      if (i < this.items.length) {
        oneItemToggle.label = this.items[i];
      } else {
        oneItemToggle.label = "空";
      }
    }

    this.weapons = player.inventory.weapons;
    for (let i = 0; i < player.inventory.maxWeaponsNum; i++) {
      let weaponToggle = this.weaponTogglePool[i];
      if (i < this.weapons.length) {
        weaponToggle.label = `魔杖${i}`;
      } else {
        weaponToggle.label = "空";
      }
    }
  }

  show() {
    push();
    fill(255);
    fill("white"); // 黑色
    textSize(50);
    textAlign(CENTER);
    text("Backpack Page", width / 2, height / 2 - 350); // 位置

    this.refresh();

    this.craftButton.visible = true;
    this.exitButton.visible = true;
    for (let i = 0; i < this.itemTogglePool.length; i++) {
      this.itemTogglePool[i].visible = true;
    }

    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      this.weaponTogglePool[i].visible = true;
    }

    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      let position = this.childWidgetsPosition[i];
      oneItem.x = position[0];
      oneItem.y = position[1];
    }

    player.inventory.chosenItems = [];
    for (let i = 0; i < this.items.length; i++) {
      if (this.itemTogglePool[i].val == true) {
        player.inventory.addChosenItem(this.itemTogglePool[i].label);
      }
    }

    for (let i = 0; i < this.weapons.length; i++) {
      if (
        this.weaponTogglePool[i].val === true &&
        this.selectedWeapon != this.weapons[i]
      ) {
        this.selectedWeapon = this.weapons[i];
        for (let j = 0; j < this.weapons.length; j++) {
          if (i != j) {
            this.weaponTogglePool[j].val = false;
          }
        }
      }
    }

    if (this.selectedWeapon == null) {
      this.weaponTogglePool[0].val = true;
      this.selectedWeapon = this.weapons[0];
    }

    fill(255);
    textSize(20);
    textAlign(LEFT);
    text(this.selectedWeapon.getWeaponInfo(), 0, height / 2);

    pop();
  }

  hide() {
    for (let i = 0; i < this.itemTogglePool.length; i++) {
      let oneItemToggle = this.itemTogglePool[i];
      oneItemToggle.visible = false;
      oneItemToggle.val = false;
    }
    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      let oneItemToggle = this.weaponTogglePool[i];
      oneItemToggle.visible = false;
      oneItemToggle.val = false;
    }
    this.craftButton.visible = false;
    this.exitButton.visible = false;

    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      oneItem.visible = false;
      oneItem.x = 0;
      oneItem.y = 0;
    }
  }

  getItemValidToggleNum() {
    let res = 0;
    if (this.itemTogglePool.length == 0) {
      return -1;
    }
    for (let i = 0; i < this.itemTogglePool.length; i++) {
      if (this.itemTogglePool[i].label != "空") {
        res++;
      }
    }
    return res;
  }

  getWeaponValidToggleNum() {
    let res = 0;
    if (this.weaponTogglePool.length != this.weaponTogglePool.length) {
      return -1;
    }
    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      if (this.weaponTogglePool[i].label != "空") {
        res++;
      }
    }
    return res;
  }

  destroy() {
    for (let i = 0; i < this.itemTogglePool.length; i++) {
      let oneItem = this.itemTogglePool[i];
      oneItem.visible = false;
      this.itemTogglePool.splice(i, 1);
    }

    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      let oneItem = this.weaponTogglePool[i];
      oneItem.visible = false;
      this.weaponTogglePool.splice(i, 1);
    }
    this.itemTogglePool = [];
    this.weaponTogglePool = [];

    this.craftButton.visible = false;
    this.exitButton.visible = false;
    //this.craftButton.remove();
    //this.exitButton.remove();
    this.craftButton = null;
    this.exitButton = null;
  }
}
class GamePanel {
  weapons = [];
  selectedWeapon;

  weaponTogglePool = [];
  itemsSpriteGroup = new Group();

  constructor() {
    this.refresh();
    this.itemsSpriteGroup.collider = "none";
    this.itemsSpriteGroup.textSize = 20;
    this.itemsSpriteGroup.width = 120;
    this.itemsSpriteGroup.height = 40;
  }

  refresh() {
    this.weapons = player.inventory.weapons;
    this.selectedWeapon = player.inventory.currentWeapon;

    for (
      let i = this.weaponTogglePool.length;
      i < player.inventory.maxWeaponsNum;
      i++
    ) {
      let x = i * 90;
      let y = height - 90;
      let weaponToggle = createToggle("空", x, y, 90, 90);
      this.weaponTogglePool.push(weaponToggle);
      weaponToggle.visible = false;
    }

    for (let i = 0; i < player.inventory.maxWeaponsNum; i++) {
      let weaponToggle = this.weaponTogglePool[i];
      if (i < this.weapons.length) {
        weaponToggle.label = `魔杖${i}`;
      } else {
        weaponToggle.label = "空";
      }
    }
  }

  show() {
    push();
    fill(255);
    // 添加黑色的文字表示这是一个页面

    this.itemsSpriteGroup.visible = true;
    this.refresh();

    let levelUpExp = player.levelUpExp;

    let hpBarWidth = map(player.hp, 0, player.maxHp, 0, width);
    noStroke();
    fill(255, 0, 0);
    rect(0, 0, hpBarWidth, 10);

    let levelBarWidth = map(player.exp, 0, levelUpExp, 0, width);
    noStroke();
    fill(255, 255, 0);
    rect(0, 10, levelBarWidth, 10);

    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      this.weaponTogglePool[i].visible = true;
    }

    if (this.selectedWeapon == null) {
      this.selectedWeapon = this.weapons[0];
    }

    for (let i = 0; i < this.weapons.length; i++) {
      if (this.selectedWeapon == this.weapons[i]) {
        this.weaponTogglePool[i].val = true;
        for (let j = 0; j < this.weapons.length; j++) {
          if (i != j) {
            this.weaponTogglePool[j].val = false;
          }
        }
      }
    }

    /*
    for (let i = 0; i < this.weapons.length; i++) {
      let weaponToggle = this.weaponTogglePool[i];
      if (this.weaponTogglePool[i].val === true&&this.selectedWeapon != this.weapons[i]) {
        this.selectedWeapon = this.weapons[i];
        for(let j = 0; j < this.weapons.length; j++){
          this.weaponTogglePool[j].val = false;
        }
      }
    }
    */

    fill(40);
    textSize(50);
    textAlign(CENTER);
    let maxEnemysNum = enemyFactory.maxEnemysNum;
    let enemyGroupStr = `你已经坚守了${enemyFactory.enemyGroupCounter}波`; //\n ${aliveEnemies.length}/${maxEnemysNum}\n ${player.level}/${enemyFactory.factoryLevel}
    text(enemyGroupStr, width / 2, height / 2);
    pop();
  }

  hide() {
    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      let oneItemToggle = this.weaponTogglePool[i];
      oneItemToggle.visible = false;
      oneItemToggle.val = false;
    }
    this.itemsSpriteGroup.visible = false;
  }

  destroy() {
    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      let oneItem = this.weaponTogglePool[i];
      oneItem.visible = false;
      this.weaponTogglePool.splice(i, 1);
    }
    this.weaponTogglePool = [];
  }

  getWeaponValidToggleNum() {
    let res = 0;
    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      if (this.weaponTogglePool[i].label != "空") {
        res++;
      }
    }
    return res;
  }

  collect(location) {
    if (this.itemsSpriteGroup.amount < 8) {
      let o = new this.itemsSpriteGroup.Sprite();
      o.x = location[0];
      o.y = location[1];
      let i = this.itemsSpriteGroup.length - 1;
      o.moveTo(
        width - int(4 - (i % 4)) * o.width + o.width / 2,
        height - o.height * (1 - int(i / 4)) - o.height / 2,
        60
      );

      o.text = player.inventory.items[i];

      if (superiorObjectNames.indexOf(o.text) != -1) {
        o.color = "yellow";
        o.type = "special";
      } // 2高级物品
      else {
        o.color = "pink";
      } // 8物品
    }
  }

  refreshItemsSprite() {
    let index = 0;
    for (let i = 0; i < this.itemsSpriteGroup.amount; i++) {
      let oneItemSprite = this.itemsSpriteGroup[i];
      if (player.inventory.items.indexOf(oneItemSprite.text) == -1) {
        oneItemSprite.visible = false;
        this.itemsSpriteGroup.remove(oneItemSprite);
        oneItemSprite.remove();
        i--;
      } else {
        oneItemSprite.x =
          width -
          int(4 - (index % 4)) * oneItemSprite.width +
          oneItemSprite.width / 2;
        oneItemSprite.y =
          height -
          oneItemSprite.height * (1 - int(index / 4)) -
          oneItemSprite.height / 2;
        index++;
      }
    }
  }

  clearItemsSprite() {
    this.itemsSpriteGroup.removeAll();
  }
}
class GameOverMenu {
  retryButton;
  exitButton;
  childWidgets = [];
  childWidgetsPosition = [];

  constructor() {
    this.retryButton = createButton(
      "Retry",
      width / 2 - 100,
      height / 2,
      200,
      50
    );
    this.retryButton.setStyle("fillBg", color("#202020"));
    this.retryButton.setStyle("fillLabel", color("#FFFFFF"));
    this.retryButton.visible = false;

    this.exitButton = createButton(
      "NewGame",
      width / 2 - 100,
      height / 2 + 80,
      200,
      50
    );
    this.exitButton.setStyle("fillBg", color("#202020"));
    this.exitButton.setStyle("fillLabel", color("#FFFFFF"));
    this.exitButton.visible = false;

    this.childWidgets.push(this.retryButton);
    this.childWidgets.push(this.exitButton);
    this.childWidgetsPosition.push([this.retryButton.x, this.retryButton.y]);
    this.childWidgetsPosition.push([this.exitButton.x, this.exitButton.y]);

    this.retryButton.onRelease = () => {
      //gameInstance.state = gameInstance.GAMEINSTANCE_STATE.START;
      gameInstance.state = tagManager.getTagByPath("gameState.start");
      gameInstance.failtureTime++;
    };

    this.exitButton.onRelease = () => {
      //gameInstance.state = gameInstance.GAMEINSTANCE_STATE.START;
      gameInstance.state = tagManager.getTagByPath("gameState.start");
      gameInstance.failtureTime = 0;
    };
  }

  show() {
    push();
    fill(255);
    // 添加黑色的文字表示这是一个页面
    fill("white");
    textSize(50);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2 - 350); // 位置
    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      oneItem.visible = true;
      let position = this.childWidgetsPosition[i];
      oneItem.x = position[0];
      oneItem.y = position[1];
    }
  }

  hide() {
    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      oneItem.visible = false;
      oneItem.x = 0;
      oneItem.y = 0;
    }
  }

  destroy() {
    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      oneItem.visible = false;
      this.childWidgets.splice(i, 1);
    }
    this.childWidgets = [];
    if (this.retryButton != null) {
      this.retryButton = null;
    }
    if (this.exitButton != null) {
      this.exitButton = null;
    }
  }
}
class CraftPanel {
  vwm;
  buttonSkip;
  buttonWandMake;
  objectsBoxGroup;
  wandCoreArea;
  wandStickArea;
  wandEnhanceArea;

  wandMovieText;
  wandMovieFin;
  wandMovieTextPointer;

  wandCoreObject;
  wandStickObject;
  wandName;
  wandMissile;
  wandProjectile;
  wandCoreMat;
  wandStickMat;
  wandCoreSprite;
  wandStickSprite;

  backgroundLightness;

  //调整位置用
  childWidgets = [];
  childWidgetsPosition = [];

  constructor() {
    //this.background = createSprite(width/2, height/2, width, height);
    //this.background.collider = "none";

    this.buttonSkip = createButton("Close", width - 200, height - 50, 90, 40);
    this.buttonSkip.onRelease = () => {
      player.inventory.removeChosenItem();
      hud.gamePanel.refreshItemsSprite();
      gameInstance.resumeGame();
    };
    this.buttonWandMake = createButton(
      "Make",
      width - 300,
      height - 50,
      90,
      40
    );
    this.buttonWandMake.onRelease = () => {
      craftTable.state = tagManager.getTagByPath("craft.process");
      this.vwm.VWMsetup();
      this.wandMovieTextPointer = 0;
      craftTable.craft();
    };
    this.buttonWandMake.setStyle({
      fillBg: color("#FF0000"),
      fillBgHover: color("#AA0000"),
    });
    this.buttonWandMake.visible = true;

    this.backgroundLightness = 235;

    this.childWidgets.push(this.buttonWandMake);
    this.childWidgets.push(this.buttonSkip);
    this.childWidgetsPosition.push([
      this.buttonWandMake.x,
      this.buttonWandMake.y,
    ]);
    this.childWidgetsPosition.push([this.buttonSkip.x, this.buttonSkip.y]);

    this.wandCoreArea = new Sprite(0.28 * width, 0.5 * height, 200);
    this.wandCoreArea.color = "white";
    this.wandCoreArea.textColor = "white";
    this.wandCoreArea.text = "\n\n\n\n\n\n\n\n魔杖芯材料\n（影响弹药）";
    this.wandCoreArea.textSize = 30;
    this.wandCoreArea.overlaps(allSprites);

    this.wandStickArea = new Sprite(0.72 * width, 0.5 * height, 200);
    this.wandStickArea.color = "white";
    this.wandStickArea.textColor = "white";
    this.wandStickArea.text = "\n\n\n\n\n\n\n\n魔杖柄材料\n（影响弹道）";
    this.wandStickArea.textSize = 30;
    this.wandStickArea.overlaps(allSprites);

    this.objectsBoxGroup = new Group();
    this.objectsBoxGroup.color = "pink";
    this.objectsBoxGroup.w = width / 6;
    this.objectsBoxGroup.h = 50;
    this.objectsBoxGroup.overlaps(allSprites);
    this.objectsBoxGroup.text = (i) => i;
    this.objectsBoxGroup.id = (i) => i;
    this.objectsBoxGroup.type = "normal"; // normal object or special object
    this.objectsBoxGroup.rotationLock = true;

    this.refresh();
  }

  refresh() {
    this.objectsBoxGroup.remove();
    this.items = player.inventory.items;
    for (let i = this.objectsBoxGroup.amount; i < this.items.length; i++) {
      let o = new this.objectsBoxGroup.Sprite();
      o.moveTo(100 + i * 100, height - 100, 30);
      o.textSize = 20;
      o.text = this.items[i];
      console.log(o.text);
      if (superiorObjectNames.indexOf(o.text) != -1) {
        o.color = "yellow";
        o.type = "special";
      } // 2高级物品
      else {
        o.color = "pink";
      } // 8物品
    }

    this.wandCoreObject = -1;
    this.wandStickObject = -1;
    this.wandName = "";
    this.wandMissile = "";
    this.wandProjectile = "";
    this.wandCoreMat = "";
    this.wandStickMat = "";

    this.wandMovieText = "";
    this.wandMovieFin = false;
    this.wandMovieTextPointer = 0;

    this.vwm = new VisualWandMaking();
  }

  show() {
    push();
    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      oneItem.visible = true;
      let position = this.childWidgetsPosition[i];
      oneItem.x = position[0];
      oneItem.y = position[1];
    }

    if (
      craftTable.state.checkTagField("craft.prepare") ||
      craftTable.state.checkTagField("craft.done")
    ) {
      this.drawPanel();
    } else if (craftTable.state.checkTagField("craft.process")) {
      this.drawProcess();
    }
  }

  drawPanel() {
    this.wandStickArea.visible = true;
    this.wandCoreArea.visible = true;
    this.buttonSkip.visible = true;
    this.buttonWandMake.visible = true;
    for (let i = 0; i < this.objectsBoxGroup.amount; i++) {
      this.objectsBoxGroup[i].visible = true;
      this.objectsBoxGroup[i].overlaps(allSprites);
    }
    for (
      let i = 0;
      i < this.objectsBoxGroup.amount;
      i++ // moving objects
    ) {
      if (this.objectsBoxGroup[i].mouse.hovering()) mouse.cursor = "grab";
      else mouse.cursor = "default";
      if (this.objectsBoxGroup[i].mouse.dragging()) {
        this.objectsBoxGroup[i].moveTo(mouse.x, mouse.y, 50);
        craftTable.state = tagManager.getTagByPath("craft.prepare");
      } else {
        if (
          dist(
            this.objectsBoxGroup[i].x,
            this.objectsBoxGroup[i].y,
            this.wandCoreArea.x,
            this.wandCoreArea.y
          ) < this.wandCoreArea.r
        ) {
          if (this.wandCoreObject !== -1) {
            this.objectsBoxGroup[this.wandCoreObject].x =
              100 + this.wandCoreObject * 100;
            this.objectsBoxGroup[this.wandCoreObject].y = height - 100;
          }
          this.wandCoreObject = i;
          this.objectsBoxGroup[i].x = this.wandCoreArea.x;
          this.objectsBoxGroup[i].y = this.wandCoreArea.y;
          this.wandCoreSprite = this.objectsBoxGroup[i];
          craftTable.wandCore = this.objectsBoxGroup[i].text;
          player.inventory.addChosenItem(this.objectsBoxGroup[i].text);
          this.wandCoreMat = this.objectsBoxGroup[i].text;
        } else if (
          dist(
            this.objectsBoxGroup[i].x,
            this.objectsBoxGroup[i].y,
            this.wandStickArea.x,
            this.wandStickArea.y
          ) < this.wandStickArea.r
        ) {
          if (this.wandStickObject !== -1) {
            this.objectsBoxGroup[this.wandStickObject].x =
              100 + this.wandStickObject * 100;
            this.objectsBoxGroup[this.wandStickObject].y = height - 100;
          }
          this.wandStickObject = i;
          this.objectsBoxGroup[i].x = this.wandStickArea.x;
          this.objectsBoxGroup[i].y = this.wandStickArea.y;
          this.wandStickSprite = this.objectsBoxGroup[i];
          craftTable.wandStick = this.objectsBoxGroup[i].text;
          player.inventory.addChosenItem(this.objectsBoxGroup[i].text);
          this.wandStickMat = this.objectsBoxGroup[i].text;
        } else {
          this.objectsBoxGroup[i].x =
            width / 2 +
            ((i % 4) - 2) * this.objectsBoxGroup.w * 1.2 +
            this.objectsBoxGroup.w * 0.6;
          this.objectsBoxGroup[i].y = height / 2 + 100 * int(i / 4) + 250;
        }
      }
    }

    if (craftTable.state.checkTagField("craft.done")) {
      if (this.wandStickSprite != null && this.wandCoreSprite != null) {
        this.wandStickSprite.remove();
        this.wandCoreSprite.remove();
        this.wandStickSprite = null;
        this.wandCoreSprite = null;
      }
      this.buttonWandMake.visible = false;
      craftTable.wandMovieFin = false;
      craftTable.wandParamsFin = false;
      craftTable.wandResultFin = false;
      textAlign("left");
      textSize(30);
      text(
        craftTable.wandName +
          "\nMaking wand from:" +
          this.wandCoreMat +
          "as core, and" +
          this.wandStickMat +
          "as Stick",
        0.1 * width,
        0.1 * height
      );
      textWrap(CHAR);
      fill("white");
      textSize(20);
      //text(craftTable.wandName,0.5*width,0.6*height);
      //text(craftTable.wandMovieText, 0.1*width,0.15*height,0.8*width);
      text(
        craftTable.wandMissile + "\t" + craftTable.wandProjectile,
        0.1 * width,
        0.15 * height,
        0.8 * width
      );
      /*
      textSize(15);
      text(craftTable.wandMissile,0.05*width,0.5*height,0.12*width);
      text(craftTable.wandProjectile,0.83*width,0.5*height,0.12*width);
      */
    }
  }

  drawProcess() {
    let wandMovieFin =
      craftTable.wandMovieFin &&
      craftTable.wandParamsFin &&
      craftTable.wandResultFin;
    //let wandMovieText = craftTable.wandMovieText;
    this.vwm.VWMdraw();
    allSprites.visible = false;
    this.buttonSkip.visible = false;
    this.buttonWandMake.visible = false;

    if (!wandMovieFin && this.backgroundLightness > 0)
      this.backgroundLightness--;
    craftTable.wandMovieText = craftTable.wandMovieText.replace(/[\r\n]+/g, "");
    if (frameCount % 5 === 0) this.wandMovieTextPointer++; //pointer keeps increase with time
    if (frameCount % 7 === 0) this.wandMovieTextPointer++;
    let showText = craftTable.wandMovieText.substring(
      0,
      this.wandMovieTextPointer
    ); //
    textWrap(CHAR);
    fill("white");
    textSize(18);
    textAlign("left");
    text(showText, 0.1 * width, 0.15 * height, 0.8 * width);

    if (wandMovieFin) {
      // exiting status
      if (this.wandMovieTextPointer > 0.9 * craftTable.wandMovieText.length) {
        if (this.backgroundLightness < 235) this.backgroundLightness++;
      }
      if (this.wandMovieTextPointer >= craftTable.wandMovieText.length + 20) {
        craftTable.state = tagManager.getTagByPath("craft.done");
        this.backgroundLightness = 235;
        this.wandCoreObject = -1;
        this.wandStickObject = -1;
      }
    }
  }

  hide() {
    this.vwm = null;
    for (let i = 0; i < this.childWidgets.length; i++) {
      let oneItem = this.childWidgets[i];
      oneItem.visible = false;
      oneItem.x = 0;
      oneItem.y = 0;
    }
    this.objectsBoxGroup.visible = false;
    this.wandCoreArea.visible = false;
    this.wandStickArea.visible = false;
    pop();
  }

  getItemValidToggleNum() {
    let res = 0;
    if (this.itemTogglePool.length == 0) {
      return -1;
    }
    for (let i = 0; i < this.itemTogglePool.length; i++) {
      if (this.itemTogglePool[i].label != "空") {
        res++;
      }
    }
    return res;
  }

  getWeaponValidToggleNum() {
    let res = 0;
    if (this.weaponTogglePool.length != this.weaponTogglePool.length) {
      return -1;
    }
    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      if (this.weaponTogglePool[i].label != "空") {
        res++;
      }
    }
    return res;
  }

  destroy() {
    for (let i = 0; i < this.itemTogglePool.length; i++) {
      let oneItem = this.itemTogglePool[i];
      oneItem.visible = false;
      this.itemTogglePool.splice(i, 1);
    }

    for (let i = 0; i < this.weaponTogglePool.length; i++) {
      let oneItem = this.weaponTogglePool[i];
      oneItem.visible = false;
      this.weaponTogglePool.splice(i, 1);
    }
    this.itemTogglePool = [];
    this.weaponTogglePool = [];

    this.craftButton.visible = false;
    this.exitButton.visible = false;
    //this.craftButton.remove();
    //this.exitButton.remove();
    this.craftButton = null;
    this.exitButton = null;
  }
}
