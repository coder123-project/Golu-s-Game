var bg, bgImg;
var plane, shooterImg, shooter_shooting;
var zombie, zombieImg;
var blastImg
var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;
var deadImg
var obsGroup;
var shootingSound, loseSound, winSound;
var bullets = 70;
var life = 3;
var explosionSound
var gameState = "fight"
var score = 0
var bg2Img
function preload() {

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")
  blastImg = loadImage("assets/blast.png")
  op1Image = loadImage("assets/op1.png")
  op2Image = loadImage("assets/op2.png")
  op3Image = loadImage("assets/op3.png")
  bgImg = loadImage("assets/bg.jpg")
  planeImg = loadImage("assets/plane.png")
  bulletImg = loadImage("assets/R.png")


  //shootingSound = loadSound("assets/explosion.mp3")
  // explosionSound = loadSound("assets/explosion.wav")
  //loseSound = loadSound("assets/lose.mp3")
  //winSound = loadSound("assets/win.mp3")

}

function setup() {


  createCanvas(windowWidth, windowHeight);

  //adding the background image
  bg = createSprite(displayWidth / 2 - 20, displayHeight / 2 - 40, 20, 20)
  bg.addImage(bgImg)
  bg.scale = 1.1


  //creating the plane sprite
  plane = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  plane.addImage(planeImg)
  plane.scale = 0.3
  plane.debug = true
  plane.setCollider("rectangle", 0, 0, 300, 300)


  //creating sprites to depict lives remaining
  heart1 = createSprite(displayWidth - 150, 40, 20, 20)
  heart1.visible = false
  heart1.addImage("heart1", heart1Img)
  heart1.scale = 0.4

  heart2 = createSprite(displayWidth - 100, 40, 20, 20)
  heart2.visible = false
  heart2.addImage("heart2", heart2Img)
  heart2.scale = 0.4

  heart3 = createSprite(displayWidth - 150, 40, 20, 20)
  heart3.addImage("heart3", heart3Img)
  heart3.scale = 0.4


  //creating groups for zombies and bullets
  bulletGroup = new Group()
  obsGroup = new Group()



}

function draw() {
  background(0);


  if (gameState === "fight") {

    if (life === 3) {
      heart3.visible = true
      heart1.visible = false
      heart2.visible = false
    }
    if (life === 2) {
      heart2.visible = true
      heart1.visible = false
      heart3.visible = false
    }
    if (life === 1) {
      heart1.visible = true
      heart3.visible = false
      heart2.visible = false
    }

    //go to gameState "lost" when 0 lives are remaining
    if (life === 0) {
      heart1.visible = false
      heart3.visible = false
      heart2.visible = false
      gameState = "lost"
      //loseSound.play()
    }
    if (score == 100) {
      //winSound.play()
      gameState = "win"

    }


    if (keyDown("UP_ARROW") || touches.length > 0) {
      plane.y = plane.y - 30
    }
    if (keyDown("DOWN_ARROW") || touches.length > 0) {
      plane.y = plane.y + 30
    }



    if (keyDown("space")) {
      bullet = createSprite(displayWidth - 1150, plane.y + 30, 20, 10)
      bullet.addImage(bulletImg)
      bullet.scale = 0.08
      bullet.velocityX = 20
      bulletGroup.add(bullet)
      plane.depth = bullet.depth
      plane.depth = plane.depth + 2

      bullets = bullets - 1
      //shootingSound.play()
    }

    //plane goes back to original standing image once we stop pressing the space bar

    //go to gameState "bullet" when plane runs out of bullets
    if (bullets == 0) {
      gameState = "bullet"
      // loseSound.play()
    }


    if (bulletGroup.isTouching(obsGroup)) {
      for (var i = 0; i < obsGroup.length; i++) {
        //write a condition for obsGroup touches bulletGroup
        if (obsGroup[i].isTouching(bulletGroup)) {
          var blast = createSprite(obsGroup[i].x, obsGroup[i].y, 50, 50)
          blast.addImage(blastImg)
          blast.life = 10
          blast.scale = 0.3
          //explosionSound.play()
          //explosionSound.setVolume(0.4)
          score += 5

          bulletGroup.destroyEach()
          obsGroup[i].destroy()
        }

      }
    }


    if (obsGroup.isTouching(plane)) {

      for (var i = 0; i < obsGroup.length; i++) {

        if (obsGroup[i].isTouching(plane)) {
          obsGroup[i].destroy()
          life -= 1

        }

      }
    }

    enemy();
  }

  drawSprites();
  textSize(20)
  fill("red")
  text("Score: " + score, displayWidth - 200, displayHeight / 2 - 220)
  text("Bullets: " + bullets, displayWidth - 210, displayHeight / 2 - 250)


  if (gameState == "lost") {

    textSize(100)
    fill("red")
    text("You Lost", 400, 400)
    obsGroup.destroy()
    plane.destroy()



  }

  else if (gameState == "win") {

    textSize(100)
    fill("yellow")
    text("You Won ", 400, 400)
    obsGroup.destroyEach();
    plane.destroy();

  }

  else if (gameState == "bullet") {

    textSize(50)
    fill("yellow")
    text("You ran out of bullets!!!", 470, 410)
    obsGroup.destroyEach();
    plane.destroy();
    bulletGroup.destroyEach();

  }

}



function enemy() {
  if (frameCount % 60 === 0) {

    //giving random x and y positions for zombie to appear
    obstacle = createSprite(random(1300, 1300), random(100, 500), 40, 40)
    obstacle.scale = 0.40
    obstacle.velocityX = -(3+2*score/5)
    obstacle.debug = true
    obstacle.setCollider("rectangle", 0, 0, 400, 250)

    var randomObs = Math.round(random(1, 3))

    switch (randomObs) {
      case 1: obstacle.addImage(op1Image); break;
      case 2: obstacle.addImage(op2Image); break;
      case 3: obstacle.addImage(op3Image); break;
      default: break;
    }
    obstacle.lifetime = 400
    obsGroup.add(obstacle)
  }
}


