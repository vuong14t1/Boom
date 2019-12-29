var Bomb = AnimatedEntity.extend({
    ctor: function (xt, yt, player, gameLogic) {
        this._super();
        this._player = player;
        this._gameLogic = gameLogic;
        this._x = Coordinates.tileToPixel(xt) + GameConst.TILES_SIZE.width / 2;
        this._y = Coordinates.tileToPixel(yt) + GameConst.TILES_SIZE.width / 2;
        this._timeToExplode = 5;
        this._timeHide = 3;
        this._sprite = new cc.Sprite("#img_bom0.png");
        this._directionExplosion = [];
        this._exploded = false;
        this._allowedToPassThru = true;
    },

    explosionAt: function (xt, yt) {
        for(var i = 0; i < this._directionExplosion.length; i++) {
            if (this._directionExplosion[i].explosionAt(xt, yt) != null) {
                return this._directionExplosion[i];
            }
         }
        return null;
    },

    update: function (dt) {
        this.animate(dt);
        if(this._timeToExplode <= 0 && !this._exploded) {
            this.explode();
        }else {
            this._timeToExplode -= dt;
        }

        if(this._exploded) {
            this._timeHide -= dt;
            if(this._timeHide <= 0) {
                this.removeExplosion();
            }
        }
    },

    removeExplosion: function () {
        for(var i = 0; i < this._directionExplosion.length; i++) {
            this._directionExplosion[i].removeExplosion();
        }
    },

    explode: function () {
        ZLog.error("explode bom");
        this._exploded = true;
        var xt = Coordinates.pixelToTile(this._x);
        var yt = Coordinates.pixelToTile(this._y);
        for(var i in GameConst.DIRECTION) {
            var direction = GameConst.DIRECTION[i];
            var directionExplosion = new DirectionExplosion(xt, yt, direction, this._player.getRadiusBom(), this._gameLogic);
            this._directionExplosion.push(directionExplosion);
        }
        this._player.addRateBom(1);
        this._player.removeBom(this);
    },

    collide: function (entity) {
        if(!this._exploded && entity instanceof Player) {
            var diffX = Math.abs(entity.getX() - this.getX());
            var diffY = Math.abs(entity.getY() - this.getY());
            if(diffX > GameConst.TILES_SIZE.width || diffY > GameConst.TILES_SIZE.width) {
                this._allowedToPassThru = false;
            }
            return !this._allowedToPassThru;
        }
        if(!this._exploded && entity instanceof DirectionExplosion) {
            this.explode();
        }
        return false;
    },
});