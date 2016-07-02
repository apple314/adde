//must make when game ends to do socket.disconetct and return to show users

isPlaying = false;
socket_url ='http://192.168.1.65:8888';
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
    var text = document.createElement('h3');
    text.innerHTML = 'Users list';
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
        var text = document.createElement('h3');
        text.innerHTML = 'Users list';
        inst_div.appendChild(text);

        for(var i=0; i<data.length;i++){
            var temp_p = document.createElement('p');
            temp_p.innerHTML = data[i];
            if (myName != data[i]){
                temp_p.onclick = function(){
                    var opp0 = this.innerHTML;
                    socket.emit('challenge', opp0);
                    //@here modalInfo countdown
                    Counter = new ModalInfo();
                    Counter.removeButton();
                    Counter.setMsg('Waiting for '+opp0+' to accept');  
                    Counter.show();
                    //@last
                    counter_Id = setTimeout(function(){
                        Counter.kill(); 
                    }, 7000);
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
        
            qId = setTimeout(function(){
                clearTimeout(qId); 
                question.kill.call(question);
                socket.emit('Reject', {'me':myName, 'him':user});
                
            },8000);
            
            function y(){
                clearTimeout(qId);
                question.kill();
                socket.emit('startGame', user);
            }
            function n(){
                clearTimeout(qId); 
                question.kill();
                socket.emit('Reject', {'me':myName, 'him':user});
            }
            question.addCallbacks(y,n);    
        
        }else {
            socket.emit('Busy', {'me':myName,'him':user});
        }
    });
    socket.on('RInfo', function(data){
        //@last
        clearTimeout(counter_Id);
        if (typeof Counter !== 'undefined'){
            //clearInterval(intervalId);
            Counter.kill();
        }
        var m = new ModalInfo();
        m.setMsg(data);
        m.show();
    });
    socket.on('Info', function(data){
        //@last remove modal
        Counter.kill();
        var m = new ModalInfo();
        m.setMsg(data);
        m.show();
    });

    socket.on('Start', function(){
        
        if (typeof Counter !== 'undefined' && Counter.root !== null ){
            try {
             Counter.kill();
            }
            catch(e){
                //console.log(e.message);
            }
        }
        
        isPlaying = true;
        createWorld();
        //@here
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
            socket = io.connect(socket_url);
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
            socket = io.connect(socket_url);
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

