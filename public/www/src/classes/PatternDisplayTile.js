(function() {	
	PatternDisplayTile = function( parent, name, color ) {
		var that = this;
		this.parent = parent;
		this.name = name;
		this.color = color;
		this.width = 100;
		this.height = 100;
		this.size = { width : this.width, height : this.height };
		this.x = 0;
		this.y = 0;
		this.rotationAmount = 0;
		this.shadowOffset = 10;
		this.alpha = 1;

		this.setWidth = function( width ) {
			this.size.width = this.width;
			this.width = width;
			this.button.width = this.width
			this.shadow.width = this.width;
			return this;
		};

		this.getWidth = function() {
			return this.width;
		}

		this.setHeight = function( height ) {
			this.size.height = this.height;
			this.height = height;
			this.button.height = this.height
			this.shadow.height = this.height;
			return this;
		};

		this.getHeight = function() {
			return this.height;
		};

		this.setSize = function( size ) {
			this.setWidth( size );
			this.setHeight( size );
			return this;
		};

		this.getSize = function() {
			return { width : this.width, height : this.height };
		};

		this.setPosition = function( positionObject ) {
			if ( positionObject ) {
				if ( isInt( positionObject.x )) {
					this.x = parseInt( positionObject.x );
					this.button.x = this.x;
					this.shadow.x = this.x;
					this.textObject.x = this.x;
				}
				if ( isInt( positionObject.y )) {
					this.y = parseInt( positionObject.y );
					this.button.y = this.y;
					this.shadow.y = this.y + this.shadowOffset;
					this.textObject.y = this.y;
				}
			}
			return this;
		};

		this.getPosition = function() {
			return { x : this.x, y : this.y };
		};

		this.setVisible = function( bool ) {
			this.visible = bool;
			this.button.visible = bool;
			this.shadow.visible = bool;
			return this;
		};

		this.getVisible = function() {
			return this.visible;
		};

		this.press = function() {
			if ( this.pressed ) {
				return false;
			}
			this.pressed = true;
			this.shadow.visible = false;
			this.button.y += this.shadowOffset;
			this.textObject.y += this.shadowOffset;
		};

		this.unpress = function() {
			if ( !this.pressed ) {
				return false;
			}
			this.pressed = false;
			this.shadow.visible = true;
			this.button.y = this.y;
			this.textObject.y = this.y;
		};

		this.getPressed = function() {
			return this.pressed;
		};

		this.reset = function() {
			this.setPosition( { x : this.x, y : this.y } );
			this.unpress();
			this.setVisible( true );
			this.setAlpha( 1, "all" );
		};

		this.setAlpha = function( alphaValue, type ) {
			this.alpha = alphaValue;
			this.button.alpha = this.alpha;
			this.shadow.alpha = this.alpha;
			if ( type === "all" ) {
				this.textObject.alpha = this.alpha;
			}
			
			return this;
		};

		this.getAlpha = function() {
			return this.alpha;
		};

		this.setText = function( inputText ) {
			if ( !String( inputText )) {
				return false;
			}
			if ( inputText === "clear" ) {
				this.textObject.text = "";	
			} else {
				this.textObject.text = inputText;
			}

			return this;
		};

		this.getText = function() {
			return this.textObject.text;
		}

		this.clearText = function() {
			this.setText( "clear" );
		}

		this.setBlankTile = function() {
			this.setText( "?" );
			this.press();
			this.setAlpha( 0.5 );
		};

		this.setButtonRotation = function( rotationAmount ) {
			if ( !rotationAmount ) {
				rotationAmount = 0;
			}
			this.rotationAmount = rotationAmount
			this.button.rotation = Math.PI / 180 * this.rotationAmount;
			this.shadow.rotation = Math.PI / 180 * this.rotationAmount;
			return this;
		};

		// run init when object is created
		init();

		function init() {
			console.log( "Init new ButtonPad button:", name );

			// create the container object
			that.container = new PIXI.Container();
			that.container.name =  name;
			that.parent.addChild( that.container );

			createButton();
			createText();
		}

		function createButton() {
			var colorCode = color.split( "0x" );
			var colorRef = colorCode[ 1 ];
			that.color = color;
			that.shadowColor = "0x" + colorLuminance( colorRef, -0.3 );

			// main button
			var button = new PIXI.Graphics();
			button.name = "button";
			button.beginFill( that.color, 1 );
			button.drawRoundedRect( that.x, that.y, that.width, that.height, 15 );
			button.endFill();

			button.pivot.x = button.width / 2; // center x
			button.pivot.y = button.height / 2; // center y

			// button shadow
			var shadow = new PIXI.Graphics();
			shadow.name = "shadow";
			shadow.beginFill( that.shadowColor, 1 );
			shadow.drawRoundedRect( that.x, that.y, that.width, that.height, 15 );
			shadow.endFill();

			shadow.pivot.x = shadow.width / 2; // center x
			shadow.pivot.y = shadow.height / 2; // center y

			that.button = button;
			that.shadow = shadow;

			// add button objects to container
			that.container.addChild( that.shadow );
			that.container.addChild( that.button );
		};

		function createText() {
			var style = {
				font : "68px Arial",
				fill : "#FFFFFF",
			};

			var textObject = new PIXI.Text( "X", style );
			textObject.name = "buttonText";
			textObject.anchor.set( 0.5 );
			textObject.x = that.x;
			textObject.y = that.y;
			that.textObject = textObject;

			// add text object to container
			that.container.addChild( that.textObject );
		};

	}
})();