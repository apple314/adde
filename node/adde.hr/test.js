#!/usr/bin/env node
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(8888);

io.on('connection', function(socket){
    console.log('Conn ' + socket.id);
    socket.on('sendImg', function(img){
        io.emit('recvImg', img);
    });
});