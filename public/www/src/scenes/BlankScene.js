var BlankScene = function( name ) {
	return {
		name : name,
		paused : true,

		resetPosition : function() {
			this.container.x = 0;
			this.container.y = 0;
		},

		turnOn : function() {
			this.unpause();
			this.renderOn();
			this.setInteractive( true );
			return this;
		},

		turnOff : function() {
			this.pause();
			this.renderOff();
			this.setInteractive( false );
			return this;
		},

		isPaused : function() {
			return this.paused;
		},

		pause : function() {
			this.paused = true;
			return this.paused;
		},

		unpause : function() {
			this.paused = false;
			return this.paused;
		},

		isRendering : function() {
			return this.container.renderable;
		},

		renderOn: function() {
			this.container.renderable = true;
			return this.container.renderable;
		},

		renderOff : function() {
			this.container.renderable = false;
			return this.container.renderable;
		},

		onEnter : function() {
			console.log( "onEnter:", this.name );

		},

		onEnterComplete : function() {
			console.log( "onEnterComplete", this.name );
			this.setInteractive( true );
		},

		// this event will fire at the start of a scene transition
		onExit : function() { 
			console.log( "onExit:", this.name );
			this.setInteractive( false );
		},

		// this event will fire at the end of a scene transition
		onExitComplete : function() { 
			console.log( "onExitComplete:", this.name );
		},

		setInteractive : function( boolean ) {
			this.container.interactiveChildren = boolean;
			return this.container.interactiveChildren;
		},

		isInteractive : function() {
			return this.container.interactiveChildren;
		},

		init : function( sceneName ) {
			var that = this;
			this.name = sceneName; 

			// create scene container
			this.container = new PIXI.Container();
			this.container.name = this.name;
			// this.renderOff();
			Game.renderObject.addChild( this.container );
		},

		update : function() {
		}
	}
}