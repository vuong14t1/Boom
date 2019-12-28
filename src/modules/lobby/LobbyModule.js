/**
 * Created by CPU11015-local on 2/23/2018.
 */

var LobbyModule = BaseModule.extend({
    _className: "LobbyModule",

    ctor: function(moduleId){
        this._super(moduleId);
        this.setListenerValue(1200, 1999);
    },

    processPackages: function(cmd) {
        //var errorCode = this._curPackage.getError();
        switch(cmd){
            case CMD.LOBBY_QUICK_PLAY:
                this.handleQuickPlay();
                break;
            default:
                break;
        }
    },
    //region CREATE RECEIVE PACKAGE
    createReceivedPackage: function(cmd, pkg) {
        var pk = null;
        switch (cmd) {
            case CMD.LOBBY_QUICK_PLAY:
                pk = this.getInPacket(CmdReceiveLobbyQuickPlay);
                break;
            default:
                break;
        }
        return pk;
    },
    //endregion
    handleQuickPlay:function(){
        if(this._curPackage.getError() ==  ERROR_CODE.SUCCESS){
            var rQuickPlay = this._curPackage.rQuickPlay;
            TaskMgr.Instance.addTask(function(){
                return LobbyLogic.Instance.receiveQuickPlay(rQuickPlay);
            },TaskMgrKey.QUICK_PLAY,0);
            return;


            var scene = sceneMgr.getScene(GV.SCENE_IDS.LOBBY_GAME);
            var data = this._curPackage.data;
            var mGameLogic = MGameLogic.getInstance();
            mGameLogic.setMapId(data.mapId);
            mGameLogic.setRoomId(data.roomId);
            mGameLogic.setPlayers(data.players);

            ZLog.error(JSON.stringify(this._curPackage));
            scene.updatePlayerJoinGame();
            //sceneMgr.viewSceneById(GV.SCENE_IDS.LOBBY_GAME);
            TaskMgr.getInstance().addQueueTask(function(){
                if(!sceneMgr.isScene(GV.SCENE_IDS.LOBBY_GAME)){
                    sceneMgr.viewSceneById(GV.SCENE_IDS.LOBBY_GAME);
                    ZLog.error("view lobby:" + Utility.getClientTime());
                    return true;
                }
                return false;
            },1,1000);
        }else{

            ZLog.error("handle QuickPlay Error:" + ZLog.getKey(ERROR_CODE,this._curPackage.getError()));
            sceneMgr.hideGUIWaiting();
        }

    },

    handleGetVipInfo: function(errorCode){
        if(errorCode == ERROR_CODE.SUCCESS){

        }
        else{
            Popups.showError(this._curPackage.getError());
        }
    },

    sendQuickPlay:function(){
        if(Cheat.fakeData){
          this.fakeQuickPlay();
            return;
        }
        var pk = this.getOutPacket(CmdSendLobbyQuickPlay);
        this.send(pk);

    },
    sendLeaveRoom:function(){
        if(Cheat.fakeData){
            sceneMgr.viewSceneById(GV.SCENE_IDS.LOBBY);
            return;
        }
        var pk = this.getOutPacket(CmdSendPlayerLeaveRoom);
        this.send(pk);
    },
    sendStartGame: function() {
        if(Cheat.fakeData){
            this.fakeStartGame();
            return;
        }
        var pk = this.getOutPacket(CmdSendPlayerStartGame);
        this.send(pk);
    },

    fakeQuickPlay:function(){
        var fake = {};
        fake.roomId = 1;
        fake.mapId = 2;
        fake.players = [
            {
                uId:0,
                name:"Nguoi cho 0",
                position:0
            },
            {
                uId:1,
                name:"Nguoi cho 1",
                position:1
            },
            {
                uId:2,
                name:"Nguoi cho 3",
                position:3
            },
            {
                uId:3,
                name:"Nguoi cho 2",
                position:2
            }
        ];
        this._curPackage = {};
        this._curPackage.data = fake;
        this.handleQuickPlay();
    },

    fakeStartGame:function(){
        gameModule._curPackage.timeStart = Utility.getClientTime();
        gameModule.handlePlayerStartGame();
    },
});
