/**
 * Created by VitaminB on 7/13/2015.
 */

var BaseModule = cc.Class.extend({
    _className: "BaseModule",

    ctor: function(moduleId) {
        this._idModule = moduleId;
        this._curPackage = null;
        this._errorCode = null;
        this._minListenerValue = 0;
        this._maxListenerValue = 0;
        this._otherCmd = null;
    },

    getClassName: function(){
        return this._className;
    },

    registerListener: function(){
        if(connector){
            connector.getListener().addModule(this);
            return true;
        }
        return false;
    },

    /**
     *
     * @param min
     * @param max
     * @param otherCmd
     */
    setListenerValue: function(min, max, otherCmd){
        this._minListenerValue = min;
        this._maxListenerValue = max;
        if(otherCmd){
            this._otherCmd = otherCmd;
        }
    },

    /**
     * check cmd in range listener of module
     * @param cmd
     * @returns {boolean}
     */
    isInRangeListener: function(cmd){
        if(this._otherCmd && this._otherCmd instanceof Array){
            for(var i = 0; i < this._otherCmd.length; ++i){
                if(cmd === this._otherCmd[i]){
                    return true;
                }
            }
        }

        return this._minListenerValue <= cmd && cmd <= this._maxListenerValue;
    },

    /**
     *
     * @param cmd
     * @param pkg
     * @private
     */
    _showLogPackage: function(cmd, pkg){
        if(cmd == CMD.PING || cmd == CMD.SNAPSHOT_SERVER || cmd ==  CMD.TEST_UDP_RESPONSE) return;

        if(pkg){
            // remove the dataset on Web
            if(!cc.sys.isNative) pkg._data = undefined;

            ZLog.debug(Utility.getCmdKey(cmd) + JSON.stringify(pkg));
            //(this._curPackage.getError() == ERROR_CODE.SUCCESS) ? '' : '(' + this._curPackage.getError() + ')' +
            //" | " + JSON.stringify(pkg));
        }
        else{
            ZLog.debug(Utility.getCmdKey(cmd) + " | null");
        }
    },

    /**
     *
     * @param {int} cmd
     * @param {Object} pkg
     */
    onListener: function(cmd, pkg){
        this._curPackage = this.createReceivedPackage(cmd, pkg);
        //this._showLogPackage(cmd, this._curPackage);
        if(this._curPackage){
            this._curPackage.init && this._curPackage.init(pkg);
            this._curPackage.readData && this._curPackage.readData();
            //this._curPackage.getError() == ERROR_CODE.SUCCESS && this._curPackage.readData && this._curPackage.readData();

            if(this._curPackage.getError) this._errorCode = this._curPackage.getError();
        }


        this.processPackages(cmd);

        //pool
        if(this._curPackage){
            //gv.poolObjects.push(this._curPackage);
            this._curPackage = null;
        }
    },

    processPackages: function(cmd){
        // override me
    },

    createReceivedPackage: function(cmd, pkg){
        // override me
    },

    cheatProcessPackage: function(cmd, data){
        if(data){
            data.getError = function(){
                return ERROR_CODE.SUCCESS;
            };
            this._curPackage = data;
            this.processPackages(cmd);
        }
    },

    /**
     *
     * @param clazz
     * @returns {*}
     */
    getInPacket: function (clazz) {
        return newObject.apply(null, arguments);
    },

    /**
     *
     * @param clazz
     * @returns {*}
     */
    getOutPacket: function (clazz) {
        var pk = newObject.apply(null, arguments);
        pk.reset && pk.reset();
        return pk;
    },

    send: function(pk, timeout, timeoutCallback){
        pk.packHeader();
        pk.putData && pk.putData();
        pk.updateSize();
        connector.getNetwork().send(pk);
    },

    sendUdp: function(pk, timeout, timeoutCallback){
        pk.packHeader();
        pk.putData && pk.putData();
        pk.updateSize();
        connectorUdp.getNetwork().send(pk);
        //connector.getNetwork().send(pk);
    },
    sendUdpConnect: function(pk, timeout, timeoutCallback){
        pk.packHeader();
        pk.putData && pk.putData();
        pk.updateSize();
        connectorUdp.getNetwork().send(pk);
    },

    addTimeout: function(cmd, timeout, timeoutCallback){
        TimeoutMgr.addTimeout(Utility.getCmdKey(cmd) + "_" + cmd, timeout, timeoutCallback);
    },

    removeTimeout: function(cmd){
        TimeoutMgr.removeTimeout(Utility.getCmdKey(cmd) + "_" + cmd);
    },

    cleanUp: function(){
        // override me
    },
});
