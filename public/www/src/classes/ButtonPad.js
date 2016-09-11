(function() {
	ButtonPad = function( parent, name ) {
		var that = this;
		this.parent = parent;
		this.name = name;
		this.x = 0;
		this.y = 0;
		this.visible = true;
		this.buttonPositionData = {
			button0 : { index : 0,	x : 0, 		y : 0, 		color : "0xc51162", size : 144, rotation : 45 },
			button1 : { index : 1,	x : 128, 	y : 128, 	color : "0xffab00", size : 144, rotation : 45 },
			button2 : { index : 2,	x : 0, 		y : 256, 	color : "0x0091ea", size : 144, rotation : 45 },
			button3 : { index : 3,	x : -128, 	y : 128, 	color : "0x00c853", size : 144, rotation : 45 }		
		};
		this.defaultData = [
			{ data : "_0",	answer : false  },
			{ data : "_1", 	answer : false },
			{ data : "_2", 	answer : false },
			{ data : "_3", 	answer : false },
		];

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
		};

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
				this.reset();
				return false;
			}
			for ( var i = 0; i < this.buttons.length; i++ ) {
				var currentObject = this.buttons[ i ];
				currentObject.setText( this.data[ i ].data );
			}
		};

		this.reset = function() {
			console.log( "ButtonPad reset..." );
			this.resetButtons();
			this.data = null;
			this.updateData();
		};

		this.setAlpha = function( alphaValue, type ) {
			for ( var i = 0; i < this.buttons.length; i++ ) {
				var currentChild = this.buttons[ i ];
				currentChild.setAlpha( alphaValue, type );
			}

			return this;
		};

		this.resetButtons = function() {
			this.setButtonPosition( "up" );
		};

		this.setButtonPosition = function( position ) {
			if ( !position ) {
				return false;
			}
			if ( position === "up" || position === "down" ) {
				for ( var i = 0; i < this.buttons.length; i++ ) {
					var currentObject = this.buttons[ i ];
					if ( position === "up" ) {
						currentObject.reset()
					} else {
						currentObject.press();
					}
				}
			} else {
				return false;
			}
		};

		this.setButtonRotation = function( rotationAmount, buttonArray ) {
			var rotationAmount = rotationAmount || 0;
			var buttonArray = buttonArray || [ 0, 1, 2, 3 ];
			if ( !rotationAmount ) {
				rotationAmount = 0;
			}

			for ( var i = 0; i < buttonArray.length; i++ ) { 
				var currentObject = this.buttons[ buttonArray[ i ]];
				currentObject.setButtonRotation( rotationAmount );
			}
			return this;
		}

		this.getButtonRotation = function() {
			var buttonArray = [];
			for ( var i = 0; i < this.buttons.length; i++ ) { 
				var currentObject = this.buttons[ i ];
				buttonArray.push( currentObject.rotationAmount );
			}
			return buttonArray;
		};

		this.processClick = function( dataObject ) {
			var result = Game.GameHandler.DataHandler.processClickData( dataObject );
		};

		// run init when object is created
		init();

		function init() {
			console.log( "Init new ButtonPad" );

			// create the container object
			that.container = new PIXI.Container();
			that.container.name = that.name;
			that.parent.addChild( that.container );

			// create the button pad object
			createButtonPad();

			// set default position
			that.setPosition();

			// clear to set default properties
			that.reset();
		}

		function createButtonPad() {
			// mobile listener
			// var tap = function ( event ) {
			// 	if ( !that.data || this.triggered ) {
			// 		return false;
			// 	}
			// 	this.triggered = true;
			// 	var dataObject = {};
			// 	dataObject.type = event.type;
			// 	dataObject.button = this.name;
			// 	dataObject.data = that.data[ this.index ].data;

			// 	that.processClick( dataObject );
			// };

			// desktop listener
			var click = function ( event ) {
				if ( !that.data || this.triggered ) {
					return false;
				}
				this.triggered = true;
				var dataObject = {};
				dataObject.type = event.type;
				dataObject.button = this.name;
				dataObject.data = that.data[ this.index ].data;

				that.processClick( dataObject );
			};

			// create buttons
			var buttonDataLength = Object.keys( that.buttonPositionData ).length;

			// create array to easily access buttons
			that.buttons = [];
			for ( var i = 0; i < buttonDataLength; i++ ) {
				var name = Object.keys( that.buttonPositionData )[ i ];
				var currentObject = that.buttonPositionData[ name ];

				var button = new ButtonPadButton( that.container, name, currentObject.color )
					.setSize( currentObject.size )
					.setPosition( { x : currentObject.x, y : currentObject.y  } )
					.setButtonRotation( currentObject.rotation ) // set button rotation and shadow to 45 degrees
					.setIndex( i );

				that.buttons.push( button );
			}
			window.buttons = that.buttons; // debug
		}

	}
})();