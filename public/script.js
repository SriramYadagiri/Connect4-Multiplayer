//Final Addition!!!: Leave Game

const gameCode = document.getElementById("gameCode");
const inputs = document.getElementById("inputs");
const room = document.getElementById("room");
const game = document.getElementById("game");
const turnDisplay = document.getElementById("turnDisplay");

const redWinsP = document.getElementById("red");
const yellowWinsP = document.getElementById("yellow");
const drawsP = document.getElementById("draws");
const displayField = document.getElementById("displayField");
const result = document.getElementById("result");
const playAgainButton = document.getElementById("playAgain");

let redWins = 0;
let yellowWins = 0;
let draws = 0;

const socket = io();

let player = null;
let code = null;
let ready = false;

function startGame() {
  inputs.style.display = "none";
  room.style.display = "none";
  game.style.display = "block";
  turnDisplay.textContent = player == 1 ? "Your Turn" : "Opponent's Turn";
  turnDisplay.style.color = "salmon";
  gameState = 'STARTED';
  socket.emit('drawBoard');
  canvas.addEventListener('click', handleClick);
}

socket.on('init', data => {
  code = data.gameCode;
  document.getElementById('gameCodeDisplay').textContent = "Code: " + code;
  player = data.number;
  turn = player == 1;
  turnDisplay.textContent = turnDisplay.textContent == "Your Turn" ? "Opponent's Turn" : "Your Turn";
  turnDisplay.style.color = turnDisplay.style.color == "salmon" ? "goldenrod" : "salmon";
});
socket.on('switch-turn', () => {
  socket.emit('switch-turn');
  turn = !turn;
  turnDisplay.textContent = turn ? "Your Turn" : "Opponent's Turn";
  turnDisplay.style.color = turnDisplay.style.color == "salmon" ? "goldenrod" : "salmon";
});
socket.on('start-game', startGame);
socket.on('drawBoard', drawBoard);
socket.on('game-over', handleGameOver);
socket.on('update-heights', col => heights[col]--);
socket.on('reset-game', () => {
  displayField.style.display = 'none';
  game.style.display = "block";
  turnDisplay.textContent = turn ? "Your Turn" : "Opponent's Turn";
  turnDisplay.style.color = turnDisplay.style.color == "salmon" ? "goldenrod" : "salmon";
  heights = [6, 6, 6, 6, 6, 6, 6];
  gameState = 'STARTED';
  socket.emit('drawBoard');
  canvas.addEventListener('click', handleClick);
  playAgainButton.style.background = "rgba(255, 255, 255, 0.6)";
  playAgainButton.style.color = "rgba(0, 0, 0, 0.75)";
});
socket.on('leave', () => {
  displayField.style.display = "none";
  game.style.display = "none";
  room.style.display = "block";
  turn = true;
  gameState = 'PENDING';
  heights = [6, 6, 6, 6, 6, 6, 6];
  board = [];
  redWins = 0;
  yellowWins = 0;
  draws = 0;
  player = 1;
  socket.emit('leave');
});

function joinGame() {
  socket.emit('joinGame', gameCode.value);
  socket.on('unknownCode', () => console.log("unknown code"));
  socket.on('toManyPlayers', () => console.log("To many players"));
}

function createGame() {
  socket.emit('newGame');
  inputs.style.display = "none";
  room.style.display = "block";
}

function leaveGame() {
  socket.emit('leave-game');
  turn = false;
  gameState = 'PENDING';
  heights = [6, 6, 6, 6, 6, 6, 6];
  board = [];
  redWins = 0;
  yellowWins = 0;
  draws = 0;
  player = null;
  code = null;
  displayField.style.display = 'none';
  game.style.display = 'none';
  room.style.display = 'none';
  inputs.style.display = 'block';
}

function handleGameOver(data) {
  turnDisplay.textContent = "Game Over";

  let board = JSON.parse(data.board);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
        if (board[i][j] == 1 || board[i][j] == 2) {
            circle(i*w+w/2, j*w+w/2, rad, "Gainsboro");
            ctx.save();
            ctx.globalAlpha = 0.3;
            circle(i*w+w/2, j*w+w/2, rad, board[i][j] == 1 ? "salmon" : "GoldenRod");
            ctx.restore();
        }
    }
  }

  canvas.removeEventListener('click', handleClick);
  gameState = 'PENDING';
  if (data.winner == "draw") {
    result.textContent = "Draw";
    result.style.color = "#008bba53";
    turnDisplay.style.color = "#008bba53";
    draws++;
  } else {
    result.textContent = `${data.winner == 1 ? "Red" : "Yellow"} Won`;
    result.style.color = data.winner == 1 ? "salmon" : "goldenrod";
    if (data.winner == 1) redWins++;
    else yellowWins++;
    turnDisplay.style.color = turnDisplay.style.color == "salmon" ? "goldenrod" : "salmon";
    result.style.opacity = 0.75;
  }
  redWinsP.textContent = redWins;
  yellowWinsP.textContent = yellowWins;
  drawsP.textContent = draws;
  displayField.style.display = "inline-block";
}

function handleClick() {
  if (gameState == 'STARTED') socket.emit('move', {player, move: chosenCol});
}

function resetGame() {
  socket.emit("reset-game");
  playAgainButton.style.background = "#008bba53";
  playAgainButton.style.color = "rgba(255, 255, 255, 0.6)";
}