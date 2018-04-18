/** 
 * Jewel Thief 
 * 
 * Electron 
 * 
 */
const $ = require('jquery');
const d3 = require('d3');

const $fileutil = require('./assets/javascripts/util/fileutil.js');
const $tile = require('./assets/javascripts/map/tile.js');

const tileSize = 20;
const originX = 190;
const originY = 190;
const gridSize = tileSize;

const WALK = 0;
const SAIL = 1;

const LEFT = 1;
const UP = 2;
const RIGHT = 3;
const DOWN = 4;

const FIELD = '1';
const FLOWER = '2';
const SNAG = '3';
const BOAT = '10';
const AXE = '11';
const KEY = '12';
const PLAYER = '13';
const DIAMOND = '14';
const GATE = '15';
const SHRUB = '21';
const TREE = '20';
const WATER = '22';

var map = [];
var mapSpritesSmall = [];
var mapSpritesLarge = [];
var itemSpritesSmall = [];
var itemSpritesLarge = [];
var playerSpritesLarge = [];

var start = null;

var startPos = {
    x:-1,
    y:-1 
}

var pos = {
    x:-1,
    y:-1
}

$('.reset').on('click', function(e) {

    resetMap(function() {   
        window.requestAnimationFrame(gameTicker);
    });

    return false;
  
});

$('.save').on('click', function(e) {

    var data = [];
  
    for (var xMap = 0; xMap < 40; xMap++) {
        var line = '';
        
        for (var yMap = 0; yMap < 40; yMap++) {
            var sprite = map[xMap][yMap];

            line += line.length == 0 ? sprite : ' ' + sprite;

        }

        line += (xMap < 40 - 1) ? "\r\n" : "";
        data.push(line);

    }
    var fileutil = new $fileutil(document);

    fileutil.saveAs(data, "level.map");

    return false;
    
});

$('.load').on('click', function(e) {
    var fileutil = new $fileutil(document);
 
    fileutil.load(function(files) {
        Array.prototype.slice.call(files).forEach(function(file) { 
            var fileURL = URL.createObjectURL(file);
            loadMap(fileURL, function() {
                pos = {
                    x:-1,
                    y:-1
                }
      
                var context = $('#canvas')[0].getContext('2d');
                
                contentFill(context); 
                waterFill(context);
                landFill(context);

           });
        
        });
        
    });

    return false;
  
});

$('.about').on('click', function(e) {

    $('.modal').css('display', 'block');

    return false;

});

$('.close').on('click', function(e) {

    $('.modal').css('display', 'none');

    return false;

});

$('.selectSnag').on('click', function(e) {

    setTile(SNAG);
    selectMenuItems(SNAG);

    return false;
  
});

$('.selectTree').on('click', function(e) {

    setTile(TREE);
    selectMenuItems(TREE);

    return false;
  
});

$('.selectWater').on('click', function(e) {

    setTile(WATER);
    selectMenuItems(WATER);

    return false;
  
});

$('.selectShrub').on('click', function(e) {

    setTile(SHRUB);
    selectMenuItems(SHRUB);

    return false;
  
});

$('.selectFlower').on('click', function(e) {

    setTile(FLOWER);
    selectMenuItems(FLOWER);

    return false;
  
});

$('.selectField').on('click', function(e) {

    setTile(FIELD);
    selectMenuItems(FIELD);

    return false;
  
});

$('.selectAxe').on('click', function(e) {

    setTile(AXE);
    selectMenuItems(AXE);

    return false;
  
});

$('.selectBoat').on('click', function(e) {

    setTile(BOAT);
    selectMenuItems(BOAT);
    return false;
  
});

$('.selectKey').on('click', function(e) {

    setTile(KEY);
    selectMenuItems(KEY);

    return false;
  
});

$('.selectPlayer').on('click', function(e) {

    setTile(PLAYER);
    selectMenuItems(PLAYER);
    
    return false;    
  
});

$('.selectDiamond').on('click', function(e) {

    setTile(DIAMOND);
    selectMenuItems(DIAMOND);

    return false;    
  
});
 
$('.selectGate').on('click', function(e) {

    setTile(GATE);
    selectMenuItems(GATE);

    return false;    
  
});


$('#canvas')[0].addEventListener('mousedown', function(evt) {

    var mousePos = getMousePos($('#canvas')[0], evt);

    startPos.x = mousePos.x;
    startPos.y = mousePos.y;  
   
}, false);

$('#canvas')[0].addEventListener("mousemove", function (evt) {

    if (startPos.x == -1 || startPos.y == -1) {
        return;
    }

    var mousePos = getMousePos($('#canvas')[0], evt);
    var context = $('#canvas')[0].getContext('2d');
    
    contentFill(context);
    waterFill(context);
    landFill(context);
    
    context.beginPath()
    context.strokeStyle = '#ff6347';
    context.rect(startPos.x, startPos.y, mousePos.x - startPos.x, mousePos.y - startPos.y);
    context.lineWidth = 5;
    context.stroke();  

}, false);

$('#canvas')[0].addEventListener('mouseup', function(evt) {
    var mousePos = getMousePos($('#canvas')[0], evt);
    var context = $('#canvas')[0].getContext('2d');

    contentFill(context);
    waterFill(context);
    landFill(context);

    if (startPos.x == mousePos.x && startPos.y == mousePos.y) {
       
        drawSelectionRect(context, mousePos.x, mousePos.y);
        
        pos.x = Math.floor(mousePos.x/tileSize);
        pos.y = Math.floor(mousePos.y/tileSize);
        
        selectMenuItems(map[pos.x][pos.y]);

    } else {  
        var rect = { x: 0,
                     y: 0,
                     w : 0,
                     h : 0};  
        
        for (var xMap = 0; xMap < 40; xMap++) {
            for (var yMap = 0; yMap < 40; yMap++) {
                 var x = xMap*tileSize;
                 var y = yMap*tileSize;

                if ((x > startPos.x && x+tileSize < mousePos.x) &&
                    (y > startPos.y && y+tileSize < mousePos.y)) {
                
                    rect.x =  x < rect.x || rect.w == 0 ? x : rect.x;
                    rect.y =  y < rect.y || rect.h == 0 ? y : rect.y;

                    rect.w = x + tileSize - rect.x > rect.w ? x + tileSize - rect.x : rect.w;
                    rect.h = y + tileSize - rect.y > rect.h ? y + tileSize - rect.y : rect.h;
                    
                    fillSelectionRect(context, x, y);
                
                }

            }
            
        } 

        drawSurroundingSelectionRect(context, rect.x, rect.y, rect.w, rect.h);
    
    }

    startPos.x = -1;
    startPos.y = -1;

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
    createSpriteBuffer(3, itemSpritesSmall, 'assets/images/diamond.gif', $tile.DIAMOND, 0, 0, 16, 16, 16, 16);
    createSpriteBuffer(4, itemSpritesSmall, 'assets/images/testtileset.gif', $tile.GATE, 48, 16, 16, 16, 16, 16);
    createSpriteBuffer(5, itemSpritesSmall, 'assets/images/playersprites.gif', $tile.PLAYER, 0, 0, 30, 30, 24, 24);

    createSpriteBuffer(0, itemSpritesLarge, 'assets/images/itemsLarge.gif', $tile.BOAT, 0, 32, 32, 32, 32, 32);
    createSpriteBuffer(1, itemSpritesLarge, 'assets/images/itemsLarge.gif', $tile.AXE, 32, 32, 32, 32, 32, 32);
    createSpriteBuffer(2, itemSpritesLarge, 'assets/images/itemsLarge.gif', $tile.KEY, 64, 32, 32, 32, 32, 32);
    createSpriteBuffer(3, itemSpritesLarge, 'assets/images/diamondLarge.gif', $tile.DIAMOND, 0, 0, 32, 32, 32, 32);
    createSpriteBuffer(4, itemSpritesLarge, 'assets/images/testtilesetlarge.gif', $tile.GATE, 96, 32, 32, 32, 32, 32);

    createSpriteBuffer(0, playerSpritesLarge, 'assets/images/playerSpritesLarge.gif', $tile.PLAYER, 0, 32, 32, 32, 32, 32);
  
    resetToolMenu();

    resetMap(function() {   
        window.requestAnimationFrame(gameTicker);
        
        window.addEventListener('keydown', doKeyDown, true);
        window.addEventListener('keyup', doKeyUp, true);

    });

});

/**
 * Load the Map
 * 
 * @param {Load the Map into Memory} uri 
 */
function loadMap(uri, callback) {
    
    map = [];

    $.get(uri, function(data) {
        var lines = data.split(/\r?\n/);
        for (var iLine in lines) {
            map.push(lines[iLine].split(/\s/));
        }

        callback();

    }, 'text');

}

/**
 * Load the Map
 * 
 * @param {Load the Map into Memory} uri 
 */
function resetMap(callback) {

    map = [];

    for (var xMap = 0; xMap < 40; xMap++) {
         var line = []  ;     
        for (var yMap = 0; yMap < 40; yMap++) {
            var cover = Math.floor((Math.random() * 100)) % 20;

            line.push((xMap == 0 || xMap == 39 || yMap == 0 || yMap == 39) ? '20' :
            (xMap == 19 && yMap == 19) ? PLAYER :         
            cover < 18 ?  '1' : cover == 18 ? FLOWER : SHRUB);

        }
        
        map.push(line);

    }

    callback();
 
}

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
        $(".gate").attr('src', itemSpritesLarge[4].getImage().toDataURL()); 

        $(".diamond").attr('src', itemSpritesLarge[3].getImage().toDataURL()); 
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
 * Set the Tile
 * 
 * @param {*} tile to set
 */
function setTile(tile) {
    map[pos.x][pos.y] = tile;

    var context = $('#canvas')[0].getContext('2d');

    contentFill(context);
    waterFill(context);
    landFill(context);

    drawSelectionRect(context, pos.x*tileSize, pos.y*tileSize);

}

/**
 * Draw the Surrounding Selection Rectangle
 * 
 * @param {*} context the Graphics Context
 * @param {*} x the 'X' coordinate
 * @param {*} y the 'Y' coordinate
 */
function drawSurroundingSelectionRect(context, x, y, w , h) {
    context.beginPath()
    context.strokeStyle = '#ff6347';

    context.rect(Math.floor(x/tileSize)*tileSize , Math.floor(y/tileSize)*tileSize, w, h);
    context.lineWidth = 5;
    context.stroke();   

}

/**
 * Draw the Selection Rectangle
 * 
 * @param {*} context the Graphics Context
 * @param {*} x the 'X' coordinate
 * @param {*} y the 'Y' coordinate
 */
function drawSelectionRect(context, x, y) {

    drawSurroundingSelectionRect(context, x,y, 24, 24);
    context.fillStyle = 'rgba(255, 99, 71, 0.2)';
    context.fillRect(Math.floor(x/tileSize)*tileSize , Math.floor(y/tileSize)*tileSize, 24, 24);
 
}

/**
 * Fill the Selection Rectangle
 * 
 * @param {*} context the Graphics Context
 * @param {*} x the 'X' coordinate
 * @param {*} y the 'Y' coordinate
 */
function fillSelectionRect(context, x, y) {
    context.fillStyle = 'rgba(255, 99, 71, 0.2)';
    context.fillRect(Math.floor(x/tileSize)*tileSize , Math.floor(y/tileSize)*tileSize, 24, 24);
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
            } else if (sprite == 15) {
                ctx.drawImage(itemSpritesSmall[4].getImage(), xMap * tileSize + 4, yMap * tileSize + 4);       
            } else if (sprite == 14) {
                ctx.drawImage(itemSpritesSmall[3].getImage(), xMap * tileSize + 4, yMap * tileSize + 4);        
            } else if (sprite == 12) {
                ctx.drawImage(itemSpritesSmall[2].getImage(), xMap * tileSize + 4, yMap * tileSize + 4);       
            } else if (sprite == 13) {
                ctx.drawImage(itemSpritesSmall[5].getImage(), xMap * tileSize + 4, yMap * tileSize + 4);       
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
    return sprite == TREE ? 1 : 
    (sprite == WATER || sprite == BOAT) ? 5 : 
    (sprite == FIELD || sprite == AXE || sprite == GATE || 
     sprite == DIAMOND || sprite == KEY || sprite == PLAYER) ? 6 : 
    (sprite == SNAG) ? 0 : 
    (sprite == FLOWER) ? 4 : 3;
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
 * Select Menu Items
 * 
 * @param {*} value the Cell Value - FIELD, TREE, KEY, etc
 */
function selectMenuItems(value)
{

    switch (value) {
        case FIELD:
            setMenuItems(true, true, true, true, true, false, false, true, true, true, true, true);
            break;
        case FLOWER:
            setMenuItems(true, true, true, true, false, true, false, false, false, false, false, false);
            break;
        case SNAG:
            setMenuItems(false, true, true, true, false, true, false, false, false, false, false, false);
            break;
        case BOAT:
            setMenuItems(true, true, true, true, true, true, false, false, false, false, false, false);
            break;        
        case AXE:
            setMenuItems(true, true, true, true, true, true, false, false, true, true, false, false);
            break;        
        case TREE:
            setMenuItems(true, false, true, true, true, false, false, false, false, false, false, false);
            break;
        case SHRUB:
            setMenuItems(true, true, true, false, true, true, false, false, false, false, false, false);
            break;
        case WATER:
            setMenuItems(true, true, false, true, true, true, true, false, false, false, false, false);
            break;

    }

}

/**
 * Reset the Tool Menu
 */
function resetToolMenu() {

    setMenuItems(false, false, false, false, false, false, false, false, false, false, false, false);

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
 * @param {*} diamond The diamond opacity
 * @param {*} gate The diamond opacity
 */
function setMenuItems(snag, tree, water, shrub, flower, field, boat, axe, key, player, diamond, gate ){
 
    $(".snag").css({ opacity: snag ? 1.0 : 0.5 });
    $(".tree").css({ opacity: tree ? 1.0 : 0.5 });
    $(".shrub").css({ opacity: shrub ? 1.0 : 0.5 });
    $(".flower").css({ opacity: flower ? 1.0 : 0.5 });
 
    $(".boat").css({ opacity: boat ? 1.0 : 0.5 });
    $(".axe").css({ opacity: axe ? 1.0 : 0.5 });
    $(".key").css({ opacity: key ? 1.0 : 0.5 });
    $(".player").css({ opacity: player ? 1.0 : 0.5 });
    $(".diamond").css({ opacity: diamond ? 1.0 : 0.5 });
    $(".gate").css({ opacity: gate ? 1.0 : 0.5 });

    $(".waterFiller").css("background-color", water ? "rgb(93,150,199)" : "rgb(141,180,216)");
    $(".fieldFiller").css("background-color", field ? "rgb(166,226,107)" : "rgb(177,231,126)");

}

/**
 * Detecting rectanlge overlap
 * 
 * @param {*} x1 'x' coordinate - rectangle 1 
 * @param {*} y1 'y' coordinate - rectangle 1 
 * @param {*} w1 'width' - rectangle 1 
 * @param {*} h1 'height' - rectangle 1 
 * @param {*} x2 'x' coordinate - rectangle 2 
 * @param {*} y2 'y' coordinate - rectangle 2
 * @param {*} w2 'width' - rectangle 2 
 * @param {*} h2 'height' - rectangle 2 
 */
function overlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    var dx = (x1 < x2) ? x1 + w1 - x2 : x2 + w2 - x1;
    if (dx < 0) return 0;
  
    var dy = (y1 < y2) ? y1 + h1 - y2 : y2 + h2 - y1;
    if (dy < 0) return 0;
  
    return dx * dy;
  
}