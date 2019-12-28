/**
 * Created by GSN on 9/28/2015.
 */

var ZALO = {
    //method
    METHOD_ID_SMS:                              "0",
    METHOD_ID_ATM:                              "1",
    METHOD_ID_MERGE_CARD:                       "2",
    METHOD_ID_REDEEM_CODE:                      "3",
    METHOD_ID_ZING_CARD:                        "4",
    METHOD_ID_ZING_XU:                          "5",
    METHOD_ID_TELCO:                            "6",
    METHOD_ID_TELCO_MOBI:                       "7",
    METHOD_ID_TELCO_VIETTEL:                    "8",
    METHOD_ID_TELCO_VINAPHONE:                  "9",
    URL_OPEN_API:                               "http://openapi.zaloapp.com/",
    URL_AUTH:                                   "http://oauth.zaloapp.com/v2/access_token",
    APP_ID:                                     "2373720537799200165",
    PAYMENT_SECRET_KEY:                         "1bCFH3f5z9qlBHj1LPKj",
    OAUTH_SECRET_KEY:                           "QrSBA6UqdOncSB6EN2VI",

    LIST_ALL_FRIENDS:                           0,
    LIST_PLAYED_GAME_FRIENDS:                   1,
    LIST_NOT_PLAY_GAME_FRIENDS:                 2,
    LIST_CAN_INVITE_PLAY_GAME_FRIENDS:          3,
    LIST_INVITED_PLAY_GAME_FRIENDS:             4,

    RESULT_CODE_NO_ERROR:                       0,
    RESULT_CODE_PERMISSION_DENIED:              -201,
    RESULT_CODE_USER_BACK:                      -1111,
    RESULT_CODE_USER_REJECT:                    -1114,
    RESULT_CODE_ZALO_UNKNOWN_ERROR:             -1112,
    RESULT_CODE_UNEXPECTED_ERROR:               -1000,
    RESULT_CODE_INVALID_APP_ID:                 -1001,
    RESULT_CODE_INVALID_PARAM:                  -1002,
    RESULT_CODE_INVALID_SECRET_KEY:             -1003,
    RESULT_CODE_INVALID_OAUTH_CODE:             -1004,
    RESULT_CODE_ACCESS_DENIED:                  -1005,
    RESULT_CODE_INVALID_SESSION:                -1006,
    RESULT_CODE_CREATE_OAUTH_FAILED:            -1007,
    RESULT_CODE_CREATE_ACCESS_TOKEN_FAILED:     -1008,
    RESULT_CODE_USER_CONSENT_FAILED:            -1009,
    RESULT_CODE_APPLICATION_IS_NOT_APPROVED:    -1014,
    RESULT_CODE_ZALO_OAUTH_INVALID:             -1019,
    RESULT_CODE_CANT_LOGIN_ZINGME:              -1023,
    RESULT_CODE_CANT_LOGIN_FACEBOOK:            -1105,
};

fr.zalo = {
    pluginIAP: null,
    pluginUser: null,
    oauthCode: null,
    uId: null,
    openId: null,

    init:function(){
        this.callback = null;
        if(plugin.PluginManager == null) return false;

        if(fr.zalo.pluginUser == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.zalo.pluginIAP = pluginManager.loadPlugin("IAPZalo");
            fr.zalo.pluginUser = pluginManager.loadPlugin("UserZalo");

            fr.zalo.accessTokenExpireTime = 0;
            fr.zalo.isProcessingGetFriend = false;
            fr.zalo.listFriends = [null, null, null, null, null];
        }
        return true;
    },

    setUId: function(uid){
        this.uId = uid;
        fr.UserData.setString(SocialName.Zalo + UserDataKey.USER_ID, uid);
    },

    getUId: function(){
        if(this.uId == null){
            this.uId = fr.UserData.getString(SocialName.Zalo + UserDataKey.USER_ID, "");
        }

        return this.uId;
    },

    setOpenId: function(id){
        this.openId = id;
        fr.UserData.setString(SocialName.Zalo + UserDataKey.OPEN_ID, id);
    },

    getOpenId: function(){
        if(this.openId == null){
            this.openId = fr.UserData.getString(SocialName.Zalo + UserDataKey.OPEN_ID, "");
        }

        return this.openId;
    },

    setAuthenCode: function(code){
        this.oauthCode = code;
        fr.UserData.setString(SocialName.Zalo + UserDataKey.OAUTHEN_CODE, code);
    },

    getAuthenCode: function(){
        return this.oauthCode || fr.UserData.getString(SocialName.Zalo + UserDataKey.OAUTHEN_CODE, "");
    },

    isAccessTokenExpire: function(){
        return this.accessTokenExpireTime <= Utility.getClientTimeInSeconds();
    },

    updateAccessToken: function(accessToken, expireIn){
        if(expireIn === undefined) expireIn = 3600;

        this.accessToken = accessToken;
        this.accessTokenExpireTime = Utility.getClientTimeInSeconds() + expireIn;
    },

    login: function(callback){
        if(!this.init()){
            Popups.showMessage(languageMgr.getString("ERROR_CAN_NOT_INIT_PLUGIN").replace("@pluginName", SocialName.Zalo));
            var log = "fail&socialName=" + SocialName.Zalo + "&error=init_failed";
            OpenTracker.track(TrackingAction.LOGIN, log);
            return;
        }

        var savedSessionKey = servicesMgr.isUsePortal()
            ? getPortalSessionKey()
            : fr.UserData.getStringCrypt(SocialName.Zalo + UserDataKey.SESSION_KEY, '');
        if(savedSessionKey && savedSessionKey.trim().length > 0 && servicesMgr.isUsePortal()){

            if(savedSessionKey.length < 10 && GV.MODE == BUILD_MODE.LIVE){
                ClientError.throw(ClientErrorKey.SESSION_KEY,"zalo|" + servicesMgr.isUsePortal() +"|" + savedSessionKey +"|");
            }
            fr.portal.setCurrentSocial(SocialName.Zalo);
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

    onLoginComplete: function(result, msg){
        ZLog.debug("zalo onLoginComplete: %s", msg);

        if(result == Z_PORTAL_ERROR.SUCCESS){
            var log = "success&socialName=" + SocialName.Zalo + "&error=" + result;
            OpenTracker.track(TrackingAction.LOGIN, log);
            try{
                var data = JSON.parse(msg);
                fr.portal.setCurrentSocial(SocialName.Zalo);

                this.setAuthenCode(PlatformUtils.isWinPhone() ? data["accessToken"] : data["oauthCode"]);
                this.setUId(data["userId"]);
                this.getAccessToken(function(response){
                    if(response["access_token"] && response["access_token"].length > 0){
                        this.updateAccessToken(response["access_token"], parseInt(response["expires_in"]));
                        fr.portal.getSessionKeyFromPortal(this.accessToken, SocialName.Zalo, "zalo_info_null");

                        this.callback && this.callback();
                        this.callback = null;
                    }
                    else{
                        Popups.showMessage(languageMgr.getString("ERROR_WHEN_LOGIN_FROM_SOCIAL").replace("@socialName", SocialName.Zalo));
                    }
                }.bind(this));
            }
            catch(err){
                ZLog.debug("zalo onLoginComplete - JSON parse error: " + msg);
            }
        }
        else{
            log = "fail&socialName=" + SocialName.Zalo + "&error=" + result;
            OpenTracker.track(TrackingAction.LOGIN, log);

            // un-schedule show login fail
            //asyncTaskMgr.removeTaskByKey("login_fail");

            if(sceneMgr.isScene(GV.SCENE_IDS.LOADING)){
                _.delay(function(){
                    sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                }, 2000);
            }
            else{
                if(result == Z_PORTAL_ERROR.USER_CANCEL){
                    _.delay(function(){
                        if(sceneMgr.isScene(GV.SCENE_IDS.LOBBY)) {
                            playerModule.setFirstLogin(false);
                        }

                        sceneMgr.hideGUIWaiting();
                    }, 2000);
                }
                else{
                    Popups.showMessage(languageMgr.getString("ERROR_WHEN_LOGIN_FROM_SOCIAL").replace("@socialName", SocialName.Zalo),
                        function(){
                            if(!sceneMgr.isScene(GV.SCENE_IDS.LOGIN)){
                                sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                            }
                        }
                    );
                }
            }
        }
    },

    getAccessToken: function(callbackFunc) {
        var savedAccessToken = this.accessToken || "";

        if(savedAccessToken.length > 0 && !this.isAccessTokenExpire()) {
            ZLog.debug("get cached AccessToken: %s", savedAccessToken);
            callbackFunc && callbackFunc({expires_in: 0, access_token: savedAccessToken});
        }else {
            var param = "app_id=" + ZALO.APP_ID + "&app_secret=" + ZALO.OAUTH_SECRET_KEY + "&code=" + fr.zalo.getAuthenCode();

            xmlHttpRequest(ZALO.URL_AUTH + "?" + param, callbackFunc);
        }
    },

    cleanUpFriendList: function(){
        for(var i = 0; i < this.listFriends.length; ++i){
            if(this.listFriends[i] && this.listFriends[i].length > 0){
                this.listFriends[i].splice(0, this.listFriends[i].length);
            }

            this.listFriends[i] = null;
        }
    },

    setListUIdInvited: function(list){
        this.listFriends[ZALO.LIST_INVITED_PLAY_GAME_FRIENDS] = list;
    },

    filterInvitedFriend: function(friendList){
        if(this.listFriends[ZALO.LIST_INVITED_PLAY_GAME_FRIENDS] == null) return friendList;

        for(var i = 0; i < friendList.length; ++i){
            for(var j = 0; j < this.listFriends[ZALO.LIST_INVITED_PLAY_GAME_FRIENDS].length; ++j){
                if(friendList[i].uId == this.listFriends[ZALO.LIST_INVITED_PLAY_GAME_FRIENDS][j]){
                    friendList.splice(i, 1);
                    --i;
                    break;
                }
            }
        }
    },

    _inviteSuccess: function(uIdList){
        var self = fr.zalo;
        if(self.listFriends[ZALO.LIST_INVITED_PLAY_GAME_FRIENDS] == null){
            self.listFriends[ZALO.LIST_INVITED_PLAY_GAME_FRIENDS] = [];
        }

        if(uIdList){
            for(var i = 0; i < uIdList.length; ++i){
                for(var j = 0; j < self.listFriends[ZALO.LIST_CAN_INVITE_PLAY_GAME_FRIENDS].length; ++j){
                    if(self.listFriends[ZALO.LIST_CAN_INVITE_PLAY_GAME_FRIENDS][j].uId == uIdList[i]){

                        // switch to invited list
                        self.listFriends[ZALO.LIST_INVITED_PLAY_GAME_FRIENDS].push(self.listFriends[ZALO.LIST_CAN_INVITE_PLAY_GAME_FRIENDS][j]);
                        self.listFriends[ZALO.LIST_CAN_INVITE_PLAY_GAME_FRIENDS].splice(j, 1);

                        break;
                    }
                }
            }
        }
    },

    /**
     * get list friend by type, and cache them
     * @param type
     * @param callbackFunc
     */
    getFriend: function (type, callbackFunc) {
        var self = this;
        if(self.isProcessingGetFriend) {
            //callbackFunc(false);
            return;
        }

        // turn on flag
        this.isProcessingGetFriend = true;

        if(this.listFriends[type] != null) {
            callbackFunc(true, this.listFriends[type]);
            this.isProcessingGetFriend = false;
            return;
        }

        var pos = 0;
        var numOfFriends = 50;
        var listAllFriends = [];
        var requestFriendCallback = function(result, listFriends) {
            if(result) {
                listAllFriends = listAllFriends.concat(listFriends);

                // get all friends by waves, each wave is 50 friends, if amount < 50 that meaning is end
                if(listFriends.length < numOfFriends) {
                    self.isProcessingGetFriend = false;
                    self.listFriends[type] = listAllFriends;
                    callbackFunc(true, listAllFriends);
                }
                else{
                    // next index to request
                    pos += numOfFriends;

                    self.requestFriendList(pos, numOfFriends, type, requestFriendCallback);
                }
            }else {
                self.isProcessingGetFriend = false;
                callbackFunc(false);
            }
        };
        this.requestFriendList(pos, numOfFriends, type, requestFriendCallback);
    },

    /**
     *
     * @param pos
     * @param count
     * @param type
     * @param callbackFunc
     */
    requestFriendList:function(pos, count, type, callbackFunc) {
        var self = this;
        this.getAccessToken(function(response) {
            if(response["access_token"] && response["access_token"].length > 0){
                self.updateAccessToken(response["access_token"], parseInt(response["expires_in"]));

                var url = "http://openapi.zaloapp.com/query?act=lstfri";
                url += "&appid=" + ZALO.APP_ID + "&accessTok=" + self.accessToken + "&pos=" + pos + "&count=" + count + "&type=" + type + "&version=2";

                xmlHttpRequest(url, function(response) {
                    response = JSON.stringify(response);

                    //userId in zalo is long type
                    //Numbers in ECMAScript are internally represented double-precision floating-point
                    if(response.indexOf('userId":"') < 0) {
                        response = response.replace(/userId":/g, 'userId":"');
                        response = response.replace(/,"usingApp"/g, '","usingApp"');
                    }

                    var  convertFriendsData = function(friendsList){
                        if(friendsList == null) return friendsList;

                        var length = friendsList.length;
                        for(var i = 0; i < length; ++i){
                            var friendInfo = new DataFriendInfo();
                            friendInfo.uId = friendsList[i]["userId"];
                            friendInfo.displayName = friendsList[i]["displayName"];
                            friendInfo.defaultAvatar = friendsList[i]["avatar"];

                            friendsList.push(friendInfo);
                        }

                        friendsList.splice(0, length);
                        return friendsList;
                    };

                    try{
                        var data = JSON.parse(response);
                    }
                    catch(err){
                        ZLog.debug("JSON parse error: " + response);
                    }

                    if(data.error == 0) {
                        callbackFunc(true, self.filterInvitedFriend(convertFriendsData(data.result)));
                    }else {
                        callbackFunc(false);
                    }
                });
            }
            else{
                callbackFunc(false);
            }
        });
    },

    /**
     *
     * @param toIdList
     * @param message
     * @param callbackFunc
     * @param idImage
     */
    requestInviteMessage:function(toIdList, message, callbackFunc, idImage){
        if(toIdList.length == 0) {
            if(callbackFunc != undefined) {
                //callbackFunc(SOCIAL_ACTION.FAILED, "List friend empty!");
            }
            return;
        }

        var self = this;
        this.getAccessToken(function(response) {
            if(response["access_token"] && response["access_token"].length > 0) {
                self.accessToken = response["access_token"];

                var txtListId = "";
                for(var i = 0; i < toIdList.length; i++){
                    if(i > 0)
                        txtListId += ";";
                    txtListId += toIdList[i];
                }
                var link = "http://openapi.zaloapp.com/";
                link += "message?act=";
                link += "invite&appid=";
                link += ZALO.APP_ID;
                link += "&accessTok=";
                link += self.accessToken;
                link += "&fromuid=";
                link += fr.UserData.getString(SocialName.Zalo + UserDataKey.USER_ID);
                link += "&touid=";
                link += txtListId + ";";
                link += "&message=";
                link += encodeURIComponent(message);
                if(idImage != undefined) {
                    link += "&image=";
                    link += idImage;
                }
                link += "&isnotify=true&subdata=utmInviteFr&version=2";

                xmlHttpRequest(encodeURI(link), function(response2) {
                    Popups.showMessage("response invite \n " + JSON.stringify(response2));
                });
            }
            else{
                callbackFunc(false, "Can't get access token!");
            }
        });
    },

    /**
     *
     * @param message
     * @param imagePath
     * @param callbackFunc
     */
    sharePhoto: function(message, imagePath, callbackFunc) {
        if(!this.init()){
            Popups.showMessage(languageMgr.getString("ERROR_CAN_NOT_INIT_PLUGIN").replace("@pluginName", SocialName.Zalo));
            return;
        }

        var sharePhotoFunc = function(accessToken){
            var multi = fr.HttpMultipart.create("http://openapi.zaloapp.com/upload", function(data){
                try{
                    var obj = JSON.parse(data);
                    if(obj["result"] && (obj["result"].length > 0)){
                        var userId = fr.UserData.getString(SocialName.Zalo + UserDataKey.USER_ID);
                        var url = "http://openapi.zaloapp.com/social?act=pushfeed&appid=" +
                            ZALO.APP_ID+"&accessTok="+accessToken+"&fromuid=" + userId +"&touid=" +userId +
                            "&message="+ message +"&image="+obj["result"]+"&version=2";

                        var link = encodeURI(url);
                        xmlHttpRequest(link, function(response) {
                            if(response.error == 0){
                                callbackFunc(response);
                            }
                            else{
                                Notifications.show("NOTIFICATION_SHARE_FAIL");
                            }
                        });

                    }
                }
                catch(e){
                    Notifications.show("NOTIFICATION_SHARE_FAIL");
                }
            }.bind(this));
            multi.addFormPart("act", "image");
            multi.addFormPart("appid", ZALO.APP_ID);
            multi.addFormPart("accessTok", accessToken);
            multi.addImage("upload","ic_launcher.png", imagePath);
            multi.executeAsyncTask();
        };

        if(this.accessToken && this.accessToken.length > 0){
            sharePhotoFunc(this.accessToken);
        }
    },

    sendLoginTracking:function(userId, socialType) {
        if(!this.init()){
            //Popups.showMessage(languageMgr.getString("ERROR_CAN_NOT_INIT_PLUGIN").replace("@pluginName", SocialName.Zalo));
            return;
        }

        if(this.pluginIAP != null)
        {
            var data= {};
            data["socialType"] = socialType.toString();
            data["userId"] = userId.toString();
            ZLog.debug("sendLoginTracking: ", JSON.stringify(data));

            if(PlatformUtils.isWinPhone()){
                fr.zalo.pluginIAP.callFuncWithParam("sendLoginTracking",
                    new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(data)));
            }
            else{
                fr.zalo.pluginIAP.callFuncWithParam("sendLoginTracking",
                    new plugin.PluginParam(plugin.PluginParam.ParamType.TypeStringMap, data));
            }
        }
    }
};