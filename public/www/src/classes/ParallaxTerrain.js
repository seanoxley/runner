ParallaxTerrain.prototype = new PIXI.Container();
ParallaxTerrain.prototype.constructor = ParallaxTerrain;

function ParallaxTerrain( params ) {
	var that = this;
	PIXI.Container.call( this );

	// param object properties with defaults
	this.name = params.name || "terrain";
	this.color = params.color || "0x000000";
	this.baseHeight = params.baseHeight || 0;
	this.sectionsPerPeak = params.sectionsPerPeak || 2;
	this.peakVariance = params.peakVariance || 32;
	this.peakErratic = params.peakErratic || 1;

	this.minPeak = 1;
	this.maxPeak = this.peakVariance * this.peakErratic;
	this.bottomAnchor = refY( 592 );
	this.groundAssetSize = 128;
	this.sectionSize = parseInt( this.groundAssetSize * this.sectionsPerPeak * Game.scaler );
	this.sectionsNeeded = Math.ceil( Game.width / this.sectionSize ) + 2;
	this.sectionsCreated = 0;
	this.x = -this.sectionSize;
	this.y = 0;

	this.init();
}

ParallaxTerrain.prototype.init = function() {
	// this.create();

	this.createArray();

	return this;
}

ParallaxTerrain.prototype.moveX = function( xDelta ) {
	this.x += xDelta;
	this.offSet += xDelta;
}

ParallaxTerrain.prototype.getX = function() {
	return this.x;
}

ParallaxTerrain.prototype.createArray = function() {
	if ( !this.terrainArray ) {
		this.terrainArray = new PIXI.Container();
		this.addChild( this.terrainArray );
 	}

	for ( var i = 0; i < this.sectionsNeeded; i++ ) {
		this.addPiece();
	}

}

ParallaxTerrain.prototype.getLastAnchor = function() {
	if ( this.terrainArray.children.length > 0 ) {
		var lastChild = this.terrainArray.getChildAt( this.terrainArray.children.length - 1 );
		return lastChild.rightAnchor;
	}
	return 0;
}

ParallaxTerrain.prototype.getFirstAnchor = function() {
	if ( this.terrainArray.children.length > 0 ) {
		var firstChild = this.terrainArray.getChildAt( 0 );
		return firstChild.rightAnchor;
	}
	return 0;
}


ParallaxTerrain.prototype.addPiece = function() {
	this.terrainArray.addChild( this.createPiece() );
}

ParallaxTerrain.prototype.resetOffset = function() {
	this.offSet = 0;
}

ParallaxTerrain.prototype.getOffset = function() {
	return Math.abs( this.offSet );
}

ParallaxTerrain.prototype.getChildren = function() {
	return this.terrainArray.children;
}

ParallaxTerrain.prototype.createPiece = function() {
	var height = this.baseHeight;
	height = this.bottomAnchor - refY( height );

	this.topLeft = ( !this.topLeft ) ? parseInt( randomFloatFromInterval( this.minPeak, this.maxPeak )) : this.topLeft;
	var topRight = randomIntFromInterval( this.minPeak, this.maxPeak );
	while ( Math.abs( this.topLeft - topRight ) <= this.peakVariance ) {
		topRight = parseInt( randomFloatFromInterval( this.minPeak, this.maxPeak ));
	}

	var graphics = new PIXI.Graphics();
	graphics.beginFill( this.color );
	// graphics.lineStyle( 0, 0xffd900, 1 );

	graphics.bottomAnchor = this.bottomAnchor;
	graphics.leftAnchor = this.getLastAnchor();
	graphics.rightAnchor = graphics.leftAnchor + this.sectionSize;
	graphics.topLeft;
	graphics.topRight;

	// draw a shape
	graphics.moveTo( graphics.leftAnchor, graphics.bottomAnchor ); // bottom left start
	graphics.lineTo( graphics.leftAnchor, graphics.bottomAnchor ); // bottom left
	graphics.lineTo( graphics.leftAnchor, height - refY( this.topLeft )); // top left
	graphics.lineTo( graphics.rightAnchor, height - refY( topRight )); // top right
	graphics.lineTo( graphics.rightAnchor, graphics.bottomAnchor ); // bottom right
	graphics.endFill();

	this.topLeft = topRight;

	this.sectionsCreated += 1;
	this.resetOffset();

	return graphics;
}

ParallaxTerrain.prototype.deletePiece = function() {
	if ( this.terrainArray.children.length > 0 ) {
		this.terrainArray.removeChildAt( 0 );
		return true;
	}
	return false;
}

ParallaxTerrain.prototype.update = function() {
	if ( this.getOffset() >= this.sectionSize ) {
		this.deletePiece();
		this.addPiece();

		this.x = -this.getFirstAnchor(); // ensure the container is aligned with pieces
	}


}

