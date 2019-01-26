var bg, body, skinToneChanger, currentSkinTone;
var bodies = [];
var clothing = [];

var PILE_MIN_X = 75;
var PILE_MIN_Y = 250;
var PILE_MAX_X = 1150;
var PILE_MAX_Y = 950;

var prompt, grammar;

function initGame()
{
	bg = new createjs.Bitmap(queue.getResult("bg"));

	body = new createjs.Container();
	body.x = 1200;
	for (var i = 1; i <= 9; i++)
	{
		var bodybmp = new createjs.Bitmap(queue.getResult("col0"+i));
		bodies.push(bodybmp);
		body.addChild(bodybmp);
	}
	currentSkinTone = Math.floor(Math.random() * (bodies.length));
	body.setChildIndex(bodies[currentSkinTone], body.numChildren-1);

	skinToneChanger = new createjs.Bitmap(queue.getResult("skintonechanger"));
	skinToneChanger.x = 1720;
	skinToneChanger.y = 800;
	skinToneChanger.cursor = "pointer";
	skinToneChanger.on("click", function(evt)
	{
		currentSkinTone++;
		if (currentSkinTone == bodies.length) currentSkinTone = 0;
		body.setChildIndex(bodies[currentSkinTone], body.numChildren-1);
	});

	initClothingItem("face01");
	initClothingItem("hair01");
	initClothingItem("neck01");
	initClothingItem("top01");
	initClothingItem("bottom01");
	initClothingItem("beard01");
	initClothingItem("cat01");
	initClothingItem("shoes01");

	prompt = new createjs.Text("", "32px Open Sans", "#333333");
	prompt.textAlign = "center";
	prompt.x = ACTUAL_WIDTH/2;
	prompt.y = ACTUAL_HEIGHT - 60;

	grammar = tracery.createGrammar(text);
	grammar.addModifiers(baseEngModifiers);
}

function startGame()
{	
	currentScreen = SCREEN_GAME;

	stage.addChild(bg);
	stage.addChild(body);
	stage.addChild(skinToneChanger);

	prompt.text = grammar.flatten("#prompt#");
	stage.addChild(prompt);

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

function initClothingItem(name)
{
	var c = {};
	c = new createjs.Bitmap(queue.getResult(name));
	c.regX = c.getBounds().width/2;
	c.regY = c.getBounds().height/2;
	c.cursor = "grab";

	c.on("mousedown", function(evt)
	{
		var newPos = stage.globalToLocal(evt.stageX, evt.stageY);
    	evt.target.x = newPos.x;
    	evt.target.y = newPos.y;
		stage.setChildIndex(evt.target, stage.numChildren-1);
	});
	c.on("pressmove", function(evt)
	{
		var newPos = stage.globalToLocal(evt.stageX, evt.stageY);
    	evt.target.x = newPos.x;
    	evt.target.y = newPos.y;
	});

	clothing.push(c);
}

function placeClothingItem(item)
{
	var xpos = Math.floor(Math.random() * (PILE_MAX_X - PILE_MIN_X)) + PILE_MIN_X;
	var ypos = Math.floor(Math.random() * (PILE_MAX_Y - PILE_MIN_Y)) + PILE_MIN_Y;

	if ((xpos - item.getBounds().width/2) < PILE_MIN_X) xpos = PILE_MIN_X + item.getBounds().width/2;
	if ((ypos - item.getBounds().height/2) < PILE_MIN_Y) ypos = PILE_MIN_Y + item.getBounds().height/2;
	if ((xpos + item.getBounds().width/2) > PILE_MAX_X) xpos = PILE_MAX_X - item.getBounds().width/2;
	if ((ypos + item.getBounds().height/2) > PILE_MAX_Y) ypos = PILE_MAX_Y - item.getBounds().height/2;

	item.x = xpos;
	item.y = ypos;

	var zindex = Math.floor(Math.random() * stage.numChildren) + 1;

	stage.addChildAt(item, zindex);
}
