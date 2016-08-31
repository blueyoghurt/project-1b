////////////
// Images //
////////////
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
  console.log('BG Image loaded');
};
bgImage.src = "img/background.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
  heroReady = true;
  console.log('hero image loaded');
};
heroImage.src= 'img/hero.png';

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload =  function(){
  monsterReady = true;
};
monsterImage.src = 'img/monster.png';

//////////////////
// Game objects //
//////////////////
var hero = {
  speed: 256, // movement in pixels per second
  x: 0,
  y: 0
};
var monster = {
  x: 0,
  y: 0
};
var monstersCaught = 0;

/////////////////////
// Event Listeners //
/////////////////////
document.addEventListener('DOMContentLoaded',function(){
  console.log('DOM Content Loaded');

  // Create the canvas
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 480;
  document.getElementById('canvas-container').appendChild(canvas);

  ctx.canvas.addEventListener('mousemove', function (event) {
    console.log('tracking');
    var mouseX = event.clientX - ctx.canvas.offsetLeft;
    var mouseY = event.clientY - ctx.canvas.offsetTop;
    var mouse
    console.log('hero image loaded');Y = event.clientY - ctx.canvas.offsetTop;
    var status = document.getElementById('status');
    status.textContent = mouseX + ' | ' + mouseY;
  }); //mousemove event listener

  //////////////////////////////
  // Handle keyboard controls //
  //////////////////////////////
  var keysDown = {};

  addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  }, false);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  // Reset the game when the player catches a monster
  var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
  }; //reset function

  // Update game objects
  var update = function (modifier) {
    if (38 in keysDown) { // Player holding up
      hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
      hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
      hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
      hero.x += hero.speed * modifier;
    }
    document.getElementById('heroposition').textContent = "Coordinates are: " + Math.floor(hero.x)+ " | " + Math.floor(hero.y);
    /////////////////////////
    // Collision Detection //
    /////////////////////////
    if (
      hero.x <= (monster.x + 32)
      && monster.x <= (hero.x + 32)
      && hero.y <= (monster.y + 32)
      && monster.y <= (hero.y + 32)
    ) {
      ++monstersCaught;
      reset();
    }

    ////////////////////
    // Border Control //
    ///////////////////
    if (hero.x <= 0) { hero.x = 0; }
    if (hero.y <= 0) { hero.y = 0; }
    if (hero.x > 480) { hero.x = 480; }
    if (hero.y > 448) { hero.y = 448; }

  }; //update function

  // Draw everything
  var render = function () {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
      ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
      ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 0)";
    ctx.font = "24px 'Open Sans'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);
  }; //render

  // The main game loop
  var main = function () {
    var now = Date.now();
    var delta = now - then;
    console.log("Delta is",delta);

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
  };

  // Cross-browser support for requestAnimationFrame
  var w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

  // Let's play this game!
  var then = Date.now();
  reset();
  main();

}); // DOMContentLoaded
