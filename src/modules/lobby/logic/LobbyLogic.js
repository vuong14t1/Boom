/**
 * Created by MinhTrung on 10/30/2018.
 */
var LobbyLogic = cc.Class.extend({
    isFindingMatch:false,
    /**@type {number|GameConfig.TIME_PHASE}*/
    currentPhase:null,
    dt:0,

    roomId:undefined,
    mapId:undefined,

    /**@type {ItemUseDSG[]}*/
    defaultItemUseDSG:[],// item dung trong dsg
    /**@type {ItemUseDSG[]}*/
    tempItemUseDSGWaitConfirm:[],// de luu tam thoi gia tri cac id item dung trong dsg khi gui len server


    /**@type {CharacterDSG[]}*/
    infoCharacterDSG:[],

    ctor:function(){

    },

    update:function(dt){
        //this.dt += dt;
        //if(this.isFindingMatch){
        //    if(!this.hadJoinedRoom()){
        //
        //    }
        //    if(this.dt > GameConfig.Instance.getTimePhaseInSecond(GameConfig.TIME_PHASE.finding)){
        //        this.isFindingMatch = false;
        //        LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.TIME_OUT_FINDING);
        //    }
        //}
    },

    getMapId:function(){return this.mapId},
    getRoomId:function(){return this.mapId},

    hadJoinedRoom:function(){
        return this.roomId != null;
    },

    cleanUp:function(){
        this.isFindingMatch = false;
        this.roomId = null;
        this.mapId = null;
        this._clearUseItem();
    },
    _clearUseItem:function(){
        this.tempItemUseDSGWaitConfirm.splice(0,this.tempItemUseDSGWaitConfirm.length);
        this.defaultItemUseDSG.splice(0,this.defaultItemUseDSG.length);
    },
    //gui len server thong bao tim tran dau
    handleFindingMatch:function(){
        if(this.isFindingMatch) return;
        this.dt = 0;
        this.isFindingMatch = true;
        lobbyModule.sendQuickPlay();
    },

    //cancel mot so su kien va gui len server thong bao huy
    handleCancelFindMatch:function(){
        lobbyModule.sendLeaveRoom();
    },
    handleCheatInfo:function(){
        ZLog.debug("handleCheatInfo");
        LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.UPDATE_ALL_INFO);
    },
    processGetInfoSuccess:function(){
        if(PlayerInfo.Instance.isPlaying()){
            gameModule.sendReloadGame();
        }else{
            sceneMgr.viewSceneIdAddQueue(GV.SCENE_IDS.LOBBY);

        }
    },

    processUseItemBom:function(){
        var item = GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.BOOM);
        this.processUseItem(item);
    },
    processUseItemLen:function(){
        var item = GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.RANGE);
        this.processUseItem(item);
    },
    processUseItemSpeed:function(){
        var item = GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.SPEED);
        this.processUseItem(item);
    },
    /**
     *
     * @param item {ItemConfig}
     */
    processUseItem:function(item){
        var numOfItem = PlayerInfo.Instance.getNumOfItemById(item.getId());
        var totalGoldHadUse = 0;
        for(var i in this.defaultItemUseDSG){
            var itemUseDSG = this.defaultItemUseDSG[i];
            if(itemUseDSG.getId() == item.getId()){
                ZLogger.getLog(this).error("had use this item:%s",item.getId());
                return;
            }

            if(itemUseDSG.isUseGold()){
                totalGoldHadUse += GameConfig.Instance.getDSGItemConfigById(itemUseDSG.getId()).getPrice();
            }
        }
        var check = false;
        var isUseGold = false;
        if( numOfItem > 0){
            check = true;
        }else{
            if(PlayerInfo.Instance.getGold() >= (item.getPrice() + totalGoldHadUse)){
                check = true;
                isUseGold = true;
            }
        }
        check && gameModule.sendBuyItemDSG(item.getId());
        ZLog.debug("processUseItem");
        check && LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.UPDATE_ALL_INFO);
        if(check){
            var itemUse = new ItemUseDSG(item.getId());
            itemUse.setUseGold(isUseGold);
            this.defaultItemUseDSG.push(itemUse);
            this.tempItemUseDSGWaitConfirm.push(itemUse);
        }
        return check;
    },

    /**
     * cap nhat data thong tin nguoi choi dau game
     * ==> background load map= >scene
     * @param rQuickPlay {RQuickPlay}
     */
    receiveQuickPlay:function(rQuickPlay){
        this.roomId  = rQuickPlay.getIdRoom();
        this.mapId  = rQuickPlay.getIdMap();
        this.infoCharacterDSG = rQuickPlay.getCharacterDSGs();
        this.currentPhase = GameConfig.TIME_PHASE.finding;
        MGameLogic.Instance.setState(GameState.FINDING);
        LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.VIEW_FIND_MATCH);
        this.isFindingMatch = false;
        return true;
    },
    /**
     *
     * @param rInventoryInfo {RInventoryInfo}
     */
    receiveInventoryInfo:function(rInventoryInfo){
        ZLogger.getLog(this).error("receiveInventoryInfo" + JSON.stringify(rInventoryInfo));
        PlayerInfo.Instance.setNumOfBom(rInventoryInfo.getNumOfBoom());
        PlayerInfo.Instance.setNumOfSpeed(rInventoryInfo.getNumOfSpeed());
        PlayerInfo.Instance.setNumOfRange(rInventoryInfo.getNumOfRange());
        LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.UPDATE_INVENTORY_INFO);
    },

    receiveBuyItemDGS:function(isSuccess){
        /**@type {ItemUseDSG}*/
        var itemUseDSG = this.tempItemUseDSGWaitConfirm.shift();
        itemUseDSG.setSuccess(isSuccess);
        ZLogger.getLog(this).debug("receiveBuyItemDGS %s", ZLog.getKey(GameConfig.ITEM,itemUseDSG.getId()));
        LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.CONFIRM_USE_ITEM,itemUseDSG);
    },

    /**
     *
     * @param idPhase {number|GameConfig.TIME_PHASE}
     */
    receiveChangePhase:function(idPhase){
        if(this.isFindingMatch) return false;
        ZLogger.getLog(this).debug("receive change phase: %s",ZLog.getKey(GameConfig.TIME_PHASE,idPhase));
        this.currentPhase = idPhase;
        switch (idPhase){
            case GameConfig.TIME_PHASE.confirm:
                MGameLogic.Instance.setState(GameState.CONFIRMING);
                PlayerInfo.Instance.subHearts(HEARTS_EACH_GAME);
                LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.UPDATE_TIME_ADD_HEART);
                LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.CHANGE_PHASE,idPhase);
                break;
            case GameConfig.TIME_PHASE.finding:
                MGameLogic.Instance.setState(GameState.FINDING);
                LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.CHANGE_PHASE,idPhase);
                break;
            //case GameConfig.TIME_PHASE.early:
            case GameConfig.TIME_PHASE.mid:
            case GameConfig.TIME_PHASE.chaos:
                MGameLogic.Instance.upgradePhaseGame(idPhase);
                break;
            case GameConfig.TIME_PHASE.end:
        }
        return true;
    },

    /**
     *
     * @param rLeaveGame {RLeaveGame}
     */
    receiveLeaveRoom:function(rLeaveGame){
        /**@type {CharacterDSG}*/
        var characterDSGLeave = null;
        var indexLeave = -1;
        var posLeave = rLeaveGame.getPositionPlayer();
        for(var i in this.infoCharacterDSG){
            characterDSGLeave = this.infoCharacterDSG[i];
            if(characterDSGLeave.getPositionPlayer() == posLeave){
                indexLeave = i;
                break;
            }
        }
        if(indexLeave != -1){
            characterDSGLeave = this.infoCharacterDSG[indexLeave];
            this.infoCharacterDSG.splice(indexLeave,1);
        }
        ZLogger.getLog(this).debug("leaveGame:"+ JSON.stringify(characterDSGLeave));

        if(characterDSGLeave.getUId() == PlayerInfo.Instance.getUId()){
            this.cleanUp();
            if(MGameLogic.Instance.isState(GameState.FINDING)){
                MGameLogic.Instance.setState(GameState.NONE);
                LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.VIEW_PROFILE);
            }
            //TaskMgr.addTask(
            //    function(){
            //        MGameLogic.Instance.isState(GameState.OUTED){
            //
            //        }
            //    },
            //    TaskMgrKey.LEAVE_GAME,
            //    ONE_SECOND
            //);
            //MGameLogic.Instance.setState(GameState.NONE);
            //LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.VIEW_PROFILE);
        }else{
            if(MGameLogic.Instance.isState(GameState.CONFIRMING)){
                MGameLogic.Instance.setState(GameState.FINDING);
                LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.VIEW_FIND_MATCH);
            }
        }
    },
    /**
     *
     *  @param characterDSG {CharacterDSG}
     */
    receiveJoinRoom:function(characterDSG){
        this.infoCharacterDSG.push(characterDSG);
    },
    /**
     *
     * @param rInfoStartGame {RInfoStartGame}
     */
    receiveStartGame:function(rInfoStartGame){
        ZLogger.getLog(this).debug("receiveStartGame %s",JSON.stringify(rInfoStartGame));
        MGameLogic.Instance.setTimeStart(rInfoStartGame.getTimeStart());
        MGameLogic.Instance.setState(GameState.WAITING);
        var characters = [];
        var character;
        var characterDSGs = rInfoStartGame.getCharacterDSGs();
        var characterDSG, i, length,characterBase;
        length = characterDSGs.length;
        for(i = 0; i < length ; i ++){
            characterDSG = characterDSGs[i];
            characterBase = this.getCharacterDSGAtPos(characterDSG.getPositionPlayer());
            if(characterBase == null){
                ZLogger.getLog(this).error("can't find character base: %s %s",JSON.stringify(characterBase),this.roomId);
                continue;
            }
            character = new Character();
            character.setUId(characterBase.getUId());
            character.setName(characterBase.getName());
            character.setPosition(characterBase.getPositionPlayer());
            character.setNumOfBom(characterDSG.getBooms());
            character.setLen(characterDSG.getRanges());
            character.setSpeed(characterDSG.getSpeeds());
            characters.push(character);
        }
        MGameLogic.Instance.setPlayers(characters);
        //tru tien dsg + gold + item, v.v....
        length = this.defaultItemUseDSG.length;
        var totalGoldUse = 0;
        for(i = 0 ; i< length;i++){
            var itemUseDSG = this.defaultItemUseDSG[i];
            if(itemUseDSG.isSuccess()){
                if(itemUseDSG.isUseGold()){
                    totalGoldUse += GameConfig.Instance.getDSGItemConfigById(itemUseDSG.getId()).getPrice();
                }else{
                    PlayerInfo.Instance.subNumOfItemById(itemUseDSG.getId(),1);
                }
            }
        }
        PlayerInfo.Instance.subGold(totalGoldUse);
        this.tempItemUseDSGWaitConfirm.splice(0,this.tempItemUseDSGWaitConfirm.length);
        this.defaultItemUseDSG.splice(0,this.defaultItemUseDSG.length);

        //var sceneGame = sceneMgr.getScene(GV.SCENE_IDS.GAME);
        //GameEvent.Instance.dispatchCustomEvent(GameEventName.LOAD_MAP);
        LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.START_GAME);
    },
    /**
     *
     * @param pos
     * @returns {CharacterDSG}
     */
    getCharacterDSGAtPos:function(pos){
        for(var i in this.infoCharacterDSG){
            if(this.infoCharacterDSG[i].getPositionPlayer() == pos){
                return this.infoCharacterDSG[i];
            }
        }
    }
});
LobbyLogic.prototype.name = "LobbyLogic";
/**@type {LobbyLogic}*/
LobbyLogic.Instance = new LobbyLogic();
