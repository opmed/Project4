let gravity = 0.3;
let fly = -7;
let GROUND_Y = 450;
let colorfulSquare, ground;
let columns;
let gameOver;
let columnImg, groundImg;
let button;
let timer=0;
let song;

function preload() {
  soundFormats('ogg', 'mp3','m4a');
  song = loadSound('pic/GameSong.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  song.play();

  columnImg = loadImage('pic/column.png');

  colorfulSquare = createSprite(width/2, height/2, 40, 40);
  colorfulSquare.velocity.x = 12; //controls spead and spacing of columns

  columns = new Group();
  gameOver = true;

  button = createButton('New Game'); //create new button 
  button.position(19, 19); //setting position
  button.size(100,50); //size
  button.mousePressed( newGame); //if it's pressed, the newGmae function runs and resets

  //song.loop()
}

function draw() {

  if(gameOver && keyWentDown('x'))
    newGame();

  if(!gameOver) {

    if(keyWentDown('x'))
      colorfulSquare.velocity.y = fly;

    colorfulSquare.velocity.y += gravity;

    if(colorfulSquare.overlap(columns))
      die(); //if they overlap the game ends

    if(frameCount%60 == 0) { //spawn columns
      let columnH = random(100, -700); //randomizes column length
      let column = createSprite(colorfulSquare.position.x + width, GROUND_Y-columnH/2+1+100, 80, columnH);;
      column.addImage(columnImg);
      columns.add(column);
    }

    for(var i = 0; i<columns.length; i++) //get rid of passed columns
      if(columns[i].position.x < colorfulSquare.position.x-width/2)
        columns[i].remove();
    
  camera.position.x = colorfulSquare.position.x + width/4; //so it stays to the left

  background(181, 236, 255); //makes background lightblue
  drawSprites(columns); //draws columns
  drawSprite(colorfulSquare); //draws square
  }
    push()
     //background(181, 236, 255); //makes background lightblue
     text(timer,width-50, 30);
     if (frameCount % 30==0){
       timer++
     }
    pop()
}

function die() { //when the game is over
  updateSprites(false);
  gameOver = true; //the player lost/game is over
}

function newGame() { //resets the game again
  columns.removeSprites();
  gameOver = false;
  updateSprites(true);
  colorfulSquare.position.x = width/2; //setting position of square
  colorfulSquare.position.y = height/2; //setting position of square
  colorfulSquare.velocity.y = 0; //speed
}

function mousePressed() {  //square jumps everytime mouse is clicked
  colorfulSquare.velocity.y = fly;
}
