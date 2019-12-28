/**
 * Created by eXtraKute on 3/6/2016.
 */

var ServicesMgr = cc.Class.extend({

    ctor: function () {
        this.data = new WebDataObject();
        this.dataReInit = new WebDataObject();
        this.callback = null;
        this.isTimeout = true;
    },

    sendRequest: function(callback){
        this.callback = callback;
        if(fr.platformWrapper.getConnectionStatus() != CONNECTION_STATUS.NO_NETWORK) {
            //sceneMgr.showGUIWaiting();

            var date = new Date();
            var timezone = date.getTimezoneOffset() / 60;
			
			var url = "https://zingplay.com/mobile/p13.php?game=" + GV.GAME;
            url += "&os=" + fr.platformWrapper.getOsName().toLowerCase();
            url += "&packageName=" + fr.platformWrapper.getPackageName();
            url += "&thirdPartySource=" + fr.platformWrapper.getThirdPartySource();
            url += "&versionCode=" + fr.platformWrapper.getVersionCode();
            url += "&gameVersion=" + GV.VERSION;
            url += "&mode=" + GV.MODE;
            url += "&versionName=" + fr.platformWrapper.getAppVersion();
            url += "&osVersion=" + fr.platformWrapper.getOSVersion();
            url += "&deviceId=" + fr.platformWrapper.getDeviceID();
            url += "&installDate=" + this.getInstallDate();
            url += "&timezone=" + timezone;
            url += "&mccmnc=" + fr.platformWrapper.getNetworkOperator();
            cc.log(url);
            xmlHttpRequest(url, this.onResponse.bind(this));
        }
        else{
            languageMgr.updateLang();
            var content = {text: languageMgr.getString("ERROR_CHECK_YOUR_NETWORK")};
            var listButtons = [
                {btnName: 'other', titleText: languageMgr.getString("RETRY"), hide: true, callback: {caller: servicesMgr, funcName: servicesMgr.sendRequest, args: [servicesMgr.callback]}},
                {btnName: 'close', hide: true, callback: {caller: servicesMgr, funcName: servicesMgr.sendRequest, args: [servicesMgr.callback]}}
            ];

            Popups.show(content, listButtons);
        }
    },

    onResponse:function(webData){
        ZLog.debug('onResponse: ' + JSON.stringify(webData));

        if(webData.hasOwnProperty('error') && webData.error > 0){
            this.callback && this.callback();
            return;
        }

        try{
            // merge response data to default data
            _.assign(this.data, webData);

            // set debug
            ZLog.isDebug = this.data.debug;

            if(Cheat.isEnable && Cheat.isEnablePayment){
                this.setListPaymentMethods(Cheat.payments);
            }

            // remove iap if game in portal ios or not enable iap in portal
            if(this.isUsePortal() && (!isPortalIAPEnable() || PlatformUtils.isIOs())){
                servicesMgr.removePayment(PAYMENT_SYSTEM.IAP);
            }

            // init GSN tracker
            fr.platformWrapper.initializeGSNTracker();
            languageMgr.updateLang(servicesMgr.getCountry());

            if(this.isMaintain()){
                // show popup system maintain
                Popups.showMessage(this.data.maintainMessage, function(){
                    cc.director.end();
                });
            }
            else{
                this.callback && this.callback();
                this.callback = null;
            }
        }
        catch(err){
            ZLog.error("exception: %s", err.message);
            this.callback && this.callback();
            this.callback = null;
        }
        finally{
            this.isTimeout = false;
        }
    },

    getInstallDate: function(){
        // 16/11/2016: Google Store review all apps to checking local payment
        var installDate = fr.UserData.getString(UserDataKey.INSTALL_DATE, "");
        if(installDate.length == 0){
            installDate = _.floor(_.now() / 1000).toString();
            fr.UserData.setString(UserDataKey.INSTALL_DATE, installDate);
        }

        return installDate;
    },

    getURLNews: function(){
        return this.data.urlnews || "http://play.zing.vn/mobile/index.html";
    },

    getFanpageURL: function(){
        return this.data.forumUrl || "https://www.facebook.com/13Poker.Zingplay";
    },

    isCountry: function(country){
        return this.getCountry() == country;
    },

    getCountry: function(){
        if(Cheat.isEnable && Cheat.isEnableCountry) return Cheat.country;

        if(this.data && this.data.location){
            return this.data.location;
        }else{
            return COUNTRY.INTERNATIONAL;
        }
    },

    getListLoginMethods: function(){
        if(servicesMgr.isUsePortal()) return [getPortalSocialType()];

        return this.data.login || [SocialName.ZAcc];
    },

    getListPaymentMethods: function(){
        return this.data.payment || [];
    },

    setListPaymentMethods: function(list){
        this.data.payment = list;
    },

    hasLocalPayment: function(){
        return servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZALO) ||
            servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZMPAY) ||
            servicesMgr.isEnablePayment(PAYMENT_SYSTEM.MOL) ||
            servicesMgr.isEnablePayment(PAYMENT_SYSTEM.MOL) ||
            servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IPAYY) ||
            servicesMgr.isEnablePayment(PAYMENT_SYSTEM.BLUE_PAY);
    },

    getEnablePaymentSystem: function(index){
        if(index === undefined) index = 0;
        if(this.data.payment.length > 0){
            return this.data.payment[index];
        }
        else{
            return PAYMENT_SYSTEM.EMPTY;
        }
    },

    isOnlyEnablePayment: function(paymentSystem){
        return this.data && this.data.payment.length == 1 && this.isEnablePayment(paymentSystem);
    },

    isEnablePayment: function(paymentSystem){
        //if(GV.MODE == BUILD_MODE.DEV){
        //    return true;
        //}

        if(paymentSystem === undefined){
            return this.getEnablePaymentSystem() != PAYMENT_SYSTEM.EMPTY;
        }
        else{
            return this.data.payment.indexOf(paymentSystem) >= 0;
        }
    },

    isEnableLogin: function(loginMethod){
        for(var i = 0; i < this.data.login.length; ++i){
            if(this.data.login[i] == loginMethod) return true;
        }

        return false;
    },

    isMaintain:function(){
        return this.data.maintain > 0;
    },

    canRateApp:function(){
        if(GV.MODE != BUILD_MODE.LIVE){
            return true;
        }
        return this.data.canRateGame > 0;
    },

    canLikeFanPage:function(){
        if(GV.MODE != BUILD_MODE.LIVE){
            return true;
        }
        return this.data.canLikePage > 0;
    },

    isEnableTournament: function(){
        if(GV.MODE != BUILD_MODE.LIVE){
            return true;
        }
        return this.data.hasTournament > 0;
    },

    isEnableRegister: function(){
        //if(GV.MODE != BUILD_MODE.LIVE){
            return false;
        //}
        //return this.data.canRegister > 0;
    },

    isConfirmSMS: function(){
        if(Cheat.isEnable && Cheat.isEnableConfirmSMS) return Cheat.confirmSMS;

        return this.data.confirmSMS > 0;
    },

    getIpServer:function(){
        return this.data.ipServer;
    },

    getPortServer:function(){
        return this.data.portServer;
    },

    getLinkStore:function(){
        return this.data.linkStore;
    },

    getLinkPortal:function(){
        if(GV.MODE != BUILD_MODE.LIVE){
            return "https://zingplay.com";
        }
        return this.data.linkPortalZP;
    },

    canGoToPortal:function(){
        return this.data.goToPortal;
    },

    isReviewing:function(){
        if(GV.MODE != BUILD_MODE.LIVE){
            return false;
        }
        return this.data.isReview;
    },

    isUsePortal:function(){
        return cc.director.isUsePortal && cc.director.isUsePortal();
    },

    sendReInit: function(){
        if(fr.platformWrapper.getConnectionStatus() != CONNECTION_STATUS.NO_NETWORK) {

            var date = new Date();
            var timezone = date.getTimezoneOffset() / 60;

            if(moduleMgr == null){ return }
            var playerInfo = PlayerInfo.Instance;
            if(playerInfo.getUId() == -1) {return}

            var uId = playerInfo.getUId();
            var uName = playerInfo.getUName();
            var gold = playerInfo.getGold();
            var level = playerInfo.getLevel();

            var url = "https://zingplay.com/mobile/ps.php?game=" + GV.GAME;
            url += "&os=" + fr.platformWrapper.getOsName().toLowerCase();
            url += "&packageName=" + fr.platformWrapper.getPackageName();
            url += "&deviceId=" + fr.platformWrapper.getDeviceID();
            url += "&installDate=" + this.getInstallDate();
            url += "&timezone=" + timezone;
            url += "&uId=" + uId;
            url += "&uName=" + uName;
            url += "&gold=" + gold;
            url += "&level=" + level;
            xmlHttpRequest(url, this.onResponseReInit.bind(this));
        }
    },

    onResponseReInit:function(webData){
        try{
            // merge response data to default data
            _.assign(this.dataReInit, webData);

            if(this.dataReInit.update > 0) {
                this.setListPaymentMethods(this.dataReInit.payment);
                if (Cheat.isEnable && Cheat.isEnablePayment) {
                    this.setListPaymentMethods(Cheat.payments);
                }

                paymentModule.getGUIStoreGold().reloadConfig();
            }
        }
        catch(err){
            ZLog.error("exception onResponseReInit: %s", err.message);
        }
    },

    removePayment:function(paymentSystem){
        var idIap = this.data.payment.indexOf(paymentSystem);
        if(idIap >= 0){
            this.data.payment.splice(idIap, 1);
        }
    }
});