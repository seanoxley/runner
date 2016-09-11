(function() {
	OptionsScene = {
		
		init : function( sceneName ) {
			var that = this;
			this.name = sceneName; 

			// create scene container
			this.container = new PIXI.Container();
			this.container.name = this.name;
			Game.renderObject.addChild( this.container );
			this.turnOff(); // turn off scene immediately so it does not start rendering

			// scene functions 
			createBackground( this, "0x212121" );

			// debug
			createDebugText( this, configData.debug );

			function createBackground( parent, color ) {
				var graphics = new PIXI.Graphics();

				// set a fill and a line style again and draw a rectangle
				graphics.beginFill( color, 1 );
				graphics.drawRect( 0, 0, Game.width, Game.height );
				parent.container.addChild( graphics );
			}

			function createDebugText( parent, debug ) {
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

				var textObject = new PIXI.Text( that.name, style );
				textObject.name = "debugNameText";
				textObject.x = Game.width * 0.7;
				textObject.y = Game.height * 0.94;
				parent.container.addChild( textObject );

				textObject.visible = debug.sceneNames; // debug on/off bool
			}

			function createBunnies() {
				var i;
				var numberOfBunnies = 50;

				for ( i = 0; i < numberOfBunnies; i++ ) {
					// create a texture from an image path
					var texture = PIXI.Texture.fromImage( Game.GameHandler.Loader.resources[ "bunny" ].url );
					
					// create a new Sprite using the texture
					var bunny = new PIXI.Sprite( texture );

					// center the sprites anchor point
					bunny.anchor.x = 0.5;
					bunny.anchor.y = 0.5;

					// move the sprite to the center of the screen
					bunny.position.x = Game.width * randomIntFromInterval( 1, 99 ) / 100;
					bunny.position.y = Game.height * randomIntFromInterval( 1, 99 ) / 100;
					bunny.rotationAmount = plusOrMinus() * ( randomIntFromInterval( 1, 5 ) / 10 );

					that.container.addChild( bunny );
				}
			}

			return this;
		},
		update : function() {

			for ( var i = 0; i < this.container.children.length; i++ ) {
				this.container.getChildAt( i ).rotation += this.container.getChildAt( i ).rotationAmount;
			}

		}
	}
})();