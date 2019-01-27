var bg, body, face, skinToneChanger, faceChanger, currentSkinTone, currentFace, refresh;
var bodies = [];
var faces = [];
var clothing = [];

var PILE_MIN_X = 75;
var PILE_MIN_Y = 250;
var PILE_MAX_X = 960;
var PILE_MAX_Y = 950;

var inspiration, prompt, grammar;
var soundToggle, soundOn, soundOff, music;

function initGame()
{
	var i, file;

	bg = new createjs.Bitmap(queue.getResult("bg"));

	body = new createjs.Container();
	body.x = 960;
	
	i = 1;
	file = null;
	while(true)
	{
		file = fileExists("col", i);
		if (!file) break;

		var bodybmp = new createjs.Bitmap(file);
		bodies.push(bodybmp);

		i++;
	}
	currentSkinTone = Math.floor(Math.random() * (bodies.length));
	body.addChild(bodies[currentSkinTone]);

	face = new createjs.Container();
	face.x = 1385;
	face.y = 265;

	i = 1;
	file = null;
	while(true)
	{
		file = fileExists("face", i);
		if (!file) break;

		var facebmp = new createjs.Bitmap(file);
		facebmp.regX = facebmp.getBounds().width/2;
		facebmp.regY = facebmp.getBounds().height/2;
		faces.push(facebmp);

		i++;
	}
	currentFace = Math.floor(Math.random() * (faces.length));
	face.addChild(faces[currentFace]);

	skinToneChanger = new createjs.Bitmap(queue.getResult("skintonechanger"));
	skinToneChanger.x = 1670;
	skinToneChanger.y = 495;
	skinToneChanger.cursor = "pointer";
	skinToneChanger.on("click", function(evt)
	{
		body.removeAllChildren();
		currentSkinTone++;
		if (currentSkinTone == bodies.length) currentSkinTone = 0;
		body.addChild(bodies[currentSkinTone]);
	});

	faceChanger = new createjs.Bitmap(queue.getResult("facechanger"));
	faceChanger.x = 1670;
	faceChanger.y = 670;
	faceChanger.cursor = "pointer";
	faceChanger.on("click", function(evt)
	{
		face.removeAllChildren();
		currentFace++;
		if (currentFace == faces.length) currentFace = 0;
		face.addChild(faces[currentFace]);
	});

	refresh = new createjs.Bitmap(queue.getResult("refresh"));
	refresh.x = 1685;
	refresh.y = 850;
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
	initClothingItems("mustache");

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

	soundToggle = new createjs.Container();
	soundOff = new createjs.Bitmap(queue.getResult("soundoff"));
	soundOn = new createjs.Bitmap(queue.getResult("soundon"));
	soundToggle.x = 1750;
	soundToggle.y = 50;
	soundToggle.cursor = "pointer";
	soundToggle.addChild(soundOff);
	soundToggle.on("click", function(evt)
	{
		if (!music) music = createjs.Sound.play("vogue-midi", { loop: -1 });
		else music.paused = !music.paused;

		soundToggle.removeAllChildren();
		if (music.paused) soundToggle.addChild(soundOff);
		else soundToggle.addChild(soundOn);
	});
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
	stage.addChild(soundToggle);

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
	var file = null;
	while(true)
	{
		file = fileExists(type, i);
		if (!file) break;

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
	if (prompt.getMeasuredWidth() > ACTUAL_WIDTH) changeInspirationText();
}

function fileExists(type, i)
{
	var file;
	if (file < 0) return file;
	else if (i < 10) file = queue.getResult(type+"0"+i);
	else file = queue.getResult(type+i);
	return file;
}
