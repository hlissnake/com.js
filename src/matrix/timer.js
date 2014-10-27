// define(function(require, exports, module){
// 	var Observer = require('./observer');
window.Matrix = window.Matrix || {};

Matrix.Timer = (function(Class, Observer){

	var RAF = 
		window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		function(callback){
			setTimeout(callback, 1 / 60);
		};

	function Timer(){ }

	Class.extend(Timer, Observer, {

		_loop : function(){
			if ( !this._run ) return false;
			var me = this
			,	now = (+new Date)
			,	lastTime = me.lastTime
			;
			RAF(function(){
				if (me._run) me._loop();
			});
			var dt = (now - lastTime) / 1000;
			// if diff time is longer than 200ms, We can believe that is because of debug or other thread blocking
			// then we make dt to a normal status, 30fps,32ms may be greatsd
			if(dt > 0.2) {
				dt = 1 / 30;
			}
			me.fire('run', dt)
			me.lastTime = now;
		},

		start : function(){
			this._run = true;
			this.lastTime = (+new Date);
			this._loop();

			return this;
		},

		pause : function(){
			this._run = false;

			return this;
		}

	});

	return Timer;

})(Util.Class, Util.Observer);