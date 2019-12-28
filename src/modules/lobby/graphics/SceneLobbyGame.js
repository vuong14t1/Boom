/**
 * Created by bachbv on 11/27/2015.
 */
var SceneLobbyGame = BaseScene.extend({
    _className: "SceneLobbyGame",

    btnStartGame:null,
    lbStatus:null,
    btnBack:null,
    txtRoomId:null,
    txtMapId:null,


    uiCharacters:[],

    ctor: function () {
        this._super();
        // gui
        this.init();
        this.addKeyboardListener(null,this.pressBackKeyEvent.bind(this));
    },

    init: function () {
        this._super();
        this.setDeepSyncChildren(5);
        this.syncAllChildren(res.scene_lobby_game, this.getLayer(GV.LAYERS.BG));
        this.doLayout(GV.VISIBALE_SIZE);
    },

    onEnter:function(){
        this._super();
    },

    onEnterTransitionDidFinish: function(){
        this._super();
        if(Cheat.autoPlay) this.scheduleOnce(function(){this.onTouchUIEndEvent(this.btnStartGame)}.bind(this),1);
    },

    onExitTransitionDidStart:function(){
        this._super();
    },

    localize: function(){
        this._super();
    },

    onTouchUIBeganEvent:function(sender){
        if(this._super(sender)) return true;
    },

    onTouchUIEndEvent: function(sender){
        if(this._super(sender)) return true;
        switch (sender) {
            case this.btnBack:
                this.processBack();
                break;
            case this.btnStartGame:
                this.processStartGame();
                break;
        }
    },

    updatePlayerJoinGame:function(data){
        var mGameLogic = MGameLogic.getInstance();

        var roomId = mGameLogic.getRoomId();
        var mapId = mGameLogic.getMapId();
        var players = mGameLogic.getPlayers();

        //clear
        for(var ui in this.uiCharacters){
            this.uiCharacters[ui].setVisible(false);
        }
        //update new
        for(var i = 0; i < players.length; i ++){
            var player = players[i];
            var position = player.getPosition();
            var uiCharacter = this.getUICharacterByPosition(position);
            if(uiCharacter != null){
                uiCharacter.setId(player.getUId());
                uiCharacter.setName(player.getName());
                uiCharacter.setVisible(true);
            }
        }
        this.txtRoomId.setString("roomId:"+ roomId);
        this.txtMapId.setString("mapId:"+ mapId);
    },

    /**
     *
     * @param position
     * @returns {UICharacterWaiting}
     */
    getUICharacterByPosition:function(position){
        var result = this.uiCharacters[position];
        if(result == null){
            result = new UICharacterWaiting();
            switch (position){
                case 0:
                    result.setPosition(GV.VISIBALE_SIZE.width * 0.7, GV.VISIBALE_SIZE.height * 0.5);
                    break;
                case 1:
                    result.setPosition(GV.VISIBALE_SIZE.width * 0.7, GV.VISIBALE_SIZE.height * 0.8);
                    break;
                case 2:
                    result.setPosition(GV.VISIBALE_SIZE.width * 0.3, GV.VISIBALE_SIZE.height * 0.5);
                    break;
                case 3:
                    result.setPosition(GV.VISIBALE_SIZE.width * 0.3, GV.VISIBALE_SIZE.height * 0.8);
                    break;
            }
            this.getLayer(GV.LAYERS.BG).addChild(result);
            this.uiCharacters[position] = result;
        }
        return result;
    },

    processBack:function(){
        sceneMgr.showGUIWaiting();
        lobbyModule.sendLeaveRoom();

    },
    processStartGame:function(){
        //sceneMgr.viewSceneById(GV.SCENE_IDS.GAME);
        if(MGameLogic.getInstance().getNumOfPlayer() < 2){
            return;
        }
        sceneMgr.showGUIWaiting();
        lobbyModule.sendStartGame();
    },

    pressBackKeyEvent:function(key,event){
        if(key == cc.KEY.back && connector.isConnected() && !sceneMgr.isGuiWaitingVisible()){
            if(Popups.isShowing()){
                Popups.hide();
            }
            else{
                this.processBack();
            }
        }
    }
});
