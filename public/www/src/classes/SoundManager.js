(function() {
	SoundManager = function() {
		var that = this;
		this.Sounds = null;
		this.musicStarted = false;
		this.isPlayingMusic = false;
		this.isPausedMusic = false;
		this.currentMusic = null;
		this.currentMusicIndex = null;

		this.loadSounds = function() {
			console.log( "Loading Sounds..." );

			var soundLibrary = {
				swoosh : {
					urls : [ "www/asset/audio/swoosh.wav" ],
					// urls : [ "asset/audio/swoosh.wav" ],
					volume : 0.8
				}
				// game_music_bundle : {
				// 	urls : [ "www/asset/audio/game_music_bundle.mp3" ]
				// 	// urls : [ "asset/audio/game_music_bundle.mp3" ]
				// 	sprite : {
				// 		song1 : [ 0, 140000 ],
				// 		song2 : [ 140000, 164000 ],
				// 		song3 : [ 304000, 129000 ],
				// 		song4 : [ 433000, 148000 ]

				// 		// song1 : [ 0, 3000 ],
				// 		// song2 : [ 140000, 3000 ],
				// 		// song3 : [ 304000, 3000 ],
				// 		// song4 : [ 433000, 3000 ]

				// 	},
				// 	onplay : function() {
				// 		console.log( "Music playing..." );
				// 	},
				// 	onend : function() {
				// 		console.log( "Music complete... trigger next" );
				// 		that.stopMusic();
				// 		that.playNextMusic();
				// 	},
				// 	onpause : function() {
				// 		console.log( "Music pause..." );
				// 	}
				// },
				// game_music_single : {
				// 	// urls : [ "www/asset/audio/game_music_single.ogg" ],
				// 	urls : [ "asset/audio/game_music_single.ogg" ],
				// 	onplay : function() {
				// 		console.log( "Music playing..." );
				// 	},
				// 	onend : function() {
				// 		console.log( "Music complete - trigger next" );
				// 		that.stopMusic();
				// 		that.playNextMusic();
				// 	},
				// 	onpause : function() {
				// 		console.log( "Music pause..." );
				// 	}
				// }
			};
			var totalSounds = Object.keys( soundLibrary ).length;
			var soundsLoaded = 0;

			for ( var i in soundLibrary ) {
				var soundName = i;
				var urls = soundLibrary[ i ].urls;
				var sprite = soundLibrary[ i ].sprite || null;
				var onplay = soundLibrary[ i ].onplay || null;
				var onend = soundLibrary[ i ].onend || null;
				var onpause = soundLibrary[ i ].onpause || null;
				var volume = soundLibrary[ i ].volume || configData.audio.music;

				soundLibrary[ soundName ].sound = new Howl({
					volume : volume,
					urls: urls,
					sprite : sprite,
					onplay : onplay,
					onend : onend,
					onpause : onpause,
					onload : function() {
						soundsLoaded++;

						if ( soundsLoaded === totalSounds ) {
							console.log( "All sounds loaded:", soundsLoaded + "/" + totalSounds );

							Game.GameHandler.SoundManager.allLoaded = true;
							Game.GameHandler.SoundManager.Sounds = soundLibrary; // add sound library to sound manager
							// that.createAudioShortcuts();
						} else {
							console.log( "Sound loaded: ", soundsLoaded + "/" + totalSounds );
						}
					},
					onloaderror : function( error ) {
						console.log( "Sound load error", this, error );
						// Game.GameHandler.SoundManager.Sounds = null;
						// loadSounds();
					}
				});
			}
		};

		this.shufflePlayOrder = function( numberOfSongs ) {
			var orderArray = [];
			for ( var i = 0; i < numberOfSongs; i++ ) {
				orderArray.push( i + 1 ); // add 1 to compensate for no song 0
			}
			shuffleArray( orderArray );
			this.orderArray = orderArray;
		};

		this.createAudioShortcuts = function() {
			// create audio shortcuts
			window.Sounds = {};
			// Sounds.music_bundle = Game.GameHandler.SoundManager.Sounds.game_music_bundle.sound
			Sounds.music_single = Game.GameHandler.SoundManager.Sounds.game_music_single.sound;

			Sounds.song1 = {};
			Sounds.song2 = {};
			Sounds.song3 = {};
			Sounds.song4 = {};
			Sounds.song5 = {};

			this.numberOfSongs = 1;

			// Sounds.song1.play = function() { Sounds.music_bundle.play( "song1" ) };
			// Sounds.song1.stop = function() { Sounds.music_bundle.stop( "song1" ) };
			// Sounds.song1.pause = function() { Sounds.music_bundle.pause( "song1" ) };

			// Sounds.song2.play = function() { Sounds.music_bundle.play( "song2" ) };
			// Sounds.song2.stop = function() { Sounds.music_bundle.stop( "song2" ) };
			// Sounds.song2.pause = function() { Sounds.music_bundle.pause( "song2" ) };

			// Sounds.song3.play = function() { Sounds.music_bundle.play( "song3" ) };
			// Sounds.song3.stop = function() { Sounds.music_bundle.stop( "song3" ) };
			// Sounds.song3.pause = function() { Sounds.music_bundle.pause( "song3" ) };

			// Sounds.song4.play = function() { Sounds.music_bundle.play( "song4" ) };
			// Sounds.song4.stop = function() { Sounds.music_bundle.stop( "song4" ) };
			// Sounds.song4.pause = function() { Sounds.music_bundle.pause( "song4" ) };

			Sounds.song1.play = function() { Sounds.music_single.play() };
			Sounds.song1.stop = function() { Sounds.music_single.stop() };
			Sounds.song1.pause = function() { Sounds.music_single.pause() };

			this.shufflePlayOrder( this.numberOfSongs );
		};

		this.playNextMusic = function() {
			if ( !this.isPausedMusic ) {
				if ( this.currentMusicIndex === null ) {
					this.currentMusicIndex = 0;
				} else {
					this.currentMusicIndex++;
					var index = this.currentMusicIndex % this.numberOfSongs;
					this.currentMusicIndex = index;
				}
				var nextSong = "song" + this.orderArray[ this.currentMusicIndex ];
				this.playMusic( nextSong );
			} else {
				console.log( "Cannot play next, paused..." );
			}
		};

		this.playMusic = function( musicId ) {
			if ( !musicId ) {
				if ( !this.isPausedMusic ) {
					return false;
				}
			}
			if ( this.isPlayingMusic ) {
				this.stopMusic( musicId );
			}
			var musicId = musicId || this.currentMusic;
			this.currentMusic = musicId;
			this.isPlayingMusic = true;
			this.isPausedMusic = false;
			Sounds[ musicId ].play();
			console.log( "Play Music:", this.currentMusic );
		};

		this.pauseMusic = function() {
			if ( !this.isPausedMusic ) {
				Sounds[ this.currentMusic ].pause();
				this.isPlayingMusic = false;
				this.isPausedMusic = true;
			} else {
				console.log( "Already paused..." );
			}
		};

		this.stopMusic = function() {
			if ( this.isPlayingMusic ) {
				Sounds[ this.currentMusic ].stop();
				this.currentMusic = null;
				this.isPlayingMusic = false;
				this.isPausedMusic = false;
			} else {
				console.log( "No music playing..." );
			}
		};

		init();

		function init() {
			console.log( "SoundManager init..." )
			that.loadSounds();
		}

	}
})();
