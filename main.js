document.addEventListener('DOMContentLoaded',function(){
  console.log('DOM Content Loaded');

  // Create the canvas
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 480;
  document.body.appendChild(canvas);

  ctx.canvas.addEventListener('mousemove', function (event) {
    console.log('tracking');
    var mouseX = event.clientX - ctx.canvas.offsetLeft;
    var mouseY = event.clientY - ctx.canvas.offsetTop;
    var status = document.getElementById('status');
    status.textContent = mouseX + ' | ' + mouseY;
  });
});
