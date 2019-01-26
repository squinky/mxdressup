var bg, body, skinToneChanger, currentSkinTone;
var bodies = [];
var clothing = [];

var PILE_MIN_X = 75;
var PILE_MIN_Y = 250;
var PILE_MAX_X = 1150;
var PILE_MAX_Y = 950;

var inspiration, prompt, grammar;

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
	skinToneChanger.x = 1300;
	skinToneChanger.y = 100;
	skinToneChanger.cursor = "pointer";
	skinToneChanger.on("click", function(evt)
	{
		currentSkinTone++;
		if (currentSkinTone == bodies.length) currentSkinTone = 0;
		body.setChildIndex(bodies[currentSkinTone], body.numChildren-1);
	});

	initClothingItems("face");
	initClothingItems("hair");
	initClothingItems("neck");
	initClothingItems("top");
	initClothingItems("bottom");
	initClothingItems("beard");
	initClothingItems("cat");
	initClothingItems("shoes");
	initClothingItems("hat");

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
	stage.addChild(skinToneChanger);

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
	var xpos = Math.floor(Math.random() * (PILE_MAX_X - PILE_MIN_X)) + PILE_MIN_X;
	var ypos = Math.floor(Math.random() * (PILE_MAX_Y - PILE_MIN_Y)) + PILE_MIN_Y;

	if (xpos < PILE_MIN_X) xpos = PILE_MIN_X ;
	if (ypos < PILE_MIN_Y) ypos = PILE_MIN_Y;
	if ((xpos + item.getBounds().width) > PILE_MAX_X) xpos = PILE_MAX_X - item.getBounds().width;
	if ((ypos + item.getBounds().height) > PILE_MAX_Y) ypos = PILE_MAX_Y - item.getBounds().height;

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
