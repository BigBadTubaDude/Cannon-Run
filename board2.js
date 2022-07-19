var canvas, context;
canvas = document.getElementById('gameBoard');
context = canvas.getContext("2d");
canvas.width = 1550
canvas.height = 500
canvas.style.background = "rgb(200,200,200)";
setInterval(gameLoop, 1000/60) //Redraws at 60 fps


//Arrays used to keep track of each type of projectile. Each item is an array with at least 2 items as x and y coordinates. Additional array items are noted
var cannonballs = [];
var levelOneEnemyShots = [];
var defenders = [];
var level1Defenders = [];
var level2Defenders = [];
var level3Defenders = [];

class Defender {
	constructor(xpos, ypos,yMaxRange, yMinRange, width, height, color, speed, health, ally, goingUp, topDefender, bottomDefender, levelArray, chanceOfShooting) { 
		//bottomOfOther is true if this defender shares a space with another defender above this one. topOfOther is the oppposite. 
		//topDefender and bottomDefender are the defenders to the top or bottom of this one, "none" if not applicable
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
		this.topDefender = topDefender;
		this.bottomDefender = bottomDefender;
		this.levelArray = levelArray;
		this.chance = chanceOfShooting;
		}
	canShoot() {
		let canShoot = false;
		if (this.levelArray == level1Defenders && this.health > 0 && Math.random() > this.chance) {
			canShoot = true;
			}
		else if (level1Defenders.length == 0 && this.levelArray == level2Defenders && this.health > 0 && Math.random() > this.chance){
			canShoot = true;
			}
		else if (level2Defenders.length == 0 && this.levelArray == level3Defenders && this.health > 0 && Math.random() > this.chance){
			canShoot = true;
			}
		return canShoot;
	}
	shoot() {
		if (canShoot) {
			}
	}
	list() {
		defenders.push(this);
		this.levelArray.push(this);
	}
	create(context) {
			context.fillStyle = this.color;
			context.fillRect(this.xpos, this.ypos, this.width, this.height);
		}

	move() { 

		if (this.topDefender != "none") {
			this.yMaxRange = this.topDefender.ypos + this.topDefender.height;
		}
		if (this.bottomDefender != "none") {
			this.yMinRange = this.bottomDefender.ypos;			
		}


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

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

//Player wall variables
var WallXPos = 0;
var WallHealth = 500;
var WallWidth = 35;
var WallColor = "rgb(50,50,50)";

//Enemy Wall Health variables
var EnemyWallHealth = 600;
var enemyWallWidth = 100;
var enemyWallXPos = canvasWidth - enemyWallWidth;
var enemyWallColor = "rgb(30, 110,30)"

///////////////////Enemy Defender stats
var defenderColor = "green"
var defenderGap = 100;
var defenderWidth = 20;
var middleDefenderColor = "rgb(10,10,10)";
var outerDefenderColor = "green";
var level1DefenderColor = "red";
var level1ChanceOfShooting = 0.2;
var middleLevel3ChanceOfShooting = 0.02;
var outerLevel3ChanceOfShooting = 0.09;
var middleLevel2ChanceOfShooting = 0.1;
var outerLevel2ChanceOfShooting = 0.3;
//////Defender1 (closest to enemy wall)x level 3 middle
var defender1Xpos = canvasWidth - enemyWallWidth - defenderGap - defenderWidth;
var defender1Ypos = 30;
var defender1YTopRange = 35;
var defender1YBottomRange = canvasHeight - 35;
var defender1Health = 400;
var defender1Height = 300;
var defender1Speed = .8;
var defender1Color = middleDefenderColor
var defender1TopDefender = "none";
var defender1BottomDefender = "none";
//////Defender2 level 3 low defender
var defender2Height = 20;
var defender2Xpos = canvasWidth - enemyWallWidth - defenderGap - defenderWidth;
var defender2Ypos = canvasHeight - defender2Height; 
var defender2YTopRange = 40; // Will change depending on current Defender1 possition
var defender2YBottomRange = canvasHeight;
var defender2Health = 250;
var defender2Speed = 3.5;
var defender2TopDefender = "none";
var defender2BottomDefender = "none";
var defender2Color = outerDefenderColor;
//////Defender3 level 3 high defender
var defender3Height = 20;
var defender3Xpos = canvasWidth - enemyWallWidth - defenderGap - defenderWidth;
var defender3Ypos = 0;
var defender3YTopRange = 0;
var defender3YBottomRange = canvasWidth; // Will change depending on current Defender1 possition
var defender3Health = 250;
var defender3Speed = 3;
var defender3TopDefender = "none";
var defender3BottomDefender = "none";
var defender3Color = outerDefenderColor;

//////Defender4 x level 2 middle
var defender4Xpos = canvasWidth - enemyWallWidth - (defenderGap * 2) - (defenderWidth * 2);
var defender4Ypos = 150;
var defender4YTopRange = 50;
var defender4YBottomRange = canvasHeight - 50;
var defender4Health = 300;
var defender4Height = 200;
var defender4Speed = 2;
var defender4Color = middleDefenderColor
var defender4TopDefender = "none";
var defender4BottomDefender = "none";
//////Defender5 bottom
var defender5Height = 25;
var defender5Width = 50;
var defender5Xpos = canvasWidth - enemyWallWidth - (defenderGap * 2) - (defenderWidth * 2) - (defender5Width / 2) + (defenderWidth / 2);
var defender5Ypos = canvasHeight - defender5Height - 5;
var defender5YTopRange = defender4Ypos + defender4Height; //Will change as Defender4 moves
var defender5YBottomRange = canvasHeight - 5;
var defender5Health = 200;
var defender5Speed = 7;
var defender5TopDefender = "none";
var defender5BottomDefender = "none";
var defender5Color = outerDefenderColor;
//////Defender6 top
var defender6Height = 25;
var defender6Width = 50;
var defender6Xpos = canvasWidth - enemyWallWidth - (defenderGap * 2) - (defenderWidth * 2) - (defender6Width / 2) + (defenderWidth / 2);
var defender6Ypos = 5;
var defender6YTopRange = 0;
var defender6YBottomRange = defender4Ypos; //Will change as Defender4 moves
var defender6Health = 200;
var defender6Speed = 7;
var defender6TopDefender = "none";
var defender6BottomDefender = "none";
var defender6Color = outerDefenderColor;

//////Defender7 Level 3
var defender7Xpos = canvasWidth - enemyWallWidth - (defenderGap * 3) - (defenderWidth * 3);
var defender7Ypos = 150;
var defender7YTopRange = 70;
var defender7YBottomRange = canvasHeight - 30;
var defender7Health = 250;
var defender7Height = 100;
var defender7Speed = 6;
var defender7TopDefender = "none";
var defender7BottomDefender = "none";
var defender7Color = level1DefenderColor;
//////Defender8x
var defender8Xpos = canvasWidth - enemyWallWidth - (defenderGap * 4) - (defenderWidth * 4) + 60;
var defender8Ypos = 10;
var defender8YTopRange = 30;
var defender8YBottomRange = canvasHeight - 70;
var defender8Health = 250;
var defender8Height = 100;
var defender8Speed = 7;
var defender8TopDefender = "none";
var defender8BottomDefender = "none";
var defender8Color = level1DefenderColor;
//////Defender9x
var defender9Xpos = canvasWidth - enemyWallWidth - (defenderGap * 5) - (defenderWidth * 5) + 130;
var defender9Ypos = 10;
var defender9YTopRange = 0;
var defender9YBottomRange = canvasHeight - 0;
var defender9Health = 250;
var defender9Height = 100;
var defender9Speed = 8;
var defender9TopDefender = "none";
var defender9BottomDefender = "none";
var defender9Color = level1DefenderColor;
//////Defender10x
var defender10Xpos = canvasWidth - enemyWallWidth - (defenderGap * 6) - (defenderWidth * 6) + 170;
var defender10Ypos = canvasHeight - 10;
var defender10YTopRange = 25;
var defender10YBottomRange = canvasHeight - 25;
var defender10Health = 250;
var defender10Height = 100;
var defender10Speed = 9;
var defender10TopDefender = "none";
var defender10BottomDefender = "none";
var defender10Color = level1DefenderColor;



var playerPoints = 0;
var playerMoveSpeed = 5;
var playerWidth = 20;
var playerHeight = 80;
var playerXPos = WallWidth;
var playerYPos = (canvasHeight / 2) - (playerHeight / 2); //Middle of canvas
var playerColor = "rgb(100,100,100)"

//Basic Cannonball variables
var cannonballSize = 30;
var playerCannonballColor = "black";
var playerCannonballspeed = 4;
var shootInterval = 40 ; //Number of frames before player can shoot again. EX. At 60 fps, 30 frames would be half a second.
var framesElapsedSinceShot = 0; // Frames since last player generated Cannonball
var basicCannonballDamage = -20; 



//Variables used to bypass keyboard studder/rappid fire
var leftKeyPress = false;
var spaceKeyPress = false;
var upKeyPress = false;
var downKeyPress = false;



//ally is a boolean. true if on player's team
//goingUp is a boolean that tells if defender is going up or down. Boolean is swapped once it reaches the outer range

//Create defenders and add them to defenders array
// function getDefender1Bottom() {
// 	return Defender1.ypos + Defender1.height;
// }
// function getDefender1Top() {
// 	return Defender1.ypos;
// }
middleLevel3ChanceOfShooting = 0.02;
outerLevel3ChanceOfShooting = 0.09;
middleLevel2ChanceOfShooting = 0.1;
outerLevel2ChanceOfShooting = 0.3;
var Defender1 = new Defender(defender1Xpos, defender1Ypos, defender1YTopRange, defender1YBottomRange, defenderWidth,defender1Height,defender1Color,defender1Speed,defender1Health,true,true, defender1TopDefender, defender1BottomDefender, level3Defenders, middleLevel3ChanceOfShooting);
Defender1.list();
var Defender2 = new Defender(defender2Xpos, defender2Ypos, defender2YTopRange, defender2YBottomRange, defenderWidth,defender2Height,defender2Color,defender2Speed,defender2Health,true,true, defender2TopDefender, defender2BottomDefender, level3Defenders, outerLevel3ChanceOfShooting);
Defender2.list();
var Defender3 = new Defender(defender3Xpos, defender3Ypos, defender3YTopRange, defender3YBottomRange, defenderWidth,defender3Height,defender3Color,defender3Speed,defender3Health,true,true, defender3TopDefender, defender3BottomDefender, level3Defenders, outerLevel3ChanceOfShooting);
Defender3.list();
var Defender4 = new Defender(defender4Xpos, defender4Ypos, defender4YTopRange, defender4YBottomRange, defenderWidth,defender4Height,defender4Color,defender4Speed,defender4Health,true,true, defender4TopDefender, defender4BottomDefender, level2Defenders, middleLevel2ChanceOfShooting);
Defender4.list();
var Defender5 = new Defender(defender5Xpos, defender5Ypos, defender5YTopRange, defender5YBottomRange, defender5Width,defender5Height,defender5Color,defender5Speed,defender5Health,true,true, defender5TopDefender, defender5BottomDefender, level2Defenders, outerLevel2ChanceOfShooting);
Defender5.list();
var Defender6 = new Defender(defender6Xpos, defender6Ypos, defender6YTopRange, defender6YBottomRange, defender6Width,defender6Height,defender6Color,defender6Speed,defender6Health,true,true, defender6TopDefender, defender6BottomDefender, level2Defenders, outerLevel2ChanceOfShooting);
Defender6.list();
var Defender7 = new Defender(defender7Xpos, defender7Ypos, defender7YTopRange, defender7YBottomRange, defenderWidth,defender7Height,defender7Color,defender7Speed,defender7Health,true,true, defender7TopDefender, defender7BottomDefender, level1Defenders, level1ChanceOfShooting);
Defender7.list();
var Defender8 = new Defender(defender8Xpos, defender8Ypos, defender8YTopRange, defender8YBottomRange, defenderWidth,defender8Height,defender8Color,defender8Speed,defender8Health,true,true, defender8TopDefender, defender8BottomDefender, level1Defenders, level1ChanceOfShooting);
Defender8.list();
var Defender9 = new Defender(defender9Xpos, defender9Ypos, defender9YTopRange, defender9YBottomRange, defenderWidth,defender9Height,defender9Color,defender9Speed,defender9Health,true,true, defender9TopDefender, defender9BottomDefender, level1Defenders, level1ChanceOfShooting);
Defender9.list();
var Defender10 = new Defender(defender10Xpos, defender10Ypos, defender10YTopRange, defender10YBottomRange, defenderWidth,defender10Height,defender10Color,defender10Speed,defender10Health,true,true, defender10TopDefender, defender10BottomDefender, level1Defenders, level1ChanceOfShooting);
Defender10.list();

//Assigns defenders which defender to look when calculating max or min range of motion
Defender2.topDefender = Defender1;
Defender3.bottomDefender = Defender1;
Defender5.topDefender = Defender4;
Defender6.bottomDefender = Defender4;


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
	drawMoveHealthCheckDefenders()
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
function drawMoveHealthCheckDefenders() {
	for (var i = 0; i < defenders.length; i++) {
		if (defenders[i].health > 0) {
			defenders[i].create(context);
			defenders[i].move();
		}
		else {
			defenders.splice(i,1);
		}
	}
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
			else {
				for (var d = 0; d < defenders.length; d++) {
					if (cannonballs[i][0] + cannonballSize >= defenders[d].xpos && (cannonballs[i][0]) <= defenders[d].xpos + defenders[d].width && cannonballs[i][1] <= defenders[d].ypos + defenders[d].height && cannonballs[i][1] + cannonballSize >= defenders[d].ypos ) {
							cannonballs.splice(i, 1);
							defenders[d].health += basicCannonballDamage;
						}				
					}				
				}
			//Detect each Cannonbal for defender collision

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



