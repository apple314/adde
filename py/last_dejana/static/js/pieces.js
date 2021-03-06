var bulkImages = [];
var numOfDifferentLogos;

//on button click to randomize different logogs
function randomizeLogos(){
    urls = ['/static/images/64/365 kalendar.png', '/static/images/64/a.png','/static/images/64/adde.png',
    '/static/images/64/artigo.png','/static/images/64/bijelo_polje.png','/static/images/64/bolon.png',
    '/static/images/64/crno polje.png', '/static/images/64/braille kalendar.png','/static/images/64/crno polje.png',
    '/static/images/64/crveno polje.png','/static/images/64/cvrcak kalendar.png','/static/images/64/d.png',
    '/static/images/64/danskina.png','/static/images/64/desso.png','/static/images/64/dlw.png',
    '/static/images/64/e.png','/static/images/64/ege.png','/static/images/64/igla kalendar.png',
    '/static/images/64/kuca kalendar.png','/static/images/64/maljevich kalendar.png','/static/images/64/muratto.png',
    '/static/images/64/narancasto polje.png','/static/images/64/nesite.png','/static/images/64/origami kalendar.png',
    '/static/images/64/sivo polje.png','/static/images/64/vilic kalendar.png'];

    //1 in 10 only 1 logo
    //setup num of logos
    if (Math.floor(Math.random()*10) == 0){
        numOfDifferentLogos = 1;
        bulkImages = [];
    }else {
        numOfDifferentLogos = 5;
    }

    for (var i=0; i<numOfDifferentLogos; i++){
        var temp_image = new Image();
        var logo_selection = Math.floor(Math.random()*urls.length)
        temp_image.src = urls[logo_selection]
        temp_image.width = '64';
        temp_image.height = '64';
        urls.splice(logo_selection, 1);
        bulkImages[i] = temp_image;
    }
}

function getRandomPiece()
{
	var result = Math.floor( Math.random() * 7 );
	var piece;

	switch(result)
	{
		case 0: piece = new LPiece();			break;
		case 1: piece = new BlockPiece();		break;
		case 2: piece = new ZPiece();			break;
		case 3: piece = new TPiece();			break;
		case 4: piece = new ReverseLPiece();	break;
		case 5: piece = new ReverseZPiece();	break;
		case 6: piece = new LinePiece();		break;
	}

	piece.color = Math.floor(Math.random() * bulkImages.length) + 1;
	return piece;
}

function LPiece()
{
	this.state1 = [ [1, 0],
					[1, 0],
					[1, 1] ];
					
	this.state2 = [ [0, 0, 1],
					[1, 1, 1] ];
					
	this.state3 = [ [1, 1],
					[0, 1],
					[0, 1] ];
	
	this.state4 = [ [1, 1, 1],
					[1, 0, 0] ];
					
	this.states = [ this.state1, this.state2, this.state3, this.state4 ];
	this.curState = 0;
	
	this.color = 0;
	this.gridx = 4;
	this.gridy = -3;
}

function ReverseLPiece()
{
	this.state1 = [ [0, 1],
					[0, 1],
					[1, 1] ];
					
	this.state2 = [ [1, 1, 1],
					[0, 0, 1] ];
					
	this.state3 = [ [1, 1],
					[1, 0],
					[1, 0] ];
	
	this.state4 = [ [1, 0, 0],
					[1, 1, 1] ];
					
	this.states = [ this.state1, this.state2, this.state3, this.state4 ];
	this.curState = 0;
	
	this.color = 0;
	this.gridx = 4;
	this.gridy = -3;
}

function BlockPiece()
{
	this.state1 = [ [1, 1],
					[1, 1] ];
					
	this.states = [ this.state1 ];
	this.curState = 0;
	
	this.color = 0;
	this.gridx = 4;
	this.gridy = -2;
}

function LinePiece()
{
	this.state1 = [ [1],
					[1],
					[1],
					[1] ];
					
	this.state2 = [ [1,1,1,1] ];
					
	this.states = [ this.state1, this.state2 ];
	this.curState = 0;
	
	this.color = 0;
	this.gridx = 5;
	this.gridy = -4;
}

function TPiece()
{
	this.state1 = [ [1, 1, 1],
					[0, 1, 0] ];
					
	this.state2 = [ [1, 0],
					[1, 1],
					[1, 0] ];
	
	this.state3 = [ [0, 1, 0],
					[1, 1, 1] ];
					
	this.state4 = [ [0, 1],
					[1, 1],
					[0, 1] ];
					
	this.states = [ this.state1, this.state2, this.state3, this.state4 ];
	this.curState = 0;
	
	this.color = 0;
	this.gridx = 4;
	this.gridy = -2;
}

function ZPiece()
{
	this.state1 = [ [1, 1, 0],
					[0, 1, 1] ];
					
	this.state2 = [ [0, 1],
					[1, 1],
					[1, 0] ];
					
	this.states = [ this.state1, this.state2 ];
	this.curState = 0;
	
	this.color = 0;
	this.gridx = 4;
	this.gridy = -2;
}

function ReverseZPiece()
{
	this.state1 = [ [0, 1, 1],
					[1, 1, 0] ];
					
	this.state2 = [ [1, 0],
					[1, 1],
					[0, 1] ];
					
	this.states = [ this.state1, this.state2 ];
	this.curState = 0;
	
	this.color = 0;
	this.gridx = 4;
	this.gridy = -2;
}

