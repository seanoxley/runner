(function() {
	LevelCreator = function() {
		var that = this;
		var levelTemplate = function() {
			return {
				displayData : [
					{ status : 0, 	hidden : false, 	data : "1" },
					{ status : 0, 	hidden : false,	 	data : "2" },
					{ status : 0, 	hidden : false, 	data : "3" },
					{ status : 0, 	hidden : false,	 	data : "4" },
					{ status : 0, 	hidden : false, 	data : "5" }
				],
				buttonData : [
					{ data : "1",	answer : false },
					{ data : "2", 	answer : false },
					{ data : "3", 	answer : false },
					{ data : "4", 	answer : false },
				]
			}
		}; 
		// not enough info for mixed *********************************************************************
		this.tierThreshold = { // threshold for tiers based on level
			tier1 : {
				levelMax : 4,
				type : [
					{
						type : "numbers",
						minRange : 0,
						maxRange : 9,
						reverse : false,
						gapMax : 1,
						negative : false,
						mixed : false
					}
				]
			},
			tier2 : {
				levelMax : 8,
				type : [
					{
						type : "numbers",
						minRange : 0,
						maxRange : 29,
						reverse : false,
						gapMax : 2,
						negative : false,
						mixed : false
					},
					{
						type : "letters",
						minRange : 0,
						maxRange : 29,
						reverse : false,
						gapMax : 1,
						negative : false,
						mixed : false
					}
				]
			},
			tier3 : {
				levelMax : 15,
				type : [
					{
						type : "numbers",
						minRange : 0,
						maxRange : 49,
						reverse : true,
						gapMax : 3,
						negative : true,
						mixed : false
					},
					{
						type : "letters",
						minRange : 0,
						maxRange : 49,
						reverse : true,
						gapMax : 2,
						negative : false,
						mixed : false
					}
				]			
			}
		};

		this.newLevel = function(  level, startTime, timeGrowth  ) {
			this.data = {};

			// basic level constuction
			this.tempLevel = new levelTemplate();
			this.level = level || 0;
			this.startTime = startTime || 0;
			this.addTime = timeGrowth || 0;
			this.levelRange = this.getLevelRange( this.level );
			this.difficultyTier = this.getDifficultyTier( this.levelRange );
			this.tempData = this.getListData();
			this.getLevelData( this.tempData );

			// console.log( "TEMP DATA", this.tempData );					

			// construct data object
			this.data.id = new Date().getTime();
			this.data.level = this.level;
			this.data.startTime = this.startTime; 
			this.data.addTime = this.addTime;
			this.data.levelRange = this.levelRange;
			this.data.difficultyTier = this.difficultyTier;

			return this.data;
		};

		this.getListData = function() {
			var tier = this.difficultyTier;
			var tierDataList = this.getTierData( tier );
			var numberOfTypes = tierDataList.type.length;
			var selectedTierData = tierDataList.type[ 0 ];

			// randomize a data tier from the list
			if ( numberOfTypes > 1 ) {
				var rand = randomIntFromInterval( 0, numberOfTypes - 1 );
				selectedTierData = tierDataList.type[ rand ];
			}

			// console.log( "SELECTED TIER DATA", selectedTierData );
			return this.createDataList( selectedTierData );
		};

		this.createDataList = function( tierData ) {
			var data = {};
			var type = tierData.type;
			var randSeed = randomIntFromInterval( tierData.minRange, tierData.maxRange );
			var gap = randomIntFromInterval( 1, tierData.gapMax );
			var seed = randSeed;
			data.seed = seed;
			this.data.seed = seed;
			var isReverse = false;
			var isNegative = 1;
			var isMixed = false;
			var mixedBool;

			// determine if reversed
			if ( tierData.reverse ) {
				if ( plusOrMinus() === 1 ) {
					isReverse = true;
				}
			}

			// determine if negative
			if ( tierData.negative ) {
				if ( plusOrMinus() === 1 ) {
					isNegative = -1;
				}
			}

			// determine if mixed
			if ( tierData.mixed ) {
				if ( plusOrMinus() === 1 ) {
					isMixed = true;
					mixedBool = plusOrMinus();
				}
			}

			// build data array and set if positive/negative
			var tempArray = [];
			var fakeData = [];
			for ( var i = 0; i < 9; i++ ) { // loop through 9 times to build a 5 index array with 2 fake datas
				var value = ( seed + ( gap * i )) * isNegative; // determine value
				value = parseInt( value );

				// mixed data processing
				if ( isMixed && type === "numbers" ) {
					if ( mixedBool === 1 ) {
						value = Math.abs( value );
						value = this.replaceLetter( value );
					}
					mixedBool *= -1;
				}

				// letter data processing
				if ( type === "letters" ) {
					value = this.replaceLetter( value );
				}

				if ( i !== 0 && i !== 1 && i !== 7 && i !== 8 ) { // only add the middle 5 loops to array
					tempArray.push( value );
				} else {
					fakeData.push( value ); // make that fake
				}
			}
			data.fakeData = fakeData;
			
			// reverse if true
			tempArray = this.processReverse( tempArray, isReverse );
			data.array = tempArray;

			data.patternPositions = this.getPatternPositions();
			data.buttonPositions = this.getButtonPositions();

			// process the data
			this.assembleData( data );
			this.setFakeButtons( data, type );

			return data;
		};

		this.replaceLetter = function( value ) {
			var letterLookup = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ];
			value = value % letterLookup.length;

			return letterLookup[ value ];
		};

		this.setFakeButtons = function( data, type ) {
			for ( var i = 0; i < data.buttonData.length; i++ ) {
				if ( data.buttonData[ i ] === "" ) {
					var arrayLength = data.fakeData.length;
					var rand = randomIntFromInterval( 0, arrayLength - 1 );
					data.buttonData[ i ] = data.fakeData[ rand ];
					data.fakeData.splice( rand, 1 ); // remove rand from array
				}
			}
			delete data.fakeData;
		};

		this.assembleData = function( data ) {

			// determine answer data
			var tempArray = [];
			for ( var i = 0; i < data.patternPositions.length; i++ ) {
				var selectionIndex = data.patternPositions[ i ];
				var selectedData = data.array[ selectionIndex ];
				tempArray.push( selectedData );
			}
			data.answers = tempArray;

			// determine button data
			tempArray = [ "", "", "", "" ];
			for ( var i = 0; i < data.buttonPositions.length; i++ ) {
				tempArray[ data.buttonPositions[ i ] ] = data.answers[ i ];
			}
			data.buttonData = tempArray;

			return data;
		};

		this.processReverse = function( array, bool ) {
			if ( bool ) {
				array = array.reverse();
			}
			return array;
		};

		this.getLetterList = function( tier ) {
			var gap = gap ? gap : 1;
			var reverse = reverse ? reverse : false;
			var list = [];

			return list;
		};

		this.getLevelData = function() {
			var displayData = this.tempLevel.displayData;
			var buttonData = this.tempLevel.buttonData;
			var fillDisplayData = this.tempData.array;
			var fillButtonData = this.tempData.buttonData;
			var patternPositions = this.tempData.patternPositions;
			var buttonPositions = this.tempData.buttonPositions;

			// update displayData
			for ( var i = 0; i < fillDisplayData.length; i++ ) {

				// set display fill data
				displayData[ i ].data = fillDisplayData[ i ];

				for ( var j = 0; j < patternPositions.length; j++ ) {
					var currentPosition = patternPositions[ j ];

					// hide data in pattern position array
					if ( currentPosition === i ) {
						displayData[ i ].hidden = true;
					}
				}
			}

			// update buttonData
			for ( var i = 0; i < fillButtonData.length; i++ ) {
				
				// set button fill data
				buttonData[ i ].data = fillButtonData[ i ];

				for ( var j = 0; j < buttonPositions.length; j++ ) {
					var currentPosition = buttonPositions[ j ];

					// set answer data in button position array
					if ( currentPosition === i ) {
						buttonData[ i ].answer = true;
					}
				}
			}

			this.data.displayData = displayData;
			this.data.buttonData = buttonData;
		};

		this.getButtonPositions = function() {
			return this.getRandomPositions( 4, 2 );
		};

		this.getPatternPositions = function() {
			return this.getRandomPositions( 5, 2 ).sort();
		};

		this.getLevelRange = function( level ) {
			var minLevelRange = 3; // minimum level range
			var maxLevelRange = 1; // max level range
			var tempMinLevel = level - minLevelRange;
			var minLevel = ( tempMinLevel > 0 ) ? tempMinLevel : 0; // set min range to 0 if < 0
			var maxLevel = level + maxLevelRange;

			return { minLevel : minLevel, maxLevel : maxLevel };
		}

		this.getRandomPositions = function( totalPositions, numberOfPositions ) {
			if ( !totalPositions || !numberOfPositions ) {
				return false;
			}	
			if ( totalPositions < numberOfPositions ) {
				return false;
			}

			var tempArray = [];

			// create array of unique random index positions
			for ( var i = 0; i < numberOfPositions; i++ ) {
				var unique = false;

				while ( tempArray.length < numberOfPositions ) {
					var rand = randomIntFromInterval( 0, totalPositions - 1 );
					tempArray.push( rand );	

					for ( j = 0; j < tempArray.length - 1; j++ ) {
						if ( rand === tempArray[ j ] ) {
							tempArray.pop();
							break;
						}
					}
				}
			}

			return tempArray;
		};

		this.getTierData = function( tier ) {
			return this.tierThreshold[ tier ];
		};

		this.getDifficultyTier = function( levelRange ) {
			var randLevel = randomIntFromInterval( levelRange.minLevel, levelRange.maxLevel ); // random number between min range and max range
			var numberOfTiers = Object.keys( this.tierThreshold ).length;
			var currentTier;

			// determine difficult tier
			for ( var i in this.tierThreshold ) {
				if ( randLevel < this.tierThreshold[ i ].levelMax ) {
					currentTier = i;
					break;
				} else {
					currentTier = i; // max tier
				}
			}

			return currentTier;
		};

		var init = function() {
			console.log( "Init" );

			console.log( this.newLevel( 20,4000,2000 ) )

		};

		// init();

	}
})();
