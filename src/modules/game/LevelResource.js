var LevelResource = cc.Class.extend({
    ctor: function (gameLogic) {
        this.gameLogic = gameLogic;
    },

    loadMap: function () {
        var sceneGame = sceneMgr.getScene(GV.SCENE_IDS.GAME);
        var maps = GameResource.getMap();
        for(var i = 0; i < maps.length; i++) {
            var rowMap = maps[i];
            for(var j = 0; j < rowMap.length; j++) {
                var code = rowMap[j];
                switch (code) {
                    case 1:
                        var wallTile = new WallTile(j, i);
                        wallTile.setUIBoard(sceneGame.getNodeAnchorMap());
                        this.gameLogic.addEntity(wallTile);
                        break;
                }
            }
        }
    },
});