const Pol = use('App/Models/Pol')
const Server = use('Server')
const io = use('socket.io')(Server.getInstance())

var clients = []
io.on('connection', function (socket) {
    
    socket.on('login', function(data){
        var client = new Object()
        client.socketID = socket.id
        client.user = data
        clients.push(client)        
        io.emit('clients', clients)
    })
    
    
    socket.on('SEND_MESSAGE', function(data){
        io.emit('MESSAGE', data)
    });    
})

// io.on('connection', 'PersoSocketController.data')
// socket.on('SEND_MESSAGE', async (data) => {

//     io.emit('MESSAGE', await Pol.all())
// });    