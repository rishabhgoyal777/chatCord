const path = require("path");
const express = require("express");
const http = require("http");
const socketio= require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io= socketio(server);

app.use(express.static(path.join(__dirname, "public")));  // setting static folder

const botName = 'ChatCord Bot' ; // username for system messages

//running on new connection
//io object listening (on) to connection with socket as parameter
io.on("connection", socket => { 
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);   // You can call join to subscribe the socket to a given channel:

        // 1. for single user
        socket.emit('message', formatMessage(botName, "Welcome to ChatCord")); //wecome current user  // emiting this on server side and will catch it on client side using on with message and string as parameter

        // 2. for every user except one connecting
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`)); // broadcast to specific room when user connects

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // 3. for every user
    //io.emit();

    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        
        //console.log(msg); //logging on server side
        
        io.to(user.room).emit('message', formatMessage(user.username, msg)); //emitting back to client side to everyone. emitting with message, in main message consoles log parameter
    });
    
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            
            //update users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000 ;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));