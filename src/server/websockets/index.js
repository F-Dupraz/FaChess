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
}