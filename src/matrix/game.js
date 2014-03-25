// define(function(require, exports, module){
// 	var Com = require('../src/com/com')
// 	,	Timer = require('../util/timer')
// 	, 	Loader = require('../util/loader')
// 	,	Observer = require('../util/observer')
// 	;

var Game = (function(Class, Observer, Timer, Loader){

	function Game(){ 

	}

	Class.extend(Game, Observer, {

		get : function(key){
			return this.loader.get(key);
		},

		init : function(_init){
			var game = this;

			game.stage = new Com(game.canvas);
			game.ticker = new Timer();
			game.loader = new Loader(this.assets).on('complete', function(){
				_init.call(game, game.canvas);
				game.start();
			})
		},

		append : function(com){
			this.stage.append(com);
		},

		update : function(_update){
			var game = this
			,	canvas = game.canvas
			,	isAndroid = false
			;
		    if (window.navigator.userAgent.match(/Android/)) {
		    	isAndroid = true;
		    }
			game.ticker.on('run', function(dt){

				_update.call(game, dt);

			});
		},

		start : function(){
			this.ticker.start();
		},

		pause : function(){
			this.ticker.pause();
		},

		over : function(gameover){
			gameover.call(this, this.dt);
		}

	});

	Game.createScene = function(canvas, options){
		var game = new Game();
		game.canvas = canvas;
		game.assets = options.assets;
		game.init(options.init);
		game.update(options.update);

		return game;
	};

	return Game;

 })(Util.Class, Util.Observer, Matrix.Timer, Matrix.Loader);