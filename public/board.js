const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cols = 7;
const rows = 6;
const w = Math.floor(canvas.width/cols);
const rad = w/2.4;
let chosenCol = 0;
let gameState = 'PENDING';
let heights = [6, 6, 6, 6, 6, 6, 6];
let board = [];

canvas.addEventListener('mousemove', handleMouseMove);

function handleMouseMove(e) {
  chosenCol = Math.floor(e.offsetX/w);
  if (chosenCol == 7) chosenCol = 6;
  if (gameState == 'STARTED' && turn) {
    drawBoard(board);
    var xp = chosenCol*w+w/2;
    var yp = heights[chosenCol]*w-w/2;
    ctx.save();
    ctx.globalAlpha = 0.5;
    circle(xp, yp, rad, player == 1 ? "salmon" : "GoldenRod");
    ctx.restore();
  }
}

function drawBoard(arr) {
  rect(0, 0, canvas.width, canvas.height, "lightblue");
  if (typeof arr == 'string') board = JSON.parse(arr);
  else board = arr;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let cell = board[i][j];
      var xp = i*w+w/2;
      var yp = j*w+w/2;
      if (cell == 0) circle(xp, yp, rad, "Gainsboro");
      else if (cell == 1 || cell == 2) circle(xp, yp, rad, cell == 1 ? "salmon" : "GoldenRod");
    }
  }
}
  
function rect(x, y, width, height, color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
  
function circle(x, y, radius, color="black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI*2, false);
  ctx.fill();
}