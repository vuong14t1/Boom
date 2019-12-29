var Player = Mob.extend({
    ctor: function (xt, yt, gameLogic) {
        this._super();
        this._input = null;
        this.gameLogic = gameLogic;
        this._bombs = this.gameLogic.getBoms();
        this._timeBetweenPutBombs = 0;
        this._x = Coordinates.tileToPixel(xt) + GameConst.TILES_SIZE.width / 2;
        this._y = Coordinates.tileToPixel(yt) + GameConst.TILES_SIZE.width / 2;
        this._sprite = new cc.Sprite("#img_character_side0.png");
        this._speed = 10;
        this._rateBom = 1;
        this._radiusBoom = 2;
        this._sprite.setAnchorPoint(cc.p(0.5, 0.45));
        this.updateSpriteByDirection();
    },

    setInput: function (input) {
        this._input = input;
    },

    setGameLogic: function (g) {
        this.gameLogic = g;
    },

    render: function () {
        this._super();
        this.updateSpriteByDirection();
        DrawNode(this._uiBoard, cc.p(this._x, this._y));
    },

    update: function (dt) {
        this.animate(dt);
        if(this._timeBetweenPutBombs <= 0) {
            this._timeBetweenPutBombs = 0;
        }else {
            this._timeBetweenPutBombs -= dt;
        }
        this.calculateMoving();
        this.detectPlaceBom();
    },

    calculateMoving: function () {
        var xa = 0;
        var ya = 0;
        if(this._input._right) {
            xa ++;
        }

        if(this._input._left) {
            xa --;
        }

        if(this._input._up) {
            ya ++;
        }

        if(this._input._down) {
            ya --;
        }

        if(xa !== 0 || ya !== 0) {
            this._moving = true;
            this.move(xa, ya)
        }else {
            this._moving = false;
        }

    },

    move: function (xa, ya) {
        if(xa > 0) {
            this._direction = 0;
        }

        if(xa < 0) {
            this._direction = 2;
        }

        if(ya > 0) {
            this._direction = 3;
        }

        if(ya < 0) {
            this._direction = 1;
        }

        if(this.canMove(xa, 0)) {
            this._x += xa;
        }

        if(this.canMove(0, ya)) {
            this._y += ya;
        }
        this.render();
    },

    canMove: function (xa, ya) {
        for(var i in GameConst.DIRECTION) {
            var ofsX = 0;
            var ofsY = 0;
            var direction = GameConst.DIRECTION[i];
            switch (direction) {
                case GameConst.DIRECTION.UP:
                    ofsY = GameConst.PLAYER_SIZE.height / 2 - 20;
                    break;
                case GameConst.DIRECTION.DOWN:
                    ofsY = - GameConst.PLAYER_SIZE.height / 2 + 5;
                    break;
                case GameConst.DIRECTION.RIGHT:
                    ofsX = GameConst.TILES_SIZE.width / 2 - 3;
                    break;
                case GameConst.DIRECTION.LEFT:
                    ofsX = - GameConst.TILES_SIZE.width / 2 + 3;
                    break;
            }
            var xt = Coordinates.pixelToTile(this._x + xa + ofsX);
            var yt = Coordinates.pixelToTile(this._y + ya + ofsY);
            var entity = this.gameLogic.getEntity(xt, yt);
            if(entity == null)  continue;
            if(entity.collide(this)) {
                return false;
            }
        }

        return true;
    },

    updateSpriteByDirection: function () {
        this._sprite.setFlippedX(false);
        switch (this._direction) {
            case GameConst.DIRECTION.UP:
                this._sprite.setSpriteFrame("img_character_up0.png");
                break;
            case GameConst.DIRECTION.DOWN:
                this._sprite.setSpriteFrame("img_character_down0.png");
                break;
            case GameConst.DIRECTION.RIGHT:
                this._sprite.setSpriteFrame("img_character_side0.png");
                break;
            case GameConst.DIRECTION.LEFT:
                this._sprite.setSpriteFrame("img_character_side0.png");
                this._sprite.setFlippedX(true);
                break;
        }
    },

    detectPlaceBom: function () {
        if(this._input._space && this._timeBetweenPutBombs <= 0 && this._rateBom > 0) {
            var xt = Coordinates.pixelToTile(this._x);
            var yt = Coordinates.pixelToTile(this._y);
            this.placeBom(xt, yt);
        }
    },

    placeBom: function (xt, yt) {
        var bom = new Bomb(xt, yt, this, this.gameLogic);
        this._bombs.push(bom);
        bom.render();
        this._timeBetweenPutBombs = GameConst.TIME_BETWEEN_PLACE_BOM;
        this.addRateBom(-1);
    },

    addRateBom: function (r) {
        this._rateBom += r;
    },

    collide: function (entity) {
        if(entity instanceof DirectionExplosion) {
            this.kill();
            return false;
        }
    },

    kill: function () {
        ZLog.error("player killed ");
    },

    getRateBom: function () {
        return this._rateBom;
    },

    getRadiusBom: function () {
        return this._radiusBoom;
    }

});