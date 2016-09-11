Player.prototype = new PIXI.Container();
Player.prototype.constructor = Player;

function Player() {
	var that = this;
	PIXI.Container.call( this );

	this.defaultPosition = { x : 200, y : 555 };
	this.statusList = [ "normal", "invert" ];
	this.movementList = [ "idle", "running", "jumping", "double", "falling" ];

	this.init();
}

Player.prototype.changeMovement = function( newMovement ) {
	if ( this.movementList.indexOf( newMovement ) !== -1 ) {
		var movementID = this.movementList.indexOf( newMovement );
		var currentMovement = this.getMovement();

		if ( newMovement !== currentMovement ) {
			// console.log( movementID );
			return this.movement = movementID;
		}
	}

	if ( newMovement >= 0 && newMovement < this.movementList.length && newMovement !== this.movement ) {
		return this.movement = newMovement;
	}
	return false;
}

Player.prototype.getMovement = function( bool ) {
	if ( bool ) {
		return this.movement;
	}
	return this.movementList[ this.movement ];
}

Player.prototype.toggleStatus = function() {
	return this.status = 1 - this.status;
}

Player.prototype.getStatus = function( bool ) {
	if ( bool ) {
		return this.status;
	}
	return this.statusList[ this.status ];
}

Player.prototype.disableControl = function() {

}

Player.prototype.enableControl = function() {

}

Player.prototype.create = function() {
	var graphic = new PIXI.Graphics();
	graphic.name = "player";
	graphic.beginFill( "0xFFFFFF", 1 );
	graphic.drawRect( 0, 0, 100 * Game.scaler, 100 * Game.scaler );

	// this.playerAsset = graphic;
	// this.hide();

	// this.addChild( this.playerAsset );

/////////////////////////////////////////////////////////////////////////////////

	// create an array of textures from an image path
	var frames = [];

	for (var i = 0; i < 4; i++) {
	    var val = i < 10 ? '0' + i : i;

	    // magically works since the spritesheet was loaded with the pixi loader
	    frames.push( PIXI.Texture.fromFrame( 'frame_00' + val + ".png" ));
	}


	// create a MovieClip (brings back memories from the days of Flash, right ?)
	movie = new PIXI.extras.MovieClip( frames );

	/*
	 * A MovieClip inherits all the properties of a PIXI sprite
	 * so you can change its position, its anchor, mask it, etc
	 */

	var playerScale = 5 * Game.scaler;

	movie.position.set( 300 );

	movie.anchor.set(0.5);
	movie.scale.set( playerScale )  
	movie.animationSpeed = 0.13;

	movie.play();

	// this.addChild(movie);
	// this.megaman = movie;


	window.man = movie

	this.playerAsset = movie;
	this.hide();

	this.addChild( this.playerAsset );


}

Player.prototype.draw = function() {
	this.visible = true;
	this.playerAsset.visible = true;
}

Player.prototype.hide = function() {
	this.visible = false;
	this.playerAsset.visible = false;
}

Player.prototype.revive = function() {
	this.alive = true;
}

Player.prototype.kill = function() {
	this.alive = false;
}

Player.prototype.getAlive = function() {
	return this.alive;
}

Player.prototype.setPosition = function( newPosition ) {
	var x = newPosition.x || null;
	var y = newPosition.y || null;

	this.playerAsset.x = x;
	this.playerAsset.y = y;
}

Player.prototype.resetPosition = function() {
	this.playerAsset.x = refX( this.defaultPosition.x );
	this.playerAsset.y = refY( this.defaultPosition.y );
}

Player.prototype.reset = function() {
	this.status = 0;
	this.movement = 0;
	this.resetPosition();
	this.draw();
	this.revive();
}

Player.prototype.init = function() {
	var that = this;
	console.log( "New Player" );
	this.create();
	this.reset();
	this.addListeners();
}

// Player.prototype.jump = function() {
// 	console.log( "JUMP" );

// 	this.playerAsset.y -= this.jumpHeight;
// }

Player.prototype.jump = function( power ) {
	var that = this;



	var minJump = 100;
	var maxJump = 400;

	var minDuration = 0.25;
	var maxDuration = 0.4;

	var duration = ( power * ( maxDuration - minDuration )) + minDuration;
	var jumpHeight = ( power * ( maxJump - minJump )) + minJump;

	console.log( "JUMP POWER:", power, "DURATION:", duration, "HEIGHT:", jumpHeight );

	var obj = { y : 0 }

	var tween = TweenMax.to( 
		obj, //target
		duration, // duration in seconds
			{ 	y : jumpHeight,
				yoyo : true,
				repeat : 1,
				ease: Power1.easeOut, 
				// 			ease: Power2.easeOut, 
				// ease : Sine.easeOut,
				onUpdate : function() {
					var newY = refY( that.defaultPosition.y - obj.y );
					that.playerAsset.y = newY;
				},
				onComplete : function() {
					// console.log( "END TWEEN" );
					that.resetPosition();
					that.changeMovement( "idle" );
					that.charging = false;
					// that.buttonHit = false;

				}
			}
		)

}

Player.prototype.addListeners = function() {
	var that = this;
	document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
	document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

	function onkey( ev, key, down ) {

		switch( key ) {
			case 32: handleJump( down, that ); //space
			return false;
		}

		function handleJump( down, that ) {
			that.currentJumpTime = Date.now();
			var timeDiff = that.currentJumpTime - that.startJumpTime;



			// if ( !that.buttonHit ) {
			// 	console.log( "held" );

			// 			that.buttonHit = true;



			// }



			if ( down && !that.charging && that.getMovement() === "idle" ) {
				console.log( "START CHARGE" );

				that.chargeTime = Date.now();

				that.charging = true;



			}

			if ( !down && that.getMovement() === "idle" && that.charging ) {

				var chargeTime =  Date.now() - that.chargeTime;

				if ( chargeTime < 50 ) {
					chargeTime = 50; // minimum
				} else if ( chargeTime >= 500 ) {
					chargeTime = 500; // maximum
				}
				chargeTime = chargeTime / 500;

				that.changeMovement( "jumping" );
				that.jump( chargeTime );

			}


		}
	}
}



