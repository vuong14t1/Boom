/**
 * Created by Tomorow on 12/23/2016.
 */

var ZAccTracker = function(){
    var privateURL = "http://118.102.3.28/TrackClickInstall/log_gameclientnotify.php";
    var liveURL = "http://tracking.playzing.g6.zing.vn/TrackClickInstall/log_gameclientnotify.php";
    var isTest = false;
    var privateKey = ";MEX.N3K^Wc6aBw)";

    var setTest = function(b){
        isTest = b;
    };

    var generateSignature = function(value){
        return CryptoJS.MD5(value);
    };

    var track = function(actionType, extraData){
        if(GV.MODE == BUILD_MODE.DEV) return;
        return;
        if(extraData === undefined) extraData = '';
        var url = isTest ? privateURL : liveURL;
        var params = '';
        var playerInfo = PlayerInfo.Instance;
        var uId = playerInfo.getUId();
        var uName = playerInfo.getUName();
        var level = playerInfo.getLevel;

        var deviceInfo = {
            IP: '',
            DeviceID: fr.platformWrapper.getDeviceID(),
            MAC: '',
            OSVersion: fr.platformWrapper.getOSVersion(),
            DeviceModel: fr.platformWrapper.getDeviceModel()
        };

        var accountInfo = {
            AccountID: (uId !=-1 ? playerInfo.uId : 'unknown'),
            AccountType: fr.portal.getCurrentSocial(),
            OpenAccount: (uName != '' ? playerInfo.uName : 'unknown'),
            ZingName: zAccUserData.zpid,
            level: level
        };

        var listParam = [
            {key: "partnerid", value: "GSN"},
            {key: "gameName", value: GV.GAME + "_" +servicesMgr.getCountry()},
            {key: "appOS", value: fr.platformWrapper.getOsName()},
            {key: "appVersion", value: fr.platformWrapper.getAppVersion()},
            {key: "uniqueid", value: fr.platformWrapper.getDeviceID()},
            {key: "username", value: accountInfo.OpenAccount},
            {key: "actiontype", value: actionType},
            {key: "actiontime", value: Utility.getServerTimeInSeconds()},
            {key: "deviceinfo", value: JSON.stringify(deviceInfo)},
            {key: "sourceinfo", value: level},
            {key: "accountinfo", value: JSON.stringify(accountInfo)},
            {key: "extra", value: extraData}
        ];

        listParam = _.orderBy(listParam, ["key"], ["asc"]);

        // append params
        var appendedValue = "";
        for(var i = 0; i < listParam.length; ++i){
            params += "&" + listParam[i].key.toLowerCase() + "=" + encodeURIComponent(listParam[i].value);
            appendedValue += listParam[i].value;
        }
        params = _.replace(params, "&", "");

        // append signature
        appendedValue += privateKey;
        params += "&sig=" + generateSignature(appendedValue);

        xmlHttpRequest(url + "?" + params);
    };

    return {
        setTest: setTest,
        track: track
    }
}();