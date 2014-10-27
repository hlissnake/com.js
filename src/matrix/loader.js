// define(function(require, exports, module){
// 	var Observer = require('./observer');
window.Matrix = window.Matrix || {};

Matrix.Loader = (function(Class, Observer){

	function Loader(imgMap){
		this._assetsNum = 0;
		this._loadedNum = 0;
		this._imgMap = {};

		// load image
		for(var img in imgMap) {
			this._assetsNum++;
		}
		for(var img in imgMap) {
			var url = imgMap[img];
			this._loadImag(img, url);
		}

		// load audio, use howler.js
		// for(var audio in audioMap) {
		// 	this._assetsNum++;
		// }
		// for(var audio in audioMap) {
		// 	var url = audioMap[audio];
		// 	this._loadAudio(audio, url);
		// }
	}

	Class.extend(Loader, Observer, {

		get : function(key){
			return this._imgMap[key];
		},

		_loadImag : function(key, url){
			var me = this
			,	img
			;
			img = me._imgMap[key] || new Image();
			// if(img.complete) {
				// me._complete(img);
			// } else {
			img.onload = function(){
				me._complete(this);
			}
			img.onerror = function(){
				if(!this.retry) {
					this.retry = true;
					this.onload = this.onerror = null;
					me._loadImag(key, url);
				} else {
					me.fire('error', key, url);
				}
			}
			img.src = url;
			me._imgMap[key] = img;
			// }
		},

		_complete : function(img){
			this._loadedNum++;
			if(this._loadedNum == this._assetsNum) {
				this.fire('complete');
			} else {
				this.fire('load', this._loadedNum / this._assetsNum, img)
			}
		}

	});

	return Loader;

})(Util.Class, Util.Observer);