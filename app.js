//Node server which will handle socket io connections
const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 8080

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

const users = {};

io.on('connection', socket =>{
    console.log('Server Connected..')
    // If any new user joins, let other users connected to the server know!
    socket.on('newUser', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', name => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});