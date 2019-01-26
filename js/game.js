var bg;

function initGame()
{
	bg = new createjs.Bitmap(queue.getResult("mockup"));
}

function startGame()
{	
	currentScreen = SCREEN_GAME;

	stage.addChild(bg);
}
