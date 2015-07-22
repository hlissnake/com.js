# com.js
======

A Virtual Display Object Library for html5 canvas basic graphic. Developers can manager their own graphic objects just like DOM in html, so I can it "Canvas Object Module (COM)". It is easy to build your html5 game or animation by Com.js.

Only supports canvas2d graphic currently, using global namespace to manager multiple modules.

## Features

* Provides `virtual object` managerment for canvas basic graphic shapes.
* Implemented a `Vistual Event System` similar to DOM Event Model. Using `binary tree recursion algorithm` to find the target child which trigger the current event.
* Including sprite sheet, animation, delegate events and assets loader,
* `Debug` mode. add "_debug_" on your url search and Com.js will paint your object's border.

## API
======

* `Loader` : loading resources. only include image right now.

* `Timer` : the ticker for game render loop. It is the core part of the game applications. run at 60 fps as default.

* `Com` : Core Class in the library. It's the virtual object base class. you can defines it as a shape object, or extend it as a sprite object. 

	* `Shape` implemention to render the outline shape such as Circle, Rectangle to your COM objects.
	* `Painter` implemention to render the particular context, like Text, Bitmap. 
	* `Transform` similar to CSS3 transform. support skew effect.
	* `render` callback function before/after rendering on the canvas context.
	* `clear` remove the object display form canvas context.
	* `on` : pure event listener.
	     * it will trigger only on the current com object, not include children targets in event object.
		 * By doing this, it will aviod the findTarget external recursion to improve the performance
	* `delegate` 
		 * For html events only, not observer events.
		 * Delegate the children coms event. include the target children com.
				
* `Sprite` : inherited form Com. Focus on playing sprite animation accroding to spritesheet
	* play
	* stop

* `SpriteSheet` : Define a spritesheet instance, and restore the sprite frames data

## Sample

* `Running Boy`. Can you survive beside the deadly arrows and rocks? [https://hlissnake.github.io](http://hlissnake.github.io/)

* `Jumping Ball`. First product in real application environment. Be published in Laiwang Hybrid App. It is a funny game, very easy to control. Tilt your mobile device to move your ball: [http://h5.m.taobao.com/laiwang/game/jump/index.html](http://h5.m.taobao.com/laiwang/game/jump/index.html)

======

have fun to create fascinating graphics in web canvas world

## Todo list

* Support CommonJS module style and publish to npm, I suppose to build it by webpack.
* Improve the tree recursion algorithm in the Event System.
* WebGL for practice.
* Describable UI Definition (like React JSX). Can be easy to build basic UI not animation or game.
