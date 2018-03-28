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
var mapSpritesSmall = [];
var mapSpritesLarge = [];
var itemSpritesSmall = [];
var itemSpritesLarge = [];
var playerSpritesLarge = [];

var start = null;
var context = null;

$.get('assets/maps/basic.map', function(data) {
    var lines = data.split(/\r?\n/);
    for (var iLine in lines) {
        map.push(lines[iLine].split(/\s/));
     }
}, 'text');

$('.reset').on('click', function(e) {

    return false;
  
});

$('.save').on('click', function(e) {

    return false;
  
});

$('.load').on('click', function(e) {

    return false;
  
});

$('.snag').on('click', function(e) {

    return false;
  
});

$('.tree').on('click', function(e) {

    return false;
  
});

$('.water').on('click', function(e) {

    return false;
  
});

$('.shrub').on('click', function(e) {

    return false;
  
});

$('.flower').on('click', function(e) {

    return false;
  
});

$('.field').on('click', function(e) {

    return false;
  
});

$('.axe').on('click', function(e) {

    return false;
  
});

$('.boat').on('click', function(e) {

    return false;
  
});

$('.key').on('click', function(e) {

    return false;
  
});

$('.player').on('click', function(e) {

    return false;
  
});

/**
 * Respond to the Document 'ready' event
 */
$(document).ready(function() {

   context = $('#canvas')[0].getContext('2d');
 
    createSpriteBuffer(0, mapSpritesSmall, 'assets/images/testtileset.gif', $tile.BLOCKED, 16, 16, 16, 16, 16, 16);
    createSpriteBuffer(1, mapSpritesSmall, 'assets/images/testtileset.gif', $tile.BLOCKED, 0, 16, 16, 16, 16, 16);
    createSpriteBuffer(2, mapSpritesSmall, 'assets/images/testtileset.gif', $tile.BLOCKED, 32, 16, 16, 16, 16, 16);
    createSpriteBuffer(3, mapSpritesSmall, 'assets/images/testtileset.gif', $tile.WALK, 32, 0, 16, 16, 16, 16);
    createSpriteBuffer(4, mapSpritesSmall, 'assets/images/testtileset.gif', $tile.WALK, 48, 0, 16, 16, 16, 16);
    createSpriteBuffer(5, mapSpritesSmall, 'assets/images/testtileset.gif', $tile.SAIL, 64, 0, 16, 16, 16, 16);
    createSpriteBuffer(6, mapSpritesSmall, 'assets/images/testtileset.gif', $tile.WALK, 16, 0, 16, 16, 16, 16);

    createSpriteBuffer(0, mapSpritesLarge, 'assets/images/testtilesetlarge.gif', $tile.BLOCKED, 32, 32, 32, 32, 32, 32);
    createSpriteBuffer(1, mapSpritesLarge, 'assets/images/testtilesetlarge.gif', $tile.BLOCKED, 0, 32, 32, 32, 32, 32);
    createSpriteBuffer(2, mapSpritesLarge, 'assets/images/testtilesetlarge.gif', $tile.BLOCKED, 64, 32, 32, 32, 32, 32);
    createSpriteBuffer(3, mapSpritesLarge, 'assets/images/testtilesetlarge.gif', $tile.WALK, 64, 0, 32, 32, 32, 32);
    createSpriteBuffer(4, mapSpritesLarge, 'assets/images/testtilesetlarge.gif', $tile.WALK, 96, 0, 32, 32, 32, 32);
    createSpriteBuffer(5, mapSpritesLarge, 'assets/images/testtilesetlarge.gif', $tile.SAIL, 128, 0, 32, 32, 32, 32);
    createSpriteBuffer(6, mapSpritesLarge, 'assets/images/testtilesetlarge.gif', $tile.WALK, 0, 0, 32, 32, 32, 32);
 
    createSpriteBuffer(0, itemSpritesSmall, 'assets/images/items.gif', $tile.BOAT, 0, 16, 16, 16, 16, 16);
    createSpriteBuffer(1, itemSpritesSmall, 'assets/images/items.gif', $tile.AXE, 16, 16, 16, 16, 16, 16);
    createSpriteBuffer(2, itemSpritesSmall, 'assets/images/items.gif', $tile.KEY, 32, 16, 16, 16, 16, 16);

    createSpriteBuffer(0, itemSpritesLarge, 'assets/images/itemsLarge.gif', $tile.BOAT, 0, 32, 32, 32, 32, 32);
    createSpriteBuffer(1, itemSpritesLarge, 'assets/images/itemsLarge.gif', $tile.AXE, 32, 32, 32, 32, 32, 32);
    createSpriteBuffer(2, itemSpritesLarge, 'assets/images/itemsLarge.gif', $tile.KEY, 64, 32, 32, 32, 32, 32);

    createSpriteBuffer(0, playerSpritesLarge, 'assets/images/playerSpritesLarge.gif', $tile.KEY, 0, 32, 32, 32, 32, 32);
  
  
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

        $(".snag").attr('src', mapSpritesLarge[0].getImage().toDataURL()); 
        $(".tree").attr('src', mapSpritesLarge[1].getImage().toDataURL()); 
        $(".water").attr('src', mapSpritesLarge[2].getImage().toDataURL()); 
        $(".shrub").attr('src', mapSpritesLarge[3].getImage().toDataURL()); 
        $(".flower").attr('src', mapSpritesLarge[4].getImage().toDataURL()); 
        $(".field").attr('src', mapSpritesLarge[6].getImage().toDataURL()); 

        $(".axe").attr('src', itemSpritesLarge[0].getImage().toDataURL()); 
        $(".boat").attr('src', itemSpritesLarge[1].getImage().toDataURL()); 
        $(".key").attr('src', itemSpritesLarge[2].getImage().toDataURL()); 

        $(".player").attr('src', playerSpritesLarge[0].getImage().toDataURL()); 

        waterFill(context);
        landFill(context);

    }
    
    $('#canvas')[0].addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos($('#canvas')[0], evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    }, false);

    window.requestAnimationFrame(gameTicker);

} 

/**
 * Get the Canvas Mouse Position
 * 
 * @param {*} canvas the Canvas
 * @param {*} evt the Mouse Event 
 */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/**
 * Fill in the Land
 * 
 * @param {*} ctx the Canvas Context
 */
function landFill(ctx) {
    for (var xMap = 0; xMap < 40; xMap++) {
                
        for (var yMap = 0; yMap < 40; yMap++) {
            var sprite = map[xMap][yMap];
            
            var tile = mapSpritesSmall[translate(sprite)];

            ctx.drawImage(tile.getImage(), xMap * tileSize + 4, yMap * tileSize + 4); 
            
            if (sprite == 10) {
                ctx.drawImage(itemSpritesSmall[0].getImage(), xMap * tileSize + 4, yMap * tileSize + 4);                    
            } else if (sprite == 11) {
                ctx.drawImage(itemSpritesSmall[1].getImage(), xMap * tileSize + 4, yMap * tileSize + 4);       
            } 
            
        }  

    }

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