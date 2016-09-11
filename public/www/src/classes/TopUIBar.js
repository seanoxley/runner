(function() {	
	TopUIBar = function( parent, name, barColor, baseColor, circleColor ) {
		var that = this;
		this.parent = parent;
		this.name = name;
		this.barColor = barColor;
		this.baseColor = baseColor;
		this.circleColor = circleColor;
		this.width = 100;
		this.height = 100;
		this.size = { width : this.width, height : this.height };
		this.x = 0;
		this.y = 0;
		this.rotationAmount = 0;
		this.shadowOffset = 10;
		this.pressed = false;
		this.alpha = 1;

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

		this.setVisible = function( bool ) {
			this.visible = bool;
			this.baseBar.visible = bool;
			this.colorBar.visible = bool;
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
			this.resetBar();
		};

		this.setAlpha = function( alphaValue ) {
			this.alpha = alphaValue;
			this.baseBar.alpha = this.alpha;
			this.colorBar.alpha = this.alpha;
			return this;
		};

		this.getAlpha = function() {
			return this.alpha;
		};

		this.setText = function( inputText ) {
			if ( !String( inputText )) {
				return false;
			}
			this.textObject.text = inputText;
			return this;
		};

		this.getText = function() {
			return this.textObject.text;
		}

		this.setButtonRotation = function( rotationAmount ) {
			if ( !rotationAmount ) {
				rotationAmount = 0;
			}
			this.rotationAmount = rotationAmount
			this.button.rotation = Math.PI / 180 * this.rotationAmount;
			this.shadow.rotation = Math.PI / 180 * this.rotationAmount;
			return this;
		};

		this.setIndex = function( index ) {
			if ( !isInt( index ) ) {
				return false;
			}
			this.index = index;
			return this;
		};

		this.getIndex = function() {
			return this.index;
		};

		this.resetBar = function() {
			this.setBarPercent( 1 );
		};

		this.setBarPercent = function( percent ) {
			this.barWidth = parseInt( this.baseBarWidth * percent );
			this.colorBar.width = this.barWidth;
			return this;
		};

		this.getBarPercent = function() {
			return ( this.barWidth / this.baseBarWidth );
		};

		// run init when object is created
		init();

		function init() {
			console.log( "Init new TopUIBar:", name );

			// create the container object
			that.container = new PIXI.Container();
			that.container.name =  that.name;
			that.parent.addChild( that.container );

			createBarElement();
			createTimerText();
			createLevelElement();
		}

		function createBarElement() {
			var unscaledWidth = parseInt( Game.width / Game.scaler );
			var unscaledHeight = parseInt((( 96 / Game.baseHeight ) * Game.height ) / Game.scaler );
			that.barHeight = unscaledHeight;
			that.baseBarWidth = unscaledWidth;
			that.barWidth = unscaledWidth;

			// base bar
			var baseBar = new PIXI.Graphics();
			baseBar.name = "baseBar";
			baseBar.beginFill( that.baseColor, 1 );
			baseBar.drawRect( 0, 0, unscaledWidth, unscaledHeight );

			// color bar
			var colorBar = new PIXI.Graphics();
			colorBar.name = "colorBar";
			colorBar.beginFill( that.barColor, 1 );
			colorBar.drawRect( 0, 0, unscaledWidth, unscaledHeight );

			that.baseBar = baseBar;
			that.colorBar = colorBar;

			// add objects to container
			that.container.addChild( that.baseBar );
			that.container.addChild( that.colorBar );
		}

		function createTimerText() {
			var style = {
				font : "68px Arial",
				fill : "#FFFFFF",
			};

			var textObject = new PIXI.Text( "", style );
			textObject.name = "timerText";
			textObject.anchor.set( 0, 0.5 ); // x at default, y at half height
			textObject.x = that.x + ( Game.width * 0.02 );
			textObject.y = that.y + ( that.barHeight / 2 );
			that.textObject = textObject;

			// add text object to container
			that.container.addChild( that.textObject );
		}

		function createLevelElement() {
			var style = {
				font : "68px Arial",
				fill : "#FFFFFF",
			};

			var circleColorCode = that.circleColor.split( "0x" );
			var circleColorRef = circleColorCode[ 1 ];
			that.barColor = barColor;
			that.shadowColor = "0x" + colorLuminance( circleColorRef, -0.3 );

			var circleX = parseInt( ( Game.width / 1.16 ) / Game.scaler );
			var circleY = that.barHeight;

			// main circle
			var circle = new PIXI.Graphics();
			circle.name = "circle";
			circle.beginFill( that.circleColor, 1 );
			circle.drawCircle( circleX, circleY, 60 );
			circle.endFill();

			// circle shadow
			var shadow = new PIXI.Graphics();
			shadow.name = "shadow";
			shadow.beginFill( that.shadowColor, 1 );
			shadow.drawCircle( circleX, that.barHeight + that.shadowOffset, 60 );
			shadow.endFill();

			that.circle = circle;
			that.shadow = shadow;

			// add circle objects to container
			that.container.addChild( that.shadow );
			that.container.addChild( that.circle );

			var textObject = new PIXI.Text( "", style );
			textObject.name = "levelText";
			textObject.anchor.set( 0.5 )
			textObject.x = circleX;
			textObject.y = circleY;
			that.textObject = textObject;

			// add text object to container
			that.container.addChild( that.textObject );
		}

	}
})();