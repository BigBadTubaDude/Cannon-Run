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
  var moveSquare = function() {
    requestAnimationFrame(moveSquare);
    mySquare.move();
  }

class Platform {
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
  moveDown() {
      context.clearRect(this.xpos,this.ypos,this.width, this.height);
      this.create(context);
      this.ypos += this.maxSpeed;
  }
  moveUp() {
    context.clearRect(this.xpos,this.ypos,this.width, this.height);
    this.create(context);
    this.ypos -= this.maxSpeed;
  }
  movePlatform(e) {
  requestAnimationFrame(this.movePlatform())
  e.preventDefault();
  if (e.keyCode == 40) {
    myPlatform.moveDown();
  }
  else if (e.keyCode == 38) {
    myPlatform.moveUp();
  }
  myPlatform.create(context);

}

}
var mySquare = new Square(0,30,40,40,1,"red", 2);
var myPlatform = new Platform(0,300,20,100,5,'red');



function gameLoop() {
  mySquare.create(context);
  myPlatform.create(context);
  moveSquare();
  window.addEventListener("keydown", myPlatform.movePlatform(), false);
}
gameLoop();










// function move(e) {
//   alert(e.keyCode);
// }
// // document.onkeydown = requestAnimationFrame(movePlatform);
// window.addEventListener("keydown", movePlatform, false);