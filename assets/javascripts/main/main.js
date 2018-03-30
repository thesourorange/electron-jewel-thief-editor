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

var pos = {
    x:-1,
    y:-1
}

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

$('.selectSnag').on('click', function(e) {

    return false;
  
});

$('.selectTree').on('click', function(e) {

    return false;
  
});

$('.selectWater').on('click', function(e) {

    return false;
  
});

$('.selectShrub').on('click', function(e) {

    return false;
  
});

$('.selectFlower').on('click', function(e) {

    return false;
  
});

$('.selectField').on('click', function(e) {

    return false;
  
});

$('.selectAxe').on('click', function(e) {

    return false;
  
});

$('.selectBoat').on('click', function(e) {

    return false;
  
});

$('.selectKey').on('click', function(e) {

    return false;
  
});

$('.selectPlayer').on('click', function(e) {

    return false;
  
});
 
$('#canvas')[0].addEventListener('mouseup', function(evt) {
    var mousePos = getMousePos($('#canvas')[0], evt);
    var context = $('#canvas')[0].getContext('2d');

    contentFill(context);
    waterFill(context);
    landFill(context);
    
    context.beginPath()
    context.strokeStyle = '#ff6347';

    context.rect(Math.floor(mousePos.x/tileSize)*tileSize , Math.floor(mousePos.y/tileSize)*tileSize, 24, 24);

    pos.x = Math.floor(mousePos.x/tileSize);
    pos.y = Math.floor(mousePos.y/tileSize);
    
    selectMenuItems(map[pos.x][pos.y]);
  
    context.lineWidth = 5;
    context.stroke();   
     
}, false);

/**
 * Respond to the Document 'ready' event
 */
$(document).ready(function() {
 
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
  
    resetToolMenu();

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

    start =  (!start) ? timestamp : start;

    if (timestamp - start > 50) {
        var context = $('#canvas')[0].getContext('2d');

        $(".snag").attr('src', mapSpritesLarge[0].getImage().toDataURL()); 
        $(".tree").attr('src', mapSpritesLarge[1].getImage().toDataURL()); 
        $(".water").attr('src', mapSpritesLarge[2].getImage().toDataURL()); 
        $(".shrub").attr('src', mapSpritesLarge[3].getImage().toDataURL()); 
        $(".flower").attr('src', mapSpritesLarge[4].getImage().toDataURL()); 
        $(".field").attr('src', mapSpritesLarge[5].getImage().toDataURL()); 
 
        $(".axe").attr('src', itemSpritesLarge[1].getImage().toDataURL()); 
        $(".boat").attr('src', itemSpritesLarge[0].getImage().toDataURL()); 
        $(".key").attr('src', itemSpritesLarge[2].getImage().toDataURL()); 

        $(".player").attr('src', playerSpritesLarge[0].getImage().toDataURL()); 
        
        contentFill(context);
        waterFill(context);
        landFill(context);

    } else {
        window.requestAnimationFrame(gameTicker);
    }

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
 * Fill in the Context
 * 
 * @param {*} context the Canvas Context
 */
function contentFill(context) {
    context.fillStyle = '#a6e26b';
    context.fillRect(0, 0, 804, 804);
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

function selectMenuItems(value)
{

    switch (value) {
        case '1':
            setMenuItems(true, true, true, true, true, false, false, true, true, true);
            break;
        case '2':
            setMenuItems(true, true, true, true, true, true, true, false, true, true);
            break;
        case '3':
            setMenuItems(false, true, true, true, true, false, false, false, false, false);
            break;
        case '10':
            setMenuItems(true, true, true, true, true, true, false, false, false, false);
            break;        
        case '11':
            setMenuItems(true, true, true, true, true, true, false, false, true, true);
            break;        
        case '20':
            setMenuItems(true, true, true, true, true, false, false, false, false, false);
            break;
        case '22':
            setMenuItems(true, true, true, true, true, true, true, false, false, false);
            break;

    }

}

/**
 * Reset the Tool Menu
 */
function resetToolMenu() {

    setMenuItems(false, false, false, false, false, false, false, false, false, false);

}

/**
 * Process the Key Down Event
 * 
 * @param {*} snag 'true' the snag is selected
 * @param {*} tree 'true' the tree is selected
 * @param {*} water 'true' the water is selected
 * @param {*} shrub 'true' the shrub is selected
 * @param {*} flower 'true' the flower is selected  
 * @param {*} field 'true' the field is selected  
 * @param {*} boat 'true' the boat is selected
 * @param {*} axe 'true' the axe is selected
 * @param {*} key 'true' the key is selected
 * @param {*} player The player opacity
 */
function setMenuItems(snag, tree, water, shrub, flower, field, boat, axe, key, player){
 
    $(".snag").css({ opacity: snag ? 1.0 : 0.5 });
    $(".tree").css({ opacity: tree ? 1.0 : 0.5 });
    $(".shrub").css({ opacity: shrub ? 1.0 : 0.5 });
    $(".flower").css({ opacity: flower ? 1.0 : 0.5 });
 
    $(".boat").css({ opacity: boat ? 1.0 : 0.5 });
    $(".axe").css({ opacity: axe ? 1.0 : 0.5 });
    $(".key").css({ opacity: key ? 1.0 : 0.5 });
    $(".player").css({ opacity: player ? 1.0 : 0.5 });

    $(".waterFiller").css("background-color", water ? "rgb(93,150,199)" : "rgb(141,180,216)");
    $(".fieldFiller").css("background-color", field ? "rgb(166,226,107)" : "rgb(177,231,126)");

}

/**
 * Process the Key Down Event
 * 
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