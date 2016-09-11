(function() {
	MainMenuScene = {

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

			createBackground( this.container, "0x607D8B" );


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// CONTEXT CONTAINER
			////////////////////////////////////////////////////////////////////////////////////////////////////

			createContentContainer( this.container );
			var contentContainer = this.container.getChildByName( "contentContainer" );
			this.contentContainer = contentContainer;
			contentContainer.scale.set( Game.scaler ); // set container scale to match global scale

			createTitleText( contentContainer );
			createMenuButtons( contentContainer );

			createTutorialText( contentContainer );
			createCountdownText( contentContainer );

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

			function createTutorialText( parent ) {
				var fontSize = 64;
				var style = {
					font : fontSize + "px Arial",
					fill : "#FFFFFF",
				};

				var tutorialText = new PIXI.Text( "complete the pattern in", style );
				tutorialText.name = "tutorialText";
				tutorialText.anchor.set( 0.5 );
				tutorialText.x = refX( 360 );
				tutorialText.y = refY( -600 );
				parent.addChild( tutorialText );
			}

			function createCountdownText( parent ) {
				var fontSize = 256;
				var style = {
					font : fontSize + "px Arial",
					fill : "#FFAB00"
				};

				var countdownText = new PIXI.Text( "3", style );
				countdownText.name = "countdownText";
				countdownText.anchor.set( 0.5 );
				countdownText.x = refX( 360 );
				countdownText.y = refY( -360 );
				parent.addChild( countdownText );
			}

			// title text
			function createTitleText( parent ) {
				var fontSize = 196;
				var style = {
					font : fontSize + "px Arial",
					fill : "#FFFFFF",
				};

				var titleText = new PIXI.Text( "patterns", style );
				titleText.name = "titleText";
				titleText.anchor.set( 0.5 );
				titleText.x = refX( 360 );
				titleText.y = refY( 320 );
				parent.addChild( titleText );
			}

			// all menu buttons
			function createMenuButtons( parent ) {
				var fontSize = 64;
				var style = {
					font : fontSize + "px Arial",
					fill : "#FFAB00"
				};

				// new game button
				var newGameText = new PIXI.Text( "_new game", style );
				newGameText.name = "newGameText";
				// newGameText.anchor.set( 0.5 );
				newGameText.x = refX( 180 );
				newGameText.y = refY( 600 );
				parent.addChild( newGameText );

				newGameText.interactive = true;
				newGameText.on( "tap", clickNew );
				newGameText.on( "click", clickNew );

				function clickNew() {
					console.log( "Starting New Game..." );

					// play button press sound
					// Game.GameHandler.SoundManager.Sounds.button_press.sound.play();

					that.setInteractive( false );
					that.countDownTransition();
					// SceneManager.goToScene( Scenes.Gameplay );
					// Game.GameHandler.LevelHandler.newGame();
				}

				// options button
				var optionsText = new PIXI.Text( "_options", style );
				optionsText.name = "optionsText";
				// optionsText.anchor.set( 0.5 );
				optionsText.x = refX( 180 );
				optionsText.y = refY( 750 );
				parent.addChild( optionsText );

				// optionsText.interactive = true;
				optionsText.on( "tap", clickOptions );
				optionsText.on( "click", clickOptions );

				function clickOptions() {
					console.log( "Click Options..." );
				}

				optionsText.visible = 0; // options button is currently deactive
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

		reset : function() {
			var titleText = this.contentContainer.getChildByName( "titleText" );
			var newGameText = this.contentContainer.getChildByName( "newGameText" );
			var optionsText = this.contentContainer.getChildByName( "optionsText" );

			var tutorialText = this.contentContainer.getChildByName( "tutorialText" );
			var countdownText = this.contentContainer.getChildByName( "countdownText" );

			titleText.alpha = 1;
			newGameText.alpha = 1;
			optionsText.alpha = 0.5;

			tutorialText.position.y = refY( -600 );
			countdownText.position.y = refY( -360 );
			countdownText.text = 3;
		},

		countDownTransition : function() {
			console.log( "Countdown transition..." );

			var titleText = this.contentContainer.getChildByName( "titleText" );
			var newGameText = this.contentContainer.getChildByName( "newGameText" );
			var optionsText = this.contentContainer.getChildByName( "optionsText" );
			var alphaTarget = { alpha : 1 }; 

			var tutorialText = this.contentContainer.getChildByName( "tutorialText" );
			var countdownText = this.contentContainer.getChildByName( "countdownText" );
			var positionTarget = { y : 0 }
			var countdownTarget = { text : 3 }

			var base = {};
			base.tutorialText = -600
			base.countdownText = -360

			startAlphaTween();
			startPositionTween();

			function startAlphaTween() {
				var tween = TweenLite.to( 
					alphaTarget, //target
					0.25, // duration in seconds
						{ 	alpha : 0,
							onUpdate : function() {
								titleText.alpha = alphaTarget.alpha;
								newGameText.alpha = alphaTarget.alpha;
								optionsText.alpha = alphaTarget.alpha / 2;
							},
							onComplete : function() {
								console.log( "END ALPHA TWEEN" );

								titleText.alpha = 0;
								newGameText.alpha = 0;
								optionsText.alpha = 0;
							}
						}
					)
			}

			function startPositionTween() {
				var tween = TweenLite.to( 
					positionTarget, //target
					0.5, // duration in seconds
						{ 	y : 1000,
							delay : 0.2,
							ease : Power4.easeInOut,
							onUpdate : function() {
								tutorialText.position.y = positionTarget.y + base.tutorialText;
								countdownText.position.y = positionTarget.y + base.countdownText;

							},
							onComplete : function() {
								console.log( "END POSITION TWEEN" );

								tutorialText.position.y = refY( 400 );
								countdownText.position.y = refY( 640 );
								// startCountdownTween();

								setTimeout( function() {
									// play countdown blip
									Game.GameHandler.SoundManager.Sounds.button_blip.sound.play()
								}, 50 );

								var countdown = 3;
								var interval = setInterval( function() {
									countdown--;

									if ( countdown === -1 ) {
										countdown = 0;
										clearInterval( interval );
										SceneManager.goToScene( Scenes.Gameplay );
										Game.GameHandler.LevelHandler.newGame();
									} else {
										// play countdown blip
										Game.GameHandler.SoundManager.Sounds.button_blip.sound.play();
									}
									countdownText.text = countdown;

								}, 1000 );

							}
						}
					)
			}

			function startCountdownTween() {
				var tween = TweenLite.to( 
					countdownTarget, //target
					3, // duration in seconds
						{ 	text : 0,
							delay : 0.5,
							ease : Linear.easeNone,
							onUpdate : function() {
								countdownText.text = parseInt( countdownTarget.text );
							},
							onComplete : function() {
								console.log( "END COUNTDOWN TWEEN" );

								countdownText.text = 0;


							}
						}
					)
			}

		},

		onEnter : function() {
			console.log( "onEnter:", this.name );
			this.setInteractive( true );

			// if ( !SoundManager.musicStarted ) {
			// 	SoundManager.musicStarted = true;
			// 	Game.GameHandler.SoundManager.playNextMusic();
			// }
		},

		onExitComplete : function() { 
			console.log( "onExitComplete:", this.name );
			this.reset();
		}

	}
})();