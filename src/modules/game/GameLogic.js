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

    addPlayer: function (xt, yt) {
        var player = new Player(xt, yt);
        var sceneGame = sceneMgr.getScene(GV.SCENE_IDS.GAME);
        player.setInput(sceneGame.getInput());
        player.setUIBoard(sceneGame.getNodeAnchorMap());
        player.setGameLogic(this);
        this._mobs.push(player);
        player.render();
    },

    update: function (dt) {
        for(var i in this._mobs) {
            this._mobs[i] && this._mobs[i].update(dt);
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

    getEntity: function (xt, yt) {
        for(var i in this._entities) {
            var entity = this._entities[i];
            if(xt === entity.getXTile() && yt === entity.getYTile()) {
                return entity;
            }
        }
        return null;
    },
});