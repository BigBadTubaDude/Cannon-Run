
	//Author: Coleman Alexander
	//Date: 7/24/2022
	//File: board
var canvas, context;
canvas = document.getElementById('gameBoard');
context = canvas.getContext("2d");
canvas.width = 1700
canvas.height = 500
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
canvas.style.background = "rgb(200,200,200)";
var gameLoopRefreshID = setInterval(gameLoop, 1000/60) //Redraws at 60 fps



//Arrays used to keep track of each type of projectile. Each item is an array with at least 2 items as x and y coordinates. Additional array items are noted
var cannonballs = [];
var levelOneEnemyShots = [];
var defenders = [];
var level1Defenders = [];
var level2Defenders = [];
var level3Defenders = [];
var barriers = [];
// true when shield is in use, false when it runs out of health
// var defenderBulletArrays = [level1DefenderBullets, level2Defenders, level3Defenders]



//////////////////////////////////////CLASSES
class Turret {
	constructor(xpos, ypos, width, height, color, health, cannonballSpeed, cannonballWidth, cannonballHeight) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.width = width;
		this.height = height;
		this.health = health;
		this.color = color;
		this.cannonballSpeed = playerCannonballspeed - 2;
		this.cannonballWidth = cannonballWidth;
		this.cannonballHeight = cannonballHeight;
	}
	draw(context) {
		if (turretActive) {
			context.fillStyle = this.color;
			context.fillRect(this.xpos, this.ypos, this.width, this.height);			
			}		
	}
	activate() {
		turretActive = true;
		this.ypos = Math.min(Math.ceil(Math.random() * canvasHeight - 1), canvasHeight - this.height - 5);
		}
	deactivate() {
		turretActive = false;
		// this.ypos = this.offScreenY;
	}
	shoot() {
		if (turretActive ) {

		}
	}
	drawAndCheckHealthOfTurret(context) { //Brings turret to screen when activated and deactivates it when it runs out of health
		if (turretActive && this.health > 0) { 
			this.draw(context);			 
		}
		else {
			this.deactivate();
			}	
		}
	}

class Shield {
	constructor(xpos, ypos, width, height, speed, health, color) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.yStart = 50;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.health = health;
		this.color = color;
		// this.offScreenY = -300;
		}
	draw(context) {
		if (shieldActive) {
			context.fillStyle = this.color;
			context.fillRect(this.xpos, this.ypos, this.width, this.height);			
			}
		}
	activate() {
		shieldActive = true;
		this.ypos = this.yStart;
		}
	deactivate() {
		shieldActive = false;
		// this.ypos = this.offScreenY;
	}
	moveShield(context) { //Brings shield to screen when activated and deactivates it when it runs out of health
		if (shieldActive && this.health > 0) { 
			if (this.ypos <= 0 || this.ypos + this.height >= canvasHeight) { //Turns shield around when it gets to the edge
				this.speed *= -1;
				}
			this.ypos += this.speed;
			this.draw(context);			 
		}
		else {
			this.deactivate();
		}
	}		
}



class Barrier {
	constructor(xpos, width, color, level) {
		this.xpos = xpos;
		this.destroyed = false;
		this.color = color;
		this.width = width;
	}
	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.xpos, 0, this.width, canvasHeight);		
	}
	list(barriers) {
		barriers.push(this);
	}
}
class Defender {
	constructor(xpos, ypos,yMaxRange, yMinRange, width, height, color, speed, health, middleDefender, goingUp, topDefender, bottomDefender, levelArray, chanceOfShooting) { 
		//bottomOfOther is true if this defender shares a space with another defender above this one. topOfOther is the oppposite. 
		//topDefender and bottomDefender are the defenders to the top or bottom of this one, "none" if not applicable
		this.xpos = xpos;
		this.ypos = ypos;
		this.aloneYMaxRange = yMaxRange;//min and max when other defenders in same level are dead
		this.aloneYMinRange = yMinRange;
		this.yMaxRange = yMaxRange;
		this.yMinRange = yMinRange;
		this.width = width;
		this.height = height;
		this.color = color;
		this.speed = speed;
		this.health = health;
		this.middleDefender = middleDefender;
		this.goingUp = goingUp;
		this.topDefender = topDefender;
		this.bottomDefender = bottomDefender;
		this.levelArray = levelArray;
		this.chance = chanceOfShooting;
		this.bouncing = false;
		this.bouncingDistance = 700;

		this.listOfBullets = []; //keeps track of bullets this Defender has shot
		if (this.levelArray == level1Defenders) { //Level 1 defender bullet stats
			this.bulletX = 0;
			this.bulletY = 0;
			this.XTrajectory = 4;
			this.YTrajectory = 0;
			this.bulletWidth = 10;
			this.bulletHeight = 10;
			this.bulletColor = "rgb(255,0,0)"
			this.bulletDamage = -1.5; //negative
			this.bulletDestroyPointsGained = 4;
			this.catchPointsGained = 6;
			this.defenderDestroyedPointsGained = 100;
		}
		else if (levelArray == level2Defenders){ 
			if (this.middleDefender == true) { //Level 2 middle defender bullet stats
				this.bulletX = 0;
				this.bulletY = 0;
				this.XTrajectory = 4;
				this.YTrajectory = 0;
				this.bulletWidth = 15;
				this.bulletHeight = 5;
				this.bulletColor = "rgb(20,100,255)"
				this.bulletDamage = -2;
				this.bulletDestroyPointsGained = 6;
				this.catchPointsGained = 7;	
				this.defenderDestroyedPointsGained = 250;			
				}
			else { //Level 2 outer defender bullet stats
				this.bulletX = 0;
				this.bulletY = 0;
				this.XTrajectory = 3;
				this.YTrajectory = 0;
				this.bulletWidth = 43;
				this.bulletHeight = 43;
				this.bulletHealth = 120;
				this.bulletColor = "rgb(205, 165,0)"
				this.bulletDamage = -70;
				this.bulletDestroyPointsGained = 40;
				this.defenderDestroyedPointsGained = 125;
					}
				}			
		else if (levelArray == level3Defenders){
			if (this.middleDefender) { //Level 3 middle defender bullet stats
				this.bulletX = 0;
				this.bulletY = 0;
				this.XTrajectory = 3;
				this.YTrajectory = 0;
				this.bulletWidth = 15;
				this.bulletHeight = 7;				
				this.bulletColor = "rgb(20,100,255)"
				this.bulletDamage = -2;
				this.bulletDestroyPointsGained = 7;
				this.catchPointsGained = 9;
				this.defenderDestroyedPointsGained = 400;				
				}
			else { //Level 3 outer defender bullet stats
				this.bulletX = 0;
				this.bulletY = 0;
				this.XTrajectory = 2.5; //2
				this.YTrajectory = 2;
				if (this == Defender3) {
					this.YTrajectory *= -1; //top defender bullets start by going up instead of down
				}
				this.bulletWidth = 60;
				this.bulletHeight = 60;
				this.bulletHealth = 180;				
				this.bulletColor = "rgb(255,215,0)"
				this.bulletDamage = -90;
				this.bulletDestroyPointsGained = 60;
				this.defenderDestroyedPointsGained = 300;
				}				
			}					
		}

	canShoot() {
		let canShoot = false;
		if (this.levelArray == level1Defenders && this.health > 0 && Math.random() < this.chance) {
			canShoot = true;
			}
		else if (level1Defenders.length == 0 && this.levelArray == level2Defenders && this.health > 0){
			canShoot = true;
			}
		else if (level2Defenders.length == 0 && this.levelArray == level3Defenders && this.health > 0){
			canShoot = true;
			}
		return canShoot;
	}
	shoot() {
		if (this.canShoot()) {
			if (this.levelArray == level1Defenders && Math.random()) {
				this.listOfBullets.push([this.xpos, this.ypos + (this.height / 2), this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory])	
			}
			else if (this.levelArray == level2Defenders) {
				if (this.middleDefender) { //level 2 middle
					if (Math.random() < this.chance){ //shoots from top of Defender4
						this.listOfBullets.push([this.xpos, this.ypos, this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory])	
						}
					else if (Math.random() < this.chance) { //shoots from middle of defender4
						this.listOfBullets.push([this.xpos, this.ypos + (this.height / 2), this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory])	
						}
					if (Math.random() < this.chance) {
						this.listOfBullets.push([this.xpos, this.ypos + this.height, this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory])	
						}			
					}
				else if (Math.random() < this.chance) { //level 2 outer
					let buffer = 0;
					if (this.ypos + this.bulletHeight >= canvasHeight) { //fixes bullets getting caught in bottom of screen
						buffer = this.ypos - (canvasHeight - this.bulletHeight);
						}	
					this.listOfBullets.push([this.xpos, this.ypos - buffer, this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory])
					}									
				}
			else {
				if (this.middleDefender) { //level 3 middle
					if (Math.random() < this.chance){ //shoots from top of Defender1
						this.listOfBullets.push([this.xpos, this.ypos, this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory -2])	
						this.listOfBullets.push([this.xpos, this.ypos + (this.height / 3), this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory - 1])
						this.listOfBullets.push([this.xpos, this.ypos + ((this.height / 3) * 2), this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory - 1])
						this.listOfBullets.push([this.xpos, this.ypos + this.height, this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory - 2])
						}
					// else if (Math.random() < this.chance) { //shoots from top 3rd of defender1
					// 	// this.listOfBullets.push([this.xpos, this.ypos + (this.height / 3), this.bulletWidth, this.bulletHeight, this.YTrajectory, this.bouncing, this.XTrajectory])	
					// 	}
					// else if (Math.random() < this.chance) { //shoots from lower 3rd of defender1
					// 	// this.listOfBullets.push([this.xpos, this.ypos + ((this.height / 3) * 2), this.bulletWidth, this.bulletHeight, this.YTrajectory, this.bouncing, this.XTrajectory])	
					// 	}					
					// if (Math.random() < this.chance) {
					// 	// this.listOfBullets.push([this.xpos, this.ypos + this.height, this.bulletWidth, this.bulletHeight, this.YTrajectory, this.bouncing, this.XTrajectory])	
					// 	}			
					}
				else if (Math.random() < this.chance && this.ypos >= 0) { //level 3 outer
					let buffer = 0;
					if (this.ypos + this.bulletHeight >= canvasHeight) { //fixes bullets getting caught in bottom of screen
						buffer = this.ypos - (canvasHeight - this.bulletHeight);
					}	
					this.listOfBullets.push([this.xpos, this.ypos - buffer, this.bulletWidth, this.bulletHeight, this.bulletHealth, this.YTrajectory, this.bouncing, this.XTrajectory])
					}									
				}				
			}
	}
	moveBullets(context, playerX, playerY, playerWidth, playerHeight, cannonballArray, cannonballSize) {
		for (var i = 0; i < this.listOfBullets.length; i++) {
			if (this.listOfBullets[i][6]) { //if bouncing	
				if (this.listOfBullets[i][0] < this.bouncingDistance) {
					this.listOfBullets[i][0] += (this.listOfBullets[i][7]) + Math.ceil(((((this.bouncingDistance - this.listOfBullets[i][0]) / this.bouncingDistance) - 1) * -1) * (this.listOfBullets[i][7]) / 2);
					}
				else if (this.listOfBullets[i][0] > this.bouncingDistance[i] / 3){
					this.listOfBullets[i][0] -= (this.listOfBullets[i][7]) + Math.ceil(((((this.bouncingDistance - this.listOfBullets[i][0]) / this.bouncingDistance) - 1) * -1) * (this.listOfBullets[i][7]) / 2);
					}
				else {
					this.listOfBullets[i][6] = false;
					}
				}
			// else {
			// 	this.listOfBullets[i][0] -= this.listOfBullets[i][7]; //adds xtrajectory for this bullet 
			// 	}		
			this.listOfBullets[i][0] -= this.listOfBullets[i][7]; //adds xtrajectory for this bullet
			this.listOfBullets[i][1] -= this.listOfBullets[i][5]; //Y Trajectory	
			if (this.listOfBullets[i][1] + this.bulletHeight >= canvasHeight || this.listOfBullets[i][1] <= 0) { // Bounces off ceiling and floor by making negative the ytrajectory 
				this.listOfBullets[i][5] *= -1;
				}			 
			if (detectCollision(this.listOfBullets[i][0],this.listOfBullets[i][1],this.listOfBullets[i][2],this.listOfBullets[i][3],playerX,playerY,playerWidth,playerHeight)) {
				//Detects collision with player 
				if (this.levelArray == level1Defenders || this.middleDefender == true) {
					playerPoints += this.catchPointsGained;
					this.listOfBullets.splice(i,1);
					}
				else {
					this.listOfBullets[i][6] = true; //it is now bouncing off of player
					this.listOfBullets[i][0] = playerXPos + playerWidth + this.listOfBullets[i][7];						
					context.fillStyle = this.bulletColor;
					context.fillRect(this.listOfBullets[i][0], this.listOfBullets[i][1], this.bulletWidth, this.bulletHeight);							
					}											
				}

			else if (shieldActive && detectCollision(this.listOfBullets[i][0],this.listOfBullets[i][1],this.listOfBullets[i][2],this.listOfBullets[i][3],Shield1.xpos,Shield1.ypos, Shield1.width, Shield1.height)) {
				//Detects collision with Shield 
				if (this.levelArray == level1Defenders || this.middleDefender == true) {
					playerPoints += Math.ceil(this.catchPointsGained / 4);
					this.listOfBullets.splice(i,1);
					Shield1.health += this.bulletDamage;
					}
				else if (!this.listOfBullets[i][6]){ // if not already bouncing from player
					this.listOfBullets[i][6] = true; //it is now bouncing off of shield
					this.listOfBullets[i][0] = Shield1.xpos + Shield1.width + this.listOfBullets[i][7];											
					Shield1.health += this.bulletDamage / 6; // unlike bouncing off player, bouncing off shield does a little damage
					context.fillStyle = this.bulletColor;
					context.fillRect(this.listOfBullets[i][0], this.listOfBullets[i][1], this.bulletWidth, this.bulletHeight);							
					}
				else { //if it is bouncing and it hits the shield, do nothing but draw
					context.fillStyle = this.bulletColor;
					context.fillRect(this.listOfBullets[i][0], this.listOfBullets[i][1], this.bulletWidth, this.bulletHeight);
					}											
				}	
			else if (turretActive && detectCollision(this.listOfBullets[i][0],this.listOfBullets[i][1],this.listOfBullets[i][2],this.listOfBullets[i][3],Turret1.xpos,Turret1.ypos, Turret1.width, Turret1.height)) {
				//Detects collision with Turret 
				if (this.levelArray == level1Defenders || this.middleDefender == true) {
					playerPoints += Math.ceil(this.catchPointsGained / 4);
					this.listOfBullets.splice(i,1);
					Turret1.health += this.bulletDamage;
					}
				else if (!this.listOfBullets[i][6]){ // if not already bouncing from player
					this.listOfBullets[i][6] = true; //it is now bouncing off of shield
					this.listOfBullets[i][0] = Turret1.xpos + Turret1.width + this.listOfBullets[i][7];											
					Turret1.health += this.bulletDamage / 6; // unlike bouncing off player, bouncing off shield does a little damage
					context.fillStyle = this.bulletColor;
					context.fillRect(this.listOfBullets[i][0], this.listOfBullets[i][1], this.bulletWidth, this.bulletHeight);							
					}
				else { //if it is bouncing and it hits the Turret, do nothing but draw
					context.fillStyle = this.bulletColor;
					context.fillRect(this.listOfBullets[i][0], this.listOfBullets[i][1], this.bulletWidth, this.bulletHeight);
					}											
				}				
			else if (detectCollision(this.listOfBullets[i][0], this.listOfBullets[i][1], this.bulletWidth, this.bulletHeight, 0, 0, WallWidth, canvasHeight)) {
				//Detects collision with player wall
				WallHealth += this.bulletDamage;
				this.listOfBullets.splice(i,1);								
				}						
			else {
					context.fillStyle = this.bulletColor;
					context.fillRect(this.listOfBullets[i][0], this.listOfBullets[i][1], this.bulletWidth, this.bulletHeight);												
				}					
			}
		}
	list() { //puts defender into array of all defenders and an array with other defenders of the same level
		defenders.push(this);
		this.levelArray.push(this);
	}
	move() { 

		if (this.topDefender != "none" && this.topDefender.health > 0) {
			this.yMaxRange = this.topDefender.ypos + this.topDefender.height;
		}
		else if (this.bottomDefender != "none" && this.bottomDefender.health > 0) {
			this.yMinRange = this.bottomDefender.ypos;			
		}
		// else if (this.secondTopDefender != "none" &&)
		else {
			this.yMinRange = this.aloneYMinRange;
			this.yMaxRange = this.aloneYMaxRange;
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
		context.fillStyle = this.color;
		context.fillRect(this.xpos, this.ypos, this.width, this.height);
		}
}
//Player wall variables
var WallXPos = 0;
var WallYPos = 0;
var WallHealth = 1000;
var WallWidth = 35;
var WallColor = "rgb(50,50,50)";

///////////////////////////PLAYER VARIABLES

var playerPoints = 100;
var playerMoveSpeed = 7;
var playerWidth = 20;
var playerHeight = 80; //og 80
var playerXPos = WallWidth;
var playerYPos = (canvasHeight / 2) - (playerHeight / 2); //Middle of canvas
var playerColor = "rgb(100,100,100)";
var damageDoneToCaughtOuterBullets = 0; //can be increased with power ups

//Basic Cannonball variables
var cannonballHitsCanTake = 1;
var cannonballSize = 33;
var playerCannonballColor = "black";
var playerCannonballspeed = 13;
var shootInterval = 52 ; //Number of frames before player can shoot again. EX. At 60 fps, 30 frames would be half a second.
var framesElapsedSinceShot = 0; // Frames since last player generated Cannonball
var framesElapsedSinceTurretShot = 0;
var basicCannonballDamage = -20; 



//////////////Stat boosting variables
//When these are made true by spending points, the player can see a new stat that can be updated with points
var unrandomizedArray = ["attackSpeedBoost", "playerSizeBoost", "playerCannonballDamageBoost", "playerCannonballDurabilityBoost"]
var boostsUnavailable = []
var loopLength = unrandomizedArray.length; 
// Allows additions to stats. using unrandomizedArray.length would not work
//randomizes the array so player will get stats in different order each play through
for (var i = 0; i < loopLength; i++) { 
	let randomNum = Math.ceil(Math.random() * unrandomizedArray.length - 1)
	boostsUnavailable.push(unrandomizedArray[randomNum]) ;
	unrandomizedArray.splice(randomNum, 1);
}
var boostsAvailable = []

var attackSpeedBoostAvailable = false;
var playerSizeBoostAvailable = false;
var playerCannonballDamageBoostAvailable = false;
var playerCannonballDurabilityBoostAvailable = false;

//Tallies for amount improved with stat boosts
var SizeIncreasedAmount = 0; // tally total amount increased
var shootIntervalReduction = 0; //amount it has been reduced. for display
var IncreasedDamageAmount = 0; //for player's cannonballs
var IncreasedHitsCanTakeAmount = 0

var attackSpeedBoostAmount = 1; //frames between shots reduction
var playerSizeBoostAmount = 8;
var playerCannonballDamageBoost = -5;
var playerCannonballHitsCanTakeBoost = 1;
//Upgrade Costs
var newStatCost = 100;
var newCardCost = 200;
var sizeBoostCost = 80;
var cannonballDamageBoostCost = 100;
var cannonballDurabilityBoostCost = 70;
var attackSpeedBoostCost = 65;
var costMultiplier = 1.14; //each purchase of a stat boost increases the cost by this much

/////////////Card Variables
//These can be unlocked with points and used by spending more points
unrandomizedArray = ["turret","shield"]
var cardsUnavailable = [];
var cardsAvailable = [];
var loopLength = unrandomizedArray.length // Allows additions to cards. using unrandomizedArray.length would not work
//randomizes the array so player will get cards in different order each play through
for (var i = 0; i < loopLength; i++) { //randomizes the array so player will get stats in different order each play through
	let randomNum = Math.ceil(Math.random() * unrandomizedArray.length - 1)
	cardsUnavailable.push(unrandomizedArray[randomNum]) ;
	unrandomizedArray.splice(randomNum, 1);
}
var CardTurretAvailable = false; //When true, the player may buy individual uses of each card
var CardShieldAvailable = false;
var shieldActive = false; // When true, the card is currently in use on the field
var turretActive = false;

//Shield Card Variables
var shieldXPos = WallWidth + playerWidth + 100;
var shieldYPos = 50;
var shieldWidth = 25;
var shieldHeight = 156;
var shieldMoveSpeed = 0.8;
var shieldHealth = 500;
var shieldColor = "blue";
var shieldCostPerUse = 400;

//Turret Card Variables
var turretXPos = 0;
var turretYPos = 0; // Will be randomized
var turretWidth =  WallWidth + playerWidth + 30;
var turretHeight = 40;
var turretHealth = 200;
var turretCannonballWidth = 10;
var turretCannonballHeight = 50;
var turretCannonballSpeed = 3;
var turretShootInterval = 70;
var turretColor = "blue";
var turretCostPerUse = 400;
var turretCannonballHitsCanTake = 5;


//Enemy Wall Health variables
var EnemyWallHealth = 1000;
var enemyWallWidth = 80;
var enemyWallXPos = canvasWidth - enemyWallWidth;
var enemyWallColor = "rgb(30, 110,30)"

///////////////////Enemy Defender stats (the different bullet trajectory speeds are declared in the Defender class definition)

var defenderGap = 80;
var defenderWidth = 20;
var middleDefenderColor = "rgb(10,10,10)";
var outerDefenderColor = "green";
var level1DefenderColor = "red";

//////Each Defender's chance of shooting
var middleLevel3ChanceOfShooting = 0.07;
var outerLevel3ChanceOfShooting = 0.007; 
var middleLevel2ChanceOfShooting = 0.04;
var outerLevel2ChanceOfShooting = 0.005;
var level1ChanceOfShooting = 0.022;

//////Defender1 (closest to enemy wall)x level 3 middle
var defender1Xpos = canvasWidth - enemyWallWidth - defenderGap - defenderWidth;
var defender1Ypos = 30;
var defender1YTopRange = 35;
var defender1YBottomRange = canvasHeight - 35;
var defender1Health = 2000;
var defender1Height = 300;
var defender1Speed = .8;
var defender1Color = middleDefenderColor
var defender1TopDefender = "none";
var defender1BottomDefender = "none";
//////Defender2 level 3 low defender
var defender2Height = 15;
var defender2Xpos = canvasWidth - enemyWallWidth - defenderGap - defenderWidth;
var defender2Ypos = canvasHeight - defender2Height; 
var defender2YTopRange = 0; // Will change depending on current Defender1 possition
var defender2YBottomRange = canvasHeight;
var defender2Health = 600;
var defender2Speed = 4.5;
var defender2TopDefender = "none";
var defender2BottomDefender = "none";
var defender2Color = outerDefenderColor;
//////Defender3 level 3 high defender
var defender3Height = 20;
var defender3Xpos = canvasWidth - enemyWallWidth - defenderGap - defenderWidth;
var defender3Ypos = 10;
var defender3YTopRange = 0;
var defender3YBottomRange = canvasHeight; // Will change depending on current Defender1 possition
var defender3Health = 600;
var defender3Speed = 4;
var defender3TopDefender = "none";
var defender3BottomDefender = "none";
var defender3Color = outerDefenderColor;

//////Defender4 x level 2 middle
var defender4Xpos = canvasWidth - enemyWallWidth - (defenderGap * 2) - (defenderWidth * 2);
var defender4Ypos = 150;
var defender4YTopRange = 50;
var defender4YBottomRange = canvasHeight - 50;
var defender4Health = 1000;
var defender4Height = 300;
var defender4Speed = 2;
var defender4Color = middleDefenderColor
var defender4TopDefender = "none";
var defender4BottomDefender = "none";
//////Defender5 bottom
var defender5Height = 25;
var defender5Width = 50;
var defender5Xpos = canvasWidth - enemyWallWidth - (defenderGap * 2) - (defenderWidth * 2) - (defender5Width / 2) + (defenderWidth / 2);
var defender5Ypos = canvasHeight - defender5Height - 5;
var defender5YTopRange = 0; //Will change as Defender4 moves
var defender5YBottomRange = canvasHeight - 5;
var defender5Health = 400;
var defender5Speed = 7.5;
var defender5TopDefender = "none";
var defender5BottomDefender = "none";
var defender5Color = outerDefenderColor;
//////Defender6 top
var defender6Height = 25;
var defender6Width = 50;
var defender6Xpos = canvasWidth - enemyWallWidth - (defenderGap * 2) - (defenderWidth * 2) - (defender6Width / 2) + (defenderWidth / 2);
var defender6Ypos = 5;
var defender6YTopRange = 0;
var defender6YBottomRange = canvasHeight; //Will change as Defender4 moves
var defender6Health = 400;
var defender6Speed = 7;
var defender6TopDefender = "none";
var defender6BottomDefender = "none";
var defender6Color = outerDefenderColor;

//////////////////Level 1 Defenders
//////Defender7 
var defender7Xpos = canvasWidth - enemyWallWidth - (defenderGap * 3) - (defenderWidth * 3);
var defender7Ypos = 150;
var defender7YTopRange = 70;
var defender7YBottomRange = canvasHeight - 30;
var defender7Health = 270;
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
var defender8Health = 290;
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
var defender9Health = 280;
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
var defender10Health = 300;
var defender10Height = 100;
var defender10Speed = 9;
var defender10TopDefender = "none";
var defender10BottomDefender = "none";
var defender10Color = level1DefenderColor;

//Barrier Variables
var barrierWidth = 5;
//Barrier1
var barrier1XPos = defender7Xpos + 50;
var barrier1Color = "grey";
//Barrier2
var barrier2XPos = defender4Xpos + 50;
var barrier2Color = "grey";


/////Barriers
var Barrier1 = new Barrier(barrier1XPos, barrierWidth, barrier1Color);
Barrier1.list(barriers);
var Barrier2 = new Barrier(barrier2XPos, barrierWidth, barrier2Color);
Barrier2.list(barriers);

//goingUp is a boolean that tells if defender is going up or down. Boolean is swapped once it reaches the outer range
//////////////Initialize Structures
/////Defenders
var Defender1 = new Defender(defender1Xpos, defender1Ypos, defender1YTopRange, defender1YBottomRange, defenderWidth,defender1Height,defender1Color,defender1Speed,defender1Health,true,true, defender1TopDefender, defender1BottomDefender, level3Defenders, middleLevel3ChanceOfShooting);
Defender1.list();
var Defender2 = new Defender(defender2Xpos, defender2Ypos, defender2YTopRange, defender2YBottomRange, defenderWidth,defender2Height,defender2Color,defender2Speed,defender2Health,false,true, defender2TopDefender, defender2BottomDefender, level3Defenders, outerLevel3ChanceOfShooting);
Defender2.list();
var Defender3 = new Defender(defender3Xpos, defender3Ypos, defender3YTopRange, defender3YBottomRange, defenderWidth,defender3Height,defender3Color,defender3Speed,defender3Health,false,true, defender3TopDefender, defender3BottomDefender, level3Defenders, outerLevel3ChanceOfShooting);
Defender3.list();
var Defender4 = new Defender(defender4Xpos, defender4Ypos, defender4YTopRange, defender4YBottomRange, defenderWidth,defender4Height,defender4Color,defender4Speed,defender4Health,true,true, defender4TopDefender, defender4BottomDefender, level2Defenders, middleLevel2ChanceOfShooting);
Defender4.list();
var Defender5 = new Defender(defender5Xpos, defender5Ypos, defender5YTopRange, defender5YBottomRange, defender5Width,defender5Height,defender5Color,defender5Speed,defender5Health,false,true, defender5TopDefender, defender5BottomDefender, level2Defenders, outerLevel2ChanceOfShooting);
Defender5.list();
var Defender6 = new Defender(defender6Xpos, defender6Ypos, defender6YTopRange, defender6YBottomRange, defender6Width,defender6Height,defender6Color,defender6Speed,defender6Health,false,true, defender6TopDefender, defender6BottomDefender, level2Defenders, outerLevel2ChanceOfShooting);
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

////////Shield 
var Shield1 = new Shield(shieldXPos, shieldYPos, shieldWidth, shieldHeight, shieldMoveSpeed, shieldHealth, shieldColor);
// Shield1.activate();

////////Turret
var Turret1 = new Turret(turretXPos, turretYPos, turretWidth, turretHeight, turretColor, turretHealth, turretCannonballSpeed, turretCannonballWidth, turretCannonballHeight);
// Turret1.activate();

//Variables used to bypass keyboard studder/rappid fire
var leftKeyPress = false;
var spaceKeyPress = false;
var upKeyPress = false;
var downKeyPress = false;


//Start the game paused 
var paused = true;
var gameOver = false;

//Timer
var frame = 0;
var deciSec = 0;
var min = 0;
var sec = 0;
var stopTime = true;


//Run Game
displayStaticCosts()
function gameLoop() {
	//Clears board for next frame draw
	if (!paused){
	startTimer();
	context.clearRect(0, 0, canvasWidth, canvasHeight);

	//Listens for key strokes and key releases
	document.addEventListener('keydown', movePlayer, false);
	document.addEventListener('keyup', keyRelease, false);
	document.addEventListener('keydown', pauseGame, false);
	document.addEventListener('keydown', unpauseGame, true);

	//Creates player
	createPlayer(playerXPos, playerYPos, playerWidth, playerHeight,playerColor);


	//Creates player's and enemy's wall
	createWall(WallXPos, WallYPos, WallWidth, canvasHeight, WallColor)
	createWall(enemyWallXPos, 0, enemyWallWidth, canvasHeight, enemyWallColor)
	//Create Enemy Barriers
	drawBarriers(barriers, level1Defenders, level2Defenders);
	//Manages movement of players and projectiles
	makeMovementSmooth();
	trackPlayerCannonballs(defenders, cannonballSize, cannonballHitsCanTake, barriers, canvasHeight, playerPoints);
	//Create Defenders
	drawMoveShootHealthCheckDefenders(level1Defenders, level2Defenders);
	removeDefendersAndBarriers(level1Defenders, level2Defenders, level3Defenders, barriers);
	//Create Shield
	Shield1.moveShield(context);
	///////Display scores and cards under canvas
	Turret1.drawAndCheckHealthOfTurret(context);
	// Turrer1.shoot();

	//Displays remaining health of player's and enemy's wall
	displayHealth();
	displayStats();
	winOrLoseTest(WallHealth, EnemyWallHealth);		
		}
	else {
		document.addEventListener('keydown', unpauseGame, true);
		document.addEventListener('keydown', upgradePlayer, true);
		displayStats();
		displayHealth();
		winOrLoseTest();
		stopTimer();
		} 

	}


////////////Functions
/////TIMER
function startTimer() {
	if (stopTime) {
		timerCycle();
	}
}
function stopTimer() {
	stopTime = true;	
}
function timerCycle() {
		frame += 1;
		if (frame == 6) {
			frame = 0;
			deciSec	+= 1;
		}

		if (deciSec	 == 10) {
			sec += 1;
			deciSec = 0;
		}
		if (sec == 60) {
			min += 1;
			sec = 0;
		}
	document.getElementById("timer").innerHTML = "0" + min + ":" + sec + "." + deciSec;	 
}
//////BARRIERS
function drawBarriers(barriers, level1Defenders, level2Defenders) {
	if (level1Defenders.length > 0) {
		Barrier1.draw(context);
		}
	if (level2Defenders.length > 0) {
		Barrier2.draw(context);
		}
	}


//Create and display Functions
function createWall(xpos,ypos,width, height, color) {
	context.fillStyle = color;
	context.fillRect(xpos, ypos, width, height);	
}
function removeDefendersAndBarriers(level1Defenders, level2Defenders, level3Defenders, barriers) {
	for (var bar = 0; bar < level1Defenders.length; bar++) {
		if (level1Defenders[bar].health <= 0) {
			level1Defenders.splice(bar, 1);
		}

	}
	for (var bar = 0; bar < level2Defenders.length; bar++) {
		if (level2Defenders[bar].health <= 0) {
			level2Defenders.splice(bar, 1);
		}		
	}
	if (level1Defenders.length == 0 && barriers[0] == Barrier1) {
		barriers.splice(0, 1);
	}
	if (level2Defenders.length == 0) {
		barriers.splice(0, 1);
	}

}
function drawMoveShootHealthCheckDefenders(level1Defenders, level2Defenders) {
	for (var d = 0; d < defenders.length; d++) {
		if (defenders[d].health > 0) {
			defenders[d].move();
			defenders[d].shoot();
			defenders[d].moveBullets(context, playerXPos, playerYPos, playerWidth, playerHeight, cannonballs, cannonballSize);
		}
		else {
			defenders.splice(d,1);
		}
	}
}
function displayStaticCosts() {
	document.getElementById("cardCost").innerHTML = "Q(" + newCardCost + ")"
	document.getElementById("statCost").innerHTML = "E(" + newStatCost + ")"
}
function displayHealth() {
if (!gameOver) {
	document.getElementById('playerHealth').innerHTML = Math.floor(WallHealth) + " Wall HP";
}
	document.getElementById('points').innerHTML = playerPoints + " Points";
	document.getElementById('enemyHealth').innerHTML = EnemyWallHealth + " Wall HP";
	document.getElementById('defenderHealth').innerHTML = getCurrentDenfendersTotalHealth(defenders);
	
}
function displayStats() { // Displays current health of both walls

	if (attackSpeedBoostAvailable){
		document.getElementById("attackSpeed").style.visibility = "visible";
		document.getElementById("currentNextAttackSpeed").innerHTML = "ATTACK SPEED: " + shootInterval + "(-" + attackSpeedBoostAmount + ") frame delay</br>" + attackSpeedBoostCost + " Points";
	}
	if (playerSizeBoostAvailable) {
		document.getElementById("playerSize").style.visibility = "visible";		
		document.getElementById("currentNextSize").innerHTML = "SIZE: " + playerHeight + "(+" + playerSizeBoostAmount + ") </br>" + sizeBoostCost + " Points";
	}	
	if (playerCannonballDamageBoostAvailable) {
		document.getElementById("cannonballDamage").style.visibility = "visible";		
		document.getElementById("currentNextDamage").innerHTML = "DAMAGE: " + basicCannonballDamage * -1 + "(+" + playerCannonballDamageBoost * -1 + ") </br>" + cannonballDamageBoostCost + " Points";
	}
	if (playerCannonballDurabilityBoostAvailable) {
		document.getElementById("cannonballDurability").style.visibility = "visible";		
		document.getElementById("currentNextDurability").innerHTML = "DURABILITY: " + cannonballHitsCanTake + "(+" + playerCannonballHitsCanTakeBoost + ") </br>" + cannonballDurabilityBoostCost + " Points";
	}
	if (CardShieldAvailable) {
		document.getElementById("shield").style.visibility = "visible";	
		document.getElementById("shield").innerHTML = "<h2>Shield(A)</h2><img src='shield.png'><h3>Cost " + shieldCostPerUse + "</br>press A to use</br>Remaining HP " + Shield1.health + "</h3>";
	}				
	if (CardTurretAvailable) {
		document.getElementById("turret").style.visibility = "visible";
		document.getElementById("turret").innerHTML = "<h2>Turret(D)</h2><img src='turret.png'><h3>Cost " + turretCostPerUse + "</br>press D to use</br>Remaining HP " + Turret1.health + "</h3>";			
		}
	}

function getCurrentDenfendersTotalHealth(defenders) {
	let total = 0;
	if (level1Defenders.length > 0) {
		for (var i = 0; i < level1Defenders.length; i++) {
			if (level1Defenders[i].health > 0){
				total += level1Defenders[i].health
			}
		}
	}
	else if (level2Defenders.length > 0) {
		for (var i = 0; i < level2Defenders.length; i++) {
			if (level2Defenders[i].health > 0){
				total += level2Defenders[i].health
			}
		}
	}
	else if (level3Defenders.length > 0) {
		for (var i = 0; i < level3Defenders.length; i++) {
			if (level3Defenders[i].health > 0){
				total += level3Defenders[i].health
			}
		}
	}
	return total
}
function createPlayer(xpos,ypos,width, height, color){
	context.fillStyle = color;
	context.fillRect(xpos, ypos, width, height);
	}


//Cannonball Functions
function createCannonball(xpos, ypos, cannonballHitsCanTake, cannonballwidth, cannonballheight, shooterHeight, turret) {
	cannonballs.push([xpos, ypos,cannonballHitsCanTake, cannonballwidth, cannonballheight, turret]);
	}
function drawCannonball(xpos, ypos, width, height, color) {
	context.fillStyle = color;
	context.fillRect(xpos, ypos, width, height); 
	}
function trackPlayerCannonballs(defenders, cannonballSize, cannonballHitsCanTake, barriers, canvasHeight) {
	//Also Tracks Turret Cannonballs
	//Increments frames since last shot
	framesElapsedSinceShot += 1; //counter to tell if player cannon can shoot again yet
	framesElapsedSinceTurretShot += 1;
	if (spaceKeyPress && framesElapsedSinceShot >= shootInterval) {
		createCannonball(playerXPos,playerYPos + (playerHeight * 0.5) - (cannonballSize * 0.5), cannonballHitsCanTake, cannonballSize, cannonballSize, playerHeight, false);//This math centers the Cannonball in the players platform
		framesElapsedSinceShot = 0;
	}
	if (turretActive && framesElapsedSinceTurretShot >= turretShootInterval) {
		createCannonball(Turret1.xpos, Turret1.ypos, turretCannonballHitsCanTake, Turret1.cannonballWidth, Turret1.cannonballHeight, Turret1.height, true);
		framesElapsedSinceTurretShot = 0;		
	}
	//Track basic cannonballs shot by player
	for (var c = 0; c < cannonballs.length; c++) {
		//Increment projectiles each frame
		if (!cannonballs[c][5]){
			cannonballs[c][0] += playerCannonballspeed;			
		}
		else {
			cannonballs[c][0] += Turret1.cannonballSpeed;			
		}

		drawCannonball(cannonballs[c][0], cannonballs[c][1], cannonballs[c][3], cannonballs[c][4], playerCannonballColor);
		//////Collision detection
		if (barriers.length > 0) {
			for (var bar = 0; bar < barriers.length; bar++) {
				if (detectCollision(cannonballs[c][0], cannonballs[c][1], cannonballSize, cannonballSize, barriers[bar].xpos, 0, barriers[bar].width, canvasHeight)) {
					//Does cannonball hit a barrier? if so, deletes cannonball
					cannonballs.splice(c,1);
					}
				}			
			}
		if (cannonballs[c][0] + cannonballSize > canvasWidth - enemyWallWidth) {
		// Does cannonball hit wall? Simple enough to not use full detectCollision function
			EnemyWallHealth += basicCannonballDamage;
			cannonballs.splice(c, 1);
			}
		else {
			for (var d = 0; d < defenders.length; d++) { // d represents each Defender in array.  //////////////DEFENDER LOOP//////////////////////
				//Checks for collision between Defenders and player cannonballs
				if (cannonballs[c][0] + cannonballSize >= defenders[d].xpos && (cannonballs[c][0]) <= defenders[d].xpos + defenders[d].width && cannonballs[c][1] <= defenders[d].ypos + defenders[d].height && cannonballs[c][1] + cannonballSize >= defenders[d].ypos) { 
				//Does cannonball hit a defender?
						cannonballs.splice(c, 1);
						if (defenders[d].health + basicCannonballDamage <= 0) { // If defender will be destroyed by this hit, add points to player points
							playerPoints += defenders[d].defenderDestroyedPointsGained;
						}
						if (cannonballs[c][5]) {
								defenders[d].health += basicCannonballDamage / 2 + 5;							
						}
						else {
								defenders[d].health += basicCannonballDamage;
						}
					}

				else if (defenders[d].listOfBullets.length > 0)	{ 
				// checks for collision between player and enemy projectiles 						
					for (var b = 0; b < defenders[d].listOfBullets.length; b++)	{
						if (defenders[d].levelArray == level1Defenders){
							if (detectCollision(cannonballs[c][0], cannonballs[c][1], cannonballSize, cannonballSize, defenders[d].listOfBullets[b][0], defenders[d].listOfBullets[b][1], defenders[d].bulletWidth, defenders[d].bulletHeight)) {
								//Checks for collision between level1 bullets and player cannonballs
								playerPoints += defenders[d].bulletDestroyPointsGained; 
								defenders[d].listOfBullets.splice(b,1);	
								cannonballs[c][2] -= 1;
								if (cannonballs[c][2] == 0) {
									cannonballs.splice(c,1)								
									}															
								}
							}
						else if (defenders[d].levelArray == level2Defenders){
							if (defenders[d].middleDefender) {
								if (detectCollision(cannonballs[c][0], cannonballs[c][1], cannonballSize, cannonballSize, defenders[d].listOfBullets[b][0], defenders[d].listOfBullets[b][1], defenders[d].bulletWidth, defenders[d].bulletHeight)) {
									//Checks for collision between level 2 middle bullets and player cannonballs
									playerPoints += defenders[d].bulletDestroyPointsGained; 
									defenders[d].listOfBullets.splice(b,1);  
									cannonballs[c][2] -= 1;
									if (cannonballs[c][2] == 0) {
										cannonballs.splice(c,1)										
										}																	
									}								
								}
							else {
								if (detectCollision(cannonballs[c][0], cannonballs[c][1], cannonballSize, cannonballSize, defenders[d].listOfBullets[b][0], defenders[d].listOfBullets[b][1], defenders[d].bulletWidth, defenders[d].bulletHeight)) {
									//Checks for collision between level2 outer bullets and player cannonballs									   									
								if (cannonballs[c][5]) {
										defenders[d].listOfBullets[b][4] += basicCannonballDamage / 2 + 5;							
								}
								else {
										defenders[d].listOfBullets[b][4] += basicCannonballDamage;
								}
									if (defenders[d].listOfBullets[b][4] <= 0) {									
										defenders[d].listOfBullets.splice(b,1);
										playerPoints += defenders[d].bulletDestroyPointsGained;
										}
									cannonballs.splice(c,1)														
									}
								}
							}
						else if (defenders[d].levelArray == level3Defenders){
							if (defenders[d].middleDefender) {
								if (detectCollision(cannonballs[c][0], cannonballs[c][1], cannonballSize, cannonballSize, defenders[d].listOfBullets[b][0], defenders[d].listOfBullets[b][1], defenders[d].bulletWidth, defenders[d].bulletHeight)) {
									//Checks for collision between level 3 middle bullets and player cannonballs
									playerPoints += defenders[d].bulletDestroyPointsGained;    
									defenders[d].listOfBullets.splice(b,1);  
									cannonballs[c][2] -= 1;
									if (cannonballs[c][2] == 0) {
										cannonballs.splice(c,1)										
										}																	
									}								
								}
							else {
								if (detectCollision(cannonballs[c][0], cannonballs[c][1], cannonballSize, cannonballSize, defenders[d].listOfBullets[b][0], defenders[d].listOfBullets[b][1], defenders[d].bulletWidth, defenders[d].bulletHeight)) {
									//Checks for collision between level 3 outer bullets and player cannonballs									   
									if (cannonballs[c][5]) {
										defenders[d].listOfBullets[b][4] += basicCannonballDamage / 2 + 5;							
										}
									else {
										defenders[d].listOfBullets[b][4] += basicCannonballDamage;
										}									
									if (defenders[d].listOfBullets[b][4] <= 0) {										
										defenders[d].listOfBullets.splice(b,1);
										playerPoints += defenders[d].bulletDestroyPointsGained;
										}
									cannonballs.splice(c,1)														
									}
								}
							}														
							}														
						}
						
					}	
				}	 			
			}


		}
	
		

//Collision detection functions
function detectCollision(item1X, item1Y, item1Width, item1Height, item2X, item2Y, item2Width, item2Height) {
	let itemsCollide = false;
	if (item1X + item1Width > item2X && item1X < item2X + item2Width && item1Y + item1Height > item2Y && item1Y < item2Y + item2Height) {
		itemsCollide = true
		}
	return itemsCollide;
}

//Damage calculation functions




//Player movement functions
function pauseGame(e) {
	if (e.keyCode == 80) {
		paused = true;
	}
}
function unpauseGame(e) {
	if (e.keyCode == 85) {
		paused = false;
	}
	
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
	
	}
function upgradePlayer(e) {
	if (e.keyCode == 69 && playerPoints >= newStatCost) { //E
		  	if (boostsAvailable.length == 0) {
		  		if (boostsUnavailable[0] == "attackSpeedBoost") {
		  			attackSpeedBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("attackSpeedBoost");
		  			playerPoints -= newStatCost;
		  			}
		  		else if (boostsUnavailable[0] == "playerSizeBoost") {
		  			playerSizeBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerSizeBoost");
		  			playerPoints -= newStatCost;	  			
		  			} 
		  		else if (boostsUnavailable[0] == "playerCannonballDamageBoost") {
		  			playerCannonballDamageBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerCannonballDamageBoost");
		  			playerPoints -= newStatCost;	  			
		  			}
		  		else if (boostsUnavailable[0] == "playerCannonballDurabilityBoost") {
		  			playerCannonballDurabilityBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerCannonballDurabilityBoost");
		  			playerPoints -= newStatCost;
		  				}
		  		}
		  	else if (boostsAvailable.length == 1) {
		  		if (boostsUnavailable[0] == "attackSpeedBoost") {
			  		attackSpeedBoostAvailable = true;
			  		boostsUnavailable.splice(0, 1);
			  		boostsAvailable.push("attackSpeedBoost");
			  		playerPoints -= newStatCost;		  			
		  			}
		  		else if (boostsUnavailable[0] == "playerSizeBoost") {
		  			playerSizeBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerSizeBoost");
		  			playerPoints -= newStatCost;	
		  			}
		  		else if (boostsUnavailable[0] == "playerCannonballDamageBoost") {
		  			playerCannonballDamageBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerCannonballDamageBoost");
		  			playerPoints -= newStatCost;		  			
		  			}
		  		else if (boostsUnavailable[0] == "playerCannonballDurabilityBoost") {
		  			playerCannonballDurabilityBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerCannonballDurabilityBoost");
		  			playerPoints -= newStatCost;
		  				}		  			
		  		}
		  	else if (boostsAvailable.length == 2) {
		  		if (boostsUnavailable[0] == "attackSpeedBoost") {
			  		attackSpeedBoostAvailable = true;
			  		boostsUnavailable.splice(0, 1);
			  		boostsAvailable.push("attackSpeedBoost");
			  		playerPoints -= newStatCost;		  			
		  			}
		  		else if (boostsUnavailable[0] == "playerSizeBoost") {
		  			playerSizeBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerSizeBoost");
		  			playerPoints -= newStatCost;	
		  			}
		  		else if (boostsUnavailable[0] == "playerCannonballDamageBoost"){
		  			playerCannonballDamageBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerCannonballDamageBoost");
		  			playerPoints -= newStatCost;		  			
		  			}	 
		  		else if (boostsUnavailable[0] == "playerCannonballDurabilityBoost") {
		  			playerCannonballDurabilityBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerCannonballDurabilityBoost");
		  			playerPoints -= newStatCost;
		  				}		  			 			
		  		}
		  	else if (boostsAvailable.length == 3) {
		  		if (boostsUnavailable[0] == "attackSpeedBoost") {
			  		attackSpeedBoostAvailable = true;
			  		boostsUnavailable.splice(0, 1);
			  		boostsAvailable.push("attackSpeedBoost");
			  		playerPoints -= newStatCost;		  			
		  			}
		  		else if (boostsUnavailable[0] == "playerSizeBoost") {
		  			playerSizeBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerSizeBoost");
		  			playerPoints -= newStatCost;	
		  			}
		  		else if (boostsUnavailable[0] == "playerCannonballDamageBoost"){
		  			playerCannonballDamageBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerCannonballDamageBoost");
		  			playerPoints -= newStatCost;		  			
		  			}	 
		  		else if (boostsUnavailable[0] == "playerCannonballDurabilityBoost") {
		  			playerCannonballDurabilityBoostAvailable = true;
		  			boostsUnavailable.splice(0, 1);
		  			boostsAvailable.push("playerCannonballDurabilityBoost");
		  			playerPoints -= newStatCost;
		  				}		  			 			
		  		}		  		
		  	}
		if (e.keyCode == 81 && playerPoints >= newCardCost) { //Q
			if (cardsAvailable.length == 0) {
				if (cardsUnavailable[0] == "turret") {
					CardTurretAvailable = true;
					cardsUnavailable.splice(0,1);
					cardsAvailable.push("turret")
					playerPoints -= newCardCost;
				}
				else if (cardsUnavailable[0] == "shield") {
					CardShieldAvailable = true;
					cardsUnavailable.splice(0,1);
					cardsAvailable.push("shield")
					playerPoints -= newCardCost;
				}
			}
			else if (cardsUnavailable.length == 1) {
				if (cardsUnavailable[0] == "turret") {
					CardTurretAvailable = true;
					cardsUnavailable.splice(0,1);
					cardsAvailable.push("turret")
					playerPoints -= newCardCost;
				}
				else if (cardsUnavailable[0] == "shield") {
					CardShieldAvailable = true;
					cardsUnavailable.splice(0,1);
					cardsAvailable.push("shield")
					playerPoints -= newCardCost;
				}
			}
	} 
	if (e.keyCode == 82 && playerPoints >= sizeBoostCost && playerSizeBoostAvailable && playerHeight < canvasHeight) {
		playerHeight += playerSizeBoostAmount;
		playerPoints -= sizeBoostCost;
		cannonballSize += 2; // help make up for being unable to hit things on the edges
		sizeBoostCost = Math.floor(sizeBoostCost * costMultiplier)
		SizeIncreasedAmount += playerSizeBoostAmount; // tally total amount increased		
		}
	if (e.keyCode == 84 && playerPoints >= cannonballDamageBoostCost && playerCannonballDamageBoostAvailable) {
		basicCannonballDamage += playerCannonballDamageBoost;
		playerPoints -= cannonballDamageBoostCost;
		cannonballDamageBoostCost = Math.floor(cannonballDamageBoostCost * costMultiplier);
		IncreasedDamageAmount += playerCannonballDamageBoost; // tally total amount increased
		}
	if (e.keyCode == 88 && playerPoints >= cannonballDurabilityBoostCost && playerCannonballDurabilityBoostAvailable) {
		cannonballHitsCanTake += playerCannonballHitsCanTakeBoost;
		playerPoints -= cannonballDurabilityBoostCost;
		cannonballDurabilityBoostCost = Math.floor(cannonballDurabilityBoostCost * costMultiplier);
		IncreasedHitsCanTakeAmount += playerCannonballHitsCanTakeBoost; // tally total amount increased
		}
	if (e.keyCode == 70 && playerPoints >= attackSpeedBoostCost && attackSpeedBoostAvailable && shootInterval > 1) {
		shootInterval -= attackSpeedBoostAmount;
		playerPoints -= attackSpeedBoostCost;
		attackSpeedBoostCost = Math.floor(attackSpeedBoostCost * costMultiplier);
	  	shootIntervalReduction += 1; // tally total amount improved
		}
	if (e.keyCode == 65 && playerPoints >= shieldCostPerUse && CardShieldAvailable && !shieldActive) {
		Shield1.activate();
		Shield1.health = shieldHealth;
		playerPoints -= shieldCostPerUse;
		}
	if (e.keyCode == 68 && playerPoints >= turretCostPerUse && CardTurretAvailable && !turretActive) {
		Turret1.activate();
		Turret1.health = turretHealth;
		playerPoints -= turretCostPerUse;
		}
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
function winOrLoseTest(WallHealth, EnemyWallHealth) {
	if (WallHealth <= 0 && !gameOver) {
		paused = true;
		document.getElementById('playerHealth').innerHTML = "<h1>YOU LOSE</h1><p> Press U to keep playing</p><p>Refresh page to try again</p>";
		document.getElementById("playerHealth").style.color = "red";
		gameOver = true;
	}
	if (EnemyWallHealth <= 0 && !gameOver) {
		paused = true;
		document.getElementById('playerHealth').innerHTML = "<h1>YOU WIN</h1><p> Press U to keep playing</p><p>Refresh page to try again</p>";
		document.getElementById("playerHealth").style.color = "red";
		gameOver = true;
	}	
}


