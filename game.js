var canvas_margin = 20;
var width = 640;
var height = 480;
var canvas = document.getElementById("canvas");
var context = canvas.getContext( '2d' );
var playerX = canvas_margin;
var	playerY = canvas_margin;
var enemyX = 320
var enemyY = 240;
var speed = 5;
var directionX = speed;
var directionY = speed;
var behindLine = [{'x': playerX, 'y': playerY}];
var marginLine = [{'x': canvas_margin, 'y': canvas_margin}];
var rotation = 0.25;
var check=0;
var d=new Date();
var startTime=d.valueOf();
var speedX = 0;
var speedY = 0;
var loser = new Image();
var text= 0;
var timelimit = 45;
loser.src = "img/loser.png";
var winner = new Image();
winner.src = "img/winner.png";
var enemy = new Image();
var level = 1;
enemy.src = "img/ghost.png";
context.globalAlpha =1;
var background = new Image();
background.src = "img/minions.jpg";

window.addEventListener("keydown",doKeyDown,true);
init();
var initialArea = arie();
function init(){
marginLine = [{'x': canvas_margin, 'y': canvas_margin}];
for(var i = canvas_margin+5;i<height-canvas_margin;i+=5)
{
	marginLine.push({'x':canvas_margin,'y':i});
}
for(var i = canvas_margin;i<width-canvas_margin;i+=5)
{
	marginLine.push({'x':i,'y':height-canvas_margin});
}
for(var i = height-canvas_margin;i > canvas_margin;i-=5)
{
	marginLine.push({'x':width-canvas_margin,'y':i});
}
for(var i = width-canvas_margin;i >=canvas_margin;i-=5)
{
	marginLine.push({'x':i,'y':canvas_margin});
}
}

function mainLoop(){
	var aux_time=(new Date).getTime();
	if(checkDead() || text > timelimit || check== 1) {
		window.addEventListener("keydown",doKeyDown,false);
		context.drawImage(loser,0,0,640,480);
		text = timelimit;
		check = 1;
		}
	else
		if(level>2) {
			window.addEventListener("keydown",doKeyDown,false);
			context.drawImage(winner,0,0,640,480);
			check = 3;
		}
		else
		if(score()>=85 || check ==2){
					level++;
		if(level<3)
		{
			init();
			check =3;
			startTime = aux_time;
			directionX = 2*speed;
			directionY = 2*speed;
			timelimit +=level*45;
			background.src="img/level2.jpg";
			enemyX = 320
			enemyY = 240;
			playerX=playerY = canvas_margin;
			rotation = 0.25;
			behindLine = [{'x': playerX, 'y': playerY}];
		}
		}
		else
		{
			text=(aux_time-startTime)/1000;
			context.fillStyle = "black";
			context.fillRect(0,0,width,height);
			context.drawImage(background,canvas_margin,canvas_margin,width-2*canvas_margin,height -2*canvas_margin);
			drawBg(marginLine,"yellow","white");
			drawLine(behindLine,"pink");
			context.fillStyle = "red";
			context.beginPath();
			context.arc(playerX, playerY, 10, rotation*Math.PI, (rotation+1)*Math.PI, true);
			context.closePath();
			context.fill();
			context.beginPath();
			context.arc(playerX, playerY, 10, (rotation+0.5)*Math.PI, (rotation+1.5)*Math.PI,false);
			context.closePath();
			context.fill();
			context.fillStyle = "black";
			context.beginPath();
			if(rotation<1)
				context.arc(playerX+4, playerY-2, 3, 0, 2*Math.PI, true);
			else
				if(rotation==1.75)
					context.arc(playerX-4, playerY-2, 3, 0, 2*Math.PI, true);
				else
					context.arc(playerX+4, playerY+2, 3, 0, 2*Math.PI, true);
			context.closePath();
			context.fill();
			moveEnemy();
			movePlayer();
		}
	$(".score").text("    "+score()+"%");
	$(".TIME").text(text);
}

function moveEnemy() {
	var ok=0;
	enemyX +=directionX;
	enemyY +=directionY;
	for(var i=-5;i<=20;i+=5)
	if((!inside(enemyX+i,enemyY-5) && !inside(enemyX+i+5,enemyY-5)) || (!inside(enemyX+i,enemyY+25) && !inside(enemyX+i+5,enemyY+25))) {
		directionY *=-1;
		ok =1;
		break;
	}
	for(var i=-5;i<=20;i+=5)
	if((!inside(enemyX-5,enemyY+i) && !inside(enemyX-5,enemyY+i+5)) || (!inside(enemyX+25,enemyY+i+5) && !inside(enemyX+25,enemyY+i))) {
		directionX *=-1;
		ok =1;
		break;
	}
	if(ok==1)
	{
		enemyX +=directionX;
		enemyY +=directionY;
	}
	context.drawImage(enemy,enemyX,enemyY,20,20);
}
function movePlayer(){
	playerX +=speedX;
	playerY +=speedY;

	if(!onMargin(playerX,playerY) && !inside(playerX,playerY))
	{
		playerX -=speedX;
		playerY -=speedY;
		speedX=speedY=0;
	}
	if(!onMargin(playerX,playerY))
		behindLine = addLine();
	else
	{
	   if ( behindLine.length > 1 && (behindLine[0].x !=playerX || behindLine[0].y!=playerY)){
			updateMarginLine();
		}
		behindLine = [{'x': playerX, 'y': playerY}];
	}
}

function doKeyDown(event) {
	switch (event.keyCode) {
			case 38: /*Up arrow*/
					speedY = -speed;
					speedX=0;
					rotation=1.25;
				break;
			case 40: /*Down arrow*/
					speedY = speed;
					speedX = 0;
					rotation = 0.25;
				break;
			case 37: /*Left arrow*/
					speedX = -speed;
					speedY = 0;
					rotation = 0.75;
				break;
			case 39: /*Right arrow*/
					speedX = speed;
					speedY=0;
					rotation = 1.75;					
				break;
	}
}

function determine_direction( poz)
{
	var stop;
	var i;
	for ( i = poz; i < marginLine.length ; i++)
	     if(playerX== marginLine[i].x && playerY == marginLine[i].y )
			return i;
	if(i==marginLine.length)
	{
		for ( i = 0; i < poz ; i++)
	     if(playerX== marginLine[i].x && playerY == marginLine[i].y )
			return i;
	}
  var total= marginLine.length; //nr total de liniute
}

function redesignMargin(start, stop){
		if(stop>start){
			var auxMarginLine = marginLine;
			var auxLeft = marginLine.slice(0,start);
			var auxRight = marginLine.slice(stop);
			marginLine = auxLeft.concat(behindLine.concat( auxRight));
			for(var i=0;i<20;i+=5)
				if((!inside(enemyX+i,enemyY) && !inside(enemyX+i+5,enemyY)) || (!inside(enemyX+i,enemyY+20) && !inside(enemyX+i+5,enemyY+20))) {
					auxLeft = auxMarginLine.slice(start,stop);
					behindLine.push({'x':playerX,'y':playerY});
					marginLine = auxLeft.concat(behindLine.reverse());
					break;
				}
			for(var i=0;i<20;i+=5)
				if((!inside(enemyX,enemyY+i) && !inside(enemyX,enemyY+i+5)) || (!inside(enemyX+20,enemyY+i+5) && !inside(enemyX+20,enemyY+i))) {
					auxLeft = auxMarginLine.slice(start,stop);
					behindLine.push({'x':playerX,'y':playerY});
					marginLine = auxLeft.concat(behindLine.reverse());
					break;
				}
		}
		else{
			var auxMarginLine = marginLine;
			behindLine.push({'x':playerX,'y':playerY});
			var auxLeft = marginLine.slice(0,stop);
			var auxRight = marginLine.slice(start);
			marginLine = auxLeft.concat((behindLine.reverse()).concat(auxRight))

			for(var i=0;i<20;i+=5)
				if((!inside(enemyX+i,enemyY) && !inside(enemyX+i+5,enemyY)) || (!inside(enemyX+i,enemyY+20) && !inside(enemyX+i+5,enemyY+20))) {
					auxLeft = auxMarginLine.slice(stop,start);
					marginLine = auxLeft.concat(behindLine.reverse());
					break;
				}
			for(var i=0;i<20;i+=5)
				if((!inside(enemyX,enemyY+i) && !inside(enemyX,enemyY+i+5)) || (!inside(enemyX+20,enemyY+i+5) && !inside(enemyX+20,enemyY+i))) {
					auxLeft = auxMarginLine.slice(stop,start);
					marginLine = auxLeft.concat(behindLine.reverse());
					break;
				}
		}
}

function updateMarginLine(){
	var first;
	for (var i = 0; i< marginLine.length; i++){
		if (behindLine[0].x== marginLine[i].x && behindLine[0].y == marginLine[i].y)
			{
				var stop = determine_direction(i);
				redesignMargin(i,stop);
			break;
			}
		}
}

function addLine() {
	var auxBehindLine = [{'x': behindLine[0].x, 'y': behindLine[0].y}];
	for( var i =1;i<behindLine.length;i++)
		if(playerX == behindLine[i].x && playerY == behindLine[i].y)
			break;
		else
			auxBehindLine.push({'x': behindLine[i].x, 'y': behindLine[i].y});
	auxBehindLine.push({'x':playerX,'y':playerY});
	return auxBehindLine;
}

function onMargin(pozX,pozY) {
	for (var i = 0; i< marginLine.length; i++){
		if (pozX == marginLine[i].x && pozY == marginLine[i].y)
		return true;
	}
	return false;
}

function drawLine(line,color) {
	for(var i = 1; i < line.length ; i++ )
	{
		context.strokeStyle = color;
		context.beginPath();
		context.moveTo(line[i-1].x,line[i-1].y);
		context.lineTo(line[i].x,line[i].y);
		context.closePath();
		context.stroke();
		context.fill();
	}
}
function drawBg(line,color,colorbg) {
	context.fillStyle = colorbg;
	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(line[0].x,line[0].y);
	for(var i = 1; i < line.length ; i++ )
	{
		context.lineTo(line[i].x,line[i].y);
	}
	context.closePath();
	context.stroke();
	context.fill();
}
function contain(pozX,pozY) {
	for(var i = 0;i<marginLine.length;i++)
	{
		if(pozX == marginLine[i].x && pozY == marginLine[i].y)
			return i;
	}
	return -1;
}

function arie() {
	var a=0;
	for(var i=0;i<marginLine.length-1;i++)
		a += (marginLine[i].y+marginLine[i+1].y)*(marginLine[i+1].x-marginLine[i].x)/2;
	return Math.abs(a);
}

function insidePoly(pozX,pozY)
{
	var c = 0;
	var j;
	for (var i = 0, j = marginLine.length-1; i < marginLine.length; j = i++) {
    if ( ((marginLine[i].y>pozY) != (marginLine[j].y>pozY)) && 
		(pozX < (marginLine[j].x-marginLine[i].x) * (pozY-marginLine[i].y) / (marginLine[j].y-marginLine[i].y) + marginLine[i].x) )
       c = !c;
	}
	return c==1;
}

function checkDead() {
	for(var i=0;i<behindLine.length;i++)
		for(var j=0;j<=20;j++)
		{
			if((behindLine[i].x == enemyX+j &&  behindLine[i].y ==enemyY) || (behindLine[i].x == enemyX+j &&  behindLine[i].y ==enemyY+20) || (behindLine[i].x == enemyX &&  behindLine[i].y ==enemyY+j) || (behindLine[i].x == enemyX+20 &&  behindLine[i].y ==enemyY+j))  
				return true;
		}
	return false;
}

function score(){
  var partiala = arie();
  var procent = 100-partiala/initialArea * 100;
  procent = procent*100;
  Math.ceil(procent);
  return Math.ceil(procent)/100;
}

function inside(pozX,pozY) {
	var pozEnd = contain(pozX,pozY);
	var pozBegin = contain(playerX,playerY);
	if(pozEnd>0 && pozBegin>0)
	{
		if(Math.abs(pozEnd-pozBegin) != 1)
			return false;
	}
	if(onMargin(pozX,pozY))
		return true;
	return insidePoly(pozX,pozY);
}
