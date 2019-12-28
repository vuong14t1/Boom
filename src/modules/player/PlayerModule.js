/**
 * Created by bachbv on 1/22/2017.
 */

var PlayerModule = BaseModule.extend({
    _className: "PlayerModule",
    _cachedPlayers:{},

    ctor: function (moduleId) {
        this._super(moduleId);

        this.setListenerValue(1001, 1199, [
            CMD.CHEAT_SET_USER_ATTRIBUTE,
            CMD.PLAYER_UPDATE_TELCO,
            CMD.SYSTEM_MAINTAIN,
            CMD.TEST_TYPE_DATA,
            CMD.GET_SERVER_TIME]);
    },

    processPackages: function (cmd) {
        if (this._curPackage == null) {
            cc.warn("%s NOT FOUND curPackage with cmd (%d)", this.getClassName(), cmd);
            return;
        }
        switch (cmd) {
            case CMD.PLAYER_GET_INFO:
                this.handleGetPlayerInfo();
                break;
            case CMD.PLAYER_GET_INFO_DETAIL:
                this.handleGetPlayerInfoDetail();
                break;
            case CMD.GET_SERVER_TIME:
                this.handleGetServerTime();
                break;
            case CMD.GET_INVENTORY_INFO:
                this.handleGetInventoryInfo();
                break;
            case CMD.USER_ADD_EXP:
                this.handleAddExp();
                break;


            //case CMD.PLAYER_CHEAT:
            //    this.handleCheatAttributes();
            //    ZLog.error("vao day cheat receive");
            //    break;
            //
            //case CMD.PLAYER_UPGRADE_VIP:
            //    this.handleUpgradeVip(errorCode);
            //    break;
            //
            //case CMD.PLAYER_CLAIM_DAILY_SUPPORTED_GOLD:
            //    this.handleClaimDailySupportGold(errorCode);
            //    break;
            //
            //case CMD.PLAYER_CLAIM_RATE_APP:
            //    this.handleClaimRateApp(errorCode);
            //    break;
            //
            //case CMD.PLAYER_CLAIM_LIKE_PAGE:
            //    this.handleClaimLikePage(errorCode);
            //    break;
            //
            //case CMD.PLAYER_UPDATE_URL_AVATAR:
            //    this.handleUpdateUrlAvatar();
            //    break;
            //
            //case CMD.SYSTEM_MAINTAIN:
            //    this.handleSystemMaintain(errorCode);
            //    break;

            default :
                break;
        }
    },
    createReceivedPackage: function (cmd, pkg) {
        var pk = null;
        switch (cmd) {
            case CMD.PLAYER_GET_INFO:
                pk = this.getInPacket(CmdReceiveGetPlayerInfo);
                break;
            case CMD.GET_SERVER_TIME:
                pk = this.getInPacket(CmdReceiveGetServerTime);
                break;
            case CMD.GET_INVENTORY_INFO:
                pk = this.getInPacket(CmdReceiveGetInventoryInfo);
                break;
            case CMD.USER_ADD_EXP:
                pk = this.getInPacket(CmdReceiveAddExp);
                break;




            case CMD.PLAYER_GET_INFO_DETAIL:
                pk = this.getInPacket(CmdReceiveGetPlayerInfoDetail);
                break;

            case CMD.PLAYER_UPGRADE_VIP:
                pk = this.getInPacket(CmdReceivePlayerInfoVip);
                break;

            case CMD.PLAYER_CLAIM_DAILY_SUPPORTED_GOLD:
                pk = this.getInPacket(CmdReceiveClaimDailySupportGold);
                break;

            case CMD.PLAYER_CLAIM_RATE_APP:
                pk = this.getInPacket(CmdReceiveClaimRateApp);
                break;

            case CMD.PLAYER_CLAIM_LIKE_PAGE:
                pk = this.getInPacket(CmdReceiveClaimDailyLikeFanPage);
                break;

            case CMD.PLAYER_CHEAT:
                pk = this.getInPacket(CmdReceivePlayerCheat);
                break;

            case CMD.PLAYER_UPDATE_URL_AVATAR:
                pk = this.getInPacket(BaseInPacket);
                break;

            case CMD.PLAYER_UPDATE_TELCO:
                pk = this.getInPacket(CmdReceivePlayerUpdateTelco);
                break;


            case CMD.CHEAT_DISCONNECT:
                pk = {};
                break;

            case CMD.USER_LOG_OUT:
                pk = {};
                break;

            case CMD.CHEAT_SET_USER_ATTRIBUTE:
                pk = this.getInPacket(CmdReceiveCheatAttribute);
                break;

            case CMD.CHEAT_USER_PAYMENT:
                pk = this.getInPacket(CmdReceiveCheatAttribute);
                break;

            case CMD.SYSTEM_MAINTAIN:
                pk = this.getInPacket(CmdReceiveSystemMaintain);
                break;

            case CMD.TEST_TYPE_DATA:
                pk = this.getInPacket(CmdReceiveTestTypeData);
                break;

            default :
                break;
        }

        return pk;
    },

    updateServerTime:function(){
        var deltaTime = 0;
        if(this._timeSendPlayerInfo){
            deltaTime = (Utility.getClientTime() - this._timeSendPlayerInfo) /2;
            delete this._timeSendPlayerInfo;
        }
        this._curPackage.dataPlayer.serverTime += deltaTime;
        Utility.setCurrentServerTime(this._curPackage.dataPlayer.serverTime);
    },

    handleGetPlayerInfo: function(){
        this.updateServerTime();
        PlayerInfo.Instance.updateInfoFromData(this._curPackage.dataPlayer);
        LobbyLogic.Instance.processGetInfoSuccess();

        //this.setMyInfo(this._curPackage.dataPlayer);
        //if(this.isFirstLogin()){
        //    this.doFirstLogin();
        //}
        //
        //// execute callback
        //connector.connectSuccessCallback && connector.connectSuccessCallback();
        //connector.connectSuccessCallback = null;
    },
    handleGetServerTime:function(){
        TimeMgr.Instance.receiveServerTime(this._curPackage);
    },
    handleGetInventoryInfo:function(){
        LobbyLogic.Instance.receiveInventoryInfo(this._curPackage.rInventoryInfo);
    },
    handleAddExp:function(){
        PlayerInfo.Instance.addExp(this._curPackage.numOfExpAdd);
    },

    sendGetPlayerInfo: function () {
        this._timeSendPlayerInfo = Utility.getClientTime();
        var pk = this.getOutPacket(CmdSendGetPlayerInfo);
        this.send(pk);
    },

    sendGetServerTime:function(id){
        var pk = this.getOutPacket(CmdSendGetServerTime,id);
        this.sendUdp(pk);
    },

    sendGetInventoryInfo:function(){
        var pk = this.getOutPacket(BaseOutBaseCmd,CMD.GET_INVENTORY_INFO);
        this.send(pk);
    },

    sendCheatInfo:function(numOfHeart,numOfExpAdd){
        var cheatInfo = new SendCheatInfo(numOfHeart,numOfExpAdd);
        var pk = this.getOutPacket(CmdSendCheatInfo,cheatInfo);
        this.send(pk);
    },


    setMyInfo: function(info){
        if(info === undefined) return;
        this._info = info;
    },
    /**
     *
     * @returns {null|DataPlayer}
     */
    getMyInfo: function() {
        return this._info;
    },










    isFirstLogin: function() {
        return this._isFirstLogin;
    },
    setFirstLogin: function(b) {
        this._isFirstLogin = b;
    },
    getVipExpiredTime: function(){
        return this._info.vipExpiredTime;
    },
    setVipExpiredTime: function(time){
        if(time === undefined) return;
        this._info.vipExpiredTime = time;
    },
    getUId: function() {
        if(Cheat.fakeData) return 0;
        return this._info != null ? this._info.uId : -1;
    },
    getName: function(){
      return this._info.displayName;
    },
    setAvatar: function(url){
        if(url === undefined) return;
        this._info.uAvatar = url;
    },
    getAvatar: function(){
        return this._info.uAvatar;
    },
    getIsRateApp: function(){
        return this._info.isRateApp;
    },
    getIsLikedFanPage: function(){
        return this._info.isLikedFanPage;
    },
    setIsLikedFanPage: function(b){
        if(b === undefined) return;
        this._info.isLikedFanPage = b;
    },
    setIsRateApp: function(b){
        if(b === undefined) return;
        this._info.isRateApp = b;
    },
    getDayOld: function(){
        if(this._info && this._info.createdTime > 0){
            return (this._info.serverTime - this._info.createdTime) / 86400;
        }
        else return 0;
    },
    getTimeRemainVip: function(){
        var timeCurrent = Utility.getCurrentTime();
        if(this._info.vipLevel > 0){
            return this._info.vipExpiredTime - timeCurrent;
        }
        return 0;
    },
    updateVipLevel: function(){
        if(this.getTimeRemainVip() <= 0){
            this._info.vipLevel = 0;
        }
    },
    savePlayer: function(uId, player){
        return this._cachedPlayers[uId] = player;
    },

    getPlayerInfo: function (uId) {
        if(uId === undefined)
            return this._info;
        else{
            return this._cachedPlayers[uId];
        }
    },

    getVipLevel: function(){
        return this._info.vipLevel;
    },
    setVipLevel: function(toVip){
        if(toVip === undefined) return;
        this._info.vipLevel = toVip;
    },
    getLevel: function () {
        return this._info.level;
    },

    getHearts:function(){return this._info.hearts},
    getNumOfBoom:function(){return this._info.numOfBoom},
    getNumOfSpeed:function(){return this._info.numOfSpeed},
    getNumOfLen:function(){return this._info.numOfLen},

    getExp: function () {
        return this._info.levelExp;
    },
    setExp: function(exp){
        if(exp === undefined) return;
        this._info.levelExp = exp;
    },
    getNumOfDailySupported: function(){
        return this._info.numOfDailySupported;
    },
    setNumOfDailySupported: function(number){
        if(number === undefined) return;
        this._info.numOfDailySupported = number;
    },
    getGold: function () {
        return this._info.gold;
    },
    getVipPoints: function(){
        return this._info.vipPoint;
    },
    isEnoughGold: function (amount) {
        return this._info && this.getGold() >= amount;
    },

    logOut: function () {
        fr.portal.logOut();
        this.sendLogout();
        this.setFirstLogin(true);

        if(servicesMgr.isUsePortal()){
            backToPortal();
        }
        else{
            sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
            connector.disconnect();
        }
    },
    doFirstLogin: function(){
        // GSN tracking with game user_id and current plugins info
        var playerInfo = this.getPlayerInfo();
        var social = fr.portal.getCurrentSocial();
        var socialUId = zAccUserData.zpid;

        switch (social){
            case SocialName.Facebook:
                fr.facebook.init();
                break;
            case SocialName.Zalo:
                fr.zalo.init();
                break;
            case SocialName.Google:
                fr.google.init();
                break;
        }

        fr.platformWrapper.trackLoginGSN(playerInfo.uId, social, socialUId, playerInfo.uName);
        ZAccTracker.track(TrackingAction.LOCAL_PAYMENT_ENABLE, servicesMgr.isOnlyEnablePayment(PAYMENT_SYSTEM.IAP) ? '0' : '1');
        paymentModule._guiStoreGold && paymentModule._guiStoreGold.reloadConfig();
        //this.sendPlayerUpdateTelco();
    },


    handleClaimDailySupportGold: function(errorCode){
        if(errorCode == ERROR_CODE.SUCCESS){
            var sceneLobby = sceneMgr.getScene(GV.SCENE_IDS.LOBBY);
            sceneLobby.showGUIDailyGift(this._curPackage.gold);
            // add gold
            playerModule.addGold(this._curPackage.gold, true);
            playerModule.setNumOfDailySupported(playerModule.getNumOfDailySupported() + 1);
        }else{
            Popups.showError(this._curPackage.getError());
        }
    },
    handleGetPlayerInfoDetail: function(errorCode){
        //xu li lay thong tin chi tiet cua player
        if(errorCode == ERROR_CODE.SUCCESS){
            //if(this.sendGetPlayerInfoDetail.gold != null){
            //    this._curPackage.dataPlayer.gold +=this.sendGetPlayerInfoDetail.gold;
            //}
            this.savePlayer( this._curPackage.dataPlayer.uId, this._curPackage.dataPlayer);
            this.showGUIInforDetail(this._curPackage.dataPlayer);
        }else{
            /*this.dataPlayer = {};
             this.dataPlayer.uId = this.getInt();
             this.dataPlayer.uName = this.getString();
             this.dataPlayer.displayName = this.getString();
             this.dataPlayer.avatarURL = this.getString();
             this.dataPlayer.gold = this.getLong();
             this.dataPlayer.level = this.getShort();
             this.dataPlayer.vipLevel = this.getByte();
             this.dataPlayer.totalGame = this.getShort();
             this.dataPlayer.totalWin = this.getShort();
             this.dataPlayer.totalLose = this.getShort();
             this.dataPlayer.totalPenalty = this.getShort();
             */
            var data = this.getFakeDataPlayer(
                this.sendGetPlayerInfoDetail.uId ,
                this.sendGetPlayerInfoDetail.displayName,
                this.sendGetPlayerInfoDetail.defaultAvatar,
                this.sendGetPlayerInfoDetail.level,
                this.sendGetPlayerInfoDetail.vip,
                this.sendGetPlayerInfoDetail.gold
            );
            this.savePlayer( data.uId, data);
            this.showGUIInforDetail(data);

            //Popups.showError(this._curPackage.getError());
        }

    },
    handleUpgradeVip: function(errorCode){
        if(errorCode == ERROR_CODE.SUCCESS){
            sceneMgr.hideGUIWaiting();
            var toVip =this.sendPlayerUpgradeVip.toVip;
            if(toVip!== undefined){
                var configVip = resourceMgr.getConfigVip()[toVip];
                // add gold directly bonus
                this.effectAddGold(configVip['directlyGoldBonus'], toVip);
                // set ExpiredVip
                if(this.getVipLevel() == toVip){
                    this.setVipExpiredTime(this.getVipExpiredTime() + configVip['duration']);
                }else{
                    this.setVipExpiredTime(Utility.getCurrentTime() + configVip['duration']);
                }
                //set vip level
                this.setVipLevel(toVip);
                //sub vip point
                this.subVipPoint(configVip['requiredPoint']);
                // update GUI
                var sceneVIp = sceneMgr.getScene(GV.SCENE_IDS.REGISTER_VIP);
                sceneVIp.updateInfoPlayer && sceneVIp.updateInfoPlayer();
            }
        }
        else{
            Popups.showError(this._curPackage.getError());
        }
    },
    handleCheatAttributes: function(){
        if (this._curPackage.getError() == ERROR_CODE.SUCCESS) {
            ZLog.error("vao day cheat 1");
            //this.sendGetPlayerInfo();
            //playerModule.setGold(goldCheated);
        }else{
            ZLog.error("vao day cheat 2");

        }
    },
    handleUpdateUrlAvatar:function(){
        if(fr.platformWrapper.getConnectionStatus() != CONNECTION_STATUS.NO_NETWORK
            && fr.portal.getCurrentSocial() == SocialName.Facebook) {
            var openId = fr.facebook.getOpenId();

            xmlHttpRequest(fr.facebook.urlGetAvatar.replace("@openId", openId),function(result){
                if(result.data && result.data.url){
                    var url = result.data.url;
                    var curScene = sceneMgr.getCurrentScene();

                    this.setAvatar(url);
                    curScene.updatePlayerInfo && curScene.updatePlayerInfo();

                    var pk = this.getOutPacket(CmdSendUpdateUrlAvatar, url);
                    this.send(pk);

                    ZLog.debug("success: " + url);
                }else{
                    ZLog.error("fail: "+JSON.stringify(result));
                }
            }.bind(playerModule));
        }
    },
    handleSystemMaintain: function(errorCode){
        if(errorCode == ERROR_CODE.SUCCESS){

            fr.UserData.setString(UserDataKey.MAINTAIN_SYSTEM, Utility.getCurrentTime() + this._curPackage.remainTime + "");

            this.addNotificationMaintain(this._curPackage.remainTime);
            // sau 1s thi cap nhat 1 lan
            gameLoop.addTask(new Task(KEY.MAINTAIN_SYSTEM, this.remindNotificationMaintain.bind(this), 1));
        }
        else{
            Popups.showError(this._curPackage.getError());
        }
    },
    handleClaimRateApp: function(){
        if(this._curPackage.getError() == ERROR_CODE.SUCCESS){
            var addedGold = resourceMgr.getGoldRateApp();
            // add gold
            this.addGold(addedGold, true);
            this.showGUIReceiveGold(addedGold);
        }
        else{
            Popups.showError(this._curPackage.getError());
        }
    },
    handleClaimLikePage: function(){
        if(this._curPackage.getError() == ERROR_CODE.SUCCESS){
            var addedGold = LobbyResourceMgr.getGoldLikeFanPage();
            // add gold
            this.addGold(addedGold, true);
            this.showGUIReceiveGold(addedGold);
        }
        else{
            Popups.showError(this._curPackage.getError());
        }
    },

    effectAddGold: function(golds, toVip){
        if(golds === undefined) return;

        var nameVip = languageMgr.getString("NAME_VIP_" + toVip);
        var string = languageMgr.getString('TEXT_CONGRAT_BECOME_VIP')
            .replace('@vip', nameVip)
            .replace('@gold', Utility.formatMoney(golds, ''));
        var content = {text: string};
        var listButtons = [
            {btnName: 'ok', hide: true, callback: function(){
                EffectMgr.runGoldenRain(0);
                this.addGold(parseInt(golds));
            }.bind(this)}
        ];
        Popups.show(content, listButtons);
    },
    remindNotificationMaintain: function(){
        var loop_time = 60;

        // neu be hon 1 phut thi hien thong bao
        var timeRemain = parseInt(fr.UserData.getString(UserDataKey.MAINTAIN_SYSTEM, 0) - Utility.getCurrentTime());
        if(timeRemain > 0){
            if(timeRemain <= loop_time){
                if(this.remindNotificationMaintain.init === undefined) this.remindNotificationMaintain.init = false;
                if(this.remindNotificationMaintain.init == true) return;
                this.remindNotificationMaintain.init = true;
                this.addNotificationMaintain(timeRemain);

            }

        }else{
            // huy dang ki va show gui maintain
           //this.showGUIMaintain();
            gameLoop.removeTask(KEY.MAINTAIN_SYSTEM);

        }

    },
    addNotificationMaintain: function(timeRemain){
        var msg = languageMgr.getString("NOTIFICATION_SYSTEM_MAINTAIN").replace("@time", Utility.timeToString(timeRemain, 'MM@m', true, false, 1, true));
        BroadcastReceiver.addNotification({
            msg : msg,
            loop: 2
        });
    },

    showGUIMaintain: function(){
        if(this._guiMaintain == null){
            this._guiMaintain = new GUIMaintain();
            this._guiMaintain.retain();
        }
        this._guiMaintain.showAtCurrentScene();
    },
    showGUIInforDetail: function(data){
        if(this._guiInfoDetail == null){
            this._guiInfoDetail = new GUIInfoDetail();
            this._guiInfoDetail.retain();
        }
        this._guiInfoDetail.initDataToShow(data);
        if(!this._guiInfoDetail.isVisible()) this._guiInfoDetail.showAtCurrentScene();
    },
    showGUIReceiveGold:function(gold){
        if(this._guiReceiveGold == null){
            this._guiReceiveGold = new GUIReceiveGold();
            this._guiReceiveGold.retain();
        }
        this._guiReceiveGold.setGold(gold);
        this._guiReceiveGold.showAtCurrentScene(Z_ORDER_GUI_RECEIVE_GOLD);
    },



    sendPlayerCheat: function (data) {
        var pk = this.getOutPacket(CmdSendGetPlayerCheat,data);
        this.send(pk);
    },
    sendPlayerUpdateTelco: function () {
        var pk = this.getOutPacket(CmdSendPlayerUpdateTelco);
        this.send(pk);
    },
    /**
     * displayName: for caching, creating fake info
     * defaultAvatar: for caching, creating fake info
     * @param uId
     * @param displayName
     * @param defaultAvatar
     * @param level
     * @param vip
     * @param gold
     */
    sendGetPlayerInfoDetail: function (uId, displayName, defaultAvatar, level,vip,gold) {
        this.sendGetPlayerInfoDetail.uId = uId;
        this.sendGetPlayerInfoDetail.displayName = displayName;
        this.sendGetPlayerInfoDetail.defaultAvatar = defaultAvatar;
        this.sendGetPlayerInfoDetail.level = level;
        this.sendGetPlayerInfoDetail.vip = vip;
        this.sendGetPlayerInfoDetail.gold = gold;

        if(this.getPlayerInfo(uId)!= null){
            this.showGUIInforDetail(this.getPlayerInfo(uId));
        }

        var pk = this.getOutPacket(CmdSendGetPlayerInfoDetail, uId);
        this.send(pk);
    },
    sendPlayerUpgradeVip: function(toVip){
        if(toVip === undefined) return;


        var pk = this.getOutPacket(CmdSendPlayerUpgradeVip, {toVip: toVip});
        this.send(pk);
    },
    sendCheatAttribute: function (attribute, value, uId) {
        if (uId === undefined) uId = this._info.uId;
        ZLog.debug("uid = %d", uId);

        var pk = this.getOutPacket(CmdSendCheatAttribute, {uId: uId, attribute: attribute, value: value});
        this.send(pk);
    },
    sendLogout: function () {
        var pk = this.getOutPacket(CmdSendLogout);
        this.send(pk);
    },
    sendTestTypeData: function (data) {
        var pk = this.getOutPacket(CmdSendTestTypeData, data);
        this.send(pk);
    },
    sendClaimDailySupportGold: function(){
        var pk = this.getOutPacket(CmdSendClaimDailySupportGold);
        this.send(pk);
    },
    sendClaimRateApp: function(){
        this.setIsRateApp(true);
        var pk = this.getOutPacket(CmdSendClaimRateApp);
        this.send(pk);
    },
    sendClaimLikeFanPage: function(){
        this.setIsLikedFanPage(true);
        var pk = this.getOutPacket(CmdSendClaimLikeFanPage);
        this.send(pk);
    },

    //=========================================================
    updateGoldForScene: function (value) {
        if(value === undefined) value = this.getGold();
        var currentScene = sceneMgr.getCurrentScene();

        if (currentScene.lbGold) {
            currentScene.lbGold.setString(Utility.formatMoney(value, ""));
        }
    },
    upgradeVip: function(toVip){
        if(toVip === undefined) return;
        // kiem tra neu vip hien tai lon hon -> thong bao ban khong de nang cap vip nho hon
        // Khong du tien-> hien thi gui shop
        if(this.getVipLevel() > toVip){
            var content = {text: languageMgr.getString("VIP_CANNOT_SWITCH_TO_LOWER_VIP")};
            var listButtons = [
                {btnName: 'ok', hide: true, callback: function(){
                }.bind(this)}
            ];
            Popups.show(content, listButtons);
            return ;
        }
        var config = resourceMgr.getConfigVip();
        if(this.getVipPoints() < config[toVip]['requiredPoint']){
            Popups.showMessageNotEnoughGold(
                languageMgr.getString("NOTIFICATION_NOT_ENOUGH_VPOINT_TO_BUY_VIP").replace('@res', '#icon_diamond.png')
            );
            return ;
        }

        var timeRemain  = playerModule.getVipExpiredTime() - Utility.getCurrentTime();
        if(timeRemain > 0 && (toVip > this.getVipLevel())){
            var text = languageMgr.getString("VIP_WARRING_OVERRIDE_CURRENT_VIP")
                .replace("@timeVip", LobbyUtility.formatTimeVip(timeRemain))
                .replace("@newTime", LobbyUtility.formatTimeVip(config[toVip]['duration']))
                .replace("@nameVip", languageMgr.getString("NAME_VIP_" + toVip));
            var content = {text: text};
            var listButtons = [
                {btnName: 'ok', hide: true, callback: function(){
                    sceneMgr.showGUIWaiting();
                    this.sendPlayerUpgradeVip.toVip = toVip;
                    this.sendPlayerUpgradeVip(toVip);
                }.bind(this)},
                {btnName: 'cancel', hide: true}
            ];
            Popups.show(content, listButtons);
        }else{
            var text = languageMgr.getString('CONFIRM_UPGRADE_VIP')
                .replace("@vpoint", Utility.formatMoneyFull(config[toVip]['requiredPoint'], ''))
                .replace("@vipName", languageMgr.getString("NAME_VIP_" + toVip))
                .replace("@res", '#icon_diamond.png');
            var content = {text: text};
            var listButtons = [
                {btnName: 'ok', hide: true, callback: function(){
                    sceneMgr.showGUIWaiting();
                    this.sendPlayerUpgradeVip.toVip = toVip;
                    this.sendPlayerUpgradeVip(toVip);
                }.bind(this)},
                {btnName: 'cancel', hide: true}
            ];
            Popups.show(content, listButtons);
        }
    },
    setVipPoint: function(value){
        if(value === undefined) return;
        this._info.vipPoint = value;
    },
    addVipPoint: function(value){
        if(value === undefined) return;
        this._info.vipPoint += value;
    },
    subVipPoint: function(value){
        if(value === undefined) return;
        if(this._info.vipPoint - value > 0){
            this._info.vipPoint -= value;
        }

    },
    addExp: function (value) {
        this._info.exp += value;
        ZLog.debug("addExp: %d", value);

        var maxLevel = resourceMgr.getConfigMaxLevel();
        var curLevel = this._info.level;
        for (var i = this._info.level; i < maxLevel; ++i) {
            var config = resourceMgr.getConfigLevel(i);
            if (this._info.exp < config["requiredExp"]) {
                curLevel = i;
                break;
            }
            else{
                this._info.exp -= config["requiredExp"];
            }
        }

        return curLevel;
    },
    setGold: function (value, updateUI) {
        if(updateUI === undefined) updateUI = true;
        this._info.gold = value;

        ZLog.error("SET GOLD,  new value = %s", Utility.formatMoney(this._info.gold));
        if(updateUI){
            this.updateGoldForScene();
        }
    },
    addGold: function (value, updateUI) {
        if(updateUI === undefined) updateUI = true;
        this._info.gold += value;

        ZLog.error("ADD GOLD,  new value = %s, offset = %s", Utility.formatMoney(this._info.gold), Utility.formatMoney(value));
        if(updateUI){
            this.updateGoldForScene();
        }
    },
    subGold: function(value, updateUI){
        if(value === undefined) return;
        if(this._info.gold - value > 0){
            this._info.gold -= value;
        }
        if(updateUI){
            this.updateGoldForScene();
        }
    },
    getFakeDataPlayer:function(uId,displayName,defaultAvatar,level,vip,gold){

        var totalGame;
        var totalWin;
        var totalLose;
        var totalPenalty;
        var avatarUrl;
        var account = 123456789012345;
        if(displayName == null) displayName  ="";
        for (var i = 0; i < displayName.length; i++) {
            var value = displayName.charCodeAt(i);
            account += value * (Math.pow(10, i));
            account %= 900000000000000;
        }

        //version 1
        /*totalGame = parseInt(account % 100 + level * 100);
        totalWin = parseInt(totalGame*0.4);
        totalLose = parseInt(totalGame*0.6);
        totalPenalty = parseInt(totalLose *0.1);*/

        //version 2
        //1. tinh tong so tien can de len duoc chung do level neu win
        //1.1 totalMoneyNeed ==> so tien tong so van choi
        //2. moneyWinEachGame ==>chon trung binh muc gia cua van choi tu 9k ==> min(tong so tien, 30M)
        //2.2 totalGameNeed => tong so van choi
        //  rateWinLose ==> win thua ( dua vao phan tram so tien ran dom (cang gan max ==> win nhieu ==> can gan min ==> thua nhieu
        // rateChanel ==> dua vao totalMoneyNeed xac dinh so kenh tham gia va ti le kenh tham gia ==1:15k ,2:50K, 3:500k, 4:5M
        // gameWin = (totalMoneyNeed * rateWin) / total(rateChanel * costChanel)
        // gameLose = (totalMoneyNeed * rateLose) / total(rateChanel * costChanel) * 5
        // gamePenalty
        var totalMoney = playerModule.getTotalMoneyNeedToReachLevel(level);
        var percentWin = account%60/60+0.2;
        var moneyWinEachGame = playerModule.ranAverageMoneyEachGame(totalMoney,percentWin);
        var rateWinGame = playerModule.getRateWinGame(totalMoney,moneyWinEachGame,percentWin);
        moneyWinEachGame = playerModule.getRealMoneyWinEachGameWithChanel(totalMoney,percentWin);
        totalWin = playerModule.getGameWin(totalMoney,rateWinGame,moneyWinEachGame);
        totalLose = playerModule.getGameLose(totalMoney,rateWinGame,moneyWinEachGame);
        //totalPenalty = parseInt(_.random(0,0.2) * totalLose );
        totalPenalty = parseInt(percentWin*0.1 * totalLose );
        totalGame = totalLose + totalWin;
        account = "fb." + account;
        return {
            uId:uId,
            uName:account,
            displayName:displayName,
            avatarURL:defaultAvatar,
            gold:gold,
            level:level,
            vipLevel:vip,
            totalGame:totalGame,
            totalWin:totalWin,
            totalLose:totalLose,
            totalPenalty:totalPenalty,
            version: GV.VERSION_FULL
        };
    },
    getTotalMoneyNeedToReachLevel:function(level){
        var goldTotal = 0;
        for(var i = 1; i<level;i++){
            var config = resourceMgr.getConfigLevel(i);
            if(config){
                goldTotal += config["requiredExp"] * 1000;
            }
        }
        return goldTotal;
    },
    ranAverageMoneyEachGame:function(totalMoney,percentWin){
        if(percentWin){
            var goldMax =9000 + _.min([30000000,totalMoney]);
            return goldMax * percentWin;
        }
        return _.random(9000, _.min([30000000,totalMoney]));//9k 3M
    },
    getRateWinGame:function(totalMoney,moneyEachGame,percentWin){
        //9k ==> moneyEachGame or 30M
        if(percentWin){
             return percentWin%80/100+0.2;
        }
       return _.random(0.3,0.6,true);
        //if((moneyEachGame/totalMoney) > 0.7){
        //    return (_.random(4000,moneyEachGame)/ moneyEachGame);
        //}
        //return (_.random(4000,moneyEachGame)/ 30000000);
    },
    getRealMoneyWinEachGameWithChanel:function(totalMoney,percentWin){
        percentWin = percentWin || 0;

        var result =  [0.3,0.4,0.2,0.1];
        if(totalMoney<5000000){
            result[3] = 0;
            result[0] = 0.4;
        }
        if(totalMoney<500000){
            result[2] = 0;
            result[0] = 0.6;
        }
        if(totalMoney<50000){
            result[1] = 0;
            result[0] = 1;
        }
        //return parseInt(result[0] * _.random(3000,15000) + result[1] * _.random(1500,50000) + result[2] * _.random(50000,500000) + result[3]*_.random(1000000,5000000));
        return parseInt(result[0] * (3000 + percentWin* 12000) + result[1] * (15000 + percentWin* 35000) + result[2] *(50000 + percentWin* 450000) + result[3]* (1000000 + percentWin* 4000000));
    },
    getGameWin:function(totalMoney,rateWin,moneyWinEachGame){
        return parseInt(totalMoney * rateWin/ moneyWinEachGame);
    },
    getGameLose:function(totalMoney,rateWin,moneyWinEachGame){
        return parseInt(((totalMoney * (1- rateWin)) / moneyWinEachGame) * 5);
    },
    cleanUp: function(){
        this._super();
    }
});