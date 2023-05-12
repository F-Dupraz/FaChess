// Imports the Requests module
const FriendRequest = require('../db/models/friendRequest.model');

module.exports = (httpServer) => {
  const { Server } = require('socket.io');

  // Creates the websocket server
  const io = new Server(httpServer);

  // Listens the connections
  io.of('/users').on('connection', (socket) => {
    socket.on('joinMyRoom', (data) => {
      socket.leaveAll();
      socket.join(data);
    });
    socket.on('addFriendRequest', async (data) => {
      socket.to(data.userUuid).emit('friendRequest', {
        userUuid: data.fromUsername,
        userUsername: data.fromUsername
      });
      const newFriendRequest = await new FriendRequest({
        from: data.fromUsername,
        to: data.toUsername
      });
      await newFriendRequest.save();
    });
  });
  io.of('/games').on('connection', (socket) => {
    socket.on('joinMyRoom', (data) => {
      socket.leaveAll();
      socket.join(data);
    });
    socket.on('inviteFriend', (data) => {
      socket.to(data.friendInvited).emit(data.message, {
        user: data.user
      });
    });
    socket.on('ChessGameStatus', (data) => {
      socket.emit('ChessGameStatusRecived', {
        pieces: data.pieces,
        turn: data.turn
      });
    });
  });
}