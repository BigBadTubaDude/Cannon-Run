var canvas, context;
canvas = document.getElementById('gameBoard');
context = canvas.getContext("2d");
canvas.width = 1250
canvas.height = 425
canvas.style.background = "rgb(125,75,125)";
setInterval(gameLoop, 1000/60) //Redraws at 60 fps



var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var playerMoveSpeed = 5;
var playerWidth = 20;
var playerHeight = 80;
var playerStartXPos = 0;
var playerStartYPos = (canvasHeight / 2) - (playerHeight / 2);
var playerXPos = playerStartXPos;
var playerYPos = playerStartYPos;
var playerColor = "rgb(190,210,212)"

var playerBulletSize = 24;
var playerBulletColor = "black";
var playerBulletSpeed = 5;
var shootInterval = 25 ; //Number of frames before player can shoot again. EX. At 60 fps, 30 frames would be half a second.
var framesElapsedSinceShot = 0; // Frames since last player generated bullet

var leftKeyPress = false;
var spaceKeyPress = false;
var upKeyPress = false;
var downKeyPress = false;

//array used to keep track of bullets. Each item is an array with 2 items as x and y coordinates
var bullets = [];

function gameLoop() {
	document.addEventListener('keydown', movePlayer, false);
	document.addEventListener('keyup', keyRelease, false)
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	createPlayer(playerXPos, playerYPos, playerWidth, playerHeight,playerColor);
	makeMovementSmooth();
	trackPlayerBullets();
	}
function createPlayer(xpos,ypos,width, height, color){
	context.fillStyle = color;
	context.fillRect(xpos, ypos, width, height);

	}
function createBullet(playerX, playerY) {
	bullets.push([playerX,playerY]);
	}
function drawBullet(xpos, ypos, width, height, color) {
	context.fillStyle = color;
	context.fillRect(xpos, ypos + (playerHeight * 0.5) - (playerBulletSize * 0.5), width, height); //This math centers the bullet in the players platform
	}
function movePlayer(e) {
	e.preventDefault();
	if ((e.keyCode == 38 || e.keyCode == 87) && playerYPos >= 0) { // up move
	  upKeyPress = true;
	  }
	if ((e.keyCode == 40 || e.keyCode == 83) && (playerYPos + playerHeight) <= canvasHeight) { //down move
	  downKeyPress = true;
	 }
	  if (e.keyCode == 32) {
	  	spaceKeyPress = true;
	  }
	 createPlayer(playerXPos, playerYPos, playerWidth, playerHeight, playerColor);
	}
function trackPlayerBullets() {
	//Increments frames since last shot
	framesElapsedSinceShot += 1;
	//allows
	if (spaceKeyPress && framesElapsedSinceShot >= shootInterval) {
		createBullet(0,playerYPos)
		framesElapsedSinceShot = 0;
	}
	//Track basic bullets shot by player
	for (var i = 0; i < bullets.length; i++) {
			//Increment projectiles each frame
			bullets[i][0] += playerBulletSpeed;
			drawBullet(bullets[i][0], bullets[i][1], playerBulletSize, playerBulletSize, playerBulletColor);
			//Erases bullets from array once they leave the screen
			if (bullets[i][0] >= canvasWidth) { 
				bullets.splice(i, 1);
			}
		}
	}
//This works in conjenctions with downKeyPress = true (ect.) and keyRelease function to stop jagged player movement
function makeMovementSmooth() {
	if (upKeyPress && playerYPos >= 0) {
		playerYPos -= playerMoveSpeed;
		}
	if (downKeyPress && (playerYPos + playerHeight) <= canvasHeight) {
		playerYPos += playerMoveSpeed;
		}
	}
function keyRelease(e) {
	if (e.keyCode ==  40 || e.keyCode == 83) {
	  downKeyPress = false;
	 }
	if (e.keyCode == 38 || e.keyCode == 87) {
	  upKeyPress = false;
	  }
	if (e.keyCode == 37 || e.keyCode == 65) {
	  leftKeyPress = false;
	  }
	if (e.keyCode == 39 || e.keyCode == 68) {
	  rightKeyPress = false;
	  }
	if (e.keyCode == 32)
		spaceKeyPress = false
	}




