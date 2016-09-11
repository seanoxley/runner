(function() {
	Timer = function() {
		var that = this;

		this.newTimer = function( initialTime ) {
			var startTime = initialTime / 1000 || 1; // initialTime is passed in ms so it is divided by 1000 to translate into seconds - default of 1 second for init purposes
			this.timerObject = { time : initialTime };

			var tween = TweenLite.to( 
				this.timerObject, //target
				startTime, // duration
				{ time : 0, // final value - 0
					// onUpdate : showScore, // on update callback
					onComplete : endTween, // on complete callback
					ease : Linear.easeNone, // no easing
					paused : true // stops tween from auto playing
				})

			this.timerObject.tween = tween;

			function endTween() {
				console.log( "Tween Complete" );
				Game.GameHandler.LevelHandler.gameOver();
			}
		};

		this.setTime = function( setTime ) {
			if ( !setTime ) {
				return false;
			}
			this.timerObject.time = setTime;
			this.newTimer( this.timerObject.time );
		};

		this.start = function() {
			if ( !this.timerObject.tween || this.timerObject.time === 0 || this.active ) {
				return false;
			}
			this.timerObject.tween.play();
			this.active = true;
			this.paused = false;
			this.timerStartSnapshot = this.timerObject.time;
			console.log( "Timer start:", this.timerStartSnapshot );
		};

		this.pause = function() {
			if ( this.paused || !this.active ) {
				return false;
			};
			this.paused = true;
			this.timerObject.tween.pause();
			console.log( "Timer pause" );
		};

		this.resume = function() {
			if ( !this.paused || !this.active ) {
				return false;
			}
			this.paused = false;
			this.timerObject.tween.play();
			console.log( "Timer resume" );
		};

		this.stop = function() {
			if ( !this.timerObject.tween ) {
				return false;
			}
			this.timerObject.tween.pause();
			this.active = false;
			console.log( "Timer stop" );
		};

		this.newTime = function( newTime, autoStart ) {
			if ( !newTime ) {
				return false;
			}
			if ( !this.timerObject.tween ) {
				return false;
			}
			this.stop();
			this.timerObject.time = newTime;
			this.newTimer( newTime );

			if ( autoStart ) {
				this.start();
				console.log( "AUTOSTART" );
			}
			console.log( "New Time:", this.timerObject.time );

			return this.timerObject.time;
		};

		this.reset = function() {
			console.log( "Timer reset..." );
			this.stop();
			this.timerObject.timer = 0;
			this.newTimer( 0 );
		};

		this.getTime = function() {
			if ( this.timerObject ) {
				return parseInt( this.timerObject.time );
			}
		};

		this.isActive = function() {
			return this.active;
		};

		init();

		function init() {
			console.log( "Timer init..." );
			that.newTimer();
		}
	}
})();

