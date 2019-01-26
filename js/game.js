var bg;
var clothing = [];

var PILE_MIN_X = 75;
var PILE_MIN_Y = 150;
var PILE_MAX_X = 1150;
var PILE_MAX_Y = 950;

function initGame()
{
	bg = new createjs.Bitmap(queue.getResult("mockup"));

	initClothingItem("mockup-hat");
	initClothingItem("mockup-hat");
	initClothingItem("mockup-hat");
	initClothingItem("mockup-hat");
	initClothingItem("mockup-shirt");
	initClothingItem("mockup-shirt");
	initClothingItem("mockup-shirt");
}

function startGame()
{	
	currentScreen = SCREEN_GAME;

	stage.addChild(bg);

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

	c.on("mousedown", function(evt)
	{
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
