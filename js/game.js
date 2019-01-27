var bg, body, face, skinToneChanger, faceChanger, currentSkinTone, currentFace, refresh;
var bodies = [];
var faces = [];
var clothing = [];

var PILE_MIN_X = 75;
var PILE_MIN_Y = 250;
var PILE_MAX_X = 1100;
var PILE_MAX_Y = 950;

var inspiration, prompt, grammar;

function initGame()
{
	bg = new createjs.Bitmap(queue.getResult("bg"));

	body = new createjs.Container();
	body.x = 1100;
	for (var i = 1; i <= 9; i++)
	{
		var bodybmp = new createjs.Bitmap(queue.getResult("col0"+i));
		bodies.push(bodybmp);
	}
	currentSkinTone = Math.floor(Math.random() * (bodies.length));
	body.addChild(bodies[currentSkinTone]);

	face = new createjs.Container();
	face.x = 1525;
	face.y = 265;
	for (var i = 1; i <= 9; i++)
	{
		var facebmp = new createjs.Bitmap(queue.getResult("face0"+i));
		facebmp.regX = facebmp.getBounds().width/2;
		facebmp.regY = facebmp.getBounds().height/2;
		faces.push(facebmp);
	}
	currentFace = Math.floor(Math.random() * (faces.length));
	face.addChild(faces[currentFace]);

	skinToneChanger = new createjs.Bitmap(queue.getResult("skintonechanger"));
	skinToneChanger.x = 1720;
	skinToneChanger.y = 580;
	skinToneChanger.cursor = "pointer";
	skinToneChanger.on("click", function(evt)
	{
		body.removeAllChildren();
		currentSkinTone++;
		if (currentSkinTone == bodies.length) currentSkinTone = 0;
		body.addChild(bodies[currentSkinTone]);
	});

	faceChanger = new createjs.Bitmap(queue.getResult("facechanger"));
	faceChanger.x = 1720;
	faceChanger.y = 745;
	faceChanger.cursor = "pointer";
	faceChanger.on("click", function(evt)
	{
		face.removeAllChildren();
		currentFace++;
		if (currentFace == faces.length) currentFace = 0;
		face.addChild(faces[currentFace]);
	});

	refresh = new createjs.Bitmap(queue.getResult("refresh"));
	refresh.x = 1735;
	refresh.y = 920;
	refresh.cursor = "pointer";
	refresh.on("click", function(evt)
	{
		restartGame();
	});

	initClothingItems("hair");
	initClothingItems("neck");
	initClothingItems("top");
	initClothingItems("bottom");
	initClothingItems("beard");
	initClothingItems("cat");
	initClothingItems("shoes");
	initClothingItems("hat");
	initClothingItems("octopus");
	initClothingItems("accessory");

	prompt = new createjs.Text("", "32px Open Sans", "#333333");
	prompt.textAlign = "center";
	prompt.x = ACTUAL_WIDTH/2;
	prompt.y = ACTUAL_HEIGHT - 60;

	inspiration = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0,0,0,0.01)").drawRect(0, ACTUAL_HEIGHT-80, ACTUAL_WIDTH, 66));
	inspiration.cursor = "pointer";
	inspiration.on("click", function(evt)
	{
		changeInspirationText();
	});

	grammar = tracery.createGrammar(text);
	grammar.addModifiers(baseEngModifiers);
}

function startGame()
{	
	currentScreen = SCREEN_GAME;

	stage.addChild(bg);
	stage.addChild(body);
	stage.addChild(face);
	stage.addChild(skinToneChanger);
	stage.addChild(faceChanger);
	stage.addChild(refresh);

	changeInspirationText();
	stage.addChild(prompt);
	stage.addChild(inspiration);

	var n;
	for (n of clothing)
	{
		placeClothingItem(n);		
	}
}

function restartGame()
{
	stage.removeAllChildren();
	startGame();
}

function initClothingItems(type)
{
	var i = 1;
	while(true)
	{
		var file = queue.getResult(type+"0"+i);
		if (!file) return;

		var c = {};
		c = new createjs.Bitmap(file);

		c.cursor = "grab";

		c.on("mousedown", function(evt)
		{
			stage.setChildIndex(evt.target, stage.numChildren-1);
			c.posOnObject = evt.target.globalToLocal(evt.stageX, evt.stageY);
		});
		c.on("pressmove", function(evt)
		{
			var newPos = stage.globalToLocal(evt.stageX, evt.stageY);
	    	evt.target.x = newPos.x - c.posOnObject.x;
	    	evt.target.y = newPos.y - c.posOnObject.y;
		});

		clothing.push(c);
		i++;
	}
}

function placeClothingItem(item)
{
	var xpos = Math.floor(Math.random() * (PILE_MAX_X - PILE_MIN_X - item.getBounds().width)) + PILE_MIN_X;
	var ypos = Math.floor(Math.random() * (PILE_MAX_Y - PILE_MIN_Y - item.getBounds().height)) + PILE_MIN_Y;

	item.x = xpos;
	item.y = ypos;

	var zindex = Math.floor(Math.random() * stage.numChildren) + 1;

	stage.addChildAt(item, zindex);
}

function changeInspirationText()
{
	var str = grammar.flatten("#prompt#");
	prompt.text = str.replace("%", "#");
}
