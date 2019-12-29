var GameLogic = cc.Class.extend({
    ctor: function () {
        this._mobs = [];
        this._boms = [];
        this._entities = [];
        this.levelResource = new LevelResource(this);
    },

    startGame: function () {
        this.levelResource.loadMap();
        this.renderEntity();
    },

    getBoms: function () {
        return this._boms;
    },

    addPlayer: function (xt, yt) {
        var player = new Player(xt, yt, this);
        var sceneGame = sceneMgr.getScene(GV.SCENE_IDS.GAME);
        player.setInput(sceneGame.getInput());
        player.setUIBoard(sceneGame.getNodeAnchorMap());
        this._mobs.push(player);
        player.render();
    },

    update: function (dt) {
        for(var i in this._mobs) {
            this._mobs[i] && this._mobs[i].update(dt);
        }
        for(var i in this._boms) {
            this._boms[i] && this._boms[i].update(dt);
        }
    },

    renderEntity: function () {
        for(var i in this._entities) {
            this._entities[i].render();
        }
    },

    addEntity: function (entity) {
        this._entities.push(entity);
    },

    addBom: function (boom) {
        this._boms.push(boom);
    },

    cleanBom: function () {

    },

    getEntity: function (xt, yt) {
        //check bound
        if(xt < 0 || yt < 0 | xt >= GameConst.TILES_SIZE_MAP.WIDTH || yt >= GameConst.TILES_SIZE_MAP.HEIGHT) {
            return Bound.getInstance();
        }
        var entity = null;
        entity = this.getExplosionAt(xt, yt);
        if(entity) return entity;
        entity = this.getBombAt(xt, yt);
        if(entity) return entity;
        entity = this.getEntityAt(xt, yt);
        if(entity) return entity;

        return entity;
    },

    getEntityAt: function (xt, yt) {
        for(var i in this._entities) {
            var entity = this._entities[i];
            if(xt === entity.getXTile() && yt === entity.getYTile()) {
                return entity;
            }
        }
        return null;
    },

    getExplosionAt: function (xt, yt) {
        for(var i = 0; i < this._boms.length; i++) {
            var bom = this._boms[i];
            if(bom.explosionAt(xt, yt)) {
                return bom;
            }
        }
        return null;
    },

    getBombAt: function (xt, yt) {
        for(var i = 0; i < this._boms.length; i++) {
            var bom = this._boms[i];
            if(bom.getXTile() === xt && bom.getYTile() === yt) {
                return bom;
            }
        }
        return null;
    },
});