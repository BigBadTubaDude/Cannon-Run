//complementary gray rgb(180,200,202)
let canvas = document.getElementById('gameBoard');
let context = canvas.getContext("2d");

var canvasHeight = 1050;
var canvasWidth = 425;

canvas.style.background = "rgb(125,75,125,0.5)";

class Square {
  constructor(xpos, ypos, width, height, speed, color, growth) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
    this.horizontalMove = this.speed;
    this.growth = growth;
  }
  create(context) {
    context.fillStyle = this.color;
    context.fillRect(this.xpos, this.ypos, this.width, this.height);
  }
  move() {
    context.clearRect(0,0,canvasHeight,canvasWidth);
    this.create(context);
    this.xpos += this.horizontalMove;
  }
}

let mySquare = new Square(0,30,40,40,1,"red", 2);
// mySquare.create(context);

let moveSquare = function() {
  requestAnimationFrame(moveSquare);
  mySquare.move();
}


class Platform{
  constructor(xpos,ypos,width, height, maxSpeed, color){
  this.xpos = xpos;
  this.ypos = ypos;
  this.width = width;
  this.height = height;
  this.maxSpeed = maxSpeed;
  this.color = color;
  }
  create(context) {
    context.fillStyle = this.color;
    context.fillRect(this.xpos, this.ypos, this.width, this.height);
  }
  strafe(e) {
    context.clearRect(0,0,canvasHeight, canvasWidth);
    this.create(context);
    if (e.keyCode == 38) {
        this.ypos -= maxSpeed;
    }
    if (e.keyCode == 40) {
      this.ypos += maxSpeed;
    }
    requestAnimationFrame(strafe)
  }
}
let myPlatform = new Platform(0,300,20,100,5,'red');

let movePlatform = function() {
  requestAnimationFrame(movePlatform)
  myPlatform.strafe();
}
myPlatform.create(context);
document.addEventListener('keydown', movePlatform, false)


// moveSquare();
function move(e) {
  alert(e.keyCode);
}
// document.onkeydown = requestAnimationFrame(movePlatform);