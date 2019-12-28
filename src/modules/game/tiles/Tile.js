var Tile = Entity.extend({
    ctor: function (tx, ty, sprite) {
        this._super();
        this._x = Coordinates.tileToPixel(tx) + GameConst.TILES_SIZE.width / 2;
        this._y = Coordinates.tileToPixel(ty) + GameConst.TILES_SIZE.width / 2;
        this._sprite = sprite;
    },

    collide: function () {
        return false;
    },

    update: function () {

    }
});