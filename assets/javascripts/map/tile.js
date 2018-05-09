module.exports = function(image, type) {

    return new Tile(image, type);

}

module.exports.UNBLOCKED = 0;
module.exports.WALK = 1;
module.exports.SAIL = 2;    

module.exports.WALKING = 0;
module.exports.SAILING = 1; 

module.exports.BOAT = 0;
module.exports.AXE = 1;
module.exports.KEY = 2;
module.exports.DIAMOND = 3;
module.exports.GATE = 4;

module.exports.PLAYER = 0;

const UNBLOCKED = 0;
const BLOCKED = 1;

const WALKING = 0;
const ROWING = 1;

function Tile(image, type) {

    this._image = image;
    this._type = type;

};

Tile.prototype.getImage = function() {

    return this._image;

};

Tile.prototype.getType = function() {

    return this._type;

};
