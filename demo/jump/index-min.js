define(function(a){var b,c,d=a("com/com"),e=a("com/timer"),f=a("com/sprite"),g=a("com/spriteSheet"),h=a("com/loader"),i={runner:"./image/runner.png",hill:"./image/hill.png",sky:"./image/bg.png",blood:"./image/blood.png",ground:"./image/ground.png",start:"./image/start.png",over:"./image/over.png",arrow:"./image/arrow.png"},j=9.81,k=60,l=10,m=100,n=60,o=20,p=40*Math.random()+30,q=70,r=360/(Math.PI*p/70),s=80;return{score:0,calculateAccelerate:function(a,b,c){var d=a*b*l;c.x+=d,c.x<0?c.x=0:c.x>this.stage.width-c.width&&(c.x=this.stage.width-c.width),c.framerate=Math.abs(d)>1&&!c.Jumping?0:1,c.scaleX=d>=0?1:-1},hitTestCircle:function(a,b){var c={x:a.x+a.width/2,y:a.y+a.height/2,r:a.width/2},d={x:b.x+b.width/2,y:b.y+b.height/2,r:b.width/2},e=Math.sqrt(Math.pow(c.x-d.x,2)+Math.pow(c.y-d.y,2));return e<c.r+d.r},hitTestArrow:function(a,b){for(var c={x:a.x+a.width/2,y:a.y+a.height/2,r:a.width/2},d=0;d<b.length;d++){var e=b[d],f={x:e.x+e.width/2-e.tan*(e.height/2),y:e.y+e.height},g=Math.sqrt(Math.pow(c.x-f.x,2)+Math.pow(c.y-f.y,2));if(g<c.r)return!0}return!1},gameStart:function(){var a=this;a.gamePlaying=!0,a.score=0,c?(b.x=0,b.y=a.stage.height-60-90,b.die=!1,b.play("run"),b.visible=!0,c.x=-c.width):(c=new d({x:a.stage.width,y:a.stage.height-60-p,width:p,height:p,zIndex:300,backgroundImage:a.loader.get("ground"),shape:d.Shape.Circle,painter:d.Painter.Bitmap}).on("render:before",function(b){if(this.x<-this.width){this.x=a.stage.width+250*Math.random();var c=40*Math.random()+30;this.width=c,this.height=c,this.y=a.stage.height-60-c,r=360/(Math.PI*c/q)}else this.x-=(q+m)*b;this.rotate-=r*b}),a.stage.append(c))},init:function(){var a=this,l=document.getElementById("canvas");l.width=document.body.getBoundingClientRect().width,l.height=document.body.getBoundingClientRect().height;var p=new h(i),q=new d(l),r=new e;return a.stage=q,a.loader=p,p.on("complete",function(){function e(){for(var a=2*Math.ceil(q.width/320),b=0;a>b;b++){var c=new d({x:b*q.width,y:-58,width:13,height:58,zIndex:200,visible:!1,velocityY:0,backgroundImage:p.get("arrow"),shape:d.Shape.Rect,painter:d.Painter.Bitmap});q.append(c),E.push(c)}}function h(){D.text=a.score}function i(b,c){if(b.visible||(b.visible=!0),b.dropping){if(b.y==-b.height){var d,e=q.width*Math.random();b.x=q.width*Math.random(),d=(b.x-e)/(q.height-60-58),b.rotate=Math.atan(d)/Math.PI*180,b.tan=d}else b.y>q.height-60-58*Math.cos(b.rotate*Math.PI/180)&&(b.dropping=!1,b.hitLand=!0,a.gamePlaying&&a.score++);b.velocityY+=j*c*k;var f=b.velocityY*c;b.y+=f,b.x-=b.tan*f}else b.hitLand&&(b.x<-20?(b.dropping=!0,b.hitLand=!1,b.y=-b.height,b.velocityY=0):b.x-=m*c)}function t(a){for(var b=0;b<E.length;b++){var c=E[b];c.dropping=a,c.visible=a,a&&(c.velocityY=0,c.y=-c.height)}}function u(){b.visible=!1,B.visible=!0,C.visible=!0,a.gamePlaying=!1,t(!1),new TWEEN.Tween({y:0-C.height}).to({y:s},500).easing(TWEEN.Easing.Back.Out).onUpdate(function(){C.y=this.y}).start(),new TWEEN.Tween({x:0-B.width}).to({x:q.width/2-55},500).easing(TWEEN.Easing.Back.Out).onUpdate(function(){B.x=this.x}).start()}var v=document.getElementById("loading");v.style.display="none";var w={over:!0,jump:function(a){var b=this,c=a.y;if(b.over&&!a.die){var d=new TWEEN.Tween({y:c}).to({y:c-50},600).easing(TWEEN.Easing.Quintic.Out).onUpdate(function(){a.die&&(b.over=!0),a.y=this.y}),e=new TWEEN.Tween({y:c-50}).to({y:c},600).easing(TWEEN.Easing.Quartic.In).onUpdate(function(){a.die&&(b.over=!0),a.y=this.y,a.y==c&&(b.over=!0)});d.chain(e).start(),b.over=!1}}},x={over:!0,die:function(b,c){var d=this,e=b.y;if(d.over){b.Jumping=!1,b.stop();var f=new TWEEN.Tween({y:e}).to({y:e-30},500).easing(TWEEN.Easing.Quartic.Out).onUpdate(function(){b.y=this.y}),g=new TWEEN.Tween({y:e-30}).to({y:q.height},800).easing(TWEEN.Easing.Quartic.In).onUpdate(function(){b.y=this.y}).onComplete(function(){d.over=!0,c&&c.call(a)});f.chain(g).start(),d.over=!1}}},y=new d({width:q.width,height:q.height-60,backgroundImage:p.get("sky"),imagePositionX:0,backgroundRepeatX:!0,shape:d.Shape.Rect,painter:d.Painter.Bitmap}),z=new d({y:l.height-60,width:l.width,height:60,zIndex:202,backgroundImage:p.get("ground"),imagePositionX:0,backgroundRepeatX:!0,shape:d.Shape.Rect,painter:d.Painter.Bitmap}),A=new d({x:l.width*Math.random(),y:l.height-60-118,width:564,height:118,zIndex:20,backgroundImage:p.get("hill"),shape:d.Shape.Rect,painter:d.Painter.Bitmap}),B=new d({id:"start",x:q.width/2-55,y:140,width:110,height:60,backgroundImage:p.get("start"),shape:d.Shape.Rect,painter:d.Painter.Bitmap}),C=new d({id:"gameover",x:q.width/2-99,y:-50,width:198,height:50,visible:!1,zIndex:199,backgroundImage:p.get("over"),shape:d.Shape.Rect,painter:d.Painter.Bitmap}),D=new d({id:"score",x:q.width/2,y:240,width:60,height:50,text:0,fillColor:"white",font:"30px Palatino",visible:!1,shape:d.Shape.Rect,painter:d.Painter.Text}),E=[],F=new g({image:a.loader.get("blood"),frameData:{imgWidth:450,imgHeight:64,frameWidth:64,frameHeight:64,frameNum:6}}),G=new f({width:50,height:50,visible:!1,framerate:3,shape:d.Shape.Rect,painter:F}),H=new g({image:a.loader.get("runner"),frameData:{imgWidth:2048,imgHeight:2048,frameWidth:165,frameHeight:292,frameNum:64},animations:{run:{start:0,end:25,loop:!0},jump:{start:26,end:63},stand:{start:58,end:60,loop:!0}}});b=new f({x:50,y:a.stage.height-60-90,width:50,height:90,zIndex:400,shape:d.Shape.Rect,painter:H,loop:!0,autoPlay:!0}),q.append(y),q.append(z),q.append(A),q.append(b),q.append(G),q.append(B),q.append(C),q.append(D),e(),q.delegate("touchstart","",function(a){"start"!=a.targetCom.id&&(b.die||b.Jumping||(b.framerate=1,b.Jumping=!0,b.play("jump",function(){b.framerate=0,b.Jumping=!1,this.play("run")}),w.jump(b)))}),q.delegate("touchstart","start",function(){a.gameStart(),t(!0),new TWEEN.Tween({x:q.width/2-55}).to({x:0-B.width},500).easing(TWEEN.Easing.Back.Out).onUpdate(function(){B.x=this.x}).onComplete(function(){B.visible=!1}).start(),C.visible&&new TWEEN.Tween({y:s}).to({y:0-C.height},500).easing(TWEEN.Easing.Back.In).onUpdate(function(){C.y=this.y}).onComplete(function(){C.visible=!1}).start()});var I=0;window.addEventListener("deviceorientation",function(a){I=a.gamma});var J=0,K=!1;window.navigator.userAgent.match(/Android/)&&(K=!0),r.on("run",function(d){if(z.imagePositionX>=z.maxPositionX?z.imagePositionX=z.imagePositionX-z.maxPositionX:z.imagePositionX+=m*d,A.x=A.x<-A.width?q.width+60:A.x-n*d,y.imagePositionX>=y.maxPositionX?y.imagePositionX=0:y.imagePositionX+=o*d,TWEEN.update(),a.gamePlaying){D.visible=!0,b.die||a.calculateAccelerate(I,d,b);for(var e=0;e<E.length;e++)i(E[e],d);b.die||!a.hitTestArrow(b,E)&&!a.hitTestCircle(b,c)||(console.log("die"),b.die=!0,G.x=b.x-7,G.y=b.y+13,G.visible=!0,G.play("",function(){G.visible=!1}),x.die(b,function(){u()}))}h(),q.clear(),q.render(d),J+=d,J>1&&(J=0,fps.innerHTML="FPS:"+Math.floor(1/d))}).start()}),r}}});