var canvas, context;
canvas = document.getElementById('gameBoard');
context = canvas.getContext("2d");


window.onload = function() {
	canvas.style.background = "rgb(125,75,125)";
	document.addEventListener('keydown', movePlayer, false);
	document.addEventListener('keyup', keyRelease, false)
	setInterval(gameLoop, 1000/60)
	}

	var canvasHeight = 425;
	var canvasWidth = 1050;

	var playerMoveSpeed = 5;
	var playerWidth = 20;
	var playerHeight = 80;
	var playerStartXPos = 0;
	var playerStartYPos = (canvasHeight / 2) - (playerHeight / 2);
	var playerXPos = playerStartXPos;
	var playerYPos = playerStartYPos;
	var playerColor = "rgb(190,210,212)"

	var playerBulletSize = 18;
	var playerBulletColor = "pink";
	var playerBulletSpeed = 5;

	var leftKeyPress = false;
	var rightKeyPress = false;
	var upKeyPress = false;
	var downKeyPress = false;

//array used to keep track of bullets. Each item is an array with 2 items as x and y coordinates
	var bullets = [];

	function gameLoop() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		createPlatform(playerXPos, playerYPos, playerWidth, playerHeight,playerColor);
		makeMovementSmooth();

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
	
	function createPlatform(xpos,ypos,width, height, color){
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
		  if (e.keyCode == 39) {
		  	rightKeyPress = true;
		  	createBullet(0,playerYPos);
		  }
		 createPlatform(playerXPos, playerYPos, playerWidth, playerHeight, playerColor);
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
	}




