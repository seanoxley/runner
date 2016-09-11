(function() {
	BootScene = {

		init : function( sceneName ) {
			var that = this;
			this.name = sceneName; 

			// create scene container
			this.container = new PIXI.Container();
			this.container.name = this.name;
			Game.renderObject.addChild( this.container );


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// THIS CONTAINER
			////////////////////////////////////////////////////////////////////////////////////////////////////

			createBackground( this.container, "0x212121" );


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// CONTEXT CONTAINER
			////////////////////////////////////////////////////////////////////////////////////////////////////

			createContentContainer( this.container );
			var contentContainer = this.container.getChildByName( "contentContainer" );
			contentContainer.scale.set( Game.scaler ); // set container scale to match global scale

			createLoadText( contentContainer );


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// FUNCTIONS
			////////////////////////////////////////////////////////////////////////////////////////////////////

			// create gameplay container and all of its children 
			function createContentContainer( parent ) {
				var container = new PIXI.Container();
				container.name = "contentContainer";
				parent.addChild( container );
			}

			// fill background with a solid color
			function createBackground( parent, color ) {
				var graphics = new PIXI.Graphics();

				// set a fill and a line style again and draw a rectangle
				graphics.beginFill( color, 1 );
				graphics.drawRect( 0, 0, Game.width, Game.height );
				parent.addChild( graphics );
			}

			// load text
			function createLoadText( parent ) {
				var fontSize = 64;
				var style = {
					font : fontSize + "px Arial",
					fill : "#FFFFFF",
				};

				var textObject = new PIXI.Text( "loading...", style );
				textObject.name = "loadingText";
				textObject.anchor.set( 0.5 );
				textObject.x = refX( 360 );
				textObject.y = refY( 640 );
				parent.addChild( textObject );
			}

			////////////////////////////////////////////////////////////////////////////////////////////////////
			// DEBUG
			////////////////////////////////////////////////////////////////////////////////////////////////////

			createDebugText( this.container, configData.debug );

			// create debug scene name text
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
				parent.addChild( textObject );

				textObject.visible = debug.sceneNames; // debug on/off bool
			}


			////////////////////////////////////////////////////////////////////////////////////////////////////
			// END
			////////////////////////////////////////////////////////////////////////////////////////////////////
		}
	}
})();