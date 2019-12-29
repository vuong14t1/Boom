var Coordinates = {
    pixelToTile: function (x) {
        if((x / GameConst.TILES_SIZE.width) < 0) return - 1;
        return parseInt(x / GameConst.TILES_SIZE.width)
    },

    tileToPixel: function (t) {
        return t * GameConst.TILES_SIZE.width
    }
};