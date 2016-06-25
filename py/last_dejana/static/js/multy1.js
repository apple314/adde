//must make when game ends to do socket.disconetct and return to show users

isPlaying = false;

function isTaken(bool, n){
    if (bool){
        myName = n;
        showUsers();
    }else {
        //@test new modal
        var mInfo = new ModalInfo();
        mInfo.show();
        mInfo.setMsg('Nickname taken!\nTry another nickname!');
        //alert('Nickname taken!\nTry another nickname!');
    }
}

function showUsers(){
    inst_div.innerHTML = '';
    var text = document.createElement('p');
    text.innerHTML = 'Users list:';
    inst_div.appendChild(text);
    inst_div.focus();
    socket_setup();
    html = document.getElementsByTagName('html')[0];
}

function socket_setup(){
    counter_0 = 0;

    socket.on('users', function(data){
    if (!isPlaying){
        inst_div.innerHTML = '';
        img_close.onclick = multiClose;

        inst_div.appendChild(img_close);
        var text = document.createElement('p');
        text.innerHTML = 'Users list:';
        inst_div.appendChild(text);

        for(var i=0; i<data.length;i++){
            var temp_p = document.createElement('p');
            temp_p.innerHTML = data[i];
            if (myName != data[i]){
                temp_p.onclick = function(){
                    socket.emit('challenge', this.innerHTML);
                    var opp0 = this.innerHTML;
                    //@here modalInfo countdown
                    Counter = new ModalInfo();
                    Counter.removeButton();
                    Counter.setMsg('Waiting for 10 second for '+opp0+' to accept');  
                    Counter.show();
                    var c0 = 10;
                    intervalId = setInterval(function(){
                        if (c0 <= 1){
                            Counter.kill();
                            clearInterval(intervalId);
                            c0=9;
                        }
                        else{
                            c0--;
                            Counter.setMsg('Waiting for '+c0+' seconds for '+ opp0+' to accept');    
                        }    
                    },1000);
                };
            }
            inst_div.appendChild(temp_p);
        }
    }
    });
    socket.on('cRequest', function(user){
        if (!isPlaying){
            //@here New Modal
            //isPlaying = true;
            question = new ModalQuestion();
            question.show();
            question.setMsg('Do you accept challange from '+user+'?');
        
            function y(){
                socket.emit('startGame', user);
                clearTimeout(qId); 
                question.kill();
            }
            function n(){
                socket.emit('Reject', {'me':myName, 'him':user});
                clearTimeout(qId); 
                question.kill();
            }
            question.addCallbacks(y,n);
            //@here
            qId = setTimeout(function(){
                clearTimeout(qId); 
                socket.emit('Reject', {'me':myName, 'him':user});
                question.kill();
            },8000);    
        
        }else {
            socket.emit('Busy', {'me':myName,'him':user});
        }
    });
    socket.on('RInfo', function(data){
        if (typeof Counter !== 'undefined'){
            clearInterval(intervalId);
            Counter.kill();
        }
        //@here
        //Modal info
        //alert(data);
        var m = new ModalInfo();
        m.setMsg(data);
        m.show();
    });
    socket.on('Info', function(data){
        var m = new ModalInfo();
        m.setMsg(data);
        m.show();
        //alert(data);
    });

    socket.on('Start', function(){
        if (typeof Counter !== 'undefined'){
            clearInterval(intervalId);
            Counter.kill();
        }
        isPlaying = true;
        createWorld();
        //@here
        //img_close.onclick = multiClose;
        opponent = document.getElementById('opponent');
        opCtx = opponent.getContext('2d');
        tmp_img = new Image();
    });

    socket.emit('getUsers');

    socket.on('addRow', function(){
        addRow();
    });

    socket.on('OGameData', function(data){
        drawOpponent(data);
    });
}

function drawOpponent(opponentData){
        tmp_img.src = opponentData;
        opCtx.clearRect(0,0,128,204);
        opCtx.drawImage(tmp_img, 0,0,128,204);
}

function addRow(){
    var rand = Math.floor(Math.random(COLS)*10);
    var tempGameData = gameData;
    for (var r=0; r<ROWS-1; r++){
        for(var c=0;c<COLS;c++){
            tempGameData[r][c] = gameData[r+1][c];
        }
    }
    for (var c=0;c<COLS;c++){
        if (c == rand){
            tempGameData[15][c] = 0;
        }else {
            tempGameData[15][c] = 1;
        }
    }
    gameData = tempGameData;

}

function opponent_add(){
    socket.emit('opponent_add');
}

function challengeUser(userNick){
    socket.emit('challenge', userNick);
}

function showLobby(){
    if (typeof mInput === 'undefined'){
        mInput = new ModalInput();
        mInput.show();
        function ok(){
            nickname = mInput.getVal();
            if (nickname){
            //@local testing
            socket = io.connect('http://192.168.1.64:8888');
            socket.emit('newUser', nickname, isTaken);
            mInput.kill();
            }
            else {
                mInput.setMsg('Must enter nickname');
            } 
        }
        function no(){mInput.kill();}
        mInput.addCallbacks(ok,no);
    }else {
        delete mInput;
        mInput = new ModalInput();
        mInput.show();
        mInput.clearInput();
        function ok(){
            nickname = mInput.getVal();
            if (nickname){
            //@local testing
            socket = io.connect('http://192.168.1.64:8888');
            socket.emit('newUser', nickname, isTaken);
            mInput.kill();
            }
            else {
                mInput.setMsg('Must enter nickname');
            } 
        }
        function no(){mInput.kill();}
        mInput.addCallbacks(ok,no);
    }
}

function multiClose(){
    console.log('Mclose');
    //@h
    isGameOver = true;
    //@test
    document.onkeydown = null;
    if (socket){
        socket.disconnect();
    }
    if (document.getElementById('wrapper')){
        var w = document.getElementById('wrapper');
        w.parentNode.removeChild(w);
        isPlaying = false;
        showInstuctions();
    }
    else {
        var w = document.getElementById('gameStart');
        w.parentNode.removeChild(w);
        isPlaying = false;
        showInstuctions();
    }
}

//send gamedata to opponent
function emitGameData(gData){
    if (socket && isPlaying){
        socket.emit('gameData', gData);
    }
}
