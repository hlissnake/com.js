define(function(require, exports, module){
	var Com = require('com/com')
	, 	Timer = require('com/timer')
	, 	Loader = require('com/loader')
	;

	var assetsMap = {
		'universe' : './image/universe.jpg'
	};


	var hitTestCircle = function(comA, comB){
		var centerA = {
				x : comA.x + comA.width / 2,
				y : comA.y + comA.height / 2,
				r : comA.width / 2
			}
		,	centerB = {
				x : comB.x + comB.width / 2,
				y : comB.y + comB.height / 2,
				r : comB.width / 2
			}
		,	distance = Math.sqrt(Math.pow(centerA.x - centerB.x, 2) + Math.pow(centerA.y - centerB.y, 2))
		;
		return distance < centerA.r + centerB.r;
	}

	return {

		init : function(){

			var Game = this;

			var canvas = document.getElementById('canvas');
			canvas.width = document.body.getBoundingClientRect().width;
			canvas.height = document.body.getBoundingClientRect().height;	

			var loader = new Loader(assetsMap)
			,	stage = new Com(canvas)
			,	timer = new Timer()
			;

			var SunRadius = 40
			,	OriginCircleRadius = 100 + SunRadius / 2
			,	cricleRadius = OriginCircleRadius
			,	OriginCircleTime = 6
			,	PlanetVelocity = Math.PI * 2 * 100 / OriginCircleTime
			,	PlantMass = 100
			,	Sun_Gravity_Force = PlantMass * PlanetVelocity * PlanetVelocity / OriginCircleRadius
			,	Min_Gravity_Force = PlantMass * PlanetVelocity * PlanetVelocity / (stage.height / 2 - SunRadius / 2)
			,	increaseGravityForce = false;
			;

			loader.on('complete', function(status, img){

				var bg = new Com({
						width : stage.width,
						height : stage.height,
						backgroundImage : loader.get('universe'),
						shape : Com.Shape.Rect,
						painter : Com.Painter.Bitmap
					})
				,	sun = new Com({
						x : stage.width / 2 - SunRadius / 2,
						y : stage.height / 2 - SunRadius / 2,
						width : SunRadius,
						height : SunRadius,
						// backgroundImage : Game.loader.get('ground')
						fillColor : 'gold',
						shape : Com.Shape.Circle//,
						// painter : Com.Painter.Bitmap
					})
				,	planet = new Com({
						width : 20,
						height : 20,
						circleRotate : 0,
						fillColor : 'blue',
						// backgroundImage : Game.loader.get('ground')
						shape : Com.Shape.Circle
					})
				,	circle = new Com({
						x : stage.width / 2 - OriginCircleRadius,
						y : stage.height / 2 - OriginCircleRadius,
						width : OriginCircleRadius * 2,
						height : OriginCircleRadius * 2,
						fillColor : 'rgba(0,0,0,0)',
						strokeColor : '#000',
						shape : Com.Shape.Circle//,
					})
				;

				stage.append(bg);
				// stage.append(circle);
				stage.append(sun);
				stage.append(planet);

				addMassEnergy();

				sun.on('touchstart', function(e){
					increaseGravityForce = true;
				})

				sun.on('touchend', function(e){
					increaseGravityForce = false;
				});

				var FPS_TOTAL = 0;

				var center = {
					x : stage.width/2,
					y : stage.height/2
				};
				addMassEnergy()

				timer.on('run', function(dt){

					var forceAccrelarate = 4000 / cricleRadius;

					if(increaseGravityForce) {
						Sun_Gravity_Force += forceAccrelarate; 
					} else {
						Sun_Gravity_Force -= forceAccrelarate;
					}
					if(Sun_Gravity_Force < Min_Gravity_Force) {
						Sun_Gravity_Force = Min_Gravity_Force;
						console.log('lose');
					}
					cricleRadius = PlanetVelocity * PlanetVelocity / Sun_Gravity_Force * PlantMass;
					var CircleVelocity = PlanetVelocity / cricleRadius;
					if( planet.circleRotate > Math.PI * 2 ){
						planet.circleRotate = 0;
					} else {
						planet.circleRotate += CircleVelocity * dt;
					}

					circle.x = center.x - cricleRadius;
					circle.y = center.y - cricleRadius;
					circle.width = cricleRadius * 2;
					circle.height = cricleRadius * 2;
					planet.x = center.x + Math.sin(planet.circleRotate) * cricleRadius - planet.width/2;
					planet.y = center.y - Math.cos(planet.circleRotate) * cricleRadius - planet.height/2; console.log(cricleRadius)

					// var r = calculateCircleRadius();

					stage.clear();
					stage.render(dt);

					FPS_TOTAL += dt;
					if(FPS_TOTAL > 1) {
						FPS_TOTAL = 0;
						fps.innerHTML = 'FPS:' + Math.floor(1/dt);
					}

				}).start();

				function addMassEnergy(){
					var len = Math.ceil(Math.random() * 3);
					for(var i = 0; i < len; i++){
						var energy = new Com({
							x : Math.random() * stage.width,
							y : Math.random() * stage.height,
							width : 15,
							height : 15,
							fillColor : 'gold',
							shape : Com.Shape.Circle//,
						}).on('render:before', function(){
							if(hitTestCircle(this, planet)) {
								this.x = Math.random() * stage.width;
								this.y = Math.random() * stage.width;
								// PlanetVelocity += 20;
								planet.fillColor = planet.fillColor == 'blue'? 'green' : 'blue';
							}
						});

						stage.append(energy);
					}
				}

			});

			return timer;
	
		}
	}

});	