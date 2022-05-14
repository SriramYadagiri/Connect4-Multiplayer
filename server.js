const game = require("./game.js");
const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));    

server.listen(PORT, () => console.log("Server is running on port " + PORT));

const roomNames = [];
const clientRooms = {};
const boards = {};

io.on('connection', client => {
  client.on('joinGame', handleJoinGame);
  client.on('newGame', handleNewGame);
  client.on('drawBoard', () => io.to(clientRooms[client.id]).emit('drawBoard', JSON.stringify(boards[clientRooms[client.id]])));
  client.on('move', handleMove);
  client.on('switch-turn', () => {
    client.turn = !client.turn;
    console.log(client.number, client.turn);
  });
  client.on('reset-game', () => {
    client.ready = true;
    let sockets = [];
    let clients = Array.from(io.sockets.adapter.rooms.get(clientRooms[client.id]));
    for (let id of clients) {
      sockets.push(io.sockets.sockets.get(id));
    }
    for (c of sockets) {
      if (!c.ready) return;
    }
    
    for (c of sockets) {
      c.ready = false;
    }
    boards[clientRooms[client.id]] = game.createBoard();
    client.emit("drawBoard", boards[clientRooms[client.id]]);
    io.to(clientRooms[client.id]).emit('reset-game');
  });
  client.on('leave-game', () => {
    let roomName = clientRooms[client.id];
    client.leave(clientRooms[client.id]);
    io.to(roomName).emit("leave");
  });
  client.on('disconnecting', () => {
    let roomName = clientRooms[client.id];
    client.leave(clientRooms[client.id]);
    io.to(roomName).emit("leave");
  });
  client.on('leave', () => {
    client.number = 1;
    client.ready = false;
    client.turn = true;
  });

  function handleJoinGame(roomName) {
    if (io.sockets.adapter.rooms.has(roomName)) {
      if (io.sockets.adapter.rooms.get(roomName).size >= 2) {
        client.emit('toManyPlayers');
        return;
      }

      clientRooms[client.id] = roomName;
      client.join(roomName);

      client.number = 2;
      client.turn = false;
      client.ready = false;
      client.emit('init', {gameCode: roomName, number: 2});
      boards[roomName] = game.createBoard();
      io.to(roomName).emit("start-game");
    } else {
      client.emit('unknownCode');
    }
  }

  function handleNewGame() {
    let roomName = newID(5);
    while (roomNames.includes(roomName)) {
        roomName = newID(5);
    }

    console.log("New Game: " + roomName);

    roomNames.push(roomName);
    clientRooms[client.id] = roomName;
    client.join(roomName);
    client.number = 1;
    client.turn = true;
    client.emit('init', {gameCode: roomName, number: 1});
  }

  function handleMove(data) {
    console.log(data, client.turn);
    let board = boards[clientRooms[client.id]];
    if (board[data.move][0] != 0 || client.turn == false) {
      return;
    }
    for (let i = game.rows-1; i > -1; i--) {
      if (board[data.move][i] == 0) {
        board[data.move][i] = data.player;
        break;
      }
    }
    io.to(clientRooms[client.id]).emit('switch-turn');
    io.to(clientRooms[client.id]).emit('update-heights', data.move);
    io.to(clientRooms[client.id]).emit('drawBoard', JSON.stringify(board));
    let winner = game.checkWinner(board);
    if (winner != null) io.to(clientRooms[client.id]).emit('game-over', {winner, board: JSON.stringify(board)});
  }
});

function newID(length) {
  var result = "";
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}