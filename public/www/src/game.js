// "use strict";

(function() {
	document.addEventListener( "DOMContentLoaded", function() {
	 // document.addEventListener( "deviceready", function() {
		console.log( "Booting app..." );

		//intel.xdk.device.hideSplashScreen();
		
		// lock screen orientation
		// intel.xdk.device.setRotateOrientation("portrait");
		console.log( "Orientation is", screen.orientation );

		// init focus handler
		// focusHandler();

		// create the game object and set critical config data
		createBasicGameObjects();

		// determine screen info such as height, width, aspect ratio
		setupScreenInformation();

		// create a new PIXI stage
		createGameStage();

		// setup gameplay handlers, timers and level builder objects
		createGameplayHandlers();

		// setup gameplay property object - used to store basic game properties
		createGameplayProperties();

		// load scenes
		loadScenes( false );

		function createBasicGameObjects() {
			console.log( "Creating Game object..." );
			window.Game = {};
		}

		function setupScreenInformation() {
			resize( Game );
		}

		function createGameStage() {
			if ( window.Game ) {
				console.log( "Creating stage..." );
				// create an new instance of a pixi stage   
				Game.stage = new PIXI.Container();

				// create a renderer instance	
				Game.renderer = new PIXI.autoDetectRenderer( Game.width, Game.height, 
					{ 	backgroundColor : 0x000000,
						transparent : true,
						antialias : true,
						resolution : Game.pixelRatio || 1,
						autoResize : true
					}, false );

				PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST; // set scale mode to keep pixel images pixelated

				console.log( "Resolution:", Game.renderer.resolution );

				// setting up the renderObject
				Game.renderObject = new PIXI.Container();
				Game.renderObject.name = "RenderObject";
				Game.stage.addChild( Game.renderObject );

				var div = document.getElementById( "grad" );
				div.appendChild( Game.renderer.view );

				// add the renderer view element to the DOM
				// document.body.appendChild( Game.renderer.view );

			} else {
				throw new Error( "NO GAME OBJECT" );
			}
		}

		function createGameplayHandlers() {
			// create GameHandler object 
			Game.GameHandler = {};
			// Game.GameHandler.Timer = new Timer();
			// Game.GameHandler.LevelCreator = new LevelCreator();
			// Game.GameHandler.LevelHandler = new LevelHandler();
			// Game.GameHandler.DataHandler = new DataHandler();

			Game.GameHandler.Loader = null; // define later on
			Game.GameHandler.SoundManager = new SoundManager();
		}

		function createGameplayProperties() {
			Game.Properties = {};
		}

		function loadAssets() {
			console.log( "Loading Assets..." );

			var loader = new PIXI.loaders.Loader( "www/asset/" );
			Game.GameHandler.Loader = loader;
			var startTime = new Date().getTime(); // get a timer snapshot for load time compare
			var loadingText = Scenes.Boot.container.getChildByName( "contentContainer" ).getChildByName( "loadingText" );

			// loading text pulsate tween
			var tween = TweenMax.to( 
				loadingText, //target
				0.5, // duration in seconds
					{ 	alpha : 0.5,
						repeat : -1, // -1 repeats indefintely
						yoyo : true
					}
				)

			loader.on( "progress", onProgressCallback );
			loader
				.add( "new_runner_art/run_cycle/run_cycle.json" )
				.add( "test", "new_runner_art/run_cycle/test.png" )
				.add( "paper_512", "new_runner_art/paper_512.png" )
				.add( "ground", "new_runner_art/ground.png" )
				.add( "128_ground", "new_runner_art/128_ground.png" ) 
				.add( "paper_flake_32", "new_runner_art/paper_flake_32.png" ) 

				.add( "clouds1", "new_runner_art/clouds1.png" )
				.add( "clouds2", "new_runner_art/clouds2.png" )
				.add( "clouds3", "new_runner_art/clouds3.png" )
				.add( "clouds4", "new_runner_art/clouds4.png" )
				.add( "maggot", "tinyMaggot.png" )
				.add( "drop1", "rain_drop.png" )

				// .add( "sound_test", "audio/swoosh.wav" )
				.load( onAssetsLoaded );

			// loadScenes( true ); // sound bypass
			// onAssetsLoaded();

			function onProgressCallback() {
				console.log( "Load Progress:", loader.progress );
			}

			// load game scenes on asset load completion
			function onAssetsLoaded() {
				console.log( "Load complete..." );
				var currentTime = new Date().getTime();
				var timeDiff = currentTime - startTime;

				var loadLoop = function() {
					var currentTime = new Date().getTime();
					var timeDiff = currentTime - startTime;

					// enter load loop wait until all assets are loaded
					if ( timeDiff < configData.minBootTime || Game.GameHandler.SoundManager.Sounds === null || !Game.GameHandler.SoundManager.allLoaded ) {
						setTimeout( loadLoop, 200 );
					} else  {
						tween.kill();
						loadScenes( true ); // load remaining game scenes - pass true to skip Boot scene load and Engine start
					}
				}

				// wait until minBootTime threshold is reached before loading assets
				setTimeout( loadLoop, 200 ); 
			}
		}

		function loadScenes( loaded ) {
			if ( !loaded ) {
				console.log( "Creating Scene Object and Boot Scene..." );
				// short reference to scene list
				window.Scenes = SceneManager.Scenes;
				new SceneManager.scene( "Boot", BootScene );

				// set base scene and start game loop
				Engine.start( Scenes.Boot );

				loadAssets(); // load game assets
			} else {
				console.log( "Load Remainging Scenes..." );

				// load scenes
				// Scene Name, Scene Source
				// new SceneManager.scene( "MainMenu", MainMenuScene );
				// new SceneManager.scene( "Options", OptionsScene );
				// new SceneManager.scene( "Load", LoadScene );
				// new SceneManager.scene( "Gameplay", GameplayScene );
				// new SceneManager.scene( "GameOver", GameOverScene );

				SceneManager.scenesLoaded = true;
				// test scene
				new SceneManager.scene( "Test", TestScene );

				SceneManager.goToScene( Scenes.Test );
			}

		}

	}, false);
}());



