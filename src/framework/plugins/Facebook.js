/**
 * Created by GSN on 9/30/2015.
 */

fr.facebook = {
    pluginUser: null,
    uId: null,
    openId: null,
    urlGetAvatar: 'https://graph.facebook.com/@openId/picture?type=large&redirect=false',

    init:function(){
        this.callback = null;
        if(plugin.PluginManager == null) return false;

        if(fr.facebook.pluginUser == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.facebook.pluginUser = pluginManager.loadPlugin("UserFacebook");
            fr.facebook.agent = plugin.FacebookAgent.getInstance();
        }
        return true;
    },

    setUId: function(uid){
        this.uId = uid;
        fr.UserData.setString(SocialName.Facebook + UserDataKey.USER_ID, uid);
    },

    getUId: function(){
        if(this.uId == null){
            this.uId = fr.UserData.getString(SocialName.Facebook + UserDataKey.USER_ID, "");
        }

        return this.uId;
    },

    setOpenId: function(id){
        this.openId = id;
        fr.UserData.setString(SocialName.Facebook + UserDataKey.OPEN_ID, id);
    },

    getOpenId: function(){
        if(this.openId == null){
            this.openId = fr.UserData.getString(SocialName.Facebook + UserDataKey.OPEN_ID, "");
        }

        return this.openId;
    },

    /**
     *
     * @param callback
     */
    login: function (callback) {
        if(!this.init()){
            Popups.showMessage(languageMgr.getString("ERROR_CAN_NOT_INIT_PLUGIN").replace("@pluginName", SocialName.Facebook));
            var log = "fail&socialName=" + SocialName.Facebook + "&error=init_failed";
            OpenTracker.track(TrackingAction.LOGIN, log);
            return;
        }

        var savedSessionKey = servicesMgr.isUsePortal()
            ? getPortalSessionKey()
            : fr.UserData.getStringCrypt(SocialName.Facebook + UserDataKey.SESSION_KEY, '');
        if(savedSessionKey && savedSessionKey.trim().length > 0){
            if(savedSessionKey.length < 10 && GV.MODE == BUILD_MODE.LIVE){
                ClientError.throw(ClientErrorKey.SESSION_KEY,"facebook|" + servicesMgr.isUsePortal() +"|" + savedSessionKey +"|");
            }
            fr.portal.setCurrentSocial(SocialName.Facebook);
            fr.portal.connectServerGame(savedSessionKey);

            callback && callback();
        }
        else{
            this.callback = callback;

            var self = this;
            if (this.agent.isLoggedIn() && cc.sys.isNative){
                this.agent.logout(function(){
                    _.delay(function(){
                        self.agent.login(["public_profile", "email"], self.onLoginComplete.bind(self));
                    }, 1500);
                });
            }
            else{
                this.agent.login(["public_profile", "email"], this.onLoginComplete.bind(this));
            }
        }
    },

    logOut: function(callback) {
        if(this.agent) this.agent.logout(callback);
    },

    onLoginComplete: function(result, msg){
        ZLog.debug("facebook onLoginComplete : " + JSON.stringify(msg));

        if(result != 2){ // 2 = log out success

            if (result == plugin.FacebookAgent.CODE_SUCCEED) {
                var log = "success&socialName=" + SocialName.Facebook + "&error=" + result;
                OpenTracker.track(TrackingAction.LOGIN, log);

                fr.portal.setCurrentSocial(SocialName.Facebook);

                // get session key from zing play portal
                fr.portal.getSessionKeyFromPortal(msg["accessToken"], SocialName.Facebook, "fb_info_null");

                this.callback && this.callback();
                this.callback = null;
            } else {
                log = "fail&socialName=" + SocialName.Facebook + "&error=" + result;
                OpenTracker.track(TrackingAction.LOGIN, log);

                // TODO un-schedule show login fail

                if(sceneMgr.isScene(GV.SCENE_IDS.LOADING)){
                    _.delay(function(){
                        sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                    }, 2000);
                }
                else{
                    if(result == 1) { // user cancel
                        _.delay(function(){
                            if(sceneMgr.isScene(GV.SCENE_IDS.LOBBY)) {
                                playerModule.setFirstLogin(false);
                            }

                            sceneMgr.hideGUIWaiting();
                        }, 2000);
                    }
                    else{
                        Popups.showMessage(languageMgr.getString("ERROR_WHEN_LOGIN_FROM_SOCIAL")
                                .replace("@socialName", SocialName.Facebook) + "\ncode = " + result,
                            function(){
                                if(!sceneMgr.isScene(GV.SCENE_IDS.LOGIN)){
                                    sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                                }
                            }
                        );
                    }
                }
            }
        }
    },

    /**
     *
     * @param img
     */
    sharePhoto:function(img) {
        if(!this.init()){
            Popups.showMessage(languageMgr.getString("ERROR_CAN_NOT_INIT_PLUGIN").replace("@pluginName", SocialName.Facebook));
            return;
        }

        var info = {
            "dialog": "sharePhoto",
            "photo": img
        };

        this.agent.dialog(info, function(ret){
            // TODO share_photo_fail

            sceneMgr.hideGUIWaiting();

            if(ret == plugin.FacebookAgent.CODE_SUCCEED) {
                Notifications.show("NOTIFICATION_SHARE_SUCCESS");
            }else {
                Notifications.show("NOTIFICATION_SHARE_FAIL");
            }
        })
    }
};