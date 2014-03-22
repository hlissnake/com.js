define(function(require, exports, module){

  var Com = require('../src/com/com')
  ,   Game = require('../src/matrix/game')   
  ;

  function Game() {
    this.player = null;
  }

  var Right = true;

  Game.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2
        , Gravity = 50
        ;

      var Velocity = {
          x : 400,
          y : -1000
      }

      this.group = new Com({
        
      });

      //  The platforms group contains the ground and the 2 ledges we can jump on
      this.rocks = this.add.group();
      //  Now let's create two ledges
      var rock = this.rocks.create(200, this.game.height - groundSpriteWidth - 128, 'player');
      rock.body.immovable = true;
      rock.scale.setTo(0,5, 1);

      rock = this.rocks.create(350, this.game.height - groundSpriteWidth - 128, 'player');
      rock.body.immovable = true;
      rock.scale.setTo(0,8, 0.8);

      this.player = this.add.sprite(0, this.game.height - 120, 'player');
      // this.player.body.setCircle(30);
      this.player.body.gravity.y = Gravity;
      this.player.body.velocity.x = Velocity.x;
      this.player.scale.x = 0.3;
      this.player.scale.y = 0.3;

      // this.Touch.add(this.jump, this);
      // var touchs = new Phaser.Touch({
      //   touchStartCallback : this.jumpHandler
      // });
      // touchs.start();
      this.input.Keyboard.addCallbacks(this, function(keyCode){
          if(keyCode == 36) this.jumpHandler(e);
      })//.add(this.jumpHandler, this);
    },

    update: function () {

      if( Right && (this.player.position.x + this.player.body.width)>= this.game.width) {
        this.player.body.velocity.x = -this.player.body.velocity.x;
        Right = false;
      } else if ( !Right && this.player.position.x <= 0) {
        this.player.body.velocity.x = -this.player.body.velocity.x;
        Right = true;
      }

      this.physics.collide(this.player, this.rocks, this.rockCollisionHandler, null, this);
      this.physics.collide(this.player, this.ground, this.groundCollisionHandler);
    },

    rockCollisionHandler : function(player, rock){
      alert('dead');
      this.game.state.start('menu');
    },

    groundCollisionHandler : function(player, rock){
      this.jumping = false;
    },

    jump: function () {
      if(!this.jumping) {
        this.jumping = true;
        this.player.body.Velocity.y = -1000;
      }
    }

  };

  window['tofu'] = window['tofu'] || {};
  window['tofu'].Game = Game;

}());
