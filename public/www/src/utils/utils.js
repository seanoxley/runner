/* swap indices of two array elements */
Array.prototype.swap = function (x,y) {
	var b = this[x];
	this[x] = this[y];
	this[y] = b;
	return this;
}

/* move current element index to the end of the array */
Array.prototype.moveToEnd = function ( x ) {
	var b = this[x];
	this[x] = this[y];
	this[y] = b;
	return this;
}

function randomFloatFromInterval(min,max) {
	return (Math.random() * (max - min) + min).toFixed(4);
}

/* Return random int from min to max */
function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

/* Randomly returns positive or negative 1 */
function plusOrMinus() {
	return Math.random() < 0.5 ? -1 : 1;
}

// Short-circuiting, and saving a parse operation
function isInt(value) {
	var x;
	if (isNaN(value)) {
		return false;
	}
	x = parseFloat(value);
	return (x | 0) === x;
}

// Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
function reduce(numerator,denominator){
	var gcd = function gcd(a,b){
		return b ? gcd(b, a%b) : a;
	};
	gcd = gcd(numerator,denominator);
	return String(numerator/gcd + ":" + denominator/gcd);
}

// get aspect ratio of pass height and width
function getAspectRatio( height, width ) {
	var aspectRatioValue = 1;
	var aspectRatio = "1:1";
	var height = Game.height;
	var width = Game.width;

	if ( height > width) {
		aspectRatioValue = height / width;
		aspectRatio = reduce( width, height );
	} else {
		aspectRatioValue = width / height;
		aspectRatio = reduce( height, width );
	}
	return [ aspectRatioValue, aspectRatio ];
}

// Darken or lighten passed hex color - 0.1 = 10% brighter, -0.1 = 10% darker
function colorLuminance( hex, lum ) {
	var rgb = "", 
		c, 
		i;

	// Validate hex string
	hex = String( hex ).replace( /[^0-9a-f]/gi, "" );
	if ( hex.length < 6 ) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;

	// Convert to decimal and change luminosity
	for ( i = 0; i < 3; i++ ) {
		c = parseInt( hex.substr( i * 2 , 2 ), 16 );
		c = Math.round( Math.min( Math.max( 0, c + ( c * lum )), 255 )).toString( 16 );
		rgb += ( "00" + c ).substr( c.length );
	}

	return rgb;
}

// returns x position value based on base width
function refX( pixel ) {
	return parseInt((( Game.gameX + ( pixel * Game.scaler )) / Game.scaler ) * Game.scaler );
}

// returns y position value based on base height
function refY( pixel ) {
	return parseInt((( Game.gameY + ( pixel * Game.scaler )) / Game.scaler ) * Game.scaler );
}

// initiates and handles focus/unfocus events
function focusHandler() {
	console.log( "Focus Handler init..." );

	window.focusHandler = {
		// Function to use for the `focus` event.
		onFocus: function () {
			console.log('The window has focus.');
			window.hasFocus = true;
			
			if ( SceneManager.scenesLoaded ) {
				Game.GameHandler.SoundManager.playMusic();
			}

		},
		// Function to use for the `blur` event.
		onBlur: function () {
			console.log('The window has lost focus.');
			window.hasFocus = false;

			if ( SceneManager.scenesLoaded ) {
				Game.GameHandler.SoundManager.pauseMusic();
			}

			// if the user on focuses the app during gameplay, call gameover with no transition
			if ( SceneManager.getCurrent().name === "Gameplay" ) {
				console.log( "Gamplay - Lose Focus" );
				Game.GameHandler.LevelHandler.gameOver( 1 );
			}
		}
	};

	/* Detect if the browser supports `addEventListener`
	Complies with DOM Event specification. */
	if(window.addEventListener) {
		// Handle window's `load` event.
		window.addEventListener('load', function () {
			// Wire up the `focus` and `blur` event handlers.
			window.addEventListener('focus', window.focusHandler.onFocus);
			window.addEventListener('blur', window.focusHandler.onBlur);
		});
	}
	/* Detect if the browser supports `attachEvent`
	Only Internet Explorer browsers support that. */
	else if(window.attachEvent) {
		// Handle window's `load` event.
		window.attachEvent('onload', function () {
			// Wire up the `focus` and `blur` event handlers.
			window.attachEvent('onfocus', window.focusHandler.onFocus);
			window.attachEvent('onblur', window.focusHandler.onBlur);
		});
	}
	/* If neither event handler function exists, then overwrite 
	the built-in event handers. With this technique any previous event
	handlers are lost. */
	else {
		// Wire up the `focus` and `blur` event handlers.
		window.onfocus = window.focusHandler.onFocus;
		window.onblur = window.focusHandler.onBlur;
	}
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}