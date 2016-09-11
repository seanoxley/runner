(function() {
	GameplayScene = {

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

			createBackground( this, "0x212121" );


			// setup containers and children
			////////////////////////////////////////////////////////////////////////////////////////////////////
			// CONTEXT CONTAINER
			////////////////////////////////////////////////////////////////////////////////////////////////////
			createContentContainer( this );
			var contentContainer = this.container.getChildByName( "contentContainer" );
			contentContainer.scale.set( Game.scaler ); // set container scale to match global scale

			// create a new PatternDisplay object and add it to passed container
			Game.GameHandler.PatternDisplay = new PatternDisplay( contentContainer, "PatternDisplay" )
				.setPosition({ 	x : refX( 360 ), 
								y : refY( 420 )
							});

			// create a new ButtonPad object and add it to passed container
			Game.GameHandler.ButtonPad = new ButtonPad( contentContainer, "ButtonPad" )
				.setPosition({ 	x : refX( 360 ), 
								y : refY( 720 )
							});

			// create a new TopUIBar object and add it to passed container
			Game.GameHandler.TopUIBar = new TopUIBar( contentContainer, "TopUIBar", "0x0091ea", "0x616161", "0xff6d00" );


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// FUNCTIONS
			////////////////////////////////////////////////////////////////////////////////////////////////////

			// create gameplay container and all of its children 
			function createContentContainer( parent ) {
				var container = new PIXI.Container();
				container.name = "contentContainer";
				parent.container.addChild( container );

				// debug square to show gameplay area
				testSquare( container, 0xFFFFFF );

				function testSquare( parent, color ) {
					var graphics = new PIXI.Graphics();
					// set a fill and a line style again and draw a rectangle
					graphics.beginFill( color, 1 );
					graphics.drawRect( Game.gameX, Game.gameY, Game.gameWidth, Game.gameHeight );
					graphics.alpha = 0.05;
					parent.addChild( graphics );

					graphics.visible = configData.debug.screenSizeSquare; // debug on/off bool
				}
			}

			// fill background with a solid color
			function createBackground( parent, color ) {
				var graphics = new PIXI.Graphics();

				// set a fill and a line style again and draw a rectangle
				graphics.beginFill( color, 1 );
				graphics.drawRect( 0, 0, Game.width, Game.height );
				parent.container.addChild( graphics );
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
			// update UI
			var timerTextObject = Game.GameHandler.TopUIBar.container.getChildByName( "timerText" );
			var levelTextObject = Game.GameHandler.TopUIBar.container.getChildByName( "levelText" );

			if ( Game.GameHandler.DataHandler.data ) {
				var percent =  Game.GameHandler.Timer.getTime() / Game.GameHandler.Timer.timerStartSnapshot;

				timerTextObject.text = ( Game.GameHandler.Timer.getTime() / 1000 ).toFixed( 3 ); // format the timer text into 00.000
				levelTextObject.text = Game.GameHandler.DataHandler.data.level;
				Game.GameHandler.TopUIBar.setBarPercent( percent ); // set top timer bar to current time left %

				// ensures the else if does not continuously run if no data is loaded
				if ( this.updated ) {
					this.updated = false;
				}
			} else if ( !this.updated ) {
				timerTextObject.text = 0;
				levelTextObject.text = 0;
				this.updated = true;
			}
		}
		
	}
})();