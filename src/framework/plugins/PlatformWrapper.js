/**
 * Created by KienVN on 10/23/2015.
 */

fr.platformWrapper = {
    init:function()
    {
        if(plugin.PluginManager == null) return false;

        if(fr.platformWrapper.pluginPlatform == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.platformWrapper.pluginPlatform = pluginManager.loadPlugin("PlatformWrapper");

            if(PlatformUtils.isIOs()){
                fr.platformWrapper.pluginPlatform.configDeveloperInfo({data: "empty"});
            }
        }
        return true;
    },

    getPhoneNumber:function()
    {
        if(this.pluginPlatform != null)
        {
           return this.pluginPlatform.callStringFuncWithParam("getPhoneNumber");
        }

        return "";
    },

    getMailAccount:function()
    {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getMailAccount");
        }
        return "";
    },

    getDeviceModel:function()
    {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getDeviceModel");
        }
        return "";
    },

    getAvailableRAM:function()
    {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getAvailableRAM");
        }
        return -1;
    },

    getVersionCode:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getVersionCode");
        }
        return -1;
    },

    getAppVersion:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getAppVersion");
        }
        return "0.0.0";
    },

    getOSVersion:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getOSVersion");
        }
        return "";
    },
    //connection type 0: ko co mang, 1: 3g, 2: wifi
    getConnectionStatus:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getConnectionStatus");
        }
        return -1;
    },

    hasNetwork: function(){
        if(fr.platformWrapper.getConnectionStatus() == CONNECTION_STATUS.NO_NETWORK){
            Popups.showMessage(languageMgr.getString("ERROR_CHECK_YOUR_NETWORK"));
            return false;
        }
        else return true;
    },

    getConnectionStatusName:function() {
        var connectionType =  this.getConnectionStatus();
        switch (connectionType) {
            case 0:
                return "unknown";
            case 1:
                return "3g";
            case 2:
                return "wifi";
        }
        return "";
    },

    getOsName:function() {
        if(cc.sys.isNative){
            if(cc.sys.platform == cc.sys.WIN32) {
                return "win32";
            }
            if(cc.sys.platform == cc.sys.ANDROID) {
                return "android";
            }
            if(cc.sys.platform == cc.sys.IPAD || cc.sys.platform == cc.sys.IPHONE) {
                return "ios";
            }
            if(cc.sys.platform == cc.sys.WP8 || cc.sys.platform == cc.sys.WINRT) {
                return "wp";
            }

            return "null os";
        }
        else{
            return "web";
        }
    },

    getClientVersion:function() {
        return GV.VERSION;
    },

    getDownloadSource:function() {
        if(this.pluginPlatform != null) {
            //TODO: kienvn
        }
        return "";
    },

    getThirdPartySource:function() {
        if(PlatformUtils.isMobile()){
            if(this.pluginPlatform != null) {
                return this.pluginPlatform.callStringFuncWithParam("getThirdPartySource", null);
            }
        }
        return "";
    },

    getZPThirdPartySource: function(){
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getZPThirdPartySource");
        }

        return "";
    },

    getExternalDataPath:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getExternalDataPath");
        }
        return jsb.fileUtils.getWritablePath();
    },

    setNotificationExtraData: function(msg){
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("setNotificationsExtraDataNonStatic",
                new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, msg));
        }

        return "";
    },

    getNotificationExtraData: function(){
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getNotificationExtraData");
        }

        return "";
    },

    addNotify:function(notify) {
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("addNotify",
               new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(notify)));
        }
    },

    showNotify:function() {
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("showNotify" ,null);
        }
    },

    cancelAllNotification:function() {
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("cancelAllNotification",null);
        }
    },

    getStoreType:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getStoreType");
        }
    },

    getDeviceID:function() {
        if(this.pluginPlatform != null) {
            var deviceID =  this.pluginPlatform.callStringFuncWithParam("getDeviceID");
            if(deviceID == "")
            {
                return this.getMailAccount();
            }
            return deviceID;
        }
        return "";
    },

    getPackageName:function() {
        if(PlatformUtils.isDesktop()) return GV.GAME;

        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getPackageName");
        }
        return "";
    },

    initializeGSNTracker: function(){
        if(this.pluginPlatform != null) {
            var data = {
                gsnAppName: GV.GAME,
                gsnAppVersion: this.getVersionCode(), // version trong AndroidManifest.xml
                gsnGameVersion: GV.VERSION, // version trong project.manifest
                gsnPartnerId: "GSN", //this.getThirdPartySource(), // trong "/res/values/strings.xml"
                locate: servicesMgr.getCountry()
            };
            ZLog.debug("init GSNTracker: ", data.gsnAppName, data.locate, data.gsnGameVersion, data.gsnAppVersion, data.gsnPartnerId);
            if(cc.sys.isNative){
                if(this.pluginPlatform != null) {
                    this.pluginPlatform.callFuncWithParam("initializeGSNTracker", new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(data)));
                }
            }
            else{
                try{
                    ZLog.debug("web tracker init: " + JSON.stringify(data));
                    gsntracker.init && gsntracker.init(data.gsnAppName + "_" + data.locate, data.gsnAppVersion);
                }
                catch(err){
                    ZLog.error(err.message);
                }
            }

            data = null;
        }
    },

    //accountType: google , zingme , facebook , zalo
    //openAccount: socialID, voi zingme la username
    trackLoginGSN:function(_accountId, _accountType, _openAccount, _zingName) {
        if(cc.sys.isNative){
            // for zalo payment
            fr.zalo.sendLoginTracking(_accountId, _accountType);

            if(this.pluginPlatform != null) {
                var data = {
                    accountId: _accountId,
                    accountType: _accountType,
                    openAccount: _openAccount,
                    zingName: _zingName
                };

                ZLog.debug("trackLoginGSN: %s", JSON.stringify(data));
                this.pluginPlatform.callFuncWithParam("trackLoginGSN",
                    new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(data)));

                data = null;
            }
        }
        else{
            try{
                //ZLog.debug("web track login: " + JSON.stringify(data));
                gsntracker.login && gsntracker.login(_accountId, _accountType, _openAccount, _zingName);
            }
            catch(err){
                ZLog.error(err.message);
            }
        }

        playerModule.setFirstLogin(false);
    },

    openCSApplication:function(userId) {
        var data =  "UserId: " + userId + "\n";
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("openCSApplication",
               new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, data));
        }
    },

    //zalo uri = "com.zing.zalo";
    isInstalledApp:function(uri) {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("isInstalledApp",
               new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, uri));
        }
        return 0;
    },

    isInstalledFacebookApp:function() {
        if(PlatformUtils.isAndroid()){
            return this.isInstalledApp("com.facebook.katana");
        }
        else if(PlatformUtils.isIOs()){
            return true;
        }

        return false;
    },

    isInstalledZaloApp:function() {
        if(PlatformUtils.isAndroid()){
            return this.isInstalledApp("com.zing.zalo");
        }
        else if(PlatformUtils.isIOs()){
            return true;
        }

        return false;
    },

    isInstalledGoogleApp : function(){
        if(PlatformUtils.isAndroid()){
            return this.isInstalledApp("com.google.android.apps.plus");
        }
        else if(PlatformUtils.isIOs()){
            return true;
        }

        return false;
    },

    sendSMS:function(phoneNo, msg) {
        if(_.isObject(phoneNo)){
            msg = phoneNo["msg"] || "";
            phoneNo = phoneNo["phoneNo"] || "";
        }

        // check sim available
        //if(this.getSimState() == SIM_STATE.READY){
            var data = {
                phoneNo: phoneNo.toString(),
                msg: msg
            };
            if(this.pluginPlatform != null) {
                ZLog.debug("jsb sendSMS: %s - %s", phoneNo, msg);
                this.pluginPlatform.callFuncWithParam("sendSMS", new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(data)));
                SMS_CALLBACK = true;

                if(PlatformUtils.isIOs()){
                    sceneMgr.showGUIWaiting();
                    _.delay(function(){
                        if(SMS_CALLBACK){
                            // show notification: sms processing
                            Popups.showMessage("NOTIFICATION_PROCESSING_SMS");
                            SMS_CALLBACK = false;
                        }
                    }, 3000);
                }
            }
        //}
        //else{
        //    Popups.showMessage("NOTIFICATION_SIM_NOT_AVAILABLE");
        //}
    },

    sendEmail:function(email, subject, body, chooserTitle, isHtmlText) {
        if(this.getVersionCode() < API_VERSION_AVAILABLE.EMAIL) return false;

        if(_.isObject(email)){
            email.email = email.email || "";
            email.subject = email.subject || "";
            email.body = email.body || "";
            email.chooserTitle = email.chooserTitle || "";
            email.isHtmlText = email.isHtmlText || false;

            var data = email;
        }
        else{
            data = {
                email: email || "",
                subject: subject || "",
                body: body || "",
                chooserTitle: chooserTitle || "",
                isHtmlText: isHtmlText || false
            };
        }

        if(this.pluginPlatform != null) {
            ZLog.debug("jsb sendEmail: %s - %s" + JSON.stringify());
            this.pluginPlatform.callFuncWithParam("sendEmail", new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(data)));

            return true;
        }

        return false;
    },

    getNetworkOperator: function(){
        if(Cheat.isEnable && Cheat.isEnableOperator) return Cheat.operator;

        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getNetworkOperator").toLowerCase();
        }

        return "";
    },

    getSimState: function(){
        // cheat for dev and private env
        //if(GV.MODE != BUILD_MODE.LIVE) return SIM_STATE.READY;

        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getSimState");
        }

        return SIM_STATE.UNKNOWN;
    },

    isAndroidEmulator:function(){
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callBoolFuncWithParam("isEmulator");
        }

        return false;

    },
};