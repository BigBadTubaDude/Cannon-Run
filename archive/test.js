let canvas = document.getElementById('gameBoard');
let context = canvas.getContext("2d");

var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width
canvas.height = window_height

canvas.style.background = "rgb(150,150,150)";

let hitCounter = 0;

class Circle {
  constructor(xpos, ypos, radius, color, text, speed) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;

    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }
  draw(context) {
    context.beginPath();
    context.lineWidth = 4;

    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.baseLine = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.xpos, this.ypos);

    context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }
  update() {

    this.text = hitCounter;

    context.clearRect(0,0,window_width,window_height);
    this.draw(context);

    if ((this.xpos + this.radius) >= window_width) {
      this.dx = -this.dx;
      hitCounter++;
    }
    if ((this.xpos - this.radius) <= 0) {
      this.dx = -this.dx;
      hitCounter++;
    }
    if ((this.ypos + this.radius) >= window_height) {
      this.dy = -this.dy;
      hitCounter++;
    }
    if ((this.ypos - this.radius) <= 0) {
      this.dy = -this.dy;
      hitCounter++;
    }


    this.xpos += this.dx;
    this.ypos += this.dy;
  }
}

let circleCounter = 1;


let randX = Math.random() * window_width;
let randY = Math.random() * window_height;

let myCircle = new Circle(randX, randY, 50, "purple", hitCounter, 5);

myCircle.draw(context);

let updateCircle = function() {
  requestAnimationFrame(updateCircle);
  myCircle.update();
}
updateCircle();

// for (var numbers = 0; numbers < 1; numbers++) {
//  let randX = Math.random() * window_width;
//  let randY = Math.random() * window_width;

//  let myCircle = new Circle(randX, randY, 50, "purple", circleCounter, 1);
//  allCircles.push(myCircle);
//  createCircle(allCircles[numbers]);
//  circleCounter++;
// }
