(function() {
	DataHandler = function() {
		var that = this;
		this.defaultCharacter = "_";

		this.load = function( rawData ) {
			if ( !rawData ) {
				return false;
			}
			if ( rawData.loaded ) {
				console.error( "Load data missing or already loaded" );
				return false;
			}
			var currentTime = Game.GameHandler.Timer.getTime();
			console.log( "Loading new data..." );
			this.reset();

			this.data = rawData;
			this.loaded = true;
			this.data.loaded = true;
			this.data.status = "active";

			// update data and displays 
			this.processLoadedData();
			this.updateDataDisplay();

			// update timer
			if ( currentTime === 0 ) {
				this.createTimer();
			} else {
				var addTime = Game.GameHandler.DataHandler.data.addTime;
				var newTime = currentTime + addTime;
				var elapsedTime = parseInt( this.data.startTime - newTime );
				this.data.elapsedTime = elapsedTime;

				console.log( "Update Timer:", currentTime, addTime, newTime );
				console.log( "Elapsed Time:", elapsedTime );

				Game.GameHandler.Timer.newTime( newTime, true );
			}
			return this.loaded;
		};

		this.createTimer = function() {
			var startTime = this.data.startTime;
			var addTime = this.data.addTime;

			console.log( startTime, addTime )

			console.log( Game.GameHandler.Timer.getTime(), "CREATE TIME" )

			Game.GameHandler.Timer.setTime( startTime );
			Game.GameHandler.Timer.start();
		};

		this.updateDataDisplay = function() {
			Game.GameHandler.PatternDisplay.updateData( this.data.displayData );
			Game.GameHandler.PatternDisplay.updateDisplay();
			Game.GameHandler.ButtonPad.updateData( this.data.buttonData );
			Game.GameHandler.ButtonPad.updateDisplay();
		};

		this.processLoadedData = function() {
			if ( !this.data || !this.loaded ) {
				return false;
			}

			var displayData = this.data.displayData;

			this.data.displayReference = [];
			this.data.upcoming = [];
			this.data.answer = []

			for ( var i = 0; i < displayData.length; i++ ) {
				var currentObject = displayData[ i ];

				// assemble answer data array
				this.data.answer.push( currentObject.data );

				// set each letter to default character
				currentObject.display = this.defaultCharacter;

				// update display data
				if ( !currentObject.hidden) {
					currentObject.display = currentObject.data;

				} else if ( currentObject.hidden ) {
					if ( currentObject.status === 0 ) {						
						this.data.upcoming.push( i );
					}
				}

				// assemble display refernce data
				this.data.displayReference.push( currentObject.display );
			}
		};

		this.processClickData = function( clickData ) {
			if ( !this.data || !this.loaded || !clickData ) {
				return false;
			}
			if ( this.data.status !== "active" ) {
				console.error( "LOST - NO ACTION - THIS SHOULD NOT BE DISPLAYING" );
				return false;
			}

			var result;
			var displayData = this.data.displayData;
			var currentDisplayDataObject = displayData[ this.data.upcoming[ 0 ]];
			var submittedData = clickData.data;
			var answer = currentDisplayDataObject.data;
			var lastAnswer = false;

			// check if this is the last answer in the data object
			if ( this.data.upcoming.length === 1 ) {
				lastAnswer = true;
			}

			console.log( "Clicked:", submittedData, "Answer", answer );

			// if answer is correct
			if ( submittedData === answer ) {
				// remove the first element in the array
				this.data.upcoming.shift();

				// update current object status to 1 - win
				currentDisplayDataObject.status = 1;
				result = "continue";

				////////////////////////////////////////////////////////////////////////////////////////////////////
				// WIN FLOW
				////////////////////////////////////////////////////////////////////////////////////////////////////
				// if answer is last - enter win flow
				if ( lastAnswer ) {
					this.data.status = "win";
					result = "win";
					console.log( "ENTER WIN FLOW" );
					Game.GameHandler.LevelHandler.winLevel( this.data );
				}

				// update data and display
				this.data.displayReference = [];
				for ( var i = 0; i < displayData.length; i++ ) {
					var currentObject = displayData[ i ];

					// update display to show winning status
					if ( currentObject.status === 1 ) {
						currentObject.display = currentObject.data;
					}

					// assemble display reference data
					this.data.displayReference.push( currentObject.display );
				}
				this.updateDataDisplay();

			// answer is incorrect - enter lose flow 
			} else {
				////////////////////////////////////////////////////////////////////////////////////////////////////
				// LOSE FLOW
				////////////////////////////////////////////////////////////////////////////////////////////////////
				// update current object status to 2 - lose
				currentDisplayDataObject.status = 2;
				this.data.status = "lose";
				result = "lose";

				Game.GameHandler.LevelHandler.gameOver();
				// setTimeout( function() {
				// 	SceneManager.goToScene( Scenes.GameOver );

				// }, 1000 );
			}

			return result;
		};

		this.reset = function () {
			this.loaded = false;
			this.data = null;

			console.log( "DataHandler Reset(): PatternDisplay, ButtonPad, Timer, TopUIBar" );
			Game.GameHandler.PatternDisplay.reset();
			Game.GameHandler.ButtonPad.reset();
			Game.GameHandler.Timer.reset();
			Game.GameHandler.TopUIBar.reset();
		};

	}
})();

