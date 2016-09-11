var configData = {};

configData.debug = {};
configData.debug.sceneNames = false;
configData.debug.screenSizeSquare = false;

configData.minBootTime = 1000; // ensures the initial load scene will appear for at least this duration - ms
	
configData.baseHeight = 720;
configData.baseWidth = 1280;
configData.widthToHeight = configData.baseWidth / configData.baseHeight;

configData.baseStartTime = 8000; // ms
configData.baseTimeGrowth = 3000; // ms

configData.sceneTransitionSpeed = 500; // ms
configData.sceneTransitionEase = Power4.easeInOut;

configData.audio =  {};
configData.audio.music = 0.2;
// configData.audio.music = 0;

// platform config
configData.platformer = {};
configData.platformer.size = 20;
configData.platformer.columns = 32;
configData.platformer.rows = 24;

configData.platformer.buildMode = true;
configData.platformer.outlineColor = "0xF4511E";
configData.platformer.grid1Color = "0xF5F5F5";
configData.platformer.grid2Color = "0xE0E0E0";

configData.platformer.brickColor = "0x4CAF50"; 