var canvas, context;
canvas = document.getElementById('gameBoard');
context = canvas.getContext("2d");
canvas.width = 1450
canvas.height = 425
canvas.style.background = "rgb(125,75,125)";
setInterval(gameLoop, 1000/60) //Redraws at 60 fps



var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

//Player wall variables
var WallXPos = 0;
var WallHealth = 500;
var WallWidth = 35;
var WallColor = "rgb(175,195,197)";

//Enemy Wall Health variables
var EnemyWallHealth = 600;
var enemyWallWidth = 100;
var enemyWallXPos = canvasWidth - enemyWallWidth;
var enemyWallColor = "rgb(30, 110,30)"


var playerMoveSpeed = 5;
var playerWidth = 20;
var playerHeight = 80;
var playerXPos = WallWidth;
var playerYPos = (canvasHeight / 2) - (playerHeight / 2); //Middle of canvas
var playerColor = "rgb(240,60,70)"

//Basic bullet variables
var playerBulletSize = 24;
var playerBulletColor = "black";
var playerBulletSpeed = 10;
var shootInterval = 25 ; //Number of frames before player can shoot again. EX. At 60 fps, 30 frames would be half a second.
var framesElapsedSinceShot = 0; // Frames since last player generated bullet
var basicBulletDamage = -20;



//Variables used to bypass keyboard studder/rappid fire
var leftKeyPress = false;
var spaceKeyPress = false;
var upKeyPress = false;
var downKeyPress = false;

//Arrays used to keep track of each type of projectile. Each item is an array with at least 2 items as x and y coordinates. Additional array items are noted
var bullets = [];


//Run Game
function gameLoop() {
	//Clears board for next frame draw
	context.clearRect(0, 0, canvasWidth, canvasHeight);

	//Listens for key strokes and key releases
	document.addEventListener('keydown', movePlayer, false);
	document.addEventListener('keyup', keyRelease, false)

	//Creates player
	createPlayer(playerXPos, playerYPos, playerWidth, playerHeight,playerColor);

	//Creates player's and enemy's wall
	createWall(WallXPos, 0, WallWidth, canvasHeight, WallColor)
	createWall(enemyWallXPos, 0, enemyWallWidth, canvasHeight, enemyWallColor)


	///////Display scores and cards under canvas

	//Displays remaining health of player's and enemy's wall
	displayWallsHealth();

	//Manages movement of players and projectiles
	makeMovementSmooth();
	trackPlayerBullets();
	}


////////////Functions
//Create and display Functions
function createWall(xpos,ypos,width, height, color) {
	context.fillStyle = color;
	context.fillRect(xpos, ypos, width, height);	
}
function displayWallsHealth() { // Displays current health of both walls
	document.getElementById('playerHealth').innerHTML = WallHealth
	document.getElementById('enemyHealth').innerHTML = EnemyWallHealth
}
function createPlayer(xpos,ypos,width, height, color){
	context.fillStyle = color;
	context.fillRect(xpos, ypos, width, height);
	}


//Bullet Functions
function createBullet(playerX, playerY) {
	bullets.push([playerX,playerY]);
	}
function drawBullet(xpos, ypos, width, height, color) {
	context.fillStyle = color;
	context.fillRect(xpos, ypos + (playerHeight * 0.5) - (playerBulletSize * 0.5), width, height); //This math centers the bullet in the players platform
	}
function trackPlayerBullets() {
	//Increments frames since last shot
	framesElapsedSinceShot += 1;
	//allows
	if (spaceKeyPress && framesElapsedSinceShot >= shootInterval) {
		createBullet(playerXPos,playerYPos)
		framesElapsedSinceShot = 0;
	}
	//Track basic bullets shot by player
	for (var i = 0; i < bullets.length; i++) {
			//Increment projectiles each frame
			bullets[i][0] += playerBulletSpeed;
			drawBullet(bullets[i][0], bullets[i][1], playerBulletSize, playerBulletSize, playerBulletColor);
			//Detect each bullet for enemy wall collision
			if (bullets[i][0] + playerBulletSize > canvasWidth - enemyWallWidth) {
				EnemyWallHealth += basicBulletDamage;
				bullets.splice(i, 1);
			}

		}
	}

//Collision detection functions
function detectCollision(item1X, item1Y, item1Width, item1Height, item2X, item2Y, item2Width, item2Height) {
	let collide = false;
	if (item1X + item1Width > item2X && item1X < item2X - item2Width && item1Y + item1Height > item2Y && item1Y < item2Y - item2Height) {
		itemsCollide = true
		}
	return itemsCollide
}

//Damage calculation functions




//Player movement functions

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
function makeMovementSmooth() { //This works in conjenctions with downKeyPress = true (ect.) and keyRelease function to stop jagged player movement
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




