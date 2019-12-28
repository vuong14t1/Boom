/**
 * Created by GSN on 9/29/2015.
 */
zAccGameId              = 50017; // game Id

zAccLoginData = {
    gameId:             zAccGameId,
    service_name:       "zacc_login",
    username:           "",
    password:           "",
};

zAccRegisterData = {
    gameId:             zAccGameId,
    service_name:       "zacc_register",
    username:           "",
    password:           ""
};

fr.zacc = {
    passwordNotMD5: "",

    login:function(username, password, callback){
        zAccLoginData.username = username;
        zAccLoginData.password = CryptoJS.MD5(password).toString();
        this.passwordNotMD5 = password;

        fr.UserData.setStringCrypt(SocialName.ZAcc + UserDataKey.PASSWORD, password);
        var params = packDataForRequest(zAccLoginData);

        xmlHttpRequest((GV.MODE == BUILD_MODE.LIVE ? zAccHostUrlLive : zAccHostUrlPrivate) + "" + params, this.onLoginComplete.bind(this));
    },

    onLoginComplete:function(response){
        if(response.status  ==  ZACC_ERROR.SUCCESS){
            var log = "success&socialName=" + SocialName.ZAcc + "&error=" + response.status;
            OpenTracker.track(TrackingAction.LOGIN, log);

            fr.portal.setCurrentSocial(SocialName.ZAcc);
            fr.UserData.setNumber(SocialName.ZAcc + UserDataKey.USER_ID, response.data.zpid);
            fr.UserData.setString(SocialName.ZAcc + UserDataKey.USER_NAME, zAccLoginData.username);

            fr.portal.getSessionKeyFromPortal(response.data.sid, SocialName.ZAcc);
        }else{
            log = "fail&socialName=" + SocialName.ZAcc + "&error=" + response.status;
            OpenTracker.track(TrackingAction.LOGIN, log);

            // un-schedule show login fail
            //asyncTaskMgr.removeTaskByKey("login_fail");

            if(response.status) {
                this.showError(response.status);
            }
            else {
                Popups.showMessage(languageMgr.getString("ERROR_CHECK_YOUR_NETWORK"));
            }
            fr.UserData.setStringCrypt(SocialName.ZAcc + UserDataKey.PASSWORD, "");
        }
    },

    register: function(username, password){
        if(fr.platformWrapper.hasNetwork()){
            zAccRegisterData.username = username;
            zAccRegisterData.password = CryptoJS.MD5(password).toString();
            this.passwordNotMD5 = password;
            fr.UserData.setStringCrypt(SocialName.ZAcc + UserDataKey.PASSWORD, password);

            var params = packDataForRequest(zAccRegisterData);

            xmlHttpRequest((GV.MODE == BUILD_MODE.LIVE ? zAccHostUrlLive : zAccHostUrlPrivate) + "" + params, this.onRegisterComplete.bind(this));
        }
    },

    onRegisterComplete: function(response){
        if(response.status === ZACC_ERROR.SUCCESS){
            //PlatformUtils.makeToast("zp register access token\n" + response.data.sid);

            fr.portal.setCurrentSocial(SocialName.ZAcc);
            fr.UserData.setNumber(SocialName.ZAcc + UserDataKey.USER_ID, response.data.zpid);
            fr.UserData.setString(SocialName.ZAcc + UserDataKey.USER_NAME, zAccRegisterData.username);

            // get session key from zing play portal
            fr.portal.getSessionKeyFromPortal(response.data.sid, SocialName.ZAcc, response.data.zpid + "");
        }
        else{
            this.showError(response.status);
            fr.UserData.setStringCrypt(SocialName.ZAcc + UserDataKey.PASSWORD, "");
        }
    },

    showError: function(errorCode){
        var callback = function(){
            if(!sceneMgr.isScene(GV.SCENE_IDS.LOGIN)){
                sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
            }
        };

        switch (errorCode){
            case ZACC_ERROR.SUCCESS:
                return;
            case ZACC_ERROR.USERNAME_PASSWORD_NOT_MATCH:
                Popups.showMessage("ERROR_INCORRECT_INPUT", callback);
                break;
            case ZACC_ERROR.USERNAME_ALREADY_EXISTED:
                Popups.showMessage("ERROR_EXISTENCE_ACCOUNT", callback);
                break;
            case ZACC_ERROR.USERNAME_DOES_NOT_EXISTED:
            case ZACC_ERROR.USERNAME_INVALID:
                Popups.showMessage("ERROR_INVALID_ACCOUNT", callback);
                break;
            case ZACC_ERROR.WRONG_PASSWORD:
            case ZACC_ERROR.PASSWORD_INVALID:
                Popups.showMessage("ERROR_INCORRECT_PASSWORD", callback);
                break;
            case ZACC_ERROR.SESSION_INVALID:
            case ZACC_ERROR.ZPID_DOES_NOT_EXIST:
            case ZACC_ERROR.DEVICE_ID_INVALID:
            case ZACC_ERROR.PARTNER_ID_INVALID:
            default:
                Popups.showMessage(languageMgr.getString("ERROR_WHEN_LOGIN_FROM_SOCIAL").replace("@socialName", SocialName.ZAcc) + "\ncode: " + errorCode, callback);
                break;
        }
    },
};