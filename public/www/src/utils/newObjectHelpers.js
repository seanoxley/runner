/* create a new player object within the passed scene*/
function createPlayer( parent ) {
	if ( !parent ) {
		parent = SceneManager.getCurrent();
	}
	var foo = new Player();
	parent.container.addChild( foo );
}