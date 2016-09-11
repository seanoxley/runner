(function() {
	LevelHandler = function() {
		var that = this;
		this.baseLevel = 1;
		this.baseStartTime = configData.baseStartTime; // time in ms
		this.baseTimeGrowth = configData.baseTimeGrowth; // time in ms

		this.newGame = function() {
			this.reset();
			var newLevel = this.createLevelData( this.baseLevel, this.baseStartTime );
			console.log( newLevel )
			this.active = true;
			this.paused = false;
			this.startNextLevel( newLevel );
		};

		this.createLevelData = function( level, time ) {
			if ( !level ) {
				level = 0;
			}
			var levelObject = {
				id : new Date().getTime(),
				level : level,
				startTime : time,
				addTime : this.baseTimeGrowth,
				displayData : [
					{ status : 0, 	hidden : false, 	data : "1" },
					{ status : 0, 	hidden : true,	 	data : "2" },
					{ status : 0, 	hidden : false, 	data : "3" },
					{ status : 0, 	hidden : true,	 	data : "4" },
					{ status : 0, 	hidden : false, 	data : "5" }
				],
				buttonData : [
					{ data : "1",	answer : false },
					{ data : "2", 	answer : true },
					{ data : "3", 	answer : false },
					{ data : "4", 	answer : true },
				]
			}; 

			levelObject = Game.GameHandler.LevelCreator.newLevel( level, time, this.baseTimeGrowth );

			return levelObject;
		};

		this.pause = function() {
			if ( this.paused || !this.active ) {
				return false;
			};
			console.log( "Pausing..." );
			this.paused = true;
			Game.GameHandler.Timer.pause();
		};

		this.resume = function() {
			if ( !this.paused || !this.active ) {
				return false;
			}
			console.log( "Resume..." );
			this.paused = false;
			Game.GameHandler.Timer.resume();
		};

		this.startNextLevel = function( levelData ) {
			if ( !levelData ) {
				return false;
			}

			console.log( "Starting Level", levelData.level );
			Game.GameHandler.DataHandler.load( levelData );
		};

		this.gameOver = function( tweenDuration ) {	
			var waitTime = tweenDuration || 1000;		
			SceneManager.getCurrent().setInteractive( false );
			this.pause(); // pause timer for transition period

			// store level data if > current highestLevel
			var levelReached = Game.GameHandler.DataHandler.data.level;
			console.log( "Current Level", levelReached );

			var currentTime = Game.GameHandler.Timer.getTime();
			var totalTime = Game.GameHandler.DataHandler.data.startTime;
			var elapsedTime = totalTime - currentTime;
			console.log( "Elapsed Time:", elapsedTime );

			if ( Engine.getData( "highestLevel" ) < levelReached ) {
				Engine.storeData( "highestLevel", levelReached );
				Engine.storeData( "bestTime", elapsedTime );
			}

			console.log( "Game Over... - transition in", waitTime );

			setTimeout( function() {
				SceneManager.goToScene( Scenes.GameOver, null, tweenDuration );
			}, waitTime );
		};

		this.winLevel = function( levelData ) {
			if ( !levelData ) {
				return false;
			}
			// var levelData = levelData;
			that.levelData = levelData;
			var target = { alpha : 1 }; 

			this.pause(); // pause timer for transition period

			startAlphaTween();

			// tween to 0 alpha
			function startAlphaTween() {
				var tween = TweenLite.to( 
					target, //target
					0.5, // duration in seconds
						{ 	alpha : 0,
							onUpdate : function() {
								Game.GameHandler.PatternDisplay.setAlpha( target.alpha, "all" );
								Game.GameHandler.ButtonPad.setAlpha( target.alpha, "all" );
							},
							onComplete : function() {
								console.log( "END ALPHA TWEEN" );

								startNextLevel();
								startPositionTween();
							}
						}
					)
			}

			// tween position to base location
			function startPositionTween() {
				var target = { y : 0, alpha : 0 };
				var basePosition =  Game.GameHandler.PatternDisplay.getPosition().y;

				// set PatternDisplay offscreen
				Game.GameHandler.PatternDisplay.setPosition( { y : 0 } );
				Game.GameHandler.PatternDisplay.setAlpha( 1, "all" );
				Game.GameHandler.PatternDisplay.updateDisplay();

				Game.GameHandler.ButtonPad.setAlpha( 0, "all" );

				// tween PatternDisplay to original position
				var tween = TweenLite.to( 
					target, //target
					0.75, // duration in seconds
						{ 	y : basePosition,
							ease : Back.easeOut,
							onUpdate : function() {
								Game.GameHandler.PatternDisplay.container.y = target.y;
							},
							onComplete : endPositionTween
						}
					)

				var tween2 = TweenLite.to( 
					target, //target
					0.75, // duration in seconds
						{ 	alpha : 1,
							ease : Linear.easeNone,
							onUpdate : function() {
								Game.GameHandler.ButtonPad.setAlpha( target.alpha, "all" );
							}
						}
					)

				function endPositionTween() {
					console.log( "END POSITION TWEEN" );
					Game.GameHandler.PatternDisplay.y = basePosition;
					Game.GameHandler.ButtonPad.setAlpha( 1, "all" );
				}
			}

			function startNextLevel() {
				var levelData = that.levelData;
				var nextLevel = levelData.level + 1;
				var nextTime = levelData.startTime + that.baseTimeGrowth;
				var levelData = that.createLevelData( nextLevel, nextTime );

				console.log( "Transition to next level..." );
				that.resume();
				that.startNextLevel( levelData );
			}
		};

		this.reset = function() {
			this.active = false;
			Game.GameHandler.DataHandler.reset();
		};

		this.isActive = function() {
			return this.active;
		};

		init();

		function init() {
			console.log( "Level Handler init" );
		}
	}
})();

