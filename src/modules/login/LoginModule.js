/**
 * Created by bachbv on 1/21/2017.
 */

var LoginModule = BaseModule.extend({
    _className: "LoginModule",

    ctor: function(moduleId){
        this._super(moduleId);
        this.setListenerValue(0, 998);

        this.sessionId = "";
        this.userData = {};
        this.socialData = {};
        this._sessionKey = "";
        this._sessionToken = "";
    },

    //=========================================================
    // RECEIVE
    //=========================================================
    processPackages: function(cmd){
        if(this._curPackage == null){
            cc.warn("%s NOT FOUND curPackage with cmd (%d)", this.getClassName(), cmd);
            return;
        }

        switch (cmd){
            case CMD.USER_LOGIN:
                this.handleUserLogin();
                break;
            case CMD.HAND_SHAKE:
                this.handleHandShake();
                break;
            case CMD.DISCONNECTED:
                this.handleDisconnected();
                break;
            case CMD.CONNECT_UDP:
                this.handleUdpConnected();
                break;
            default :
                break;
        }
    },
    createReceivedPackage: function(cmd, pkg){
        var pk = null;
        switch (cmd){
            case CMD.USER_LOGIN:
                pk = this.getInPacket(CmdReceiveLogin);
                break;
            case CMD.DISCONNECTED:
                pk = this.getInPacket(CmdReceiveDisconnect);
                break;
            case CMD.HAND_SHAKE:
                pk = this.getInPacket(CmdReceiveHandShake);
                break;
            case CMD.CONNECT_UDP:
                pk = this.getInPacket(CmdReceiveHandShake);
                break;
            default :
                break;
        }

        return pk;
    },

    setUserData: function(userData){
        this.userData = userData;
        ZLog.debug("setUserData | " + JSON.stringify(userData));
    },

    getUserData: function(){
        return this.userData;
    },

    setSessionKey: function(sessionKey){
        this._sessionKey = sessionKey + "";
    },

    getSessionToken:function(){
        return this._sessionToken;
    },

    getUserInfoTracking: function(){
        var obj = {
            clientVersion: GV.VERSION_FULL,
            osPlatform: fr.platformWrapper.getOsName(),
            osVersion: fr.platformWrapper.getOSVersion(),
            deviceId: fr.platformWrapper.getDeviceID(),
            deviceName: fr.platformWrapper.getDeviceModel(),
            connectionType: fr.platformWrapper.getConnectionStatus() == CONNECTION_STATUS.THREE_G
                ? "3G"
                : (fr.platformWrapper.getConnectionStatus() == CONNECTION_STATUS.WIFI ? "wifi" : "null"),
            locate: servicesMgr.getCountry(),
            downloadSource: "",
            thirdPartySource: fr.platformWrapper.getZPThirdPartySource(),
            userSource: servicesMgr.isUsePortal() ? 'portal' : GV.GAME
        };

        ZLog.debug("USER_INFO_TRACKING | " + JSON.stringify(obj));
        return obj;
    },

    handleUserLogin: function(){
        if(this._errorCode == ERROR_CODE.SUCCESS){
            //wait until receive pack player info ==> scene lobby or table scene
            //playerModule.sendGetPlayerInfo();
            ////TODO open quest
            //lobbyModule.sendQuestInfo();
            //lobbyModule.sendSafeBoxGetInfo();
            //lobbyModule.sendMailInfo(0,20);
            //connectorUdp.connect();
            loginModule.sendConnectUdp();
            pingModule.startPing();
            TimeMgr.Instance.run();
        }
        else if(this._errorCode == ERROR_CODE.SESSION_EXPIRED
            || this._errorCode == ERROR_CODE.SESSION_KEY_INVALID){

            ZLog.debug("USER_LOGIN: SESSION_EXPIRED or SESSION_KEY_INVALID, error_code = %d", this._errorCode);
            // clean session key in cache
            fr.UserData.setStringCrypt(fr.UserData.getString(UserDataKey.LOGIN_METHOD, "") + UserDataKey.SESSION_KEY, "");
            // re-login
            var lastLoginMethod = fr.UserData.getString(UserDataKey.LOGIN_METHOD, "");
            ZLog.debug("LOGIN_METHOD:" + lastLoginMethod);
            if(lastLoginMethod.length > 0){
                switch (lastLoginMethod){
                    case SocialName.ZAcc:
                        var username = fr.UserData.getString(lastLoginMethod + UserDataKey.USER_NAME, "");
                        var password = fr.UserData.getStringCrypt(lastLoginMethod + UserDataKey.PASSWORD, "");
                        if(username.length > 0 && password.length > 0){
                            fr.portal.login(lastLoginMethod, null, {username: username, password: password});
                        }
                        else{
                            sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                        }
                        break;

                    case SocialName.Facebook:
                    case SocialName.Zalo:
                        fr.portal.login(lastLoginMethod);
                        break;

                    default:
                        sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                        break;
                }
            }
            else{
                sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
            }
        }
        else{
            Popups.showError(this._errorCode);
        }
    },

    handleHandShake: function(){
        ZLog.debug("--------------Login---------------");

        if(this._errorCode == ERROR_CODE.SUCCESS){
            this._sessionToken = this._curPackage._sessionToken;
            this.sendLogin(this._sessionKey, this.getUserInfoTracking(), this.socialData);
        }
        else{
            Popups.showError(this._errorCode);
        }
    },

    handleDisconnected: function(){
        if(!connector.isConnected()) return;

        var canRetry = true;
        switch (this._errorCode){
            case DisconnectReason.LOGIN:
                canRetry = false;
                var content = {text: languageMgr.getString("ERROR_LOGIN_SOMEWHERE")};
                break;

            case DisconnectReason.KICK:
                content = {text: languageMgr.getString("DISCONNECT_KICK")};
                canRetry = false;
                break;

            case DisconnectReason.BAN:
                content = {text: languageMgr.getString("DISCONNECT_BAN")};
                canRetry = false;
                break;

            case DisconnectReason.HANDSHAKE:
                content = {text: languageMgr.getString("DISCONNECT_HANDSHAKE")};
                break;

            case DisconnectReason.UNKNOWN:
            case DisconnectReason.IDLE:
            default:
                content = {text: languageMgr.getString("DISCONNECT_UNKNOWN")};
                break;
        }

        if(canRetry){
            ZLog.debug("DISCONNECTED: login module: canRetry, error = " + this._errorCode);
            var listButtons = [
                {btnName: 'other', titleText: languageMgr.getString("RETRY"), hide: true, callback: {caller: connector, funcName: connector.reconnect, args: []}},
                {btnName: 'close', callback: {caller: sceneMgr, funcName: sceneMgr.viewSceneById, args: [GV.SCENE_IDS.LOGIN]}}
            ];
        }
        else{
            ZLog.debug("DISCONNECTED: login module: cannot Retry, error = ", this._errorCode);
            listButtons = [
                {btnName: 'ok', hide: true, callback: {caller: sceneMgr, funcName: sceneMgr.viewSceneById, args: [GV.SCENE_IDS.LOGIN]}},
                {btnName: 'close', callback: {caller: sceneMgr, funcName: sceneMgr.viewSceneById, args: [GV.SCENE_IDS.LOGIN]}}
            ];
        }

        Popups.show(content, listButtons);
        connector.disconnect();
    },

    handleUdpConnected:function(){
        connectorUdp.setConnected(true);
        playerModule.sendGetPlayerInfo();
        playerModule.sendGetInventoryInfo();

        ZLog.debug("--------------connect udp success---------------");
        var lobby = sceneMgr.getScene(GV.SCENE_IDS.LOBBY);
        lobby.onUdpConnected();
        this.removeTimeout(CMD.CONNECT_UDP);
    },



    //=========================================================

    //=========================================================
    // SEND
    //=========================================================
    sendHandShake: function(){
        ZLog.debug("--------------HAND_SHAKE---------------");
        var pk = this.getOutPacket(CmdSendHandshake);
        this.send(pk);
    },

    sendLogin: function(sessionKeyFromPortal, userData, socialData){
        if(Cheat.fakeData){
            this._errorCode == ERROR_CODE.SUCCESS;
            this.handleUserLogin();
            return;
        }
        if(sessionKeyFromPortal && sessionKeyFromPortal.length > 0){
            var pk = this.getOutPacket(CmdSendLogin, {sessionKey: sessionKeyFromPortal, userData: userData, socialData: socialData});
            this.send(pk);
        }
        else{
            ZLog.error("--> sendLogin: sessionKeyFromPortal not found");
            var pk = this.getOutPacket(CmdSendLogin, {sessionKey: "", userData: userData, socialData: socialData});
            this.send(pk);
        }
    },

    sendConnectUdp:function(){
        if(Cheat.fakeData){
            this.handleUdpConnected();
            return;
        }
        var pk = this.getOutPacket(CmdSendConnectUdp , this.getSessionToken());
        this.sendUdpConnect(pk);
        ZLog.debug("--------------sendConnectUdp---------------");
        this.addTimeout(CMD.CONNECT_UDP,5000,this.sendConnectUdp.bind(this));
    },
    sendUdpTest:function(msg){
        msg  = msg || "";
        var pk = this.getOutPacket(CmdSendTestUdp ,msg);
        this.sendUdp(pk);
        ZLog.error("send udp test:" + msg);
    }
    //=========================================================
});

DisconnectReason = {
    IDLE: 0,
    KICK: 1,
    BAN: 2,
    LOGIN: 3,
    UNKNOWN: 4,
    HANDSHAKE: 5
};
