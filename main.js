const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./MyAnimation.png");
ASSET_MANAGER.queueDownload("./Animation.png");
ASSET_MANAGER.queueDownload("./hair.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	canvas.style.background = "Gray";

	gameEngine.init(ctx);

	gameEngine.addEntity(new Character(gameEngine, canvas.width / 2, -128, 0));

	gameEngine.start();
});