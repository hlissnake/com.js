"use strict";window.Util=window.Util||{},Util.Class=function(){function a(a,b){function c(){this.constructor=a}for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);c.prototype=b.prototype,a.prototype=new c}function b(a,b){for(var c in b)b.hasOwnProperty(c)&&(a.prototype[c]=b[c])}var c={};return c.extend=function(c,d,e){"function"==typeof d?(a(c,d),e&&b(c,e),c._super=d):"object"==typeof d&&(b(c,d),c._super=function(){})},c}(),window.Util=window.Util||{},Util.Observer=function(a){function b(){}return a.extend(b,{on:function(a,b,c){return this._events=this._events||{},this._events[a]||(this._events[a]=[]),this._events[a].push({fn:b,ctx:c}),this},fire:function(a){this._events=this._events||{};var b,c=this._events[a],d=Array.prototype.slice.call(arguments,1);if(c&&c.length)for(var e=0;e<c.length;e++)b=c[e],b.fn.apply(b.ctx||this,d);return this},off:function(a,b){if(this._events=this._events||{},b){for(var c=0;c<this._events[a].length;c++)if(b==this._events[a][c]){this._events[a].splice(c,1);break}}else delete this._events[a];return this}}),b}(Util.Class),window.COM=window.COM||{},COM.Com=function(a,b){function c(a){if(a.getContext)this.canvas=a,this.context=this.canvas.getContext("2d"),this.x=this.y=0,this.width=this.canvas.width,this.height=this.canvas.height,this.type="stage";else{for(var b in a)void 0!==a[b]&&(this[b]=a[b]);if(a.backgroundImage){var c=a.backgroundImage;this.width=a.width?a.width:c.width,this.height=a.height?a.height:c.height}a.flash&&(this._flashLoop=0)}}var d=",touchend,touchmove,touchstart,click,mousemove,",e=",tap,pinch,swipe,rotate,hold,";return window.location.search.indexOf("_debug_")>-1&&(window._DEBUG_=!0),a.extend(c,b,{x:0,y:0,width:0,height:0,rotate:0,scaleX:1,scaleY:1,fillColor:"rgba(0,0,0,1)",lineWidth:0,opacity:1,visible:!0,zIndex:0,behaviors:[],ev_map:{},append:function(a){this.children=this.children||[],a&&(a.context=this.context,a.stage="stage"==this.type?this:this.stage,this.children.push(a),this.children.sort(function(a,b){return a.zIndex-b.zIndex}))},remove:function(a){if(this.children)for(var b=this.children,c=0,d=this.children.length;d>c;c++)if(b[c]===a){this.children.splice(c,1);break}},clear:function(a,b){var b=b||this.context;if(!b)throw"no canvas context for this COM-Object";b.clearRect(this.x+this.lineWidth,this.y+this.lineWidth,this.width+2*this.lineWidth,this.height+2*this.lineWidth)},render:function(a,b){var b=b||this.context;if(!b)throw"no canvas context for this COM-Object";this.fire("render:before",a),b.save(),this._setGraphicStyle(b),b.beginPath(),this._createPath(b),b.closePath(),this._draw(a,b),this._renderChildren(a,b),b.restore(),this.fire("render:after",a)},_renderChildren:function(a,b){if(this.children){b.translate(this.x,this.y);for(var c,d=this.children,e=d.length,f=0;e>f;f++)c=d[f],c.render(a,b)}},_setGraphicStyle:function(a){var b=this.x+this.width/2,c=this.y+this.height/2;this.transform?a.setTransform(this.transform):(a.translate(b,c),this.rotate&&a.rotate(this.rotate*Math.PI/180),(this.scaleX||this.scaleY)&&a.scale(this.scaleX,this.scaleY),(this.skewX||this.skewY)&&a.transform(1,Math.tan(this.skewY*Math.PI/180),Math.tan(this.skewX*Math.PI/180),1,0,0),a.translate(-b,-c)),this.opacity&&(a.globalAlpha=this.opacity),this.fillColor&&(a.fillStyle=this.fillColor),this.graphicFilter&&(a.globalCompositeOperation=this.graphicFilter),this.font&&(a.font=this.font),this.fontAlign&&(a.textAlign=this.fontAlign),this.strokeColor&&(a.strokeStyle=this.strokeColor),this.lineWidth&&(a.lineWidth=this.lineWidth)},_createPath:function(a){this.shape&&this.shape.draw(this,a)},_draw:function(a,b){return this.visible?(this.painter?this.painter.draw(this,b,a):(this.fillColor&&b.fill(),this.strokeColor&&b.stroke()),void(window._DEBUG_&&(b.strokeStyle="rgba(1,1,1,0.6)",b.lineWidth=2,b.stroke()))):!1},on:function(a,b){var f=this;if(d.indexOf(","+a+",")>-1){var g="stage"==this.type?this:this.stage;g._addEventListener(a,f,function(a){b&&b.call(f,a)},!0)}else e.indexOf(","+a+",")>-1||c._super.prototype.on.call(this,a,b);return f},delegate:function(a,b,c){var e=this;if(d.indexOf(","+a+",")>-1){var f="stage"==this.type?this:this.stage;f._addEventListener(a,e,function(a){b?a.targetCom.id&&a.targetCom.id==b&&c&&c.call(e,a):c&&c.call(e,a)})}return e},_addEventListener:function(a,b,c,d){var e=this.ev_map,f=this;e[a]||(e[a]=[],f.canvas.addEventListener(a,function(a){f._eventTrigger(a||window.event)})),e[a].push({t:b,fn:c,listenSelf:d})},_eventTrigger:function(a){var b,c,d=this.canvas.getBoundingClientRect(),e=this.canvas,f={},g=a.type;if(g.match(/touch/)){var h=a.touches.length?a.touches[0]:a.changedTouches[0];b=h.pageX,c=h.pageY}else b=a.pageX,c=a.pageY;f={x:b-d.left*(e.width/d.width),y:c-d.top*(e.height/d.height)};for(var i=this.ev_map[g],j=0;j<i.length;j++){var k=i[j],l=k.t,m=l._findTarget(f,k.listenSelf);m&&(a.targetCom=m,k.fn.call(l,a))}},_findTarget:function(a,b){function c(f,g){var h=!0;if("stage"==f.type?d=!0:(g.save(),f._setGraphicStyle(g),g.beginPath(),f._createPath(g),g.closePath(),d=g.isPointInPath(a.x,a.y)),d){if(e=f,b)h=!0;else if(f.children){var i=f.children;g.translate(f.x,f.y);for(var j=i.length-1;j>=0;j--){if(i[j].visible&&c(i[j],g)){h=!0;break}h=!1}}}else h=!1;return g.restore(),h}var d,e,f=this,g=f.context;return c(f,g),e}}),c.Shape={Rect:{draw:function(a,b){b.rect(a.x,a.y,a.width,a.height)}},Circle:{draw:function(a,b){var c=a.x+a.width/2,d=a.y+a.height/2,e=a.width/2;b.arc(c,d,e,0,2*Math.PI),b.clip()}}},c.Painter={Text:{draw:function(a,b){b.fillText(a.text,a.x,a.y)}},Bitmap:{draw:function(a,b){var c=a.backgroundImage;if(a.backgroundRepeatX){var d=c.width,e=c.height,f=a.height/e*d,g=a.imagePositionX||0,h=Math.ceil(a.width/f)+1;a.maxPositionX||(a.maxPositionX=f);for(var i=0;h>i;i++)b.drawImage(c,0,0,d,e,a.x+i*f-g,a.y,f,a.height)}else b.drawImage(c,0,0,c.width,c.height,a.x,a.y,a.width,a.height)}}},c}(Util.Class,Util.Observer),window.COM=window.COM||{},COM.Sprite=function(a,b){function c(a){c._super.call(this,a),this.callbackList=[],this.frameLoop=0,this.autoPlay&&this.play(this.firstAnim)}return a.extend(c,b,{framerate:0,setFrameSpeed:function(a){this.frameTime=1/a},_draw:function(a,b){c._super.prototype._draw.call(this,a,b),this.painter&&this._animPlay&&!this.isOver&&(this.frameLoop<this.framerate?this.frameLoop++:(this.frameLoop=0,this.isOver=this.painter.advance(),this.isOver&&this.callbackList.length&&this.callbackList[0]()))},play:function(a,b){if(this.painter){var c=this,d=a?a:this.firstAnim;c._animPlay=!0,c.isOver=!1,c.painter.playAnim(d),b&&this.callbackList.push(function(){b.call(c),c.callbackList.shift()})}},stop:function(){this._animPlay=!1}}),c}(Util.Class,COM.Com),window.COM=window.COM||{},COM.SpriteSheet=function(a,b){function c(a){for(var b in a)void 0!==a[b]&&(this[b]=a[b]);if(this.frameData&&!this.frames){for(var c,d=this.frameData,e=d.frameHeight,f=d.frameWidth,g=d.imgHeight,h=d.imgWidth,i=d.frameNum,j=[],k=Math.floor(h/f),l=Math.floor(g/e),m=0;l>m;m++){for(c=0;k>c;c++){var n=[];if(n.push(c*f),n.push(m*e),n.push(f),n.push(e),j.push(n),m*k+c+1>=i)break}if(m*k+c+1>=i)break}this.frames=j}if(this.animations)for(var o in this.animations){this.firstAnim=o;break}else this.maxFrame=this.frames.length-1,this.minFrame=0,this.loop=!1}return a.extend(c,b,{frameIndex:0,advance:function(){var a=!1;return this.frameIndex<this.maxFrame?this.frameIndex++:(this.frameIndex=this.minFrame,a=!0,this._loop&&(a=!1)),a},playAnim:function(a){var b=a?a:this.firstAnim;if(this.animations){var c=this.animations[b];this.minFrame=c.start,this.maxFrame=c.end,this.frameIndex=c.start,this._loop=c.loop?!0:!1}},draw:function(a,b){var c=this.frames[this.frameIndex],d=c[0],e=c[1],f=c[2],g=c[3];b.drawImage(this.image,d,e,f,g,a.x,a.y,a.width,a.height)}}),c}(Util.Class,Util.Observer),void 0===Date.now&&(Date.now=function(){return(new Date).valueOf()});var TWEEN=TWEEN||function(){var a=[];return{REVISION:"12",getAll:function(){return a},removeAll:function(){a=[]},add:function(b){a.push(b)},remove:function(b){b=a.indexOf(b),-1!==b&&a.splice(b,1)},update:function(b){if(0===a.length)return!1;for(var c=0,b=void 0!==b?b:"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now();c<a.length;)a[c].update(b)?c++:a.splice(c,1);return!0}}}();TWEEN.Tween=function(a){var b,c={},d={},e={},f=1e3,g=0,h=!1,i=!1,j=0,k=null,l=TWEEN.Easing.Linear.None,m=TWEEN.Interpolation.Linear,n=[],o=null,p=!1,q=null,r=null;for(b in a)c[b]=parseFloat(a[b],10);this.to=function(a,b){return void 0!==b&&(f=b),d=a,this},this.start=function(b){TWEEN.add(this),i=!0,p=!1,k=void 0!==b?b:"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now(),k+=j;for(var f in d){if(d[f]instanceof Array){if(0===d[f].length)continue;d[f]=[a[f]].concat(d[f])}c[f]=a[f],!1==c[f]instanceof Array&&(c[f]*=1),e[f]=c[f]||0}return this},this.stop=function(){return i?(TWEEN.remove(this),i=!1,this.stopChainedTweens(),this):this},this.stopChainedTweens=function(){for(var a=0,b=n.length;b>a;a++)n[a].stop()},this.delay=function(a){return j=a,this},this.repeat=function(a){return g=a,this},this.yoyo=function(a){return h=a,this},this.easing=function(a){return l=a,this},this.interpolation=function(a){return m=a,this},this.chain=function(){return n=arguments,this},this.onStart=function(a){return o=a,this},this.onUpdate=function(a){return q=a,this},this.onComplete=function(a){return r=a,this},this.update=function(b){var i;if(k>b)return!0;!1===p&&(null!==o&&o.call(a),p=!0);var s=(b-k)/f,s=s>1?1:s,t=l(s);for(i in d){var u=c[i]||0,v=d[i];v instanceof Array?a[i]=m(v,t):("string"==typeof v&&(v=u+parseFloat(v,10)),"number"==typeof v&&(a[i]=u+(v-u)*t))}if(null!==q&&q.call(a,t),1==s){if(!(g>0)){for(null!==r&&r.call(a),i=0,s=n.length;s>i;i++)n[i].start(b);return!1}isFinite(g)&&g--;for(i in e)"string"==typeof d[i]&&(e[i]+=parseFloat(d[i],10)),h&&(s=e[i],e[i]=d[i],d[i]=s),c[i]=e[i];k=b+j}return!0}},TWEEN.Easing={Linear:{None:function(a){return a}},Quadratic:{In:function(a){return a*a},Out:function(a){return a*(2-a)},InOut:function(a){return 1>(a*=2)?.5*a*a:-.5*(--a*(a-2)-1)}},Cubic:{In:function(a){return a*a*a},Out:function(a){return--a*a*a+1},InOut:function(a){return 1>(a*=2)?.5*a*a*a:.5*((a-=2)*a*a+2)}},Quartic:{In:function(a){return a*a*a*a},Out:function(a){return 1- --a*a*a*a},InOut:function(a){return 1>(a*=2)?.5*a*a*a*a:-.5*((a-=2)*a*a*a-2)}},Quintic:{In:function(a){return a*a*a*a*a},Out:function(a){return--a*a*a*a*a+1},InOut:function(a){return 1>(a*=2)?.5*a*a*a*a*a:.5*((a-=2)*a*a*a*a+2)}},Sinusoidal:{In:function(a){return 1-Math.cos(a*Math.PI/2)},Out:function(a){return Math.sin(a*Math.PI/2)},InOut:function(a){return.5*(1-Math.cos(Math.PI*a))}},Exponential:{In:function(a){return 0===a?0:Math.pow(1024,a-1)},Out:function(a){return 1===a?1:1-Math.pow(2,-10*a)},InOut:function(a){return 0===a?0:1===a?1:1>(a*=2)?.5*Math.pow(1024,a-1):.5*(-Math.pow(2,-10*(a-1))+2)}},Circular:{In:function(a){return 1-Math.sqrt(1-a*a)},Out:function(a){return Math.sqrt(1- --a*a)},InOut:function(a){return 1>(a*=2)?-.5*(Math.sqrt(1-a*a)-1):.5*(Math.sqrt(1-(a-=2)*a)+1)}},Elastic:{In:function(a){var b,c=.1;return 0===a?0:1===a?1:(!c||1>c?(c=1,b=.1):b=.4*Math.asin(1/c)/(2*Math.PI),-(c*Math.pow(2,10*(a-=1))*Math.sin(2*(a-b)*Math.PI/.4)))},Out:function(a){var b,c=.1;return 0===a?0:1===a?1:(!c||1>c?(c=1,b=.1):b=.4*Math.asin(1/c)/(2*Math.PI),c*Math.pow(2,-10*a)*Math.sin(2*(a-b)*Math.PI/.4)+1)},InOut:function(a){var b,c=.1;return 0===a?0:1===a?1:(!c||1>c?(c=1,b=.1):b=.4*Math.asin(1/c)/(2*Math.PI),1>(a*=2)?-.5*c*Math.pow(2,10*(a-=1))*Math.sin(2*(a-b)*Math.PI/.4):.5*c*Math.pow(2,-10*(a-=1))*Math.sin(2*(a-b)*Math.PI/.4)+1)}},Back:{In:function(a){return a*a*(2.70158*a-1.70158)},Out:function(a){return--a*a*(2.70158*a+1.70158)+1},InOut:function(a){return 1>(a*=2)?.5*a*a*(3.5949095*a-2.5949095):.5*((a-=2)*a*(3.5949095*a+2.5949095)+2)}},Bounce:{In:function(a){return 1-TWEEN.Easing.Bounce.Out(1-a)},Out:function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},InOut:function(a){return.5>a?.5*TWEEN.Easing.Bounce.In(2*a):.5*TWEEN.Easing.Bounce.Out(2*a-1)+.5}}},TWEEN.Interpolation={Linear:function(a,b){var c=a.length-1,d=c*b,e=Math.floor(d),f=TWEEN.Interpolation.Utils.Linear;return 0>b?f(a[0],a[1],d):b>1?f(a[c],a[c-1],c-d):f(a[e],a[e+1>c?c:e+1],d-e)},Bezier:function(a,b){var c,d=0,e=a.length-1,f=Math.pow,g=TWEEN.Interpolation.Utils.Bernstein;for(c=0;e>=c;c++)d+=f(1-b,e-c)*f(b,c)*a[c]*g(e,c);return d},CatmullRom:function(a,b){var c=a.length-1,d=c*b,e=Math.floor(d),f=TWEEN.Interpolation.Utils.CatmullRom;return a[0]===a[c]?(0>b&&(e=Math.floor(d=c*(1+b))),f(a[(e-1+c)%c],a[e],a[(e+1)%c],a[(e+2)%c],d-e)):0>b?a[0]-(f(a[0],a[0],a[1],a[1],-d)-a[0]):b>1?a[c]-(f(a[c],a[c],a[c-1],a[c-1],d-c)-a[c]):f(a[e?e-1:0],a[e],a[e+1>c?c:e+1],a[e+2>c?c:e+2],d-e)},Utils:{Linear:function(a,b,c){return(b-a)*c+a},Bernstein:function(a,b){var c=TWEEN.Interpolation.Utils.Factorial;return c(a)/c(b)/c(a-b)},Factorial:function(){var a=[1];return function(b){var c,d=1;if(a[b])return a[b];for(c=b;c>1;c--)d*=c;return a[b]=d}}(),CatmullRom:function(a,b,c,d,e){var a=.5*(c-a),d=.5*(d-b),f=e*e;return(2*b-2*c+a+d)*e*f+(-3*b+3*c-2*a-d)*f+a*e+b}}};