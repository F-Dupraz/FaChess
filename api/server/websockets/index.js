// Imports the Requests module
const FriendRequest = require('../db/models/friendRequest.model');

module.exports = (httpServer) => {
  const { Server } = require('socket.io');

  // Creates the websocket server
  const io = new Server(httpServer);

  // Listens the connections on the users namespace
  io.of('/users').on('connection', (socket) => {
    // Leaves all the rooms and joins the user room given by its username
    socket.on('joinMyRoom', (data) => {
      socket.leaveAll();
      socket.join(data);
    });

    // Send the friend request
    socket.on('addFriendRequest', async (data) => {
      // Stores the friend request in the DB
      const newFriendRequest = await new FriendRequest({
        from: data.fromUsername,
        to: data.toUsername
      });

      await newFriendRequest.save();
    });
  });
  // Listens the connections on the game namespace
  io.of('/games').on('connection', (socket) => {
    // Leaves all the rooms and joins the user room given by its username
    socket.on('joinMyRoom', (data) => {
      socket.leaveAll();
      socket.join(data);
    });

    // Listens the 'inviteFriend' socket sended by the client
    socket.on('inviteFriend', (data) => {
      // Responses the game request to the user room 
      socket.to(data.friendInvited).emit('gameRequest', {
        friendInvited: data.friendInvited,
        user: data.user
      });
    });

    // Listens is the user accepted the invitation
    socket.on('invitationAccepted', (data) => {
      // Sends the socket koining the chess match to the user room
      socket.to(data.user).emit('joinTheChessMatch', {
        user: data.user,
        invited: data.invited,
        color: 'black',
        status: data.status
      });
    });

    // Updates the game
    socket.on('ChessGameStatus', (data) => {
      // Sends the data to the especific user
      socket.to(data.oponent).emit('ChessGameStatusRecived', {
        pieces: data.pieces,
        turn: data.turn
      });
    });

    socket.on('checkmate', (data) => {
      socket.to(data.oponent).emit('gameOver', {
        wins: data.wins
      });
    });
  });
}