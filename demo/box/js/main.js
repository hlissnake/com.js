window.onload = function () {
  'use strict';

  	var game
    , ns = window['tofu'];

  	var width = document.body.getBoundingClientRect().width
	,	height = document.body.getBoundingClientRect().height
	;

  game = new Phaser.Game(width, height, Phaser.AUTO, 'tofu-game', null, true);
  // game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);

  game.state.start('preloader');
};
