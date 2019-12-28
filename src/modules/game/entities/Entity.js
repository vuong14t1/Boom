var Entity = cc.Class.extend({
    ctor: function () {
        this._x =  null;
        this._y = null;
        this._removed = false;
        this._sprite = null;
        this._uiBoard = null;
    },

    setUIBoard: function (uiBoard) {
        this._uiBoard = uiBoard;
    },

    remove: function () {
        this._removed = true;
    },

    isRemoved: function () {
        return this._removed;
    },

    render: function () {
        if(this._sprite && this._sprite.getParent() == null) {
            this._uiBoard.addChild(this._sprite);
        }
        this._sprite.setVisible(!this.isRemoved());
        this._sprite.setPosition(this._x, this._y);
    },

    getSprite: function () {
        return this._sprite;
    },

    collide: function (entity) {
        return true;
    },

    getXTile: function () {
        return Coordinates.pixelToTile(this._x);
    },

    getYTile: function () {
        return Coordinates.pixelToTile(this._y);
    },

    getX: function () {
        return this._x;
    },

    getY: function () {
        return this._y;
    },

    update: function () {

    }
});