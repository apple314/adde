#!/usr/bin/env node
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
app.listen(8888, '0.0.0.0');
var users = {};
var pairs = [];

//makni iz pairsa i users na disconect ili over
io.on('connection', function(socket){
    socket.on('newUser', function(data, callback){
        console.log('User '+ data + ' joined');
        if (data in users) {
            callback(false);
        }else {
            callback(true, data);
            socket.nickname = data;
            users[socket.nickname] = socket;
            console.log('Current lobby users : '+Object.keys(users));
            socket.broadcast.emit('users', Object.keys(users));
        }
        
    });
    
    socket.on('challenge', function(data){
        console.log(socket.nickname + ' challanges ' + data);
        users[data].emit('cRequest', socket.nickname);
    });
    
    socket.on('disconnect', function(){
        delete users[socket.nickname];
        //console.log(popPair(pairs,socket.nickname));
        io.emit('users', Object.keys(users));
        console.log('Bye bye from: '+socket.id+' disconnect');   
    });
    
    socket.on('getUsers', function(){
        socket.emit('users', Object.keys(users));        
    });
    //last
    socket.on('startGame', function(opponent){
        console.log('Start game => '+socket.nickname+' and '+opponent);
        users[socket.nickname].emit('Start');
        users[opponent].emit('Start');
        pairs.push([socket.nickname, opponent]);
        for (var i =0; i<pairs.length; i++){
            console.log('Pairs playing: ' + pairs[i]);
        }
    });
    
    socket.on('Busy', function(data){
        console.log(data.me + ' says he is busy '+ data.him);
        users[data.him].emit('Info', socket.nickname+' is busy!');
    });
    socket.on('Reject', function(data){
        users[data.him].emit('RInfo', socket.nickname+' refused chellange!');
        console.log(socket.nickname+' refused chellange!');
    });
    //@
    socket.on('opponent_add', function(){
        var oponent = getPair(socket.nickname, pairs);
        console.log(socket.nickname + ' adds 1 to ' + oponent);
        //@add row to opponent
        if (users[oponent]){
            users[oponent].emit('addRow');
        }
    
    });
    //get gameData and send to opponent
    socket.on('gameData', function(data){
        //console.log(socket.nickname + ' sent game data');
        var opponent = getPair(socket.nickname, pairs);
        if (opponent && users[opponent]) {
            //@test volatile to impruve iceveasel support...
            users[opponent].volatile.emit('OGameData', data);
        }
    });
});


function popPair(pairsVar, nameToMatch) {
    for (var i=0; i<pairsVar.length; i++){
        for (var ii=0; ii<pairsVar[i].length;ii++){
            if (nameToMatch == pairsVar[i][ii]) {
                pairsVar.splice(i,1);
                return true;
            }
        }
    }
    return false;
}


function getPair(me,pairs_var) {
    for (var i=0; i<pairs_var.length; i++){
        var p = pairs_var[i];
        var index = p.indexOf(me);
        if (index > -1) {
            switch (index) {
                case 0:
                    return pairs_var[i][1];
                case 1:
                    return pairs_var[i][0];
            }
        }
    }
    return false;
}

function handler(req,res) {
    res.end('Adde.hr rules!');
}