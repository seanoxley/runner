Doodad.prototype = new PIXI.Container();
Doodad.prototype.constructor = Doodad;

function Doodad() {
	var that = this;
	PIXI.Container.call( this );

	this.size = configData.platformer.size;

	this.setId();
}

Doodad.prototype.setId = function() {
	if ( !this.id ) {
		this.id = [];
	}
	this.id[ 0 ] = this.x / this.size;
	this.id[ 1 ] = this.y / this.size;
}

Doodad.prototype.setPosition = function( x, y ) {
	var x = x;
	var y = y;

	if ( x % this.size !== 0 || y % this.size !== 0 ) {
		return false;
	}

	this.position.x = x || this.position.x;
	this.position.y = y || this.position.y;

	return this.position;
}
	
Doodad.prototype.init = function() {
	// this.on( "mouseover", mouseover );
	// this.on( "click", click );
	// this.on( "mousedown", mousedown );
	// this.on( "mouseup", mouseup );
	// this.on( "mousemove", mousemove );

	function mouseover( event ) {
		// event.stopPropagation();

		// console.log( this.id );
	}

	function click( event ) {
		// event.stopPropagation();
		// console.log( "click", this.id );
	}

	function mousedown( event ) {
		// event.stopPropagation();

		this.data = event.data;
		this.setDrag( true );

	}

	function mouseup( event ) {
		// event.stopPropagation();

		// snap to tile
		if ( this.dragging ) {
			this.setDrag( false );

			var x = parseInt( this.parent.hoveredTile[ 0 ] * this.size );
			var y = parseInt( this.parent.hoveredTile[ 1 ] * this.size );

			this.setPosition( x, y );
			this.setId();
			// console.log( this.id );

		}




	}

	function mousemove( event ) {
		// event.stopPropagation();

		if ( this.dragging ) {
			var newPosition = this.data.getLocalPosition( this.parent );
			this.position.x = newPosition.x;
			this.position.y = newPosition.y;
		}
	}


}

Doodad.prototype.setDrag = function( boolean ) {
	this.parent.dragging = boolean;
	this.dragging = boolean;
}
