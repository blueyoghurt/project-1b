$(document).ready(function(){
  console.log('DOMContentLoaded');

  // HighScore information
  var dbRef = new Firebase('https://snake-7406a.firebaseio.com/');
  var highScoresRef = dbRef.child('highscores');
  var minHighScore;
  var highScoresArray = [];

  // Creating the canvas
  var canvas  = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var w = canvas.width  = 520;
  var h = canvas.height = 520;
  document.getElementById('canvas-container').appendChild(canvas);

  //define the variables used in the game
  var cellWidth = 10;
  var direction, preventDirection;
  var gameState = false;
  var pause = false;
  var gameOver = false;
  var score;
  var stage = 1;
  var food = {};
  var menu = {  main: document.getElementById('menu'),
  score: document.getElementById('announceScore'),
  announcement: document.getElementById('announcement'),
  button: document.getElementById('menubutton'),
  instruction: document.getElementById('instruction')}
  var message = { startMessage: "Are you ready?",
  startButton: "Begin",
  startInstruction: "Press space to begin",
  pauseMessage: "Have a break, Have a Kit Kat.",
  pauseButton: "Resume",
  pauseInstruction: "Press space to resume",
  endMessage: "Better luck next time!",
  endButton: "Restart",
  endInstruction: "Press space to restart"}
  var music = { gameover: document.getElementById('gameover'),
  food: document.getElementById('food'),
  loop: document.getElementById('loop')}

  function gameSpeed(){
    return (1000/(10*0.8*stage));
  }

  listenForKeys();
  findHighScore();

  function listenForKeys(){
    $(document).off('keydown'); // clear previous keydown events
    $(document).on('keydown', function(e){
      e.preventDefault();
      if (e.keyCode === 37 && preventDirection != "left"){ direction = "left"; }
      if (e.keyCode === 38 && preventDirection != "up"){ direction = "up"; }
      if (e.keyCode === 39 && preventDirection != "right"){ direction = "right"; }
      if (e.keyCode === 40 && preventDirection != "down"){ direction = "down"; }
      if (e.keyCode === 32) {checkStatus();}
    });
    //Wait for player's prompt to start game
    menu.button.addEventListener('click',function(){
      checkStatus();
    });
  };

  function checkStatus() {
    if (!gameState) {
      init();
      gameState = true;
    }else if (gameState){
      gPaused();
    }
    if (gameOver)
    restart();
  }

  var snake = [];
  // var obstacle =[];

  function init (){
    $('#highScoreBoard').hide();
    listenForKeys();
    // $('#menu').hide();
    menu.main.style.zIndex = "-1";
    music.loop.play()
    music.loop.loop = true;

    direction = "right" //default direction

    createSnake();
    createFood();
    score = 0;
    document.getElementById('keepScore').textContent = "Score:" + score;
    document.getElementById('keepStage').textContent = "Stage:" + stage;

    if (typeof game_loop != "undefined") {clearInterval(game_loop);} // not sure what this is for
    game_loop = setInterval(moveSnake, gameSpeed());
  } // init function

  function gPaused() {
    if (!pause){
      menu.main.style.zIndex = "1";
      menu.score.textContent = ("Stage: "+ stage + "   " + " Score: " + score) ;
      menu.announcement.textContent = message.pauseMessage;
      menu.button.textContent = message.pauseButton;
      menu.instruction.textContent = message.pauseInstruction;
      music.loop.pause();
      clearInterval(game_loop);
      pause = true;
    } else {
      menu.main.style.zIndex = "-1";
      music.loop.play();
      game_loop = setInterval(moveSnake,gameSpeed());
      pause = false;
    }
  }

  function restart (){
    gameOver = false;
    score = 0;
    stage = 1;
    init();
  }

  function createSnake(){
    snake =[];
    length = 10;
    for (i = 0; i < length ; i++ ){
      snake.push({x:i*cellWidth, y:0*cellWidth});
    }
    snake = snake.reverse();
    paintSnake();
  }

  // Paint the snake as well as repaint the background to prevent the trail.
  function paintSnake(){
    paintBackground();
    paintFood();
    ctx.fillStyle = "red";
    for (i = 0;  i< snake.length; i++){
      ctx.fillRect(snake[i].x,snake[i].y,cellWidth,cellWidth);
    }
  }

  function createFood(){
    food.x = Math.floor(Math.random() * ((w/cellWidth)))*cellWidth;
    food.y = Math.floor(Math.random() * ((h/cellWidth)))*cellWidth;
    for (i = 0 ; i < snake.length; i++){
      if (food.x === snake[i].x && food.y === snake[i].y){
        return createFood();
      } // if food is on the snake, respawn it.
    }
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

    checkCollision(hx,hy,snake);

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
      score += (1 * stage);
      checkStage();
      document.getElementById('keepScore').textContent = "Score:" + score;
      document.getElementById('keepStage').textContent = "Stage:" + stage;
      music.food.play();
      return true;
    } else {
      return false;
    }
  }

  function checkCollision(x,y,array){
    for (i = 0; i < array.length; i ++){
      if (array[i].x == x && array[i].y == y){
        isGameOver();
        return true;
      }
    } return false;
  }

  function isGameOver() {
    $(document).off('keydown');
    gameOverStuff();
    if (score > minHighScore){
      highScoreStuff();
    }
  }

  function gameOverStuff(){
    gameOver = true;
    gameState = false;
    clearInterval (game_loop);
    music.loop.pause();
    music.gameover.play();

    menu.main.style.zIndex = "1";
    menu.score.textContent = ("Stage: "+ stage + "   " + " Score: " + score) ;
    menu.announcement.textContent = message.endMessage;
    menu.button.textContent = message.endButton;
    menu.instruction.textContent = message.endInstruction;

    document.getElementById('keepScore').textContent = "";
    document.getElementById('keepStage').textContent = "";

    $(document).on('keydown',function(e){
      if (e.keyCode === 32){
        menu.main.style.zIndex = "-1";
        showHighScore();
      }
    });

  }

  function highScoreStuff(){
    $("#inputHighScore").show();
    $("#inputName").focus();
    $(document).on('keydown',function(e){
      if (e.keyCode == 13){
        highScoresRef.push({
          name: $('#inputName').val(),
          score: score
        });
        $('#inputName').val('');
        menu.main.style.zIndex = "-1";
        $("#inputHighScore").hide();
        showHighScore();
        findHighScore();
      }
    });
  }

  function showHighScore() {
    $('#highScoreBoard').show();
    $('#highScoreBoard').empty();

    $('#highScoreBoard').append('<p id="scoreBoardTitle">High Scores</p>')
    var table = $('<table>');
    console.log(highScoresArray.length);
    for (i=0; i<highScoresArray.length; i++ ){
      $(table).append(
        '<tr>'+
        '<td>' + highScoresArray[i].name + '</td>' +
        '<td>' + highScoresArray[i].score + '</td>' +
        '</tr>'
      )
    }

    $('#highScoreBoard').append(table).append('</br>')
    $('#highScoreBoard').append(($('<p>')).text('Press space to continue...'));

    $(document).on('keydown',function(e){
      if (e.keyCode === 32){
        menu.main.style.zIndex = "-1";
        $('#highScoreBoard').hide();
        checkStatus();
      }
    });
  }

  function checkStage(){
    if (score == 20 || score == 60 || score == 120 || score == 200 || score == 300 || score == 420 || score == 560 ){
      stage++;
      clearInterval(game_loop);
      game_loop = setInterval(moveSnake,gameSpeed());
    }
  }

  // setObstacles();
  //   function setObstacles(){
  //     var obslength = 5;
  //     var obs = Math.random();
  //     if (obs>0.5){
  //       var x = Math.floor(Math.random() * ((w-((obslength-1)*cellWidth))/cellWidth))*cellWidth;
  //       for (i = 0;  i < obslength; i++){
  //         obstacle.push({x:x*cellWidth, y:0*cellWidth});
  //         console.log(obstacle);
  //       }
  //     } else {
  //       var y = Math.floor(Math.random() * ((h-((obslength-1)*cellWidth))/cellWidth))*cellWidth;
  //       for (i = 0;  i < obslength; i++){
  //         obstacle.push({x:0*cellWidth, y:y*cellWidth});
  //         console.log(obstacle);
  //       }
  //     }
  //   }

  function paintBackground () {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,w,h);
  }

  function findHighScore(){
    highScoresArray =[];
    return highScoresRef.orderByChild('score').limitToLast(8).once('value', function(snapshot) {
      snapshot.forEach(function(snapshot){
        highScoresArray.push(snapshot.val());
      });
      minHighScore = highScoresArray[0].score
      highScoresArray.reverse();
      console.log(highScoresArray, minHighScore,highScoresArray.length);
    });
  }

}); // DOMContentLoaded
//
