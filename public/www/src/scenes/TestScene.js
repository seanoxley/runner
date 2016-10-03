(function() {
	TestScene = {
		
		init : function( sceneName ) {
			var that = this;
			this.name = sceneName; 

			// create scene container
			this.container = new PIXI.Container();
			this.container.name = this.name;
			Game.renderObject.addChild( this.container );
			this.turnOff(); // turn off scene immediately so it does not start rendering


			Game.Properties.gameSpeed = 5;


			// scene functions 
			// createBackground( this, 0x5C6BC0 );

			// debug
			createDebugText( this );

			var tilingSprite = new PIXI.extras.TilingSprite( Game.GameHandler.Loader.resources.paper_512.texture, Game.width / Game.scaler, Game.height / Game.scaler );
			tilingSprite.scale.set( Game.scaler );
			tilingSprite.alpha = 0.5;
			this.container.addChild( tilingSprite );

			this.bg = tilingSprite;

			createGround( this );

			var bg1Data = {
				name : "front",
				baseColor : "0x3E2723",
				baseHeight : 32,
				peakVariance : 32,
				peakErratic : 5,
				sectionsPerPeak : 2
			};

			var bg2Data = {
				name : "mid",
				baseColor : "0x5D4037",
				baseHeight : 92,
				peakVariance : 64,
				peakErratic : 3,
				sectionsPerPeak : 1
			};			

			var bg3Data = {
				name : "back",
				baseColor : "0x795548",
				baseHeight : 160,
				peakVariance : 128,
				peakErratic : 2,
				sectionsPerPeak : 3
			};

			window.bg3 = new ParallaxTerrain( bg3Data );
			bg3.setSpeedScaler( 0.2 ).start();
			this.container.addChild( bg3 );

			window.bg2 = new ParallaxTerrain( bg2Data );
			bg2.setSpeedScaler( 0.5 ).start();
			this.container.addChild( bg2 );

			window.bg1 = new ParallaxTerrain( bg1Data );
			bg1.setSpeedScaler( 1 ).start();
			this.container.addChild( bg1 );

			var foo = new Player();
			this.container.addChild( foo );

			window.objectSpawner = new ObjectSpawner();
			this.container.addChild( objectSpawner )

			window.player = foo;


			window.test = createTestSquare()

			test.x = Game.width / 2
			test.y = Game.height / 2

			// this.container.addChild( test )
			

			// DEBUG UI
			this.gameTimer = new StopWatch();
			this.gameTimer.start();
			createTimerText( this );
			createGameSpeedText( this );


			function createTestSquare() {

				var img = new PIXI.Sprite( Game.GameHandler.Loader.resources[ "paper_flake_32" ].texture );

				// var graphics = new PIXI.Graphics();
				// graphics.beginFill(0x00FF00);
				// graphics.drawRect( 0, 0, 100, 100);
				// graphics.endFill()

				// var img = new PIXI.Sprite(graphics.generateCanvasTexture());
				img.anchor.set( 0.5 )

				return img
			}


			function createGround( parent ) {
				var ground = new PIXI.Sprite( Game.GameHandler.Loader.resources[ "128_ground" ].texture );
				ground.x = 0;
				ground.y = refY( 592 );
				ground.scale.set( Game.scaler );
				ground.alpha = 0.75;
				ground.width = Game.width;

				parent.container.addChild( ground );
			}






var sprites = new PIXI.particles.ParticleContainer(10000, {
	scale: true,
	position: true,
	rotation: true,
	uvs: true,
	alpha: true
});
this.container.addChild(sprites);

// create an array to store all the sprites
this.maggots = [];

var totalSprites = 1000;

for (var i = 0; i < totalSprites; i++)
{
	// create a new Sprite
	// var dude = new PIXI.Sprite(  Game.GameHandler.Loader.resources.drop1.texture );
	var dude = new PIXI.Sprite( Game.GameHandler.Loader.resources[ "paper_flake_32" ].texture );

	// dude.tint = Math.random() * 0xE8D4CD;

	dude.scaler = randomFloatFromInterval( 0.2, 0.7 );
	dude.direction1 = plusOrMinus();
	dude.direction2 = plusOrMinus();

	// set the anchor point so the texture is centerd on the sprite
	dude.anchor.set(0.5);

	// different maggots, different sizes
	dude.scale.set( randomFloatFromInterval( 0.1, 0.3 ) * Game.scaler );

	// scatter them all
	dude.x = Math.random() * Game.width;
	dude.y = Math.random() * Game.height;

	// dude.alpha = randomFloatFromInterval( 0.6, 1 );

	// create a random direction in radians
	dude.direction = Math.random() * Math.PI * 2;
	dude.direction = -randomFloatFromInterval( 0.2, 0.7 );

	// this number will be used to modify the direction of the sprite over time
	dude.turningSpeed = Math.random() - 0.8;
	// dude.turningSpeed = 0;

	// create a random speed between 0 - 2, and these maggots are slooww
	dude.speed = ( 1 + ( 5 * randomFloatFromInterval( 0.01, 0.8 )) * Game.scaler );

	dude.offset = Math.random() * 100;

	// finally we push the dude into the maggots array so it it can be easily accessed later
	this.maggots.push(dude);

	sprites.addChild(dude);
}


var dudeBoundsPadding = 20;
this.dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding,
									-dudeBoundsPadding,
									Game.width + dudeBoundsPadding * 2,
									Game.height + dudeBoundsPadding * 2);

this.tick = 0;









			function createBackground( parent, color ) {
				var graphics = new PIXI.Graphics();

				// set a fill and a line style again and draw a rectangle
				graphics.beginFill( color, 1 );
				graphics.drawRect( 0, 0, Game.width, Game.height );

				parent.container.addChild( graphics );

				// debug background area
				graphics.beginFill( "0xacacac", 1 );
				graphics.drawRect( Game.gameX, Game.gameY, Game.gameWidth, Game.gameHeight );
				parent.container.addChild( graphics );

			}

			function createDebugText( parent ) {
				var style = {
					// font : 'bold italic 36px Arial',
					fontFamily : "Arial",
					fontSize : "36px",
					fontStyle : "italic",
					fontWeight : "bold",
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
				textObject.x = Game.width * 0.03;
				textObject.y = Game.height * 0.02;
				parent.container.addChild( textObject );
			}

			function createTimerText( parent) {
				var style = {
					// font : 'bold italic 36px Arial',
					fontFamily : "Arial",
					fontSize : "36px",
					fontStyle : "italic",
					fontWeight : "bold",
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

				var textObject = new PIXI.Text( 0, style );
				textObject.name = "timerText";
				textObject.x = Game.width * 0.9;
				textObject.y = Game.height * 0.02;
				parent.container.addChild( textObject );
			}

			function createGameSpeedText( parent) {
				var style = {
					// font : 'bold italic 36px Arial',
					fontFamily : "Arial",
					fontSize : "36px",
					fontStyle : "italic",
					fontWeight : "bold",
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

				var textObject = new PIXI.Text( 0, style );
				textObject.name = "gameSpeedText";
				textObject.x = Game.width * 0.9;
				textObject.y = Game.height * 0.08;
				parent.container.addChild( textObject );
			}

			return this;
		},

		update : function() {
			this.bg.tilePosition.x -= 1;

			this.container.getChildByName( "timerText" ).text = this.gameTimer.time();
			this.container.getChildByName( "gameSpeedText" ).text = Game.Properties.gameSpeed;

			// parallax backgrounds
			bg1.update( Game.Properties.gameSpeed );
			bg2.update( Game.Properties.gameSpeed );
			bg3.update( Game.Properties.gameSpeed );

	// iterate through the sprites and update their position
	for (var i = 0; i < this.maggots.length; i++)
	{
		var dude = this.maggots[i];

		dude.rotation += 0.02 * dude.scaler * dude.direction1;
		// dude.skew.x += 1 * dude.direction1;
		// dude.skew.y += 1 * dude.direction2;
		// dude.scale.x = (0.90 + Math.cos(this.tick * 0.5) * 0.10) * dude.scaler;
		// dude.scale.y = (0.90 + Math.sin(this.tick * 0.5) * 0.10) * dude.scaler;
		dude.alpha = ( 0.75 + Math.cos(this.tick * 0.2 * dude.scaler) * 0.25 ) * dude.scaler;

		// dude.direction += Math.sin( dude.turningSpeed ) * 0.01;
		dude.position.x += Math.sin( this.tick * dude.direction1 * 0.1 ) * dude.direction * dude.speed;
		dude.position.y += Math.cos( dude.direction ) * dude.speed;

		// wrap the maggots
		if (dude.position.x < this.dudeBounds.x)
		{
			dude.position.x += this.dudeBounds.width;
		}
		else if (dude.position.x > this.dudeBounds.x + this.dudeBounds.width)
		{
			dude.position.x -= this.dudeBounds.width;
		}

		if (dude.position.y < this.dudeBounds.y)
		{
			dude.position.y += this.dudeBounds.height;
		}
		else if (dude.position.y > this.dudeBounds.y + this.dudeBounds.height)
		{
			dude.position.y -= this.dudeBounds.height;
		}
	}

	// increment the ticker
	this.tick += 0.1;



		}
	}
})();