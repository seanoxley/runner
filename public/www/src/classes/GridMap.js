GridMap.prototype = new PIXI.Container();
GridMap.prototype.constructor = GridMap;

function GridMap( columns, rows, size ) {
	var that = this;
	PIXI.Container.call( this );

	this.columns = columns || configData.platformer.columns;
	this.rows = rows || configData.platformer.rows;
	this.size = size || configData.platformer.size;
	this.startLocation = { 
		x : 0,
		y : 0
	};

	// this.dragging = false;
	// this.interactive = true;
	// this.buttonMode = true;



	this.clearLevel();
	this.generateGrid();

	this.selectedTileGraphic = new PIXI.Graphics();
	this.selectedTileGraphic.name = "selectedTileGraphic";
	this.hoveredTileGraphic = new PIXI.Graphics();
	this.hoveredTileGraphic.name = "hoveredTileGraphic";

	this.addChild( this.selectedTileGraphic );
	this.addChild( this.hoveredTileGraphic );

}

GridMap.prototype.gridTile = function( x, y, size ) {
	var that = this;

	var xPos = x * this.size;
	var yPos = y * this.size;

	var gridPiece = new PIXI.Graphics();
	gridPiece.tile = [ 0, 0 ];
	gridPiece.tile[ 0 ] = x;
	gridPiece.tile[ 1 ] = y;
	gridPiece.name = "gridPiece:x" + x + ":y" + y;

	// create grid
	if ( x % 2 === 0 && y % 2 === 0 ||  x % 2 === 1 && y % 2 === 1 ) {
		gridPiece.beginFill( configData.platformer.grid1Color, 1 );
	} else {
		gridPiece.beginFill( configData.platformer.grid2Color, 1 );
	}
	gridPiece.drawRect( 0, 0, size, size );
	gridPiece.position.x = xPos;
	gridPiece.position.y = yPos;

	gridPiece.interactive = true;
	// gridPiece.buttonMode = true;

	// this.addChild( gridPiece );


	gridPiece.on( "click", click );
	gridPiece.on( "mouseout", mouseout );
	gridPiece.on( "mouseover", mouseover);

	// gridPiece.on( "mouseup", mouseup );

	function click() {
		that.selectTile( this.tile[0], this.tile[1] );
	}

	function mouseover() {
		// that.hoverTile( this.tile[0], this.tile[1] );
		var tilePosition = { x : this.tile[ 0 ], y : this.tile[ 1 ] };
		that.currentHoveredTile = tilePosition;
		that.hoverOverTile( that.currentHoveredTile );
		// console.log( that.hoveredTile );
	}

	function mouseout() {
		that.resetTile( that.currentHoveredTile );
		that.currentHoveredTile = null;
	}

	return gridPiece;
}

GridMap.prototype.getTileAtPosition = function( position ) {
	if ( !position ) {
		return false;
	}

	for ( var i = 0; i < this.gridContainer.children.length; i++ ) {
		var currentDoodad = this.gridContainer.children[ i ];
		if ( position.x === currentDoodad.tile[ 0 ] && position.y === currentDoodad.tile[ 1 ] ) {
			return currentDoodad;
		}
	}

}

GridMap.prototype.resetTile = function( position ) {
	var doodad = this.getTileAtPosition( position ) || null;
	if ( doodad ) {
		doodad.alpha = 1;
	}
}

GridMap.prototype.hoverOverTile = function( position ) {
	var doodad = this.getTileAtPosition( position ) || null;
	if ( doodad ) {
		doodad.alpha = 0.5;
	}
}

GridMap.prototype.toggleGrid = function( boolean ) {
	if ( !boolean ) {
		this.gridVisible = !this.gridVisible;
	} else {
		this.gridVisible = boolean;
	}
	return this.gridVisible;
}

GridMap.prototype.selectTile = function( x, y ){
	this.selectedTile = [ x, y ];
	console.log( "Selected tile:", this.selectedTile );

	this.selectedTileGraphic.clear();
	this.selectedTileGraphic.lineStyle( 2, configData.platformer.outlineColor, 1 );
	// this.selectedTileGraphic.beginFill(0x000000, 0);
	this.selectedTileGraphic.drawRect( x * this.size, y * this.size, this.size, this.size );
	this.selectedTileGraphic.endFill();

	console.log( this.container )

	// this.selectDoodadAt( this.selectedTile );


}

GridMap.prototype.hoverTile = function( x, y ){
	this.hoveredTile = [ x, y ];


	this.hoveredTileGraphic.clear();
	this.hoveredTileGraphic.lineStyle( 2, 0x000000, 1 );
	// this.hoveredTileGraphic.beginFill(0x000000, 0);
	this.hoveredTileGraphic.drawRect( x * this.size, y * this.size, this.size, this.size );
	this.hoveredTileGraphic.endFill();
}

GridMap.prototype.buildMode = function( boolean ) {
	if( typeof boolean === "boolean" ) {
		this.buildMode = boolean;
		this.interactive = boolean;
		this.buttonMode = boolean;
		this.toggleGrid( boolean );
	}

	return boolean;
}

GridMap.prototype.selectDoodadAt = function( position ) {
	var posX = position.x;
	var posY = position.y;
	var doodads = this.level.doodads;

	if ( doodads.length !== 0 ) {
		for ( var i = 0; i < doodads.length; i++ ) {
			var currentDoodad = doodads[ i ];

			console.log( currentDoodad )

			if ( currentDoodad.id[ 0 ] === posX && currentDoodad.id[ 1 ] === posY ) {
				console.log( "got it at:", i )
				return i;
			}
		}
	}
	return false;


	// console.log( this.level.doodads )

	// return doodad;
}

GridMap.prototype.addDoodad = function() {

}

GridMap.prototype.addBrick = function() {
	if ( this.level ) {
		var object = new Brick();

		this.addChild( object );
		this.addDoodad();
		this.addDoodadToLevelObject( object );
	} else {
		throw Error( "No Level Object" );
	}
}

GridMap.prototype.addDoodadToLevelObject = function( object ) {
	if ( this.level ) {
		var thisDoodad = {};
		thisDoodad.id = object.id;
		thisDoodad.type = object.type;
		thisDoodad.data = object.data || null;

		this.level.doodads.push( thisDoodad );	
	} else {
		throw Error( "No Level Object" );
	}

}

GridMap.prototype.generateGrid = function() {
	if ( this.gridContainer ) {
		this.gridContainer = null;
	}
	this.gridContainer = new PIXI.Container();
	this.gridContainer.name = "gridContainer";
	this.addChild( this.gridContainer );

	this.position = this.startLocation;

	for ( var y = 0; y < this.rows; y++ ) {
		for ( var x = 0; x < this.columns; x++ ) {


			this.gridContainer.addChild( this.gridTile( x, y, this.size ));


			// container.addChild( gridPiece );

			// gridPiece.interactive = true;
		}
	}
}

GridMap.prototype.newLevel = function( columns, rows, size ) {
	this.columns = columns || configData.platformer.columns;
	this.rows = rows || configData.platformer.rows;
	this.size = size || configData.platformer.size;

	this.level =  {
		columns : this.columns,
		rows : this.rows,
		size : this.size,
		theme : null,
		doodads : []
	}

}

GridMap.prototype.clearLevel = function() {
	if ( this.level ) {
		this.level = null;
		return true;
	}
	return false;
}

GridMap.prototype.saveLevel = function( levelData ) {

}

GridMap.prototype.loadLevel = function( levelData ) {

}

	// data : [
	// 	{ id : null, type : null, data : "param1", "param2..." ] }
	// ]