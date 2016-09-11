(function() {
	GameOverScene = {

		init : function( sceneName ) {
			var that = this;
			this.name = sceneName; 

			// create scene container
			this.container = new PIXI.Container();
			this.container.name = this.name;
			Game.renderObject.addChild( this.container );
			this.turnOff(); // turn off scene immediately so it does not start rendering


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// THIS CONTAINER
			////////////////////////////////////////////////////////////////////////////////////////////////////

			createBackground( this.container, "0x616161" );


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// CONTEXT CONTAINER
			////////////////////////////////////////////////////////////////////////////////////////////////////

			createContentContainer( this.container );
			var contentContainer = this.container.getChildByName( "contentContainer" );
			contentContainer.scale.set( Game.scaler ); // set container scale to match global scale

			createTitleText( contentContainer );
			createStatsText( contentContainer );
			createMenuButtons( contentContainer );


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// FUNCTIONS
			////////////////////////////////////////////////////////////////////////////////////////////////////

			// create gameplay container and all of its children 
			function createContentContainer( parent ) {
				var container = new PIXI.Container();
				container.name = "contentContainer";
				parent.addChild( container );
			}

			// fill background with a solid color
			function createBackground( parent, color ) {
				var graphics = new PIXI.Graphics();

				// set a fill and a line style again and draw a rectangle
				graphics.beginFill( color, 1 );
				graphics.drawRect( 0, 0, Game.width, Game.height );
				parent.addChild( graphics );
			}

			// title text
			function createTitleText( parent ) {
				var fontSize = 128;
				var style = {
					font : fontSize + "px Arial",
					fill : "#FFFFFF",
				};

				var titleText = new PIXI.Text( "game over", style );
				titleText.name = "titleText";
				titleText.anchor.set( 0.5 );
				titleText.x = refX( 360 );
				titleText.y = refY( 320 );
				parent.addChild( titleText );
			}

			// all stats text
			function createStatsText( parent ) {
				var fontSize = 48;
				var style = {
					font : fontSize + "px Arial",
					fill : "#FFFFFF"
				};
				var style2 = {
					font : fontSize + "px Arial",
					fill : "#26a69a"
				};

				// this level text label
				var thisLevelText = new PIXI.Text( "this level", style );
				thisLevelText.name = "thisLevelText";
				thisLevelText.anchor.set( 1 );
				thisLevelText.x = refX( 360 );
				thisLevelText.y = refY( 560 );
				parent.addChild( thisLevelText );

				// this level data
				var thisLevelData = new PIXI.Text( "", style2 );
				thisLevelData.name = "thisLevelData";
				thisLevelData.anchor.set( 0, 1 );
				thisLevelData.x = refX( 410 );
				thisLevelData.y = refY( 560 );
				parent.addChild( thisLevelData );
				that.thisLevelData = thisLevelData;

				// highest level text label
				var highestLevelText = new PIXI.Text( "highest level", style );
				highestLevelText.name = "highestLevelText";
				highestLevelText.anchor.set( 1 );
				highestLevelText.x = refX( 360 );
				highestLevelText.y = refY( 660 );
				parent.addChild( highestLevelText );

				// this level text label
				var highestLevelData = new PIXI.Text( "", style2 );
				highestLevelData.name = "highestLevelData";
				highestLevelData.anchor.set( 0, 1 );
				highestLevelData.x = refX( 410 );
				highestLevelData.y = refY( 660 );
				parent.addChild( highestLevelData );
				that.highestLevelData = highestLevelData;

				// best time text label
				var bestTimeText = new PIXI.Text( "best time", style );
				bestTimeText.name = "bestTimeText";
				bestTimeText.anchor.set( 1 );
				bestTimeText.x = refX( 360 );
				bestTimeText.y = refY( 720 );
				parent.addChild( bestTimeText );

				// this level text label
				var bestTimeData = new PIXI.Text( "", style2 );
				bestTimeData.name = "bestTimeData";
				bestTimeData.anchor.set( 0, 1 );
				bestTimeData.x = refX( 410 );
				bestTimeData.y = refY( 720 );
				parent.addChild( bestTimeData );
				that.bestTimeData = bestTimeData;
			}

			// all menu buttons
			function createMenuButtons( parent ) {
				var fontSize = 64;
				var style = {
					font : fontSize + "px Arial",
					fill : "#FFAB00"
				};

				// retry button
				var retryText = new PIXI.Text( "_retry", style );
				retryText.name = "retryText";
				// retryText.anchor.set( 0.5 );
				retryText.x = refX( 180 );
				retryText.y = refY( 950 );
				parent.addChild( retryText );

				retryText.interactive = true;
				retryText.on( "tap", clickRetry );
				retryText.on( "click", clickRetry );

				function clickRetry() {
					console.log( "Click Retry..." );
					SceneManager.goToScene( Scenes.Gameplay, "right" );
					Game.GameHandler.LevelHandler.newGame();

					// play button press sound
					Game.GameHandler.SoundManager.Sounds.button_press.sound.play();
				}

				// main menu button
				var mainMenuText = new PIXI.Text( "_main menu", style );
				mainMenuText.name = "mainMenuText";
				// mainMenuText.anchor.set( 0.5 );
				mainMenuText.x = refX( 180 );
				mainMenuText.y = refY( 1100 );
				parent.addChild( mainMenuText );

				mainMenuText.interactive = true;
				mainMenuText.on( "tap", clickMainMenu );
				mainMenuText.on( "click", clickMainMenu );

				function clickMainMenu() {
					console.log( "Click Main Menu..." );
					SceneManager.goToScene( Scenes.MainMenu, "down" );

					// play button press sound
					Game.GameHandler.SoundManager.Sounds.button_press.sound.play();
				}
			}

			////////////////////////////////////////////////////////////////////////////////////////////////////
			// DEBUG
			////////////////////////////////////////////////////////////////////////////////////////////////////

			createDebugText( this.container, configData.debug );

			// create debug scene name text
			function createDebugText( parent, debug ) {
				var style = {
					font : 'bold italic 36px Arial',
					fill : '#F7EDCA',
					stroke : '#4a1850',
					strokeThickness : 5,
					dropShadow : true,
					dropShadowColor : '#000000',
					dropShadowAngle : Math.PI / 6,
					dropShadowDistance : 6,
					wordWrap : true,
					wordWrapWidth : 440
				};

				var textObject = new PIXI.Text( that.name, style );
				textObject.name = "debugNameText";
				textObject.x = Game.width * 0.7;
				textObject.y = Game.height * 0.94;
				parent.addChild( textObject );

				textObject.visible = debug.sceneNames; // debug on/off bool
			}


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// END
			////////////////////////////////////////////////////////////////////////////////////////////////////
		},

		update : function() {
			this.updateUI();
		},

		updateUI : function() {
			if ( Game.GameHandler.DataHandler.data && !this.updatedUI ) {
				var thisLevel = Game.GameHandler.DataHandler.data.level || 0;
				var highestLevel = Engine.getData( "highestLevel" ) || 0;
				var bestTime = Engine.getData( "bestTime" ) || 0;
				bestTime = ( bestTime / 1000 ).toFixed( 3 );

				this.thisLevelData.text = thisLevel;
				this.highestLevelData.text = highestLevel;
				this.bestTimeData.text = bestTime;

				this.updatedUI = true;
			} 
		},

		onExitComplete : function() {
			this.updatedUI = false;
		}

	}
})();