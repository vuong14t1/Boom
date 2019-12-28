/**
 * Created by GSN on 9/30/2015.
 */

fr.google = {
    pluginUser:null,
    uId: null,
    openId: null,

    init:function() {
        if(plugin.PluginManager == null) return false;

        if(fr.google.pluginUser == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.google.pluginUser = pluginManager.loadPlugin("UserGoogle");
            ZLog.debug('init plugin gg-plus success');
        }

        return true;
    },

    setUId: function(uid){
        this.uId = uid;
        fr.UserData.setString(SocialName.Google + UserDataKey.USER_ID, uid);
    },

    getUId: function(){
        if(this.uId == null){
            this.uId = fr.UserData.getString(SocialName.Google + UserDataKey.USER_ID, "");
        }

        return this.uId;
    },

    setOpenId: function(id){
        this.openId = id;
        fr.UserData.setString(SocialName.Google + UserDataKey.OPEN_ID, id);
    },

    getOpenId: function(){
        if(this.openId == null){
            this.openId = fr.UserData.getString(SocialName.Google + UserDataKey.OPEN_ID, "");
        }

        return this.openId;
    },

    login:function(callback) {
        if(!this.init()) {
            Popups.showMessage(languageMgr.getString("ERROR_CAN_NOT_INIT_PLUGIN").replace("@pluginName", SocialName.Google));
            var log = "fail&socialName=" + SocialName.Google + "&error=init_failed";
            OpenTracker.track(TrackingAction.LOGIN, log);

            return;
        }

        var savedSessionKey = servicesMgr.isUsePortal()
            ? getPortalSessionKey()
            : fr.UserData.getStringCrypt(SocialName.Google + UserDataKey.SESSION_KEY, '');

        if(savedSessionKey && savedSessionKey.trim().length > 0){
            if(savedSessionKey.length < 10 && GV.MODE == BUILD_MODE.LIVE){
                ClientError.throw(ClientErrorKey.SESSION_KEY,"google|" + servicesMgr.isUsePortal() +"|" + savedSessionKey +"|");
            }
            fr.portal.setCurrentSocial(SocialName.Google);
            fr.portal.connectServerGame(savedSessionKey);
            callback && callback();
        }
        else{
            this.callback = callback;
            this.pluginUser.logout();
            this.pluginUser.login(function(result, msg){
                this.onLoginComplete(result, msg);
            }.bind(this));
        }
    },

    onLoginComplete:function(result, accessToken) {
        ZLog.debug("google onLoginComplete : " + JSON.stringify(arguments));

        if(result == Z_PORTAL_ERROR.SUCCESS){
            var log = "success&socialName=" + SocialName.Google + "&error=" + result;
            OpenTracker.track(TrackingAction.LOGIN, log);

            fr.portal.setCurrentSocial(SocialName.Google);
            fr.portal.getSessionKeyFromPortal(accessToken, SocialName.Google);

            this.callback && this.callback();
            this.callback = null;
        }
        else{
            log = "fail&socialName=" + SocialName.Google + "&error=" + result;
            OpenTracker.track(TrackingAction.LOGIN, log);

            if(sceneMgr.isScene(GV.SCENE_IDS.LOADING)){
                _.delay(function(){
                    sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                }, 2000);
            }
            else{
                _.delay(function(){
                    sceneMgr.hideGUIWaiting();
                }, 2000);
            }
        }
    },
};