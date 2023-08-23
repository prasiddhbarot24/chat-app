const http = require('http');
const express =require('express');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

app.use(express.static(__dirname+'/public'))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})

// socket.io Setup
const socketio = require("socket.io");
const io = socketio(server);

var users={};

io.on("connection",(socket)=>{
    // console.log("socket connected...");
    
    socket.on("new-user-joined",(username)=>{
       users[socket.id] = username;
    //    console.log(users);
        socket.broadcast.emit("user-connected",username); //display msg to all user except current connect user
                                                          // for ex. if jarvis joined then all connected user get msg except jarvis
        io.emit("user-list",users);
    })

    socket.on("disconnect",()=>{
        socket.broadcast.emit("user-disconnected",user = users[socket.id]);
        delete users[socket.id];
        io.emit("user-list",users);
    } );

    socket.on("message",(data)=>{
        socket.broadcast.emit("message",{user:data.user, msg:data.msg})
    });


});



// socket.io setup end

server.listen( port,()=>{
    console.log(`server running on ${port}`)
})