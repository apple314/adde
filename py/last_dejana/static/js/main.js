var ROWS = 16;
var COLS = 10;
var SIZE = 32;

var gameOverImg;
var curPiece;
var gameData;
var isGameOver;
var lineSpan;
var curLines;
var canvas;
var ctx;
var curTime;
var prevTime;
var scorePosition;
var nextPiece;
var nextDiv;
var nextctx;
var touchX;
var touchY;
var touchId;
var socket;

window.onload = function(){
    document.getElementsByTagName('button')[0].disabled = false;
}

//first called show instructions
function showInstuctions(){
    randomizeLogos();
    inst_div = document.createElement('div');
    document.body.appendChild(inst_div);
    inst_div.id = 'gameStart';
    document.getElementsByTagName('button')[0].disabled = true;
    img_close = new Image();
    img_close.src = '/static/images/64/exit1.png';
    inst_div.appendChild(img_close);
    img_close.id = 'img_close';
    img_close.onclick = closeIntructions;

    var inst_div_text = document.createElement('div');
    inst_div.appendChild(inst_div_text);
    inst_div_text.id='gameStartText';


    if (isMobile()){
        inst_div_text.style.bottom = '0px';
        inst_div_text.innerHTML = 'Double-tap: rotate</br>Swipe-left: move left</br>Swipe-right: move right</br>Swipe-down: move down</br></br><span id="play">Singleplayer</span><div id="mplay"><span>Multiplayer</span></div>';
        img_close.style.width = '48px';
        img_close.style.height = '48px';
        var play = document.getElementById('play');
        play.addEventListener('touchstart', createWorld);
        var mplay = document.getElementById('mplay');
        mplay.addEventListener('touchstart', showLobby);

    } else {
        inst_div_text.style.bottom = '0px';
        inst_div_text.innerHTML = 'Up arrow: rotate</br>Left arrow: move left</br>Right arrow: move right</br>Down arrow: move down</br></br><span id="play">Singleplayer</span><div id="mplay"><span>Multiplayer</span></div>';
        var play = document.getElementById('play');
        play.addEventListener('click', createWorld);
        var mplay = document.getElementById('mplay');
        mplay.addEventListener('click', showLobby);
    }
    //resize at same as gamediv
    calculateInstWin();
}

function calculateInstWin(){
    var t = document.getElementById('gameStart');
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    var ratio = 0.902;
    if (ww>wh){
        t.style.width = (wh*ratio-55)+'px';
        t.style.height = (t.getBoundingClientRect().width/ratio - 10) +'px';
        //dims = t.getBoundingClientRect();
    }
    else {
        //console.log('wh>ww');
        t.style.width = '85%';
        t.style.height = (t.getBoundingClientRect().width/ratio - 10)+'px';
    }

}

function createWorld(){
    //clear tap, click
    var intro_div = document.getElementById('gameStart');
    intro_div.removeEventListener('click', createWorld);
    intro_div.removeEventListener('tap', createWorld);
    intro_div.parentNode.removeChild(intro_div);
	//* disable game start button
	document.getElementsByTagName('button')[0].disabled = true;

    var wrapper, nextpiece, gamecanvas;
    wrapper = document.createElement('div');
    wrapper.id = 'wrapper';
    nextpiece = document.createElement('canvas');
    nextpiece.id = 'nextPiece';
    gamec = document.createElement('canvas');
    gamec.id = 'gameCanvas';
    //@previev canvas

    var opponent = document.createElement('canvas');
    opponent.id = 'opponent';

    //exit on game
    img_close.onclick = gameOverClear;
    wrapper.appendChild(img_close);

     //@
    wrapper.appendChild(opponent);

    wrapper.appendChild(nextpiece);
    wrapper.appendChild(gamec);

    document.body.appendChild(wrapper);
    nextpiece.width = 128;
    nextpiece.height = 128;
    gamec.height = 512;
    gamec.width = 320;
    //@
    opponent.width = 128;
    opponent.height = 204;

    wrapper.style.position = 'absolute';
    wrapper.style.top = 0;
    wrapper.focus();
    onReady();
}

function onReady(){
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    prevTime = curTime = 0;
    document.onkeydown = getInput;
    initGameData();
    mobileInput();
    double_t();
}

function initGameData(){
	isGameOver = false;
	curLines = 0;
	nextDiv = document.getElementById('nextPiece');

	if (gameData == undefined){
		gameData = [];
		for (var i=0; i<ROWS;i++){
			gameData[i] = [];
			for(var ii=0; ii<COLS;ii++){
				gameData[i][ii] = 0;
			}
		}
	}
	else {
		for (var i=0;i<ROWS;i++){
			for (var ii=0; ii<COLS;ii++){
				gameData[i][ii] = 0;
			}
		}
	}
	curPiece = getRandomPiece();
	nextPiece = getRandomPiece();
	var requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
							window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	window.requestAnimationFrame = requestAnimFrame;
	requestAnimationFrame(update);
}

function isMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function closeIntructions(){
    document.getElementsByTagName('button')[0].disabled = false;
    var s = document.getElementById('gameStart');
    s.parentNode.removeChild(s);
}

function double_t(){
    test_me();
    test_me();
}

function gameOverClear(){
    html.removeEventListener('touchstart', touchStartHandler );
	html.removeEventListener('touchmove', touchMoveHandler);
	html.removeEventListener('touchend', touchEndHandler);
	window.removeEventListener('orientationchange', test_me);
	window.removeEventListener('resize', double_t);
    //@
    multiClose();
    if (document.getElementById('wrapper')){
        alert('wrapper exists');
        wrapper.parentNode.removeChild(wrapper);
        showInstuctions();
    }
    else {
        //alert('nowrapper');
        var gs = document.getElementById('gameStart');
        gs.parentNode.removeChild(gs);
        showInstuctions();
    }

}

function touchStartHandler(e){
    //html = document.getElementsByTagName('html')[0];
    e.preventDefault();
    touchX = e.touches[0].pageX;
    touchY = e.touches[0].pageY;
    touchId = e.touches[0].identifier;
    //handle in game touch to close
    var img_location = img_close.getBoundingClientRect();
    if ((touchX > img_location.left-5 && touchX < img_location.right+5) && (touchY > img_location.top-5 && touchY < img_location.bottom+5)){
        gameOverClear();
    }
}

function touchMoveHandler(e){
    //html = document.getElementsByTagName('html')[0];
    e.preventDefault();
    var difY = e.touches[0].pageY - touchY;

    if(difY > 60)
    {
        if( checkMove(curPiece.gridx, curPiece.gridy + 1, curPiece.curState) )
            curPiece.gridy++;
    }
}

function touchEndHandler(e){
    e.preventDefault();
    var touchEndX;
    var touchEndY;

    var touch = e.changedTouches.item(0);

    try
    {
        touchEndX = touch.pageX;
        touchEndY = touch.pageY;
    }
    catch(err)
    {
        alert(err);
        return;
    }

    var difX = Math.abs(touchEndX - touchX);
    var difY = Math.abs(touchEndY - touchY);

    if(difX < 10 && difY < 10)
    {
        //tu check za ofsfet fro right
        var newstate = curPiece.curState - 1;
        if(newstate < 0)
            newstate = curPiece.states.length - 1;

        //check move offset
        if (curPiece.gridx + curPiece.states[newstate][0].length > COLS){
            var newStateLen = curPiece.states[newstate][0].length;
            var currentX = curPiece.gridx;
            var xMove = curPiece.gridx - (newStateLen + currentX - COLS);
            if (checkMove(xMove, curPiece.gridy, newstate)){
                curPiece.gridx = xMove;
            }
        }
        //offset done



        if( checkMove(curPiece.gridx, curPiece.gridy, newstate) )
            curPiece.curState = newstate;
    }
    else
    if(difX > difY)
    {
        if(touchEndX < touchX)
        {
            if( checkMove(curPiece.gridx - 1, curPiece.gridy, curPiece.curState) )
                curPiece.gridx--;
        }
        else
        {
            if( checkMove(curPiece.gridx + 1, curPiece.gridy, curPiece.curState) )
                curPiece.gridx++;
        }
    }

}

function mobileInput(){
	html = document.getElementsByTagName('html')[0];
	html.addEventListener('touchstart', touchStartHandler );
	html.addEventListener('touchmove', touchMoveHandler);
	html.addEventListener('touchend', touchEndHandler);
	window.addEventListener('resize', double_t);
	window.addEventListener('orientationchange', double_t);

}

function test_me(){
	wH = window.innerHeight;
	wW = window.innerWidth;
	g_dim = wrapper.getBoundingClientRect();
	g_width = g_dim.width;
	g_height = g_dim.height;
	ratio = g_width/g_height;
    availableHeight = wH - g_height;
    if (wW > wH){
	    calcWidth = availableHeight / ratio + g_width;
	    //get dims chnge for more
	    wrapper.style.width = calcWidth-55+'px';
	    wrapper.style.left = ((wW - wrapper.getBoundingClientRect().width)/2 - 4) + 'px';
	}
	else {
	    wrapper.style.width = '85%';
	    wrapper.style.left = (wW - wrapper.getBoundingClientRect().width)/2 + 'px';

	}
	//console.log(ratio);
}

function getInput(e){
    //@here
    e.preventDefault();
	if (isGameOver != true){
		switch(e.keyCode){
			case 37: {
				if (checkMove(curPiece.gridx-1, curPiece.gridy, curPiece.curState)){
					curPiece.gridx--;
				}
			}
			break;
			case 39: {
				if (checkMove(curPiece.gridx+1, curPiece.gridy, curPiece.curState)){
					curPiece.gridx++;
				}
			}
			break;
			case 38: {
				var newstate = curPiece.curState -1;
				if (newstate < 0){
					newstate = curPiece.states.length - 1;
				}
					
				if (curPiece.gridx + curPiece.states[newstate][0].length > COLS){ 
					var newStateLen = curPiece.states[newstate][0].length;
					var currentX = curPiece.gridx;
					var xMove = curPiece.gridx - (newStateLen + currentX - COLS);
					if (checkMove(xMove, curPiece.gridy, newstate)){
						curPiece.gridx = xMove;
					}	
				}

				if (checkMove(curPiece.gridx, curPiece.gridy, newstate)){
					curPiece.curState = newstate;
				}
				
			}
			break;
			case 40: {
				if (checkMove(curPiece.gridx, curPiece.gridy+1, curPiece.curState)){
					curPiece.gridy ++;
				}
			}
		}
	}
}

function PlacePreview(nextpiece){
	if (isGameOver !== true ){
		nextctx = nextDiv.getContext('2d');
		nextctx.clearRect(0,0,128,128);

		for (var r=0, len= nextpiece.states[nextpiece.curState].length; r<len;r++){
			for (var c=0, len1 = nextpiece.states[nextpiece.curState][r].length; c<len1; c++){
				if (nextpiece.states[nextpiece.curState][r][c] == 1){
					nextctx.drawImage(bulkImages[nextpiece.color-1], c * SIZE, r * SIZE, SIZE,SIZE);
				}
			}
		}
	}
	else {
		nextctx.clearRect(0,0,128,128);
	}
}

function update(){
	curTime = new Date().getTime();
	if (curTime - prevTime > 500){
		if(checkMove(curPiece.gridx, curPiece.gridy+1, curPiece.curState)){
			curPiece.gridy += 1;	
		}
		else{
			copyData(curPiece);
			curPiece = nextPiece;
			nextPiece = getRandomPiece();
		}
		prevTime = curTime;
	}
	//@ctx smaler dim
	ctx.clearRect(0, 0, 320, 512);
	drawBoard();
	drawPiece(curPiece);
	//place
	PlacePreview(nextPiece);
	if (isGameOver == false){
		//@test
		//send image
		if (typeof(counter_0) !== 'undefined' ){
            if (counter_0 == 15){
                emitGameData(gamec.toDataURL());
                counter_0 = 0;
            }else {
                counter_0++;
            }
        }
		requestAnimationFrame(update);

	}
	else {
        //@here
		  //var nextpiece = document.getElementById('nextPiece');
		  //var s_dims = nextpiece.getBoundingClientRect();
		  //var s_ctx = nextpiece.getContext('2d');
		  //s_ctx.clearRect(0,0,s_dims.width, s_dims.height);
		//score on/off
		//s_ctx.font = "20px Helvetica serif";
        //s_ctx.fillText("Score: "+curLines, 0,128);
        setTimeout(gameOverClear, 3000);
	}
	
}

function copyData(p){
	var xpos = p.gridx;
	var ypos = p.gridy;
	var state = p.curState;

	for (var r=0, len = p.states[state].length; r<len;r++){
		for (var c=0, len1 = p.states[state][r].length; c<len1;c++){
			if (p.states[state][r][c] == 1 && ypos >= 0){
				gameData[ypos][xpos] = p.color;
			}
			xpos += 1;
		}
		xpos = p.gridx;
		ypos += 1;
	}	

	checkLines();
	if (p.gridy < 0){
		isGameOver = true;
	}

}

function checkLines(){
	for (var r=0; r<ROWS; r++){
		var got_row = true;
		for (var c=0; c<COLS; c++){
			if (gameData[r][c] == 0){
				got_row = false;
			}
		}
		if (got_row == true){
			killrow(r);
			curLines++;
			//@emit row break
			opponent_add();
			//keep score
			//scorePosition.innerHTML = curLines;
		}
	}
}

function killrow(row){
	while (row>0){
		for (var c=0; c < COLS; c++){
			gameData[row][c] = gameData[row-1][c];
		}
		row--;
	}
}

function checkMove(xpos, ypos, newState){
	var result = true;
	var newx = xpos;
	var newy = ypos;

	for (var r=0, len=curPiece.states[newState].length; r<len;r++){
		for (var c=0, len1=curPiece.states[newState][r].length; c<len1;c++){
			if (newx < 0 || newx >= COLS){
				result = false;
				c=len1;
				r=len;
			}
			if (gameData[newy] != undefined && gameData[newy][newx] != 0 && curPiece.states[newState][r] != undefined && curPiece.states[newState][r][c] != 0){
				result = false;
				c=len1;
				r=len;
			}
			newx += 1;
		}
		newx = xpos;
		newy += 1;
		if (newy > ROWS){
			result = false;
			r = len;
		}
	}
	return result;
}

function drawBoard(){
	for(var r=0; r<ROWS;r++){
		for (var c=0; c<COLS;c++){
			if (gameData[r][c] > 0){
				ctx.drawImage(bulkImages[gameData[r][c]-1],c*SIZE,r*SIZE,SIZE,SIZE);
			}	
		}
	}
}

function drawPiece(p){
	var drawX = p.gridx;
	var drawY = p.gridy;
	var state = p.curState;
	
	for(var r = 0, len = p.states[state].length; r < len; r++)
	{
		for(var c = 0, len2 = p.states[state][r].length; c < len2; c++)
		{
			if(p.states[state][r][c] > 0 && drawY >= 0)
			{
				ctx.drawImage(bulkImages[p.color-1], drawX*SIZE, drawY*SIZE, SIZE,SIZE);
			}
			
			drawX += 1;
		}
		
		drawX = p.gridx;
		drawY += 1;
	}
}
