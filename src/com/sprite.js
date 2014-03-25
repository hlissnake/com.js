// define(function(require, exports, module){
// 	var Com = require('./com')
window.COM = window.COM || {};

COM.Sprite = (function(Class, Com){

	function Sprite(options){
		Sprite._super.call(this, options);
		
		this.callbackList = [];
		this.frameLoop = 0;
		if(this.autoPlay) {
			this.play(this.firstAnim);
		}
	}

	Class.extend(Sprite, Com, {

		framerate : 0,

		setFrameSpeed : function(frameSpeed){
			this.frameTime = 1 / frameSpeed;
		},

		_draw : function(dt, ctx){
			Sprite._super.prototype._draw.call(this, dt, ctx);

			if(this.painter && this._animPlay && !this.isOver) {
				// if( this.frameTime && this.frameLoop <= this.frameTime ) {
				if( this.frameLoop < this.framerate ) {
					this.frameLoop++; //+= dt;
				} else {
					this.frameLoop = 0;
					this.isOver = this.painter.advance();
					if(this.isOver && this.callbackList.length) {
						this.callbackList[0]();
					}
				}
			}
		},

		play : function(animName, callback){
			if (!this.painter) return;
			var me = this
			,	name = animName ? animName : this.firstAnim
			;
			me._animPlay = true;
			me.isOver = false;
			me.painter.playAnim(name);
			if(callback) {
				this.callbackList.push(function(){
					callback.call(me);
					me.callbackList.shift();
					//me.painter.off('anim:complete', arguments.callee);
				});
			}
		},

		stop : function(){
			this._animPlay = false;
		}

	});

	return Sprite;

})(Util.Class, COM.Com);