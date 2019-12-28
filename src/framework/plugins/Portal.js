/**
 * Created by GSN on 9/29/2015.
 */
//zAccHostUrlPrivate          = "http://118.102.3.28:456?"; // private
//zAccHostUrlLive             = "http://52.76.245.162:443"; // live

zAccHostUrlPrivate              = "https://zingplay.com/mobile/openapi.php?api=getSessionKeyPrivate"; // private
zAccHostUrlLive                 = "https://zingplay.com/mobile/openapi.php?api=getSessionKey"; // live
myplayUrl                       = "http://myplay.apps.zing.vn/sso3/login.php?";

zAccData = {
    gameId:                     zAccGameId,
    service_name:               "getSessionKey",
    distribution:               "sea",
    clientInfo:                 "default",
    social:                     "facebook",
    accessToken:                "",
    deviceId:                   "default",
    partnerId:                  "default"
};

zAccUserData = {
    zpid:                       "",
    uName:                      "",
    social:                     "",
    socialUId:                  "",
};

SocialName = {
    ZAcc:                       "zacc",
    ZingMe:                     "zingme",
    Facebook:                   "facebook",
    Line:                       "line",
    Google:                     "google",
    Zalo:                       "zalo"
};

fr.portal = {
    loginCallBack: null,
    curSocial: SocialName.ZAcc,
    curNational: "",

    /**
     *
     */
    saveCurrentSocial: function(){
        fr.UserData.setString(UserDataKey.LOGIN_METHOD, this.curSocial);
    },

    /**
     *
     */
    saveCurrentNational: function(){
        fr.UserData.setString(UserDataKey.NATIONAL, this.curSocial);
    },

    /**
     *
     * @param socialName
     */
    setCurrentSocial: function(socialName){
        this.curSocial = socialName;

        this.saveCurrentSocial();
    },

    /**
     *
     * @returns {*}
     */
    getCurrentSocial: function(){
        return this.curSocial;
    },

    /**
     *
     * @param national
     */
    setCurrentNational: function(national){
        this.curNational = national;
        this.saveCurrentNational();
    },

    /**
     *
     * @returns {*}
     */
    getCurrentNational: function(){
        return this.curNational || COUNTRY.VIETNAM;
    },

    /**
     *
     * @param accessToken
     * @param social
     * @param gameInfo
     */
    getSessionKeyFromPortal: function (accessToken, social, gameInfo) {
        ZLog.debug("getSessionKeyFromPortal");
        zAccData.accessToken = accessToken;
        zAccData.social = social;
        zAccData.clientInfo = gameInfo || "default";
        if(cc.sys.isNative)
            zAccData.partnerId = fr.platformWrapper.getAppVersion();

        fr.UserData.setStringCrypt(social + UserDataKey.ACCESS_TOKEN, accessToken);
        var params = packDataForRequest(zAccData);
        xmlHttpRequest((GV.MODE == BUILD_MODE.LIVE ? zAccHostUrlLive : zAccHostUrlPrivate) + "" + params, this.onGetSessionKeyComplete.bind(this));
    },

    /**
     *
     * @param response
     */
    onGetSessionKeyComplete: function(response){
        ZLog.debug("onGetSessionKeyComplete");

        if(response.error == 0){
            var curSocial = this.getCurrentSocial();

            // cache session key
            fr.UserData.setStringCrypt(this.getCurrentSocial() + UserDataKey.SESSION_KEY, response["sessionKey"]);

            ZLog.debug("curSocial = %s", curSocial);
            if((curSocial == SocialName.Facebook || curSocial == SocialName.Zalo)){
                fr[curSocial].setOpenId(response["openId"]);
            }

            // connect to server game
            if(response["sessionKey"].length < 10 && GV.MODE == BUILD_MODE.LIVE){
                ZLog.error("error session_key");
                //ClientError.throw(ClientErrorKey.SESSION_KEY,"onGetSessionKeyComplete|" + servicesMgr.isUsePortal() +"|" + response["sessionKey"] +"|");
            }
            this.connectServerGame(response["sessionKey"]);
        }
        else{
            // TODO un-schedule show login fail

            Popups.showMessage(languageMgr.getString("ERROR_WHEN_GET_SESSION_KEY") + "\ncode: " + response.error, function(){
                if(!sceneMgr.isScene(GV.SCENE_IDS.LOGIN)){
                    sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                }
            });
        }
    },

    connectServerGame: function(sessionKey){
        ZLog.debug("CONNECT SERVER GAME | " + sessionKey);
        loginModule.setSessionKey(sessionKey);
        connector.connect();
    },

    /**
     *
     * @returns {boolean}
     */
    loginByCache: function(){
        var lastSocial = servicesMgr.isUsePortal() ? getPortalSocialType() : fr.UserData.getString(UserDataKey.LOGIN_METHOD, "");
        ZLog.debug("LOGIN_BY_CACHE | " + lastSocial);
        if(lastSocial.length > 0){
            var savedSessionKey = servicesMgr.isUsePortal()
                ? getPortalSessionKey()
                : fr.UserData.getStringCrypt(lastSocial + UserDataKey.SESSION_KEY, '');
            if(savedSessionKey && savedSessionKey.trim().length > 0){
                if(savedSessionKey.length < 10 && GV.MODE == BUILD_MODE.LIVE){
                    ClientError.throw(ClientErrorKey.SESSION_KEY,"loginByCache|" + servicesMgr.isUsePortal() +"|" + savedSessionKey +"|");
                }
                this.setCurrentSocial(lastSocial);
                this.connectServerGame(savedSessionKey);
                return true;
            }

            ZLog.debug("LOGIN_BY_CACHE fail, savedSessionKey = %s", savedSessionKey);
        }

        return false;
    },

    logOut: function(){
        var log = "logout&socialName=" + this.curSocial;
        OpenTracker.track(TrackingAction.LOGIN, log);
        playerModule.setFirstLogin(true);

        switch (this.curSocial){
            case SocialName.Zalo:
                fr.zalo.cleanUpFriendList();
                fr.facebook.isProcessingGetFriend = false;
                break;

            case SocialName.Facebook:
                fr.facebook.isProcessingGetFriend = false;

                if(!cc.sys.isNative){
                    fr.facebook.logOut(function() {
                        cc.error("facebook log out done");
                    });
                }
                break;

            case SocialName.Google:
                // do nothing
                break;
        }
    },

    /**
     *
     */
    loginByPriority: function(){
        if(servicesMgr.isReviewing()){
            return false;
        }

        var listMethodLogin = servicesMgr.getListLoginMethods();
        ZLog.debug("loginByPriority: %s", JSON.stringify(listMethodLogin));

        for(var i = 0; i < listMethodLogin.length; ++i){
            if(listMethodLogin[i] == SocialName.Facebook && fr.platformWrapper.isInstalledFacebookApp()){
                ZLog.debug("loginByPriority: Facebook");
                this.login(SocialName.Facebook);
                return true;
            }
            else if(listMethodLogin[i] == SocialName.Zalo && fr.platformWrapper.isInstalledZaloApp()){
                ZLog.debug("loginByPriority: Zalo");
                this.login(SocialName.Zalo);
                return true;
            }
            else{

            }
        }

        return false;
    },

    /**
     *
     * @param social
     * @param callback
     * @param otherData
     */
    login: function(social, callback, otherData){
        if(fr.platformWrapper.hasNetwork()){
            // TODO remove schedule login fail
            //asyncTaskMgr.removeTaskByKey("login_fail");
            //
            //var task = new SequenceTask();
            //task.pushTask(new BaseTask(null, function(){
            //    Popups.showMessage("CONNECTION_FAIL", function(){
            //        if(!sceneMgr.isScene(GV.SCENE_IDS.LOGIN)){
            //            sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
            //        }
            //    });
            //}, [], 20));
            //task.setKey("login_fail");
            //asyncTaskMgr.executeTask(task);

            sceneMgr.showGUIWaiting();
            switch (social){
                case SocialName.ZAcc:
                    var savedSessionKey = servicesMgr.isUsePortal()
                        ? getPortalSessionKey()
                        : fr.UserData.getStringCrypt(SocialName.ZAcc + UserDataKey.SESSION_KEY, '');
                    if(savedSessionKey.length < 10 && GV.MODE == BUILD_MODE.LIVE){
                        ClientError.throw(ClientErrorKey.SESSION_KEY,"loginGUI|" + servicesMgr.isUsePortal() +"|" + savedSessionKey +"|");
                    }
                    if(savedSessionKey && savedSessionKey.trim().length > 0){
                        fr.portal.setCurrentSocial(SocialName.ZAcc);
                        fr.portal.connectServerGame(savedSessionKey);
                        callback && callback();
                    }
                    else{
                        fr.zacc.login(otherData.username, otherData.password, callback);
                    }
                    break;

                case SocialName.Facebook:
                    fr.facebook.login(callback);
                    break;

                case SocialName.Zalo:
                    fr.zalo.login(callback);
                    break;

                case SocialName.Google:
                    fr.google.login(callback);
                    break;

                default:
                    sceneMgr.hideGUIWaiting();
                    Popups.showMessage("not found plugins login");
                    return;
            }
        }

        //this.loginCallBack = callback;
    },

    getListUIdInvited: function(){
        if(this.curSocial == SocialName.Facebook){
            fr.facebook.getListUIdInvited();
        }
        else if(this.curSocial == SocialName.Zalo){
            return [];
        }
    },

    setListUIdInvited: function(list){
        if(this.curSocial == SocialName.Facebook){
            fr.facebook.setListUIdInvited(list);
        }
        else if(this.curSocial == SocialName.Zalo){
            fr.zalo.setListUIdInvited(list);
        }
    },

    getListInvitedFriendCached: function(){
        if(this.curSocial == SocialName.Facebook){
            try{
                ZLog.debug(fr.UserData.getString(this.curSocial + playerModule.getUId() + UserDataKey.INVITED_FRIENDS));
                return JSON.parse(fr.UserData.getString(this.curSocial + playerModule.getUId() + UserDataKey.INVITED_FRIENDS, "[]"));
            }
            catch(err){
                ZLog.error("exception: %s", err.message);
            }
        }

        ZLog.debug("getListInvitedFriendCached = return []");
        return [];
    },

    canGetFriendList: function(){
        return cc.sys.isNative && this.curSocial == SocialName.Facebook;
    },

    getFriendList: function(type, callback){
        if(this.curSocial == SocialName.Facebook){
            fr.facebook.getFriendsNotPlayGame(callback);
            return true;
        }
        else{
            Notifications.show(languageMgr.getString("COMING_SOON"));
            return false;
        }
    },

    requestInviteMessage: function(friendList, msg, callback, idImage){
        if(this.curSocial == SocialName.Facebook){
            fr.facebook.requestInviteMessage(friendList, msg, callback);
        }
        else if(this.curSocial == SocialName.Zalo){
            fr.zalo.requestInviteMessage(friendList, msg, callback, idImage);
        }
    },


    inviteFriendsSuccess: function(uIdList){
        if(this.curSocial == SocialName.Facebook){
            fr.facebook._inviteSuccess(uIdList);
        }
        else if(this.curSocial == SocialName.Zalo){

        }
    },

    captureAndSharePhoto: function(){
        if(this.curSocial == SocialName.Facebook || this.curSocial == SocialName.Zalo){
            // capture
            var imgPath = Utility.captureScreen();

            if(imgPath == null || imgPath.length == 0) return;

            sceneMgr.showGUIWaiting();

            // share photo with delay
            setTimeout(function(){
                if(this.curSocial == SocialName.Facebook){
                    fr.facebook.sharePhoto(imgPath);
                }
                else if(this.curSocial == SocialName.Zalo){
                    fr.zalo.sharePhoto(languageMgr.getString("NOTIFICATION_SHARE_TITLE"), imgPath, function(response){
                        sceneMgr.hideGUIWaiting();

                        // TODO un-schedule share_photo_fail

                        if(response){
                            Notifications.show("NOTIFICATION_SHARE_SUCCESS");
                        }
                    });
                }
            }.bind(this), 2); // delay 2s

            // TODO schedule share fail
            //var task = new SequenceTask();
            //task.pushTask(new BaseTask(null, function(){
            //    sceneMgr.hideGUIWaiting();
            //
            //    Notifications.show("NOTIFICATION_SHARE_FAIL");
            //}, [], 60));
            //task.setKey("share_photo_fail");
            //asyncTaskMgr.executeTask(task);
        }
        else{
            Notifications.show("NOTIFICATION_CAPTURE_AND_SHARE_PHOTO");
        }
    },
};

backToPortal = function(){
    try{
        return fr.NativePortal.getInstance().endGame();
    }
    catch(err){
        ZLog.debug("backToPortal: " + err.message);
        return "";
    }
};

/**
 * get SSK from portal of khangvt
 * @returns {*}
 */
getPortalSessionKey = function(){
    try{
        return fr.NativePortal.getInstance().getSessionKey();
    }
    catch(err){
        ZLog.debug("getPortalSessionKey: " + err.message);
        return "";
    }
};

/**
 * get social type from portal of khangvt
 * @returns {*}
 */
getPortalSocialType = function(){
    //return SocialName.ZAcc;
    try{
        return fr.NativePortal.getInstance().getSocialType();
    }
    catch(err){
        ZLog.debug("getPortalSocialType: " + err.message);
        return "";
    }
};

isPortalIAPEnable = function(){
    return fr && fr.NativePortal
        && fr.NativePortal.getInstance().isShowInappShop && fr.NativePortal.getInstance().isShowInappShop();
};

/**
 *
 * @param urlRequest
 * @param callbackFunc
 */
xmlHttpRequest = function(urlRequest, callbackFunc){
    var xhr = cc.loader.getXMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            ZLog.debug('has response: ' + xhr.responseText);
            try{
                var objResponse = JSON.parse(xhr.responseText);
                callbackFunc && callbackFunc(objResponse);
            }
            catch(err){
                ZLog.debug('JSON parse error: ' + err.message + " | res = " + xhr.responseText);
                callbackFunc && callbackFunc({error: Z_PORTAL_ERROR.FAIL});
            }
        }
        else{
            ZLog.debug('onReadyStateChange: ' + xhr.readyState + ',status = ' + xhr.status);
            callbackFunc && callbackFunc({error: Z_PORTAL_ERROR.FAIL});
        }
    };

    xhr.onerror = function(){
        ZLog.debug('onError: ' + urlRequest);
        callbackFunc && callbackFunc({error: Z_PORTAL_ERROR.FAIL});
    };

    xhr.ontimeout = function(){
        ZLog.debug('onTimeout: ' + urlRequest);
        callbackFunc && callbackFunc({error: Z_PORTAL_ERROR.FAIL});
    };

    xhr.timeout = 5000;
    xhr.open("GET", urlRequest, true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send();

    ZLog.debug("xmlHttpRequest: " + urlRequest);
};

packDataForRequest = function(data){
    try{
        var params = "";
        for (var key in data) {
            if (data[key].length <= 0) {
                ZLog.debug("miss param: " + key);
                return params;
            }
            params += "&";
            params += key + "=" + data[key];
        }
        return params;
    }
    catch(err){
        ZLog.debug("error: " + err.message);
    }

    return "";
};

