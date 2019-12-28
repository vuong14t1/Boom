var WallTile = Tile.extend({
    ctor: function (xt, yt){
        var sprite = new cc.Sprite("#img_wall.png");
        this._super(xt, yt, sprite);
    },

    collide: function (entity) {
        return true;
    }
});