/**
 * Created by bachbv on 1/22/2017.
 */

var ConnectorListener = cc.Class.extend(
    {
        ctor: function () {
            this._basePacket = null;
            this._modulesRegistered = [];
            return true;
        },

        /**
         *
         * @param isSuccess
         */
        onFinishConnect: function (isSuccess) {
            if (isSuccess) {
                connector._isConnected = true;
                ZLog.debug("CONNECT_SUCCESS | " + connector._serverName + ":" + connector._port);
                loginModule.sendHandShake();
            }
            else {
                var content = {text: languageMgr.getString("CONNECTION_FAIL")};
                var listButtons = [
                    {btnName: 'other', titleText: languageMgr.getString("RETRY"), hide: true, callback: {caller: connector, funcName: connector.reconnect, args: []}},
                    {btnName: 'close', callback: {caller: sceneMgr, funcName: sceneMgr.viewSceneById, args: [GV.SCENE_IDS.LOGIN]}}
                ];

                Popups.show(content, listButtons);
                ZLog.debug("CONNECTION_FAIL: connector onFinishConnect");
            }
        },

        onDisconnected: function () {
            ZLog.debug("----------->ON_CONNECTOR_DISCONNECTED<------------");
            if(connector.isConnected()){
                connector.disconnect();
                Popups.showReconnect(languageMgr.getString("DISCONNECT_UNKNOWN"));

            }else{
                if(!Popups.isShowing() && !sceneMgr.isScene(GV.SCENE_IDS.LOGIN)){
                    Popups.showReconnect(languageMgr.getString("DISCONNECT_UNKNOWN"));

                }
            }

        },

        /**
         *
         * @param cmd {CMD}
         * @param pkg
         */
        onReceived: function (cmd, pkg) {
            if(!connector.isConnected()) return;
            if(cmd != CMD.PING){
                ZLog.debug("<=============== receive a cmd = %d - %s", cmd, ZLog.getKey(CMD,cmd));
            }
            //ZLog.debug("<=============== receive a cmd = %d - %s", cmd, ZLog.getKey(CMD,cmd));

            pingModule.resetNoPackageReturnCounter();

            for (var i = 0; i < this._modulesRegistered.length; ++i) {
                if (this._modulesRegistered[i].isInRangeListener(cmd)) {
                    this._modulesRegistered[i].onListener(cmd, pkg);
                    return;
                }
            }
        },

        addModule: function (module) {
            if (module !== undefined && module) {
                var listener = connector.getListener();
                listener._modulesRegistered.push(module);
                return true;
            }
            return false;
        },

        removeModule: function (module) {
            if (module !== undefined && module) {
                var listener = connector.getListener();
                for (var i = 0; i < listener._modulesRegistered.length; ++i) {
                    if (module._idModule == listener._modulesRegistered._idModule) {
                        listener._modulesRegistered.splice(i, 1);
                        return true;
                    }
                }
            }
            return false;
        },
    }
);

CmdReceiveCommon = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
        }
    }
);
