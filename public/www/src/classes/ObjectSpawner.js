ObjectSpawner.prototype = new PIXI.Container();
ObjectSpawner.prototype.constructor = ObjectSpawner;

function ObjectSpawner() {
	var that = this;
	PIXI.Container.call( this );

	this.init();
}

ObjectSpawner.prototype.init = function() {

}

ObjectSpawner.prototype.createNew = function( params ) {
	console.log( "New ObjectSpawner Object" );


	console.log( "new brick" );

	var graphic = new PIXI.Graphics();
	graphic.name = "brick";
	graphic.beginFill( "0x000000", 1 );
	graphic.drawRect( 0, 0, 100, 100 );

	graphic.x = 500;
	graphic.y = 500;

	this.addChild( graphic );

}