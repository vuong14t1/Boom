var Explosion = Entity.extend({
    ctor: function (xt, yt, direction, isLast) {
        this._super();
        this._x = Coordinates.tileToPixel(xt) + GameConst.TILES_SIZE.width / 2;
        this._y = Coordinates.tileToPixel(yt) + GameConst.TILES_SIZE.width / 2;
        this._direction = direction;
        this._isLast = isLast;
    },

    render: function () {
        this._createSprite();
        this._super();
    },

    _createSprite: function () {
        if(this._sprite == null) {
            this._sprite = new cc.Sprite("#img_explosion_12.png");
        }
        this._sprite.setFlippedX(false);
        this._sprite.setRotation(0);
        if(this._isLast) {
            this._sprite.setSpriteFrame("img_explosion_12.png");
        }else {
            this._sprite.setSpriteFrame("img_explosion_11.png");
        }

        switch (this._direction) {
            case GameConst.DIRECTION.LEFT:
                this._sprite.setFlippedX(true);
                break;
            case GameConst.DIRECTION.UP:
                this._sprite.setRotation(-90);
                break;
            case GameConst.DIRECTION.DOWN:
                this._sprite.setRotation(90);
                break;
        }
    },

    collide: function (entity) {
        if(entity instanceof Mob) {
            entity.kill();
        }
        return entity != null;
    },

});