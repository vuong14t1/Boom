/**
 * Created by bachbv on 1/22/2017.
 */

var ConnectorUdp = cc.Class.extend(
    {
        ctor: function () {
            this.config = null;
            this.loadConfig();
            this._isConnected = false;

            this._clientListener = connector.getListener();
            this._udpClient = fr.GsnClient.create();
            // this._udpClient.setUseUDP(true);
            this._udpClient.setFinishConnectListener(function(){
                ZLog.debug("init udp success");
            }.bind(this));
            //this._udpClient.setDisconnectListener(this._clientListener.onDisconnected.bind(this._clientListener));
            this._udpClient.setReceiveDataListener(this._clientListener.onReceived.bind(this._clientListener));

            return true;
        },

        getListener: function () {
            return this._clientListener;
        },

        isConnected: function () {
            return this._isConnected;
        },

        loadConfig: function () {
            var fileName = cc.loader.resPath + "res/ipConfig.json";
            if (cc.sys.isNative && !jsb.fileUtils.isFileExist(fileName)) {
                ZLog.debug("File config not exist!!!!");
                return null;
            }

            cc.loader.loadJson(fileName, function (error, jsonData) {
                if (error != null) {
                    ZLog.debug("Load ip config error");
                }
                else {
                    if(jsonData[GV.MODE]){
                        this.setServerInfo(
                            jsonData[GV.MODE]['server'],
                            jsonData[GV.MODE]['udp']
                        );

                        ZLog.debug("loaded config connector | " + JSON.stringify(jsonData[GV.MODE]));
                    }
                    else{
                        ZLog.error("server config not found");
                    }
                }
            }.bind(this));
        },

        getServerInfo: function () {
            return this._serverName + ":" + this._port;
        },

        setServerInfo: function(server, port){
            this._serverName = server;
            this._port = port;
        },

        setConnected:function(b){
            this._isConnected = b;
        },

        getNetwork: function () {
            return this._udpClient;
        },

        reconnect: function () {
            cc.log("-------------------> CONNECTOR RECONNECT <-----------------------");
            // create callback reconnect fail
            var callbackReconnect = function(msg){
                var content = {text: languageMgr.getString(msg)};

                var listButtons = [
                    {btnName: 'ok', hide: true, callback: function(){
                        if(servicesMgr.isUsePortal()){
                            fr.NativeService.endGame();
                            return;
                        }
                        sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                    }},
                    {btnName: 'close',callback: function(){
                        if(servicesMgr.isUsePortal()){
                            fr.NativeService.endGame();
                            return;
                        }
                        sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
                    }}
                ];

                Popups.show(content, listButtons);
                ZLog.debug("RECONNECT_FAIL: callbackReconnectFail: " + msg);
            };

            // check network
            if(fr.platformWrapper.getConnectionStatus() == CONNECTION_STATUS.NO_NETWORK){
                callbackReconnect('ERROR_CHECK_YOUR_NETWORK');
                return;
            }

            if(!fr.portal.loginByCache()){
                callbackReconnect('RECONNECT_FAIL');
            }
        },

        connect: function () {
            ZLog.debug("----> Connecting to server udp: " + this._serverName + ":" + this._port);
            this._udpClient.connect(this._serverName,this._port);
        },

        disconnect: function(){
            this._isConnected = false;
            if(!cc.sys.isNative) this._udpClient.disconnect();
        }
    }
);