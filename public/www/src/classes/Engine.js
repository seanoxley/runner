(function() {
	Engine = {

		start : function( scene ) {
			if ( this.active ) {
				return true;
			}
			// setting base scene
			console.log( "Setting base scene", scene.name );
			SceneManager.currentScene = scene;
			SceneManager.getCurrent().turnOn();

			console.log( "Starting game loop..." );
			this.active = true;
			Engine.gameLoop();
			SceneManager.updateTweenScenes();
			return true;
		},

		gameLoop : function( time ) {
			var currentScene = SceneManager.getCurrent() || null;
			var transitionScene = SceneManager.getTransition() || null;

			// run game loop
			requestAnimationFrame( Engine.gameLoop );

			// run update on current scene and transition scene when active
			if ( currentScene ) {
				if ( !currentScene.isPaused() ) {
					currentScene.update();
					// game.renderer.render( currentScene.container );
					Game.renderer.render( Game.renderObject );
					if ( transitionScene && !transitionScene.isPaused() ) {
						// Add listerner mask
						transitionScene.update();
					}
				}	
			}
		},

		storeData : function( type, data ) {
			if( typeof( Storage ) !== "undefined" ) {
				localStorage.setItem( type, data );
				console.log( "Stored -", type + ":" + data );
				return true;
			} else {
				console.log( "Sorry! No Web Storage support..." );
				return false;
			}
		},

		getData : function( type ) {
			if ( localStorage[ type ] ) {
				return localStorage[ type ];
			}
			console.log( "Object does not exist:", type );
			return false;
		},

		clearDataByType : function( type ) {
			if ( localStorage[ type ] ) {
				localStorage.removeItem( type );
				return true;
			}
			console.log( "Object does not exist:", type );
			return false;
		},

		clearAllData : function() {
			localStorage.clear();
		}

	};
})();