/** 
 * Jewel Thief 
 * 
 * Electron 
 * 
 */
const $ = require('jquery');
const d3 = require('d3');

const $tile = require('./assets/javascripts/map/tile.js');

const tileSize = 38;
const originX = 190;
const originY = 190;
const gridSize = tileSize;

const WALK = 0;
const SAIL = 1;

const BOAT = 10;
const AXE = 11;
const WATER = 22;

const LEFT = 1;
const UP = 2;
const RIGHT = 3;
const DOWN = 4;

var map = [];
var mapSprites = [];
var playerSprites = [];
var itemSprites = [];

$.get('assets/maps/basic.map', function(data) {
    var lines = data.split(/\r?\n/);
    for (var iLine in lines) {
        map.push(lines[iLine].split(/\s/));
     }
}, 'text');

/**
 * Respond to the Document 'ready' event
 */
$(document).ready(function() {
    var context = $('#canvas')[0].getContext('2d');
 
    createSpriteBuffer(0, mapSprites, 'assets/images/testtileset.gif', $tile.BLOCKED, 32, 32, 32, 32, 32, 32);
    createSpriteBuffer(1, mapSprites, 'assets/images/testtileset.gif', $tile.BLOCKED, 0, 32, 32, 32, 32, 32);
    createSpriteBuffer(2, mapSprites, 'assets/images/testtileset.gif', $tile.BLOCKED, 64, 32, 32, 32, 32, 32);
    createSpriteBuffer(3, mapSprites, 'assets/images/testtileset.gif', $tile.WALK, 64, 0, 32, 32, 32, 32);
    createSpriteBuffer(4, mapSprites, 'assets/images/testtileset.gif', $tile.WALK, 96, 0, 32, 32, 32, 32);
    createSpriteBuffer(5, mapSprites, 'assets/images/testtileset.gif', $tile.SAIL, 128, 0, 32, 32, 32, 32);
    createSpriteBuffer(6, mapSprites, 'assets/images/testtileset.gif', $tile.WALK, 0, 0, 32, 32, 32, 32);
 
    var pos = 0;
    for (var iSprite = 0; iSprite < 4; iSprite++) {
        createSpriteBuffer(pos++, playerSprites, 'assets/images/playersprites.gif', $tile.WALKING, 0, 24*iSprite, 24, 24, 24, 24);
        createSpriteBuffer(pos++, playerSprites, 'assets/images/playersprites.gif', $tile.WALKING, 24, 24*iSprite, 24, 24, 24, 24); 
    }

    for (var iSprite = 4; iSprite < 10; iSprite++) {
        createSpriteBuffer(pos++, playerSprites, 'assets/images/playersprites.gif', $tile.SAILING, 0, 24*iSprite, 24, 24, 24, 24);
        createSpriteBuffer(pos++, playerSprites, 'assets/images/playersprites.gif', $tile.SAILING, 24, 24*iSprite, 24, 24, 24, 24); 
    }

    createSpriteBuffer(0, itemSprites, 'assets/images/items.gif', $tile.BOAT, 0, 24, 24, 24, 24, 24);
    createSpriteBuffer(1, itemSprites, 'assets/images/items.gif', $tile.AXE, 24, 24, 24, 24, 24, 24);
    createSpriteBuffer(2, itemSprites, 'assets/images/items.gif', $tile.KEY, 48, 24, 24, 24, 24, 24);

    image.onload = function() {

        context.drawImage(image, 0, 0, this.width, this.height, 0, 20, 384, 384);
        $(".controls").html("&nbsp;Time: 100 - (" + (tilePos.x + 5) + "," +  (tilePos.y + 5) + ")");
  
    }     
  
    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', doKeyUp, true);

});

/**
 * Create an off-screen buffer containg an image
 * 
 * @param {*} sprite the Sprite Index
 * @param {*} sprites the Sprite Array
 * @param {*} src the Tile Map
 * @param {*} type the Type of Tile
 * @param {*} x the x coordinate - within the sprite map
 * @param {*} y the y coordinate - within the sprite map
 * @param {*} w the sprite width
 * @param {*} h the sprite height
 * @param {*} dw the destination width
 * @param {*} dh the destination height
 */
function createSpriteBuffer(sprite, sprites, src, type, x, y, w, h, dw, dh) {
    var canvas = document.createElement('canvas');
    canvas.width = dw;
    canvas.height = dh;

    var image = new Image();
    image.src = src;
    image.onload = function() {
        var context = canvas.getContext('2d');

        context.drawImage(image, x, y, w, h, 0, 0, dw, dh);
        
        sprites[sprite] = new $tile(canvas, type);

    }

}

/**
 * Process the Key Down Event
 * @param {*} event The Keyboard Event
 */
function doKeyDown(event) {

    switch (event.keyCode) {
        case 37:  /* Left arrow was pressed */
            direction = 1;
        break;
        case 38:  /* Up arrow was pressed */
            direction = 2;
        break;
        case 39:  /* Right arrow was pressed */
            direction = 3;
        break;
        case 40:  /* Down arrow was pressed */
            direction = 4;
        break;
    }    

}

/**
 * Process the Key Up Event
 * @param {*} event The Keyboard Event
 */
function doKeyUp(event) {

    switch (event.keyCode) {
        case 37:  /* Left arrow was pressed */
            direction = -1;
        break;
        case 38:  /* Up arrow was pressed */
            direction = -2;
        break;
        case 39:  /* Right arrow was pressed */
            direction = -3;
        break;
        case 40:  /* Down arrow was pressed */
            direction = -4;
        break;
    }    

}