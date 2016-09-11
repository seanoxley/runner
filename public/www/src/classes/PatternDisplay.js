(function() {
	PatternDisplay = function( parent, name ) {
		var that = this;
		this.parent = parent;
		this.name = name;
		this.x = 0;
		this.y = 0;
		this.visible = true;
		this.displayName = "patternString";
		this.tilePositionData = {
			tile0 : { x : 55, 	y : 0, color : "0x26a69a", size : 112, rotation : 0 },
			tile1 : { x : 192, 	y : 0, color : "0x26a69a", size : 112, rotation : 0 },
			tile2 : { x : 329, 	y : 0, color : "0x26a69a", size : 112, rotation : 0 },
			tile3 : { x : 466, 	y : 0, color : "0x26a69a", size : 112, rotation : 0 },
			tile4 : { x : 603, 	y : 0, color : "0x26a69a", size : 112, rotation : 0 }
		};
		this.defaultData = [
			{ status : 0, 	hidden : false, 	data : "1", display : "_1" },
			{ status : 0, 	hidden : false, 	data : "2", display : "_2" },
			{ status : 0, 	hidden : false, 	data : "3", display : "_3" },
			{ status : 0, 	hidden : false, 	data : "4", display : "_4" },
			{ status : 0, 	hidden : false, 	data : "5", display : "_5" }
		],

		this.setPosition = function( positionObject ) {
			if ( positionObject ) {
				if ( isInt( positionObject.x )) {
					this.x = parseInt( positionObject.x );
					this.container.x = this.x;
				}
				if ( isInt( positionObject.y )) {
					this.y = parseInt( positionObject.y );
					this.container.y = this.y;
				}
			}
			return this;
		};

		this.setScale = function( scaleX, scaleY ) {
			var scaleX = scaleX || 1;
			var scaleY = scaleY || 1;

			this.container.scale.x = scaleX;
			this.container.scale.y = scaleY;
			return this;
		};
		
		this.getScale = function() {
			return this.container.scale;
		};

		this.getPosition = function() {
			return { x : this.x, y : this.y };
		};

		this.getPosition = function() {
			return { x : this.x, y : this.y };
		};

		this.setVisible = function( bool ) {
			this.visible = bool;
			this.container.visible = this.visible;
			return this;
		};

		this.getVisible = function() {
			return this.visible;
		};

		this.getParent = function() {
			return this.parent;
		}

		this.updateData = function( dataObject ) {
			if ( !this.data ) {
				this.data = this.defaultData;
				this.updateDisplay();
				return this;
			}
			this.data = dataObject;
			return this;
		};

		this.updateDisplay = function() {
			if ( !this.data ) {
				return false;
			}
			for ( var i = 0; i < this.tiles.length; i++ ) {
				var currentChild = this.tiles[ i ];
				var text = this.data[ i ].display;

				currentChild.reset();
				if ( text !== "_" ) {
					currentChild.setText( text );
				} else {
					currentChild.setBlankTile();
				}
			}
		};

		this.reset = function() {
			console.log( "PatternDisplay reset..." );
			this.data = null;
			this.updateData();
		};

		this.setAlpha = function( alphaValue, type ) {
			for ( var i = 0; i < this.tiles.length; i++ ) {
				var currentChild = this.tiles[ i ];
				currentChild.setAlpha( alphaValue, type );
			}

			return this;
		};

		init();

		function init() {
			console.log( "Init new PatternDisplay" );

			// create the container object
			that.container = new PIXI.Container();
			that.container.name = that.name;
			that.parent.addChild( that.container );

			createTiles();
			// createDisplayText();

			// set default position
			that.setPosition();
			that.baseX = this.x;
			that.baseY = that.y;

			// set pivot
			that.container.pivot.x = that.container.width / 2; 
			that.container.pivot.y = that.container.height / 2; 

			that.reset();
		}

		function createTiles() {
			// create buttons
			var tileDataLength = Object.keys( that.tilePositionData ).length;

			// create array to easily access buttons
			that.tiles = [];
			for ( var i = 0; i < tileDataLength; i++ ) {
				var name = Object.keys( that.tilePositionData )[ i ];
				var currentObject = that.tilePositionData[ name ];

				var tile = new PatternDisplayTile( that.container, name, currentObject.color )
					.setSize( currentObject.size )
					.setPosition( { x : currentObject.x, y : currentObject.y  } )
					.setButtonRotation( currentObject.rotation );

				that.tiles.push( tile );
			}
			window.tiles = that.tiles; // debug
		}

		function createDisplayText() {
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

			var tileDataLength = Object.keys( that.tilePositionData ).length;
			for ( var i = 0; i < tileDataLength; i++ ) {
				var textObject = new PIXI.Text( i, style );
				textObject.name = "displaySpot" + i;
				textObject.x = that.x + 100 * i;
				textObject.y = that.y;
				that.container.addChild( textObject );
			}
		}

	}
})();