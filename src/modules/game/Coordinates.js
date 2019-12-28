var Coordinates = {
    pixelToTile: function (x) {
        return parseInt(x / GameConst.TILES_SIZE.width)
    },

    tileToPixel: function (t) {
        return t * GameConst.TILES_SIZE.width
    }
};