// The Rattlesnake Game //
// By Luke        //
// Inspired by http://thecodeplayer.com/walkthrough/html5-game-tutorial-make-a-snake-game-using-html5-canvas-jquery //

$(document).ready(function(){
  console.log('DOMContentLoaded');

  // Creating the canvas
  var canvas  = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var w = canvas.width  = 520;
  var h = canvas.height = 520;
  document.getElementById('canvas-container').appendChild(canvas);

  //define the variables used in the game
  var cellWidth = 20;
  var direction, preventDirection;
  var food = {};
  var score;
  var levelModifier=1;
  var gameovermusic = document.getElementById('gameover');

  // Create the Rattlesnake in an array
  var snake = [];
  var tail;
  // paintBackground();

  function init (){
    console.log('in the init function');

    var fps = 1000/20; //20 Frame per seconds?

    direction = "right" //default direction

    createSnake();
    createFood();
    score = 0;

    if (typeof game_loop != "undefined") {clearInterval(game_loop);} // not sure what this is for
    game_loop = setInterval(moveSnake, fps);

    // listen to keyboard events. only set this up once!
    document.addEventListener('keydown',function(e){
      if (e.keyCode === 37 && preventDirection != "left"){ direction = "left"; }
      if (e.keyCode === 38 && preventDirection != "up"){ direction = "up"; }
      if (e.keyCode === 39 && preventDirection != "right"){ direction = "right"; }
      if (e.keyCode === 40 && preventDirection != "down"){ direction = "down"; }
    });

  } // init function
  init();

  function createSnake(){
    length = 5;
    for (i = 0; i < length ; i++ ){
      snake.push({x:i*cellWidth, y:0*cellWidth});
    }
    snake = snake.reverse();
    paintSnake();
  }

  function paintSnake(){
    paintBackground();
    paintFood();
    ctx.fillStyle = "red";
    for (i = 0;  i< snake.length; i++){
      ctx.fillRect(snake[i].x,snake[i].y,cellWidth,cellWidth);
    }
    tail = snake.length - 1;
  }

  function createFood(){
    food.x = Math.floor(Math.random() * ((w/cellWidth)))*cellWidth;
    food.y = Math.floor(Math.random() * ((h/cellWidth)))*cellWidth;
    for (i = 0 ; i < snake.length; i++){
      if (food.x === snake[i].x && food.y === snake[i].y){
        createFood();
      } // if food is on the snake, respawn it.
    }
    // food = {
    //   x: Math.floor(Math.random() * (w-cellWidth+1)),
    //   y: Math.floor (Math.random() * (h-cellWidth+1))
    // }  // Defining food's x and y position prevents it from being accessed outside of this function. But how do i access it if i need to call it twice?
    paintFood()
  }

  function paintFood(){
    ctx.fillStyle = "blue";
    ctx.fillRect(food.x, food.y, cellWidth,cellWidth);
  }

  function moveSnake(){
    var hx = snake[0].x;
    var hy = snake[0].y;

    // moving the snake
    switch (direction){
      case "left":
      hx -= cellWidth;
      preventDirection = "right"
      break;
      case "up":
      hy -= cellWidth;
      preventDirection = "down"
      break;
      case "right":
      hx += cellWidth;
      preventDirection = "left"
      break;
      case "down":
      hy += cellWidth;
      preventDirection = "up"
      break;
    }
    // if it hits the wall, show up at the other side
    if (hx == -cellWidth) {hx = w-cellWidth} ;
    if (hy == -cellWidth) {hy = h-cellWidth} ;
    if (hx == w) {hx = 0} ;
    if (hy == h) {hy = 0} ;

    if (checkCollision(hx,hy,snake))
    { clearInterval (game_loop);}

    if (!checkFood(hx,hy)){
      snake.pop(); //remove the last one and add
      snake.unshift({x: hx, y: hy}); //add the new position as the head of snake
    } else {
      snake.unshift({x: hx, y: hy});
      createFood();
    }
    paintSnake();
  } // moveSnake

  function checkFood(x,y){
    if (x === food.x & y === food.y){
      score += (1 * levelModifier);
      console.log(score);
      return true;
    } else {
      return false;
    }
  }

  function checkCollision(x,y,array){
    for (i = 0; i < array.length; i ++){
      if (array[i].x == x && array[i].y == y){
        console.log('Game Over');
        console.log(gameovermusic);
        document.getElementById('gameover').play();
        return true;
      }
    } return false;
  }

  function paintBackground () {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,w,h);
  }
}); // DOMContentLoaded
