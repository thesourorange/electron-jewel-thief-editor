/** 
 * Jewel Thief 
 * 
 * Electron 
 * 
 */
const $ = require('jquery');
const d3 = require('d3');

const $tile = require('./assets/javascripts/map/tile.js');

const tileSize = 20;
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
var itemSprites = [];

var start = null;
var context = null;

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

   context = $('#canvas')[0].getContext('2d');
 
    createSpriteBuffer(0, mapSprites, 'assets/images/testtileset.gif', $tile.BLOCKED, 16, 16, 16, 16, 16, 16);
    createSpriteBuffer(1, mapSprites, 'assets/images/testtileset.gif', $tile.BLOCKED, 0, 16, 16, 16, 16, 16);
    createSpriteBuffer(2, mapSprites, 'assets/images/testtileset.gif', $tile.BLOCKED, 32, 16, 16, 16, 16, 16);
    createSpriteBuffer(3, mapSprites, 'assets/images/testtileset.gif', $tile.WALK, 32, 0, 16, 16, 16, 16);
    createSpriteBuffer(4, mapSprites, 'assets/images/testtileset.gif', $tile.WALK, 48, 0, 16, 16, 16, 16);
    createSpriteBuffer(5, mapSprites, 'assets/images/testtileset.gif', $tile.SAIL, 64, 0, 16, 16, 16, 16);
    createSpriteBuffer(6, mapSprites, 'assets/images/testtileset.gif', $tile.WALK, 16, 0, 16, 16, 16, 16);

    createSpriteBuffer(0, itemSprites, 'assets/images/items.gif', $tile.BOAT, 0, 16, 16, 16, 16, 16);
    createSpriteBuffer(1, itemSprites, 'assets/images/items.gif', $tile.AXE, 16, 16, 16, 16, 16, 16);
    createSpriteBuffer(2, itemSprites, 'assets/images/items.gif', $tile.KEY, 32, 16, 16, 16, 16, 16);
  
 
    window.requestAnimationFrame(gameTicker);
  
    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', doKeyUp, true);

});

/**
 * The Game Loop
 * 
 * @param {*} timestamp 
 */
function gameTicker(timestamp) {

    context.fillStyle = '#a6e26b';
    context.fillRect(0, 0, 804, 804);
    
    start =  (!start) ? timestamp : start;

    if (timestamp - start > 50) {

        waterFill(context);

        for (var xMap = 0; xMap < 40; xMap++) {
            
            for (var yMap = 0; yMap < 40; yMap++) {
                var sprite = map[xMap][yMap];
                
                var tile = mapSprites[translate(sprite)];

                context.drawImage(tile.getImage(), xMap * tileSize + 4, yMap * tileSize + 4); 
                
                if (sprite == 10) {
                    context.drawImage(itemSprites[0].getImage(), xMap * tileSize + 4, yMap * tileSize + 4);                    
                } else if (sprite == 11) {
                    context.drawImage(itemSprites[1].getImage(), xMap * tileSize + 4, yMap * tileSize + 4);       
                } 
                  
            }  

        }

    }
    
    window.requestAnimationFrame(gameTicker);

} 

/**
 * Fill in the Water
 * 
 * @param {*} ctx the Canvas Context
 */
function waterFill(ctx) {
    
    for (var xMap = 0; xMap < 40; xMap++) {
        for (var yMap = 0; yMap < 40; yMap++) {
            var sprite = map[xMap][yMap];

            if (sprite == 22 || sprite == 10) {
                ctx.fillStyle="#185d99";
                ctx.fillRect(xMap * tileSize, yMap * tileSize, 24 ,24);
            }

        }

    }

}

/**
 * Translate the sprite from the map
 * 
 * @param {*} sprite to translate
 */
function translate(sprite) {
    return sprite == 20 ? 1 : (sprite == 22 || sprite == 10) ? 5 : (sprite == 1 || sprite == 11) ? 6 : (sprite==3) ? 0 : (sprite==2) ? 4 : 3;
}

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