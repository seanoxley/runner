// adjust passed screen data object based on current screen size
function resize( sizeObject ) {
	console.group( "Resize..." );

	// set data from config file
	sizeObject.baseWidthToHeight = configData.widthToHeight;
	sizeObject.baseWidth = configData.baseWidth;
	sizeObject.baseHeight = configData.baseHeight;

	// set base screen width and height (true screen width and height)
	sizeObject.pixelRatio = window.devicePixelRatio;

		// sizeObject.pixelRatio = 1;


	sizeObject.canvasWidth = parseInt( window.innerWidth * sizeObject.pixelRatio );
	sizeObject.canvasHeight = parseInt( window.innerHeight * sizeObject.pixelRatio );
	sizeObject.width = parseInt( window.innerWidth );
	sizeObject.height = parseInt( window.innerHeight );
	sizeObject.screenWidthToHeight = sizeObject.width / sizeObject.height;

	// set base game width and height (use to determine best fit playable gameplay area)
	sizeObject.gameWidth = sizeObject.width;
	sizeObject.gameHeight = sizeObject.height;

	// set default game x, y positions
	sizeObject.gameX = 0;
	sizeObject.gameY = 0;
	sizeObject.scaler = 1;

	if ( sizeObject.screenWidthToHeight > sizeObject.baseWidthToHeight ) {
		console.log( "Window too wide" );
		sizeObject.gameWidth = parseInt( sizeObject.height * sizeObject.baseWidthToHeight );
		sizeObject.gameX = parseInt(( sizeObject.width - sizeObject.gameWidth ) / 2 );
		sizeObject.scaler = sizeObject.height / sizeObject.baseHeight;
	} else { 
		console.log( "Window too tall" );
		sizeObject.gameHeight = parseInt( sizeObject.width / sizeObject.baseWidthToHeight );
		sizeObject.gameY = parseInt(( sizeObject.height - sizeObject.gameHeight ) / 2 );
		sizeObject.scaler = sizeObject.width / sizeObject.baseWidth;
	}

	sizeObject.pixelRatio = window.devicePixelRatio;
	sizeObject.aspectRatioValue = getAspectRatio( sizeObject.height, sizeObject.width )[ 0 ];
	sizeObject.aspectRatio = getAspectRatio( sizeObject.height, sizeObject.width )[ 1 ];

	console.log( "Screen Size -", "Width:", sizeObject.width, "Height:", sizeObject.height );
	console.log( "Gameplay Size -", "Width:", sizeObject.gameWidth, "Height:", sizeObject.height, "Scaler:", sizeObject.scaler );
	console.log( "Gameplay Position -", "x: ", sizeObject.gameX, "y:", sizeObject.gameY );

	console.groupEnd( "Resize..." );
}