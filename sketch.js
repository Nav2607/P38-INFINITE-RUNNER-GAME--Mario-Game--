var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, marioRunning, marioCollided;
var ground, groundImg, invisibleGround;
var obstaclesGroup, obstacleImg, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bricksGroup, brickImg;
var bg;
var gameOver, gameOverImg; 
var restart, restartImg;
var jumpSound, dieSound, checkpointSound
var score=0;

function preload(){
  bg=loadImage("bg.png")
  marioRunning = loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  marioCollided = loadAnimation("collided.png");
  
  groundImg = loadImage("ground2.png");
  
  brickImg = loadImage("brick.png");
  
  obstacleImg = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkPoint.mp3")  
}

function setup() {
  createCanvas(600, 350);
  
  mario = createSprite(50,295,20,50),
  mario.addAnimation("running",marioRunning);
  mario.addAnimation("collided", marioCollided);
  mario.scale = 1.5;

  ground = createSprite(200,330,400,20);
  ground.addImage("ground",groundImg);
  ground.velocityX = -(2);
  ground.x = ground.width /2;
    
  invisibleGround = createSprite(200,300,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  bricksGroup = new Group();
  obstaclesGroup = new Group();
  
textSize(20);
  score = 0;
}

function draw(){
  background(bg);
  text("Score: "+ score, 480,30);
 
 
  if(gameState === PLAY){
      ground.velocityX=-(12)

    if(keyDown("space") && mario.y >= 250) {
      mario.velocityY = -12;
      jumpSound.play();
    }
    
    if(score>0 && score%10 === 0){
      checkPointSound.play() 
    }
    mario.velocityY = mario.velocityY + 0.5
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    for (var i = 0; i < bricksGroup.length; i++) {
    
      if(bricksGroup.get(i).isTouching(mario)){
      bricksGroup.get(i).remove()
      score =score+1;
    }
    }
    mario.collide(invisibleGround);
    spawnbricks();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){             camera.position.x = mario.x
      gameState = END;
      jumpSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
  
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
   
    mario.changeAnimation("collided",marioCollided);
    
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnbricks() {
  //write code here to spawn the brick
  if (frameCount % 60 === 0) {
    var brick = createSprite(600,120,40,10);
    brick.y = Math.round(random(150,180));
    brick.addImage(brickImg);
    brick.scale = 1;
    brick.velocityX = -3;
    
     //assign lifetime to the variable
    brick.lifetime = 200;
    
    //adjust the depth
    brick.depth = mario.depth;
    mario .depth = mario.depth + 1;
    
    //add each brick to the group
    bricksGroup.add(brick);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,270,10,40);

    obstacle.velocityX = -(6);
    obstacle.addAnimation("obstacles",obstacleImg);
    obstacle.scale = 1;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}
 

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("running",marioRunning);
  
  
  score = 0;
  
}