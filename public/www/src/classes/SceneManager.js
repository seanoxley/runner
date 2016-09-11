(function() {
	SceneManager = {
		Scenes : {},
		currentScene : null,
		transitionScene : null,
		sceneList : null,
		active : false,
		tweenActive : false,

		scene : function( sceneName, scene ) {
			if ( !sceneName || !scene ) {
				console.error( "Scene incomplete:", sceneName, scene );
				return false;
			}
			if ( SceneManager.Scenes[ sceneName ] ) {
				console.error( "Scene already exists:", sceneName );
				return false;
			}
			console.log( "New Scene:", sceneName );

			// create new base scene 
			var tempScene = new BlankScene();

			// copy over all code from scene js file
			for ( var i in scene ) {
				tempScene[ i ] = scene[ i ];
			}

			// add scene to global Scenes object
			SceneManager.Scenes[ sceneName ] = tempScene;
			SceneManager.Scenes[ sceneName ].init( sceneName );
			return true;
		},

		updateTweenScenes : function() {
			// loops through the scene container to turn on and set the correct index position of current and transition scenes
			// the current scene is always on and is in the last position in the scene container
			// the transition scene is second to last in the scene container and is only on during transitions
			var renderScenes = Game.renderObject.children;
			var currentSceneIndex;
			var transitionSceneIndex;

			for ( var i = 0; i < renderScenes.length; i++ ) {
				var currentObject = renderScenes[ i ];

				if ( currentObject.name === this.getCurrent().name ) {
					currentSceneIndex = i;
				}

				if ( this.transitionScene ) {
					if ( currentObject.name === this.getTransition().name ) {
						transitionSceneIndex = i;
					}
				}
			}
			var currentScene = Game.renderObject.getChildAt( currentSceneIndex );
			var transitionScene = Game.renderObject.getChildAt( transitionSceneIndex );

			// set transition scene to second to last position in renderObject
			if ( this.transitionScene ) {
				Game.renderObject.swapChildren( transitionScene, Game.renderObject.getChildAt( renderScenes.length - 2 ) );
			}
			// set current scene to last position in renderObject so it can be rendered
			Game.renderObject.swapChildren( currentScene, Game.renderObject.getChildAt( renderScenes.length - 1 )  );
		},

		updateRenderScenes : function() {
			for ( var i in Scenes ) {
				if ( this.getCurrent().name === i ) {
					this.getCurrent().turnOn();
				} else {
					Scenes[ i ].turnOff();
					Scenes[ i ].resetPosition();
				}
			}
		},

		getSceneStatus : function() {
			console.groupCollapsed( "Scene Status" );
			for ( var i in Scenes ) {
				console.log( i );
				console.log( "Paused:", Scenes[ i ].isPaused() );
				console.log( "Rendering:", Scenes[ i ].isRendering() );
			}
			console.groupEnd( "Scene Status" );
		},

		goToScene : function( scene, direction, tweenDuration ) {
			var that = this;
			var direction = direction || "left";
			var tweenDuration = tweenDuration || configData.sceneTransitionSpeed;
			var tweenData;

			if ( !scene ) {
				console.log( "No scene passed" );
				return false;
			}
			if ( this.getCurrent() ) {
				if ( scene.name === this.getCurrent().name ) {
					console.log( "Scene already current" );
					return false;
				}
			}
			if ( typeof scene != "object" || !scene.hasOwnProperty( "name" ) ) {
				console.log( "Scene not valid" )
				return false;
			}

			console.log( "Start scene transition from:", this.getCurrent().name, "to:", scene.name );

			// set the transitionScene to the passed scene object and turn it on 
			this.tweenActive = true;

			// set transition scene and turn it on
			this.transitionScene = scene;
			this.transitionScene.resetPosition();
			this.transitionScene.unpause();
			this.transitionScene.renderOn();
			this.transitionScene.onEnter(); // run transition scene onEnter
			this.currentScene.onExit(); // run current scene onExit
			this.updateTweenScenes(); // set index of current and transition scene in render object

			var tweenTarget = SceneManager.getCurrent().container;
			var duration = tweenDuration / 1000; // convert ms to seconds
			var ease = configData.sceneTransitionEase;

			switch( direction ) {
				case "up":
					tweenData = { 
						y : -Game.height,
						onComplete : endTween,
						ease : ease
					}
					break;
				case "down":
					tweenData = { 
						y : Game.height,
						onComplete : endTween,
						ease : ease
					}
					break;
				case "left":
					tweenData = { 
						x : -Game.width,
						onComplete : endTween,
						ease : ease
					}
					break;
				case "right":
					tweenData = { 
						x : Game.width,
						onComplete : endTween,
						ease : ease
					}
					break;
			}

			// play swoosh audio effect
			// Game.GameHandler.SoundManager.Sounds.swoosh.sound.play();

			// tween autostarts
			var tween = TweenLite.to( 
				tweenTarget, //target
				duration, // duration
				tweenData
				)
			
			// end tween
			function endTween() {
				console.log( "Scene tween finished" );

				that.currentScene.onExitComplete(); // run current scene onExitComplete
				// update transitions scene to current scene
				that.currentScene = that.transitionScene;
				that.currentScene.onEnterComplete(); // run current scene onEnterComplete
				that.transitionScene = null;
				that.updateRenderScenes();	// turns off all non current scenes
				that.getSceneStatus();
			}

			return true;
		},

		getCurrent : function() {
			return this.currentScene;
		},

		getTransition : function() {
			return this.transitionScene;
		},

		getList : function() {
			return this.sceneList;
		}
	}
})();