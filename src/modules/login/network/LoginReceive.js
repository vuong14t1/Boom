/**
 * Created by bachbv on 1/21/2017.
 */

CmdReceiveLogin = BaseInPacket.extend({
    ctor:function() {
        this._super();
    }
});

CmdReceiveDisconnect = BaseInPacket.extend({
    ctor:function() {
        this._super();
    }
});

CmdReceiveHandShake = BaseInPacket.extend({
    ctor:function() {
        this._super();
        this._sessionToken = "";
        this._reconnectTime = 0;
    },

    readData:function(){
        this._sessionToken = this.getString();
        this._reconnectTime = this.getInt();
    }
});