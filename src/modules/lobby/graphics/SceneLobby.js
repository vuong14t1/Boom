/**
 * Created by bachbv on 11/27/2015.
 */
var SceneLobby = BaseScene.extend({
    _className: "SceneLobby",
    _curView:null,

    txtStatus:null,
    btnBack:null,

    btnBuyHearts:null,
    btnBuyGolds:null,
    imgCharacter:null,
    nodeProfile:null,
    nodeFindingMatch:null,

    btnQuickPlay:null,
    txtUserName:null,
    txtLevel:null,
    btnMail:null,
    btnLen:null,
    btnBom:null,
    btnSpeed:null,
    /**@type {ccui.ListView}*/
    lvMenu:null,

    btnFLen:null,
    btnFBoom:null,
    btnFSpeed:null,
    btnULen:null,
    btnUBoom:null,
    btnUSpeed:null,
    txtFStatus:null,
    btnSetting:null,

    //btnConnectUdp:null,
    //btnSend: null,
    //lbStatus: null,
    //ebSend: null,
    //lbReceive: null,
    //btnGame:null,

    ctor: function () {
        this._super();
        // gui
        this.init();
        this.addKeyboardListener(null,this.pressBackKeyEvent.bind(this));
    },

    init: function () {
        this._super();
        this.setDeepSyncChildren(5);
        this.syncAllChildren(res.scene_lobby, this.getLayer(GV.LAYERS.BG));
        this.doLayout(GV.VISIBALE_SIZE);

        this.lvMenu.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.lvMenu.setTouchEnabled(true);
        this.lvMenu.setBounceEnabled(true);
        //
        //this.lvMenu.pushBackCustomItem(new ButtonLobbyMenu("shop"));
        //this.lvMenu.pushBackCustomItem(new ButtonLobbyMenu("inv"));
        //this.lvMenu.pushBackCustomItem(new ButtonLobbyMenu("Casual"));
        //this.lvMenu.pushBackCustomItem(new ButtonLobbyMenu("Rank"));
        //this.lvMenu.pushBackCustomItem(new ButtonLobbyMenu("live"));
        //this.lbReceive.ignoreContentAdaptWithSize(true);
        //this.lbStatus.ignoreContentAdaptWithSize(true);
        this.registerEventListener();
    },


    onEnter:function(){
        this._super();
        this.onUdpConnected();
        this.updateUIPhase();
        ZLog.error("player info:" + JSON.stringify(playerModule.getMyInfo()));

        // hearts '1F493'
        // gold '1F4B5'
        // bom '1F4A3'
        // len '1F4A5'
        // speed '1F45F'

    },

    updateUIPhase:function(){
        var idPhase = LobbyLogic.Instance.currentPhase;
        switch (idPhase){
            case GameConfig.TIME_PHASE.confirm:
                this.view(SceneLobby.VIEW.CONFIRM_GAME);
                break;
            case GameConfig.TIME_PHASE.finding:
                this.view(SceneLobby.VIEW.FINDING_MATCHING);
                break;
            case GameConfig.TIME_PHASE.early:
            case GameConfig.TIME_PHASE.mid:
            case GameConfig.TIME_PHASE.chaos:
                gameModule.sendReloadGame();
                break;
            case GameConfig.TIME_PHASE.end:
            default :
                this.view(SceneLobby.VIEW.PROFILE);
                break;
        }
    },
    onEnterTransitionDidFinish: function(){
        this._super();
        if(MGameLogic.Instance.isState(GameState.OUTING)){
            MGameLogic.Instance.setState(GameState.OUTED);
            MGameLogic.Instance.setGamePhase(new NullGamePhase());

        }
        if(Cheat.autoPlay) this.scheduleOnce(function(){this.onTouchUIEndEvent(this.btnQuickPlay)}.bind(this),1);
        this.updateInfoPlayer();
        this.scheduleUpdate();
        LobbyEvent.Instance.dispatchCustomEvent(LobbyEventName.UPDATE_TIME_ADD_HEART);

        //this.scheduleUpdate();
        //this.scheduleOnce(function(){ GV.MODE == BUILD_MODE.DEV && this.onTouchUIEndEvent(this.btnQuickPlay);},1);
        //GV.MODE == BUILD_MODE.DEV && this.onTouchUIEndEvent(this.btnQuickPlay);
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
            case this.btnQuickPlay:
                LobbyLogic.Instance.handleFindingMatch();
                break;
            case this.btnBack:
                this.handleBack();
                break;
            case this.btnBuyHearts:
                this.handleBuyHearts();
                break;
            case this.btnBuyGolds:
                this.handleBuyGolds();
                break;
            case this.btnFBoom:
            case this.btnFLen:
            case this.btnFSpeed:
            case this.btnUBoom:
            case this.btnULen:
            case this.btnUSpeed:
                this.handleUseItem(sender);
                break;
            case this.btnMail:
                this.processOpenMail();
                break;
            case this.btnBom:
            case this.btnLen:
            case this.btnSpeed:
                this.processOpenItem(sender);
                break;
            case this.btnSetting:
                sceneMgr.viewSceneIdAddQueue(GV.SCENE_IDS.SETTING_JOYSTICK);
                return;
        }
    },
    registerEventListener:function(){
        LobbyEvent.Instance.addListener(LobbyEventName.CONFIRM_USE_ITEM,this.listenerUseItemDSG,this);
        LobbyEvent.Instance.addListener(LobbyEventName.VIEW_FIND_MATCH,this.listenerViewFindMatch,this);
        LobbyEvent.Instance.addListener(LobbyEventName.VIEW_PROFILE,this.listenerViewViewProfile,this);
        LobbyEvent.Instance.addListener(LobbyEventName.TIME_OUT_FINDING,this.listenerTimeOutFinding,this);
        LobbyEvent.Instance.addListener(LobbyEventName.UPDATE_INVENTORY_INFO,this.listenerInventoryInfo,this);
        LobbyEvent.Instance.addListener(LobbyEventName.CHANGE_PHASE,this.listenerChangePhase,this);
        LobbyEvent.Instance.addListener(LobbyEventName.UPDATE_ALL_INFO,this.updateInfoPlayer,this);
        LobbyEvent.Instance.addListener(LobbyEventName.START_GAME,this.listenerStartGame,this);
        LobbyEvent.Instance.addListener(LobbyEventName.UPDATE_TIME_ADD_HEART,this.listenerUpdateTimeAddHearts,this);
        LobbyEvent.Instance.addListener(LobbyEventName.REMOVE_TIME_ADD_HEART,this.listenerRemoveTimeAddHearts,this);
    },

    updateTimeAddHearts:function(){
        ZLog.error("updateTimeAddHearts");
        var info = PlayerInfo.Instance;
        var timeRemain = info.getTimeRecoveryHeartRemain();
        var s = "    ";
        if(timeRemain != -1){
            s =' ' + Utility.timeToString(timeRemain,GV.TIME_FORMAT.MM_SS,false,true);
        }else{
            this.listenerRemoveTimeAddHearts();
        }
        var hearts = info.getHearts();
        if(hearts>21){hearts = 21;}
        this.btnBuyHearts.setTitleText(TEXT_NUM[hearts]+ TEXT_HEARTS + s);

    },

    listenerUpdateTimeAddHearts:function(){
        this.updateTimeAddHearts();
        this.schedule(this.updateTimeAddHearts,UPDATE_ONE_SECOND);
    },

    listenerRemoveTimeAddHearts:function(){
        this.unschedule(this.updateTimeAddHearts);
    },

    dt:0,
    update:function(dt){
        //LobbyLogic.Instance.update(dt);
        this.txtStatus.setString(cc.formatStr("OffsetTimeSerer:%s \naverageTimeOffset:%s", Utility.getServerTime.offsetClientVsServer ,TimeMgr.getInstance().averageTimeOffset));
        //if(this.isView(SceneLobby.VIEW.CONFIRM_GAME)){
        //    this.updateUIViewConfirmGame();
        //}
        //if(this.isView(SceneLobby.VIEW.FINDING_MATCHING)){
        //    this.dt += dt;
        //    if(this.dt > 3){
        //        this.onReceiveConfirmStartGame(Utility.getServerTime() + 5000);
        //    }
        //}
        return;
        TestUdpResponse.getInstance().run();
        this.dt += dt;
        if(this.dt > 1){
            ZLog.debug(TestUdpResponse.getInstance().log());
            this.dt = 0;
        }

    },
    updateUIViewConfirmGame:function(){
        var delta = MGameLogic.getInstance().getTimeStart() - Utility.getServerTime();
        var timeRemain = Math.floor(delta/1000);
        this.txtFStatus.setString("Game Start in: " + timeRemain);
        if(timeRemain <= 0) {
            ZLog.error("view scene Game");
            this.unscheduleUpdate();
            sceneMgr.viewSceneById(GV.SCENE_IDS.LOADING);
        }
    },
    onReceiveConfirmStartGame:function(timeStart){
        MGameLogic.getInstance().setTimeStart(timeStart);
        this.view(SceneLobby.VIEW.CONFIRM_GAME);
    },

    onUdpConnected:function(){
        if(connectorUdp.isConnected()){
            this.txtStatus.setString("udp is connected...");
        }else{
            this.txtStatus.setString("udp is connecting...");
        }
    },
    handleBuyHearts:function(){
        var heartsCheat = 1;
        PlayerInfo.Instance.setHearts(PlayerInfo.Instance.getHearts() + heartsCheat);
        playerModule.sendCheatInfo(heartsCheat);
        LobbyLogic.Instance.handleCheatInfo();
    },

    handleBuyGolds:function(){
        var goldCheat = 5000;
        PlayerInfo.Instance.setGold(PlayerInfo.Instance.getGold() + goldCheat);
        playerModule.sendCheatInfo();
        LobbyLogic.Instance.handleCheatInfo();
    },

    handleUseItem:function(sender){
        switch (sender){
            case this.btnFBoom:
            case this.btnUBoom:
                LobbyLogic.Instance.processUseItemBom();
                break;
            case this.btnFLen:
            case this.btnULen:
                LobbyLogic.Instance.processUseItemLen();
                break;
            case this.btnFSpeed:
            case this.btnUSpeed:
                LobbyLogic.Instance.processUseItemSpeed();

                break;
        }
    },
    processOpenMail:function(){
        Popups.showMessage("comming soon");
    },
    processOpenItem:function(sender){
        switch (sender){
            case this.btnBom:
                PlayerInfo.Instance.setNumOfBom(PlayerInfo.Instance.getNumOfBoom() + 1);
                //Popups.showShopMessage(
                //    cc.formatStr("You have: %s Boom" ,PlayerInfo.Instance.getNumOfBoom()),
                //    function(){
                //        PlayerInfo.Instance.setNumOfBom(PlayerInfo.Instance.getNumOfBoom() + 1);
                //        playerModule.sendCheatInfo();
                //        LobbyLogic.Instance.handleCheatInfo();
                //    }
                //);
                break;
            case this.btnLen:
                PlayerInfo.Instance.setNumOfRange(PlayerInfo.Instance.getNumOfRange() + 1);
                //Popups.showShopMessage(cc.formatStr("You have: %s Len" ,PlayerInfo.Instance.getNumOfRange()),
                //    function(){
                //        PlayerInfo.Instance.setNumOfRange(PlayerInfo.Instance.getNumOfRange() + 1);
                //        playerModule.sendCheatInfo();
                //        LobbyLogic.Instance.handleCheatInfo();
                //    }
                //);
                break;
            case this.btnSpeed:
                PlayerInfo.Instance.setNumOfSpeed(PlayerInfo.Instance.getNumOfSpeed() + 1);
                //Popups.showShopMessage(cc.formatStr("You have: %s Speed" ,PlayerInfo.Instance.getNumOfSpeed()),
                //    function(){
                //        PlayerInfo.Instance.setNumOfSpeed(PlayerInfo.Instance.getNumOfSpeed() + 1);
                //        playerModule.sendCheatInfo();
                //        LobbyLogic.Instance.handleCheatInfo();
                //    }
                //);
                break;
        }
        playerModule.sendCheatInfo();
        LobbyLogic.Instance.handleCheatInfo();
    },

    handleBack:function() {
        switch (this._curView) {
            case SceneLobby.VIEW.PROFILE:
                Popups.showMessageFunction("logout!!!",function(){
                    sceneMgr.viewSceneIdAddQueue(GV.SCENE_IDS.LOGIN);
                });
                break;
            case SceneLobby.VIEW.FINDING_MATCHING:
                LobbyLogic.Instance.handleCancelFindMatch();
                break;
        }
    },

    pressBackKeyEvent:function(key,event){
        if(key == cc.KEY.back && connector.isConnected() && !sceneMgr.isGuiWaitingVisible()){
            if(Popups.isShowing()){
                Popups.hide();
            }
            else{
                this.handleBack();
            }
        }
    },

    /**
     *
     * @param view {number|SceneLobby.VIEW}
     */
    setCurrentView:function(view){
        this._curView = view;
    },
    isView:function(view){
        return this._curView == view;
    },
    view:function(view){
        ZLog.error("view:"  + ZLog.getKey(SceneLobby.VIEW,view));
        switch (view){
            case SceneLobby.VIEW.CONFIRM_GAME:
                this.viewConfirmStartingGame();
                break;
            case SceneLobby.VIEW.FINDING_MATCHING:
                this.viewFindingMatch();
                break;
            case SceneLobby.VIEW.PROFILE:
                this.viewProfile();
                break;
            default :
                return;
        }
        this.setCurrentView(view);
    },

    viewProfile:function(){
        this.nodeProfile.setPosition(0,0);

        this.btnBack.setVisible(true);
        this.nodeFindingMatch.setVisible(false);
        this.nodeProfile.setVisible(true);

        this.imgCharacter.runAction(cc.moveTo(0.2,cc.p(230,700)));
        this.dt = 0;

    },
    viewFindingMatch:function(){
        this.nodeFindingMatch.setPosition(0,0);

        this.btnBack.setVisible(true);
        this.nodeProfile.setVisible(false);
        this.nodeFindingMatch.setVisible(true);

        this.imgCharacter.runAction(cc.moveTo(0.2,cc.p(GV.VISIBALE_SIZE.width/2,700)));
        this.txtFStatus.setString("Finding Opponent ...");

        var opacity = 255;
        this.btnFBoom.setOpacity(opacity);
        this.btnFLen.setOpacity(opacity);
        this.btnFSpeed.setOpacity(opacity);
        this.btnUBoom.setOpacity(opacity);
        this.btnULen.setOpacity(opacity);
        this.btnUSpeed.setOpacity(opacity);

        this.isDisableUseItem = false;
        this.setEnableUseItemBoom(true);
        this.setEnableUseItemSpeed(true);
        this.setEnableUseItemRange(true);

    },

    viewConfirmStartingGame:function(){
        this.btnBack.setVisible(false);

        this.txtFStatus.setString("Start Game in ...");
    },


    listenerStartGame:function(){
        sceneMgr.viewSceneIdAddQueue(GV.SCENE_IDS.GAME);
    },

    /**@param event{cc.EventCustom}*/
    listenerChangePhase:function(event){
        var idPhase = event.getUserData();
        switch (idPhase){
            case GameConfig.TIME_PHASE.confirm:
                this.view(SceneLobby.VIEW.CONFIRM_GAME);
                delete this.timeStartFindMath;
                this.timeStartConfirmPhase = Utility.getClientTime();
                this.unschedule(this.updateUITimeFindMatchRemain);
                this.schedule(this.updateConfirmPhaseDisableUseItem);
                break;
            case GameConfig.TIME_PHASE.finding:
                if(this.isView(SceneLobby.VIEW.CONFIRM_GAME)){
                    Popups.showMessage("Another Player Something wrong, so we can't connect, we finding continue");
                    this.view(SceneLobby.VIEW.FINDING_MATCHING);
                }
                break;
        }
    },
    updateConfirmPhaseDisableUseItem:function(dt){
        var timeNotDisable = 3000;
        var timePassed = Utility.getClientTime() - this.timeStartConfirmPhase;
        var totalTime = GameConfig.Instance.getTimePhaseInSecond(GameConfig.TIME_PHASE.confirm) * 1000;
        var timeRemain = totalTime - timePassed;
        this.txtFStatus.setString("Start Game in ." + parseInt(timeRemain/1000));
        if(timeRemain < timeNotDisable && !this.isDisableUseItem){
             this.disableUseItem();
        }
        if(timeRemain < 0){
            this.unschedule(this.updateConfirmPhaseDisableUseItem);
            delete this.timeStartConfirmPhase;
        }
    },
    disableUseItem:function(){
        this.isDisableUseItem = true;
        ZLogger.getLog(this).debug("disable use Item");
        this.btnFBoom.setTouchEnabled(false);
        this.btnFLen.setTouchEnabled(false);
        this.btnFSpeed.setTouchEnabled(false);
        this.btnUBoom.setTouchEnabled(false);
        this.btnULen.setTouchEnabled(false);
        this.btnUSpeed.setTouchEnabled(false);

        var opacity = 100;
        this.btnFBoom.setOpacity(opacity);
        this.btnFLen.setOpacity(opacity);
        this.btnFSpeed.setOpacity(opacity);
        this.btnUBoom.setOpacity(opacity);
        this.btnULen.setOpacity(opacity);
        this.btnUSpeed.setOpacity(opacity);
    },

    listenerTimeOutFinding:function(){
        Popups.showMessage("time out finding,please try again.");
        this.view(SceneLobby.VIEW.PROFILE);
    },

    setEnableUseItemBoom:function(b){
        this.btnFBoom.setTouchEnabled(b);
        this.btnUBoom.setTouchEnabled(b);
        if(b){b = 255;}else {b = 100;}
        this.btnFBoom.setOpacity(b);
        this.btnUBoom.setOpacity(b);
    },
    setEnableUseItemSpeed:function(b){
        this.btnFSpeed.setTouchEnabled(b);
        this.btnUSpeed.setTouchEnabled(b);
        if(b){b = 255;}else {b = 100;}
        this.btnFSpeed.setOpacity(b);
        this.btnUSpeed.setOpacity(b);
    },
    setEnableUseItemRange:function(b){
        this.btnFLen.setTouchEnabled(b);
        this.btnULen.setTouchEnabled(b);
        if(b){b = 255;}else {b = 100;}
        this.btnFLen.setOpacity(b);
        this.btnULen.setOpacity(b);
    },

    /**@param event{cc.EventCustom}*/
    listenerUseItemDSG:function(event){
        /**@type {ItemUseDSG}*/
        var itemUserDSG = event.getUserData();
        ZLog.error("update UI boom:" + itemUserDSG.getId());
        Popups.showMessage(cc.formatStr("Use Item:, %s %s",ZLog.getKey(GameConfig.ITEM,itemUserDSG.getId()), itemUserDSG.isSuccess()));
        switch (itemUserDSG.getId()){
            case GameConfig.ITEM.BOOM:
                this.setEnableUseItemBoom(false);
                break;
            case GameConfig.ITEM.SPEED:
                this.setEnableUseItemSpeed(false);
                break;
            case GameConfig.ITEM.RANGE:
                this.setEnableUseItemRange(false);
                break;
        }
        //this.imgCharacter.runAction(
        //    cc.sequence(
        //        cc.scaleTo(0.2,1.2),
        //        cc.scaleTo(0.2,1)
        //    )
        //);
    },
    listenerViewFindMatch:function(){
        this.view(SceneLobby.VIEW.FINDING_MATCHING);
        this.timeStartFindMath = Utility.getClientTimeInSeconds();
        this.unschedule(this.updateConfirmPhaseDisableUseItem);
        this.schedule(this.updateUITimeFindMatchRemain,1);
    },
    updateUITimeFindMatchRemain:function(){
        var timeTotal = GameConfig.Instance.getTimePhaseInSecond(GameConfig.TIME_PHASE.finding);
        var timePassed = Utility.getClientTimeInSeconds() - this.timeStartFindMath;
        var timeRemain = timeTotal - timePassed;
        if(timeRemain <0){
            this.unschedule(this.updateUITimeFindMatchRemain);
            LobbyLogic.Instance.handleCancelFindMatch();
        }
        this.txtFStatus.setString(cc.formatStr("Finding Opponent .%s.",timePassed));

    },
    listenerViewViewProfile:function(){
        this.view(SceneLobby.VIEW.PROFILE);
    },
    listenerInventoryInfo:function(){
        var getSymbol = function(value){
            if(value > 21) value =21;
            return TEXT_NUM[value];
        };
        var player = PlayerInfo.Instance;

        this.btnBom.setTitleText(TEXT_BOOM +' '+ getSymbol(player.getNumOfBoom()));
        this.btnLen.setTitleText(TEXT_RANGE +' '+ getSymbol(player.getNumOfRange()));
        this.btnSpeed.setTitleText(TEXT_SPEED +' '+ getSymbol(player.getNumOfSpeed()));

        this.btnFBoom.setTitleText(TEXT_BOOM +' '+ getSymbol(player.getNumOfBoom()));
        this.btnFLen.setTitleText(TEXT_RANGE +' '+ getSymbol(player.getNumOfRange()));
        this.btnFSpeed.setTitleText(TEXT_SPEED +' '+ getSymbol(player.getNumOfSpeed()));

        this.btnUBoom.setTitleText((player.getNumOfBoom() > 0) ? "Use":"Buy ("+GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.BOOM).getPrice()+"$)");
        this.btnULen.setTitleText((player.getNumOfRange() > 0) ? "Use":"Buy ("+GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.RANGE).getPrice()+"$)");
        this.btnUSpeed.setTitleText((player.getNumOfSpeed() > 0) ? "Use":"Buy ("+GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.SPEED).getPrice()+"$)");

    },

    updateInfoPlayer:function(){
        var getSymbol = function(value){
            if(value > 21) value =21;
            return TEXT_NUM[value];
        };
        var player = PlayerInfo.Instance;
        this.txtUserName.setString(player.getDisplayName());
        this.txtLevel.setString("Level: "+player.getLevel());

        this.btnBuyHearts.setTitleText(cc.formatStr(TEXT_HEARTS +"   %s+",getSymbol(player.getHearts())));
        this.btnBuyGolds.setTitleText(cc.formatStr(TEXT_GOLD +"   %s+",player.getGold()));

        this.btnBom.setTitleText(TEXT_BOOM +' '+ getSymbol(player.getNumOfBoom()));
        this.btnLen.setTitleText(TEXT_RANGE +' '+ getSymbol(player.getNumOfRange()));
        this.btnSpeed.setTitleText(TEXT_SPEED +' '+ getSymbol(player.getNumOfSpeed()));

        this.btnFBoom.setTitleText(TEXT_BOOM +' '+ getSymbol(player.getNumOfBoom()));
        this.btnFLen.setTitleText(TEXT_RANGE +' '+ getSymbol(player.getNumOfRange()));
        this.btnFSpeed.setTitleText(TEXT_SPEED +' '+ getSymbol(player.getNumOfSpeed()));

        this.btnUBoom.setTitleText((player.getNumOfBoom() > 0) ? "Use":"Buy ("+GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.BOOM).getPrice()+"$)");
        this.btnULen.setTitleText((player.getNumOfRange() > 0) ? "Use":"Buy ("+GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.RANGE).getPrice()+"$)");
        this.btnUSpeed.setTitleText((player.getNumOfSpeed() > 0) ? "Use":"Buy ("+GameConfig.Instance.getDSGItemConfigById(GameConfig.ITEM.SPEED).getPrice()+"$)");

    },
});
SceneLobby.prototype.name = "SceneLobby";
SceneLobby.VIEW = {
    PROFILE:0,
    FINDING_MATCHING:1,
    CONFIRM_GAME:2
};
