'use strict'

class PersoSocketController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  socket.on('SEND_MESSAGE', function(data) {
        io.emit('MESSAGE', data)
    });
}

module.exports = PersoSocketController
