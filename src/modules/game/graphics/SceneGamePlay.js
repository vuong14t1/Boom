var SceneGamePlay = BaseScene.extend({
    ctor: function () {
        this._super();
        this.imgBg = null;
        this.imgBgMap = null;
        this.nodeAnchorMap = null;
        this._input = null;
        this.gameLogic = new GameLogic();
        this._init();
    },

    _init: function () {
        this.setDeepSyncChildren(2);
        this.syncAllChildren(res.scene_game_play, this.getLayer(GV.LAYERS.BG));
        DrawNode(this.nodeAnchorMap, cc.p(0, 0));
        DrawNode(this.nodeAnchorMap, cc.p(GameConst.TILES_SIZE_MAP.WIDTH * GameConst.TILES_SIZE.width , GameConst.TILES_SIZE_MAP.HEIGHT * GameConst.TILES_SIZE.height));
        this._initInput();
    },

    onEnterTransitionDidFinish: function () {
        this._super();
        this.testUI();
    },

    _initInput: function () {
        this._input = new Keyboard(this);
        this.scheduleUpdate();
    },

    update: function (dt) {
        this.gameLogic.update(dt);
    },

    getInput: function () {
        return this._input;
    },

    getNodeAnchorMap: function () {
        return this.nodeAnchorMap;
    },

    testUI: function () {
        this.gameLogic.startGame();
        this.gameLogic.addPlayer(2, 0);
    }
});
