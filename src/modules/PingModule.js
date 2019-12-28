/**
 * Created by bachbv on 1/31/2017.
 */

var PingModule = BaseModule.extend({
    _className: "PingModule",

    PING_DELAY: 2,
    MAX_NUM_OF_PING: 60,
    DELAY_LOG: 10,
    DELAY_NO_PACKAGE_RETURN: 11,

    ctor: function (moduleId) {
        this._super(moduleId);

        this._lastTimePing = 0.0;
        this._lastTimeLog = 0.0;
        this._timeCounter = 0.0;
        this.avgPing = 0;
        this.biggestPing = 0;
        this.smallestPing = 999999;
        this.numOfPings = 0;
        this.delayNoPackageReturn = 0;
        this.canShowReconnect = true;
        this.idInterval = -1;

        this.setListenerValue(50, 50);
    },

    setCanShowReconnect: function(b){
        this.canShowReconnect = b;
    },

    resetNoPackageReturnCounter: function(){
        this.delayNoPackageReturn = 0;
    },

    update: function(dt){
        this._timeCounter += dt;
        this.delayNoPackageReturn += dt;

        if(this._timeCounter >= this.PING_DELAY){
            this._timeCounter = 0;
            this.sendPing();
        }

        if(this.delayNoPackageReturn >= this.DELAY_NO_PACKAGE_RETURN){
            this.resetNoPackageReturnCounter();
            connector.disconnect();

            ZLog.debug("DISCONNECT_UNKNOWN: ping module");
            Popups.showReconnect(languageMgr.getString("DISCONNECT_UNKNOWN") + ".");
        }
    },

    startPing: function(){
        if(connector.isConnected()){
            if(this.idInterval > -1) clearInterval(this.idInterval);
            this.idInterval = setInterval(this.update.bind(this, 1), 1000);

            this.resetNoPackageReturnCounter();
            this._timeCounter = 0;
            this._lastTimePing = Utility.getClientTimeInMilliseconds();
        }
    },

    stopPing: function(){
        if(this.idInterval > -1) {
            clearInterval(this.idInterval);
            this.idInterval = -1;
        }
    },

    getPing: function(){
        return this.avgPing;
    },

    getBiggestPing: function(){
        return this.biggestPing;
    },

    getSmallestPing: function(){
        return this.smallestPing;
    },

    _updatePingValue: function(newValue){
        if(this.biggestPing < newValue){
            this.biggestPing = newValue;
        }

        if(this.smallestPing > newValue){
            this.smallestPing = newValue;
        }

        var  sumPing = this.avgPing * this.numOfPings;

        // reset avg ping
        if(this.numOfPings > this.MAX_NUM_OF_PING){
            this.numOfPings = 0;
            sumPing = 0;
        }

        ++this.numOfPings;
        this.avgPing = (sumPing + newValue) / this.numOfPings;
    },

    log: function(){
        var curTime = Utility.getServerTimeInSeconds();
        if((curTime - this._lastTimeLog) > this.DELAY_LOG){
            this._lastTimeLog = curTime;
        }

        // TODO update ping time ui
    },

    //=========================================================
    // RECEIVE
    //=========================================================
    processPackages: function(cmd){
        if(cmd == CMD.PING){
            this._updatePingValue(Utility.getClientTimeInMilliseconds() - this._lastTimePing);
            this.log();
        }
    },
    //=========================================================

    //=========================================================
    // SEND
    //=========================================================
    sendPing: function(){
        //ZLog.debug("ping sending...");
        var pk = this.getOutPacket(CmdSendPing);
        this.send(pk);
        this._lastTimePing = Utility.getClientTimeInMilliseconds();
    }
    //=========================================================
});

CmdSendPing = BaseOutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(2);
        this.setControllerId(0);
        this.setCmdId(CMD.PING);
    }
});