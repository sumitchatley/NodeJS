var express = require('express');
var app  = express();
app.use(express.json());

//
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users=[];
connections=[];
//

//server.listen(8090);
server.listen(process.env.PORT||9090);
console.log('server running');
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/chat.html')        
});
    
    
io.sockets.on('connection',function(socket){
connections.push(socket);
/*
socket.on('join', function (data) {
    console.log('uname'+data.username);
    socket.join(data.username); // We are using room of socket io
  });
*/

console.log('connected %s socket connected', connections.length);
    socket.on('disconnect',function(data){
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        updateUserNames();
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected %s sockets connected',connections.length);
    });
    
    socket.on('send message',function(data){
        console.log(data);
        console.log(socket.id);
        console.log(connections[0].id); 
        //all the messages will be send to A
        //io.sockets.to(connections[0].id).emit('new message',{msg:data,user:socket.username});
        //io.sockets.to(socket.id).emit('new message',{msg:data,user:socket.username});
        //io.sockets.emit('new message',{msg:data,user:socket.username});
    })

    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames(){
        io.sockets.emit('get users',users)
    };
});
