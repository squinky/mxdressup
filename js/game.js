var bg;
var clothing = [];

function initGame()
{
	bg = new createjs.Bitmap(queue.getResult("mockup"));

	initClothingItem("mockup-hat", 200, 250);
	initClothingItem("mockup-shirt", 300, 500);
}

function initClothingItem(name, xpos, ypos)
{
	var c = {};
	c = new createjs.Bitmap(queue.getResult(name));
	c.regX = c.getBounds().width/2;
	c.regY = c.getBounds().height/2;
	c.x = xpos;
	c.y = ypos;

	c.on("pressmove", function(evt)
	{
		var newPos = stage.globalToLocal(evt.stageX, evt.stageY);
    	evt.target.x = newPos.x;
    	evt.target.y = newPos.y;
	});

	clothing.push(c);
}

function startGame()
{	
	currentScreen = SCREEN_GAME;

	stage.addChild(bg);

	var n;
	for (n of clothing)
	{
		stage.addChild(n);
	}
}
