class Socket {
  setIO(io) {
    this.io = io
    this.rooms = {}

    //Server listeners go into the callback
    io.on("connection", socket => {
      this.newConnection(socket)
      socket.on("test", data => {
        console.log("Test Recieved!1")
      })
      socket.on("join", data => {
        this.joinRoom(socket, data)
        console.log("hi")
      })
    });
  }
  newConnection(socket) {
    //Handshake / Confirmation of Connection
    socket.emit("CONNECTED", {
      socket: socket.id,
      message: "Successfully Connected"
    });
  }
  joinRoom(socket, { boardId, name }) {
    console.log('joining room')
    socket.join(boardId);
    socket.emit('newMember', { name })
  }
  leaveRoom(data) {
    this.io.leave(data.boardId);
  }
  notifyComment(comment) {
    this.io.to(comment.boardId).emit('comment', comment)
  }

}


const socket = new Socket();


module.exports = socket