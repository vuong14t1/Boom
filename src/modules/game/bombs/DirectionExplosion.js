var DirectionExplosion = Entity.extend({
    ctor: function (xt, yt, direction, radius, gameLogic) {
        this._super();
        this._x = Coordinates.tileToPixel(xt) + GameConst.TILES_SIZE.width / 2;
        this._y = Coordinates.tileToPixel(yt) + GameConst.TILES_SIZE.width / 2;
        this._xt = xt;
        this._yt = yt;
        this.gameLogic = gameLogic;
        this._direction = direction;
        this._radius = radius;
        this._explosions = [];
        this.createExplosions();
        this.render();
    },

    calculatePermitedDistance: function () {
        var xtStart = this._xt;
        var ytStart = this._yt;
        var radius = 0;
        while (radius < this._radius) {
            if(this._direction === GameConst.DIRECTION.UP) ytStart ++;
            if(this._direction === GameConst.DIRECTION.DOWN) ytStart --;
            if(this._direction === GameConst.DIRECTION.RIGHT) xtStart ++;
            if(this._direction === GameConst.DIRECTION.LEFT) xtStart --;
            var entity = this.gameLogic.getEntity(xtStart, ytStart);
            if(entity && entity instanceof Mob) {
                radius ++;
            }
            if(entity && entity.collide(this)) {
                break;
            }
            radius ++;
        }
        return radius;
    },

    createExplosions: function () {
        var length = this.calculatePermitedDistance();
        var xtStart = this._xt;
        var ytStart = this._yt;
        for(var i = 0; i < length; i ++) {
            var isLast = i === length - 1;
            if(this._direction === GameConst.DIRECTION.UP) ytStart ++;
            if(this._direction === GameConst.DIRECTION.DOWN) ytStart --;
            if(this._direction === GameConst.DIRECTION.RIGHT) xtStart ++;
            if(this._direction === GameConst.DIRECTION.LEFT) xtStart --;
            var explosion = new Explosion(xtStart, ytStart, this._direction, isLast);
            this._explosions.push(explosion);
        }
    },

    explosionAt: function (xt, yt) {
        for(var i = 0; i < this._explosions.length; i++) {
            var explosion = this._explosions[i];
            if(xt === explosion.getXTile() && yt === explosion.getYTile()) {
                return explosion;
            }
        }
        return null;
    },

    render: function () {
        for (var i = 0; i < this._explosions.length; i++) {
            var explosion = this._explosions[i];
            explosion.render();
        }
    },

    collide: function (entity) {
        if(entity instanceof DirectionExplosion){
            return false;
        }
        return true;
    },

    removeExplosion: function ( ){
        for(var i = 0; i < this._explosions.length; i++) {
            this._explosions[i].remove();
        }
    }
});