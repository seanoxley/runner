Triangle.prototype = new Doodad();
Triangle.prototype.constructor = Triangle;

function Triangle( idX, idY ) {
	var that = this;
	Doodad.call( this );

	// console.log( this.parent )
	this.type = "triangle";

	this.init();
	this.create();
}

Triangle.prototype.create = function() {
	console.log( "new triangle" );

	var graphic = new PIXI.Graphics();
	graphic.name = "triangle";
	graphic.beginFill( configData.platformer.brickColor, 1 );
	graphic.drawRect( 0, 0, this.size, this.size );

	var x = this.id[ 0 ] * this.size;
	var y = this.id[ 1 ] * this.size;
	this.setPosition( x, y );

	this.addChild( graphic );
}
