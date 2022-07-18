var canvas, context;
canvas = document.getElementById('gameBoard');
context = canvas.getContext("2d");
canvas.width = 1450
canvas.height = 480
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

//Enemy Defender stats
var defenderColor = "green"
var defenderGap = 100;
var defenderWidth = 20;
//Defender1 (closest to enemy wall)
var defender1Xpos = canvasWidth - enemyWallWidth - defenderGap - defenderWidth;
var defender1Ypos = 30;
var defender1YTopRange = 30;
var defender1YBottomRange = canvasHeight - 30;
var defender1Health = 400;
var defender1Height = 300;
var defender1Speed = 1;
//Defender2
var defender2Xpos = canvasWidth - enemyWallWidth - (defenderGap * 2) - (defenderWidth * 2);
var defender2Ypos = 150;
var defender2YTopRange = 10;
var defender2YBottomRange = canvasHeight - 10;
var defender2Health = 300;
var defender2Height = 200;
var defender2Speed = 3;
//Defender3
var defender3Xpos = canvasWidth - enemyWallWidth - (defenderGap * 3) - (defenderWidth * 3);
var defender3Ypos = 150;
var defender3YTopRange = 50;
var defender3YBottomRange = canvasHeight - 10;
var defender3Health = 200;
var defender3Height = 100;
var defender3Speed = 6;
//Defender4
var defender4Xpos = canvasWidth - enemyWallWidth - (defenderGap * 4) - (defenderWidth * 4) + 60;
var defender4Ypos = 10;
var defender4YTopRange = 10;
var defender4YBottomRange = canvasHeight - 50;
var defender4Health = 200;
var defender4Height = 100;
var defender4Speed = 7;
//Defender5
var defender5Xpos = canvasWidth - enemyWallWidth - (defenderGap * 5) - (defenderWidth * 5) + 120;
var defender5Ypos = 10;
var defender5YTopRange = 10;
var defender5YBottomRange = canvasHeight - 10;
var defender5Health = 200;
var defender5Height = 100;
var defender5Speed = 7;

var playerPoints = 0;
var playerMoveSpeed = 5;
var playerWidth = 20;
var playerHeight = 80;
var playerXPos = WallWidth;
var playerYPos = (canvasHeight / 2) - (playerHeight / 2); //Middle of canvas
var playerColor = "rgb(240,60,70)"

//Basic Cannonball variables
var cannonballSize = 28;
var playerCannonballColor = "black";
var playerCannonballspeed = 6;
var shootInterval = 25 ; //Number of frames before player can shoot again. EX. At 60 fps, 30 frames would be half a second.
var framesElapsedSinceShot = 0; // Frames since last player generated Cannonball
var basicCannonballDamage = -10; 



//Variables used to bypass keyboard studder/rappid fire
var leftKeyPress = false;
var spaceKeyPress = false;
var upKeyPress = false;
var downKeyPress = false;

//Arrays used to keep track of each type of projectile. Each item is an array with at least 2 items as x and y coordinates. Additional array items are noted
var cannonballs = [];
var enemyShots = [];
var defenders = []

//ally is a boolean. true if on player's team
//goingUp is a boolean that tells if defender is going up or down. Boolean is swapped once it reaches the outer range
class Defender {
	constructor(xpos, ypos,yMaxRange, yMinRange, width, height, color, speed, health, ally, goingUp) { 
		this.xpos = xpos;
		this.ypos = ypos;
		this.yMaxRange = yMaxRange;
		this.yMinRange = yMinRange;
		this.width = width;
		this.height = height;
		this.color = color;
		this.speed = speed;
		this.health = health;
		this.ally = ally;
		this.goingUp = goingUp;
		}
	list() {
		defenders.push(this);
	}
	create(context) {
			context.fillStyle = this.color;
			context.fillRect(this.xpos, this.ypos, this.width, this.height);
		}
	move() {
		if (this.goingUp){
			this.ypos -= this.speed;
			if (this.ypos <= this.yMaxRange) //swaps direction if at outer range
				this.goingUp = !this.goingUp;
			}
		else {
			this.ypos += this.speed;
			if (this.ypos + this.height >= this.yMinRange) {//swaps direction if at outer range
				this.goingUp = !this.goingUp;
				}
			}
		}
}
//Create defenders and add them to defenders array
var Defender1 = new Defender(defender1Xpos, defender1Ypos, defender1YTopRange, defender1YBottomRange, defenderWidth,defender1Height,defenderColor,defender1Speed,defender1Health,true,true)
Defender1.create(context);
Defender1.list();
var Defender2 = new Defender(defender2Xpos, defender2Ypos, defender2YTopRange, defender2YBottomRange, defenderWidth,defender2Height,defenderColor,defender2Speed,defender2Health,true,true)
Defender2.create(context);
Defender2.list();
var Defender3 = new Defender(defender3Xpos, defender3Ypos, defender3YTopRange, defender3YBottomRange, defenderWidth,defender3Height,defenderColor,defender3Speed,defender3Health,true,true)
Defender3.create(context);
Defender3.list();
var Defender4 = new Defender(defender4Xpos, defender4Ypos, defender4YTopRange, defender4YBottomRange, defenderWidth,defender4Height,defenderColor,defender4Speed,defender4Health,true,true)
Defender4.create(context);
Defender4.list();
var Defender5 = new Defender(defender5Xpos, defender5Ypos, defender5YTopRange, defender5YBottomRange, defenderWidth,defender5Height,defenderColor,defender5Speed,defender5Health,true,true)
Defender5.create(context);
Defender5.list();


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

	//Create Defenders
	for (var i = 0; i < defenders.length; i++) {
		if (defenders[i].health > 0) {
			defenders[i].create(context);
			defenders[i].move();
		}
		else {
			defenders.splice(i,1);
		}
	}
	///////Display scores and cards under canvas

	//Displays remaining health of player's and enemy's wall
	displayStats();

	//Manages movement of players and projectiles
	makeMovementSmooth();
	trackPlayerCannonballs();
	}


////////////Functions
//Create and display Functions
function createWall(xpos,ypos,width, height, color) {
	context.fillStyle = color;
	context.fillRect(xpos, ypos, width, height);	
}


function displayStats() { // Displays current health of both walls
	document.getElementById('playerHealth').innerHTML = WallHealth + " Wall HP";
	document.getElementById('enemyHealth').innerHTML = EnemyWallHealth + " Wall HP";
	document.getElementById('points').innerHTML = playerPoints + " Points";

}
function createPlayer(xpos,ypos,width, height, color){
	context.fillStyle = color;
	context.fillRect(xpos, ypos, width, height);
	}


//Cannonball Functions
function createCannonball(playerX, playerY) {
	cannonballs.push([playerX,playerY]);
	}
function drawCannonball(xpos, ypos, width, height, color) {
	context.fillStyle = color;
	context.fillRect(xpos, ypos + (playerHeight * 0.5) - (cannonballSize * 0.5), width, height); //This math centers the Cannonball in the players platform
	}
function trackPlayerCannonballs() {
	//Increments frames since last shot
	framesElapsedSinceShot += 1;
	//allows
	if (spaceKeyPress && framesElapsedSinceShot >= shootInterval) {
		createCannonball(playerXPos,playerYPos)
		framesElapsedSinceShot = 0;
	}
	//Track basic cannonballs shot by player
	for (var i = 0; i < cannonballs.length; i++) {
			//Increment projectiles each frame
			cannonballs[i][0] += playerCannonballspeed;
			drawCannonball(cannonballs[i][0], cannonballs[i][1], cannonballSize, cannonballSize, playerCannonballColor);
			//Detect each Cannonball for enemy wall collision
			if (cannonballs[i][0] + cannonballSize > canvasWidth - enemyWallWidth) { // Simple enough to not use full detectCollision function
				EnemyWallHealth += basicCannonballDamage;
				cannonballs.splice(i, 1);
				}
			//Detect each Cannonbal for defender collision
			for (var d = 0; d < defenders.length; d++) {
				if (cannonballs[i][0] + cannonballSize >= defenders[d].xpos && (cannonballs[i][0]) <= defenders[d].xpos + defenders[d].width && cannonballs[i][1] <= defenders[d].ypos + defenders[d].height && cannonballs[i][1] + cannonballSize >= defenders[d].ypos ) {
						cannonballs.splice(i, 1);
						defenders[d].health += basicCannonballDamage;
					}				
			}
			// if (cannonballs[i][0] + cannonballSize >= Defender1.xpos && (cannonballs[i][0]) <= Defender1.xpos + Defender1.width && cannonballs[i][1] <= Defender1.ypos + Defender1.height && cannonballs[i][1] + cannonballSize >= Defender1.ypos ) {
			// 		cannonballs.splice(i, 1);
			// 		Defender1.health += basicCannonballDamage;
			// 	}
			// if (cannonballs[i][0] + cannonballSize >= Defender2.xpos && (cannonballs[i][0]) <= Defender2.xpos + Defender2.width && cannonballs[i][1] <= Defender2.ypos + Defender2.height && cannonballs[i][1] + cannonballSize >= Defender2.ypos ) {
			// 		cannonballs.splice(i, 1);
			// 		Defender2.health += basicCannonballDamage;
			// 	}
			// if (cannonballs[i][0] + cannonballSize >= Defender3.xpos && (cannonballs[i][0]) <= Defender3.xpos + Defender3.width && cannonballs[i][1] <= Defender3.ypos + Defender3.height && cannonballs[i][1] + cannonballSize >= Defender3.ypos ) {
			// 		cannonballs.splice(i, 1);
			// 		Defender3.health += basicCannonballDamage;
			// 	}
			// if (cannonballs[i][0] + cannonballSize >= Defender4.xpos && (cannonballs[i][0]) <= Defender4.xpos + Defender4.width && cannonballs[i][1] <= Defender4.ypos + Defender4.height && cannonballs[i][1] + cannonballSize >= Defender4.ypos ) {
			// 		cannonballs.splice(i, 1);
			// 		Defender4.health += basicCannonballDamage;
			// 	}
			// if (cannonballs[i][0] + cannonballSize >= Defender5.xpos && (cannonballs[i][0]) <= Defender5.xpos + Defender5.width && cannonballs[i][1] <= Defender5.ypos + Defender5.height && cannonballs[i][1] + cannonballSize >= Defender5.ypos ) {
			// 		cannonballs.splice(i, 1);
			// 		Defender5.health += basicCannonballDamage;
			// 	}
			// for (var x = 0; x < defenders.length; x++) {
			// 	if(cannonballs[i][x] + cannonballSize > defenders[x].xpos) {

			// 		cannonballs.splice(i, 1);

			// 		defenders[x].health += basicCannonballDamage;

			// 		}
			// 	}
			}
		}

//Collision detection functions
function detectCollision(item1X, item1Y, item1Width, item1Height, item2X, item2Y, item2Width, item2Height) {
	let itemsCollide = false;
	if (item1X + item1Width > item2X && item1X < item2X + item2Width && item1Y + item1Height > item2Y && item1Y < item2Y - item2Height) {
		itemsCollide = true

		}
	return itemsCollide;
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




