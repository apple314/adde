isPlaying = false;

function isTaken(bool, n){
    if (bool){
        myName = n;
        showUsers();
    }else {
        alert('Nickname taken!\nTry another nickname!');
    }
}

function showUsers(){
    var intro_div = document.getElementById('gameStart');
    intro_div.removeEventListener('click', createWorld);
    intro_div.removeEventListener('tap', createWorld);
    intro_div.parentNode.removeChild(intro_div);
    document.getElementsByTagName('button')[0].disabled = true;

    var wrapperLobby = document.createElement('div');
    wrapperLobby.id = 'wrapperLobby';
    document.body.appendChild(wrapperLobby);
    wrapperLobby.style.position = 'absolute';
    wrapperLobby.style.top = 0;

    //

    img_close = new Image();
    img_close.src = '/static/images/64/exit1.png';
    img_close.id = 'img_close_M';
    img_close.style.width = '48px';
    img_close.style.height = '48px';
    img_close.style.position = 'absolute';
    img_close.style.top = '10px';
    img_close.style.left = '200px';
    img_close.style.zIndex = 100;

    //
    img_close.onclick = multiClose;
    wrapperLobby.appendChild(img_close);
	//html = document.getElementsByTagName('html')[0];
    var text = document.createElement('p');
    text.innerHTML = 'Users list:';
    wrapperLobby.appendChild(text);
    wrapperLobby.focus();
    //address heroku
    socket.on('users', function(data){
        wrapperLobby.innerHTML = '';
        var text = document.createElement('p');
        text.innerHTML = 'Users list:';
        wrapperLobby.appendChild(text);
        for(var i=0; i<data.length;i++){
            var temp_p = document.createElement('p');
            temp_p.innerHTML = data[i];
            //na click
            //here
            if (myName != data[i]){
                temp_p.onclick = function(){
                    socket.emit('challenge', this.innerHTML);
                }
            }
            wrapperLobby.appendChild(temp_p);
        }
    });
    socket.on('cRequest', function(user){
        if (!isPlaying){
            var answ = confirm('Do you accept challange from '+user+'?');
            if (answ){
                socket.emit('startGame', user);
                //start game
                //isPlaying = true;
            }else {
                //alert('Challenge rejected!');
                socket.emit('Reject', {'me':myName, 'him':user});
            }
        }else {
            socket.emit('Busy', {'me':myName,'him':user});
        }
    });
    socket.on('RInfo', function(data){
        alert(data);
    });
    socket.on('Info', function(data){
        alert(data);
    });
    //last
    socket.on('Start', function(){
        isPlaying = true;
        alert('Game start');
    });

    socket.emit('getUsers');
}

function challengeUser(userNick){
    socket.emit('challenge', userNick);
}

function showLobby(){

    var nickname = prompt('Enter nickname: ');

    if (nickname){
        socket = io.connect('http://192.168.1.66:8888');
        socket.emit('newUser', nickname, isTaken);
    }
    else {
        alert('Must enter nickname');
    }
}


function multiClose(){
    socket.disconnect();
    document.getElementsByTagName('button')[0].disabled = false;
    var s = document.getElementById('wrapperLobby');
    s.parentNode.removeChild(s);
}