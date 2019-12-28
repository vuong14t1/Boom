/**
 * Created by VitaminB on 12/22/2017.
 */

var OpenTracker = function(){
    var liveURL = "https://zingplay.com/mobile/logRaw.php";

    var track = function(action, msg){
        if(GV.MODE == BUILD_MODE.DEV) return;
        return;
        if(fr.platformWrapper.getConnectionStatus() != CONNECTION_STATUS.NO_NETWORK) {
            if(msg === undefined) msg = "";

            var uId = PlayerInfo.Instance.getUId();
            var uName = PlayerInfo.Instance.getUName();
            var gold = PlayerInfo.Instance.getGold();

            var url = liveURL + "?game=" + GV.GAME;
            url += "&country=" + servicesMgr.getCountry();
            url += "&packageName=" + fr.platformWrapper.getPackageName();
            url += "&gameVersion=" + GV.VERSION;
            url += "&uId=" + uId;
            url += "&uName=" + uName;
            url += "&gold=" + gold;
            url += "&mccmnc=" + fr.platformWrapper.getNetworkOperator();
            url += "&deviceModel=" + fr.platformWrapper.getDeviceModel();
            url += "&deviceId=" + fr.platformWrapper.getDeviceID();
            url += "&osVersion=" + fr.platformWrapper.getOSVersion();
            url += "&action=" + action;
            url += "&msg=" + msg;

            xmlHttpRequest(url);
        }
    };

    return {
        track: track
    }
}();
