#com.js
======

A Simple Canvas Object Module (COM) Library. foucs on Canvas Virtual display Object, render, event handle.
only support canvas2d graphic,not WebGL yet.

## com.js features

* provide virtual object managerment for canvas shape.
* include sprite sheet, animation, html events delegate and listen, 
* simple image assets loader, and a small time ticker object

# API
======

## loader
resource load. only include image

## timer
time ticker for game render loop

## com object
virtual canvas object. you can defines a shape object, set its properties,transform it, and render on canvas element

* config
* properties
* render
* clear
* on
* delegate

## sprite
inherited form com, play sprite animation accroding to spritesheet

* play
* stop

## spriteSheet
define a spritesheet instance, and restore the sprite frames data

## gesture
use hammer.js to handle gesture event and custom gesture


# sample


======

have fun to create graphic in canvas world
