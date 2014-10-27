// define(function(require, exports, module){
// 	var Observer = require('./observer')
// 	;
window.COM = window.COM || {};
COM.Com = (function(Class, Observer){

// ##module = "COM"
// ##requires = [{Observer = './observer'}]

	var _COMEvents = ',touchend,touchmove,touchstart,click,mousemove,'
	,	_COMCustomEvents = ',tap,pinch,swipe,rotate,hold,'
	;

	function COM(options){
		if(options.getContext) {
			this.canvas = options;
			this.context = this.canvas.getContext('2d');
			this.x = this.y = 0;
			this.width = this.canvas.width;
			this.height = this.canvas.height;
			this.type = 'stage';
		} else {
			for (var k in options) {
				if( options[k] === undefined ) continue;
				this[k] = options[k];
			}
			if(options.backgroundImage) {
				var img = options.backgroundImage;
				this.width = options.width ? options.width : img.width;
				this.height = options.height ? options.height : img.height;
			}
			if(options.flash){
				this._flashLoop = 0;
			}
		}
		this.ev_map = {};
		// this.scaleRatio = window.devicePixelRatio
	}

	Class.extend(COM, Observer, {

		x : 0,
		y : 0,
		width : 0,
		height : 0,
		rotate : 0,
		scaleX : 1,
		scaleY : 1,
		//transform : [1,0,0,1,0,0],
		fillColor : 'rgba(0,0,0,1)',
		lineWidth : 0,
		opacity : 1,
		visible : true,
		zIndex : 0,

		append : function(com){
			this.children = this.children || [];
			if(com) {
				com.context = this.context;
				com.stage = this.type == 'stage' ? this : this.stage;
				this.children.push(com);

				// sort children array by zIndex
				this.children.sort(function(a, b){
					return a.zIndex - b.zIndex;
				});
			}
		},

		remove : function(com){
			if(this.children) {
				var children = this.children;
				for(var i = 0, len = this.children.length; i < len ; i++ ) {
					if(children[i] === com) {
						this.children.splice(i, 1);
						break;
					}
				}
			}
		},

		destroy : function(){
			if(this.type == 'stage') {
				// this.children.length
			} else {
				this.stage.remove(this);
			}
		},

		clear : function(backgroundColor, context){
			var context = context || this.context;
			if(!context) {
				throw "no canvas context for this COM-Object";
				return;
			}
			if (backgroundColor) {
				context.fillStyle = backgroundColor; // android下解决重影BUG，背景色采用游戏素材背景色
				context.fillRect(this.x, this.y, this.width, this.height);
			} else {
				context.clearRect(this.x + this.lineWidth, this.y + this.lineWidth, this.width + 2 * this.lineWidth, this.height + 2 * this.lineWidth);
			}
		},

		render : function(dt, context){
			var context = context || this.context;
			if(!context) {
				throw "no canvas context for this COM-Object";
				return;
			}

			this.fire('render:before', dt);

			context.save();

			this._setGraphicStyle(context);

			context.beginPath();
			this._createPath(context);
			context.closePath();

			this._draw(dt, context);
			this._renderChildren(dt, context);

			context.restore();	

			this.fire('render:after', dt);
		},

		_renderChildren : function(dt, context){
			if(this.children) {
				context.translate(this.x, this.y);

				var childCom
				,	children = this.children
				,	len = children.length
				;
				for( var i = 0; i < len; i++ ) {
					childCom = children[i];
					childCom.render(dt, context);
				}
			}
		},

		_setGraphicStyle : function(context){
			var translateX = this.x + this.width / 2
			,	translateY = this.y + this.height / 2
			;
			if(this.transform) {
				context.setTransform(this.transform);
			} else {
				// all transform effect accrodding to com's center croodination
				context.translate(translateX, translateY);

				this.rotate && context.rotate( this.rotate * Math.PI/180);

				if(this.scaleX || this.scaleY) {
					context.scale(this.scaleX, this.scaleY);
				}
				if(this.skewX || this.skewY){
					context.transform(1, Math.tan( (this.skewY || 0) * Math.PI / 180), Math.tan( (this.skewX || 0) * Math.PI / 180), 1, 0, 0);
				}
				context.translate( -translateX, -translateY);
			}
			// context.shadowBlur = 10;
			// context.shadowOffsetX = 20;
			// context.shadowOffsetY = 20;
			// context.shadowColor = "black";

			if(this.opacity) 
				context.globalAlpha = this.opacity;

			if(this.fillColor) 
				context.fillStyle = this.fillColor;

			if(this.graphicFilter)
				context.globalCompositeOperation = this.graphicFilter;

			if(this.font) 
				context.font = this.font;

			if(this.fontAlign)
				context.textAlign = this.fontAlign;

			if(this.strokeColor) 
				context.strokeStyle = this.strokeColor;

			if(this.lineWidth) 
				context.lineWidth = this.lineWidth;
		},

		_createPath : function(context){
			if(this.shape) {
				this.shape.draw(this, context);
			}
		},

		_draw : function(dt, context){
			if(!this.visible) return false;
			if (this.painter) {
				this.painter.draw(this, context, dt);
			} else {
				if(this.fillColor) context.fill();
				if(this.strokeColor) context.stroke();
			}
		},

		/**
		 * for html events or observer events
		 * only listen to trigger com's events. not include children target com in event object
		 * this can aviod the findTarget function recursion to improve the performance
		 */
		on : function(ev, callback){
			var me = this;
			if( _COMEvents.indexOf(',' + ev + ',') > -1) {
				var stage = this.type == 'stage' ? this : this.stage;
				stage._addEventListener(ev, me, function(e){
					callback && callback.call(me, e);			
				}, true);
			} else if ( _COMCustomEvents.indexOf(',' + ev + ',') > -1) {
				// use hammerjs to expand the gesture events
			} else {
				COM._super.prototype.on.call(this, ev, callback);
			}
			return me;
		},

		/**
		 * for html events only, not observer events
		 * delegate the children coms event. include the target children com in event object
		 */
		delegate : function(ev, comId, callback){
			var me = this;
			if( _COMEvents.indexOf(',' + ev + ',') > -1) {
				var stage = this.type == 'stage' ? this : this.stage;
				stage._addEventListener(ev, me, function(e){
					// only match com of the prvoided id, can trigger the event callback
					if(comId) {
						if(e.targetCom.id && e.targetCom.id == comId) {
							callback && callback.call(me, e);
						}
					} 
					// if comId is null or '', just trigger callback for itself
					else {
						callback && callback.call(me, e);	
					}
				});
			}
			return me;
		},

		_addEventListener : function(ev, trigger, callback, listenSelf){
			var ev_map = this.ev_map
			,	me = this
			;
			if( !ev_map[ev] ) {
				ev_map[ev] = [];
				me.canvas.addEventListener(ev, function(e){
					me._eventTrigger(e || window.event);
				})
			}
			ev_map[ev].push({
				t : trigger,
				fn : callback,
				listenSelf : listenSelf
			});	
		},

		_eventTrigger : function(e){
			var canvasOffset = this.canvas.getBoundingClientRect()
			,	canvas = this.canvas
			,	coordinate = {}
			,	eventType = e.type
			,	pageX
			,	pageY
			;
			if(eventType.match(/touch/)){
				var touch = e.touches.length ? e.touches[0] : e.changedTouches[0];
				pageX = touch.pageX;
				pageY = touch.pageY;
			} else {
				pageX = e.pageX;
				pageY = e.pageY;
			}
			coordinate = {
				x : (pageX - canvasOffset.left) * (canvas.width / canvasOffset.width),
				y : (pageY - canvasOffset.top) * (canvas.height / canvasOffset.height)
			}

			var callbackList = this.ev_map[eventType];

			for(var i = 0; i < callbackList.length; i++) {
				var cb = callbackList[i]
				,	trigger = cb.t
				,	target = trigger._findTarget(coordinate, cb.listenSelf)
				;
				if(target) {
					e.targetCom = target;
					cb.fn.call(trigger, e);
					continue;
				}			
			}
		},

		_findTarget : function(coord, listenSelf){
			var me = this
			,	context = me.context
			,	inPath
			,	target
			;
			function find(com, ctx){
				var result = true;

				if(com.type == 'stage') {
					inPath = true;
				} else {
					ctx.save();
					com._setGraphicStyle(ctx);
					ctx.beginPath();
					com._createPath(ctx);
					ctx.closePath();
					inPath = ctx.isPointInPath(coord.x, coord.y);
				}

				if(inPath) {
					target = com;
					// only listen com self, no need to find children target, quit the function recursion
					if(listenSelf) {
						result = true;
					} else if(com.children) {
						var children = com.children;
						ctx.translate(com.x, com.y);

						for(var i = children.length - 1; i >= 0; i--) {
							if( children[i].visible && find(children[i], ctx) ) {
								// target = result;
								result = true;
								break;
							} else {
								result = false;
							}
						}
					}
				} else {
					result = false;
				}
				ctx.restore();

				return result;
			}

			find(me, context);

			return target;
		}

	});

	COM.Shape = {

		Rect : {				
			draw : function(com, ctx){
				ctx.rect(com.x, com.y, com.width, com.height);
			}
		},

		Circle : {				
			draw : function(com, ctx){
				var centerX = com.x + com.width / 2
				,	centerY = com.y + com.height / 2
				,	radius = com.width / 2
				; 
				ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
				ctx.clip();
			}
		}
	}

	COM.Painter = {
		Text : {
			draw : function(com, ctx, dt){
				ctx.fillText(com.text, com.x, com.y);
			}
		},

		Bitmap : {
			draw : function(com, ctx, dt){
				var img = com.backgroundImage;
				if( com.backgroundRepeatX ) {
					var w = img.width
					,	h = img.height//com.backgroundImageHeight
					,	cw = com.height / h * w
					,	positionX = com.imagePositionX || 0
					,	repeatNum = Math.ceil(com.width / cw) + 1
					;
					if (!com.maxPositionX) com.maxPositionX = cw;
					for(var i = 0; i < repeatNum; i++) {
						ctx.drawImage(img, 0, 0, w, h, com.x + i * cw - positionX, com.y, cw, com.height);
					}
				} else {
					ctx.drawImage(img, 0, 0, img.width, img.height, com.x, com.y, com.width, com.height)
				}
			}
		}
	}

	// in debug mode, override _draw method of COM Class. 
	// excute this logic in Class defining process should avoid loop if in Game tick loop. so improve the prefermance
	if (window.location.search.indexOf('_debug_') > -1) {
		COM.prototype._draw = function(dt, context){
			if(!this.visible) return false;
			if (this.painter) {
				this.painter.draw(this, context, dt);
			} else {
				if(this.fillColor) context.fill();
				if(this.strokeColor) context.stroke();
			}
			// in debug mode, paint the shape line of the com object
			context.strokeStyle = 'rgba(1,1,1,0.6)'
			context.lineWidth = 2;
			context.stroke();
		};
	}

	return COM;

})(Util.Class, Util.Observer);