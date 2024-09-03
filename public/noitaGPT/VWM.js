class VisualWandMaking {
  constellation = [];
  n;
  d;

  VWMsetup() {
    // createCanvas(500, 500);
    pixelDensity(1); // Set 1 because it's too slow on firefox
    //pixelDensity(displayDensity());
    this.n = 200;

    for (var i = 0; i <= this.n; i++) {
      this.constellation.push(new star());
    }
  }

  VWMdraw() {
    push();

    strokeWeight(0.2);
    //stroke('#1ABC9C');
    stroke("white");

    //background('#0D0D0D');

    for (var i = 0; i < this.constellation.length; i++) {
      this.constellation[i].update();
      for (var j = 0; j < this.constellation.length; j++) {
        if (i > j) {
          // "if (i > j)" => to check one time distance between two stars
          this.d = this.constellation[i].loc.dist(this.constellation[j].loc); // Distance between two stars
          if (this.d <= width / 8) {
            // if d is less than width/10 px, we draw a line between the two stars
            line(
              this.constellation[i].loc.x,
              this.constellation[i].loc.y,
              this.constellation[j].loc.x,
              this.constellation[j].loc.y
            );
          }
        }
      }
    }
    pop();
  }
}

class star {
  a;
  r;
  loc;
  speed;
  bam;
  m;

  constructor() {
    console.log("star");
    this.a = random(5 * TAU); // "5*TAU" => render will be more homogeneous
    this.r = random(width * 0.4, width * 0.25); // first position will looks like a donut
    this.loc = createVector(
      width / 2 + sin(this.a) * this.r,
      height / 2 + cos(this.a) * this.r
    );
    this.speed = createVector();
    this.speed = p5.Vector.random2D();
    //this.speed.random2D();
    this.bam = createVector();
    this.m;
  }

  update = function () {
    this.bam = p5.Vector.random2D(); // movement of star will be a bit erractic
    //this.bam.random2D();
    this.bam.mult(0.45);
    this.speed.add(this.bam);
    // speed is done according distance between loc and the mouse :
    this.m = constrain(
      map(dist(this.loc.x, this.loc.y, mouseX, mouseY), 0, width, 8, 0.05),
      0.05,
      8
    ); // constrain => avoid returning "not a number"
    this.speed.normalize().mult(this.m);

    // No colision detection, instead loc is out of bound
    // it reappears on the opposite side :
    if (
      dist(this.loc.x, this.loc.y, width / 2, height / 2) >
      (width / 2) * 0.98
    ) {
      if (this.loc.x < width / 2) {
        this.loc.x = width - this.loc.x - 4; // "-4" => avoid blinking stuff
      } else if (this.loc.x > width / 2) {
        this.loc.x = width - this.loc.x + 4; // "+4"  => avoid blinking stuff
      }
      if (this.loc.y < height / 2) {
        this.loc.y = width - this.loc.y - 4;
      } else if (this.loc.x > height / 2) {
        this.loc.y = width - this.loc.y + 4;
      }
    }
    this.loc = this.loc.add(this.speed);
  }; // End of update()
} // End of class
