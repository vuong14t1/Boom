/**
 * Created by bachbv on 12/23/2015.
 */

var CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(2);
            this.setControllerId(0);
            this.setCmdId(CMD.HAND_SHAKE);
        }
    }
);

//OUT Packet
CmdSendLogin = fr.OutPacket.extend(
{
    ctor: function (data) {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.USER_LOGIN);

        this.sessionKey = data.sessionKey;
        this.userData = data.userData;
        this.socialData = data.socialData;

    },

    putData:function(){
        if(PlatformUtils.isMobile()){
            this.putString(this.sessionKey); // ssKey
            this.putString(JSON.stringify(this.userData)); // user data is json format string
            this.putString(JSON.stringify(this.socialData)); // plugins data is json format string
        }
        else{
            this.putString(this.sessionKey); // is user name for dev
            this.putString(JSON.stringify(this.userData));
            this.putString(JSON.stringify(this.socialData));
        }
    }
});

CmdSendReconnect = fr.OutPacket.extend({
    ctor: function (sessionToken) {
        this._super();
        this.initData(10);
        this.setControllerId(0);
        this.setCmdId(CMD.HAND_SHAKE);

        this.sessionToken = sessionToken;
    },

    putData:function(){
        this.putString(this.sessionToken);
    }
});

CmdSendConnectUdp = fr.OutPacket.extend({
    ctor: function (sessionToken) {
        this._super();
        this.initData(10);
        this.setControllerId(0);
        this.setCmdId(CMD.CONNECT_UDP);
        this.sessionToken = sessionToken;
    },

    putData:function(){
        this.putString(this.sessionToken);
    }
});

CmdSendTestUdp = fr.OutPacket.extend({
    ctor: function (sessionToken) {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.TEST_UDP);
        this.sessionToken = sessionToken;
    },

    putData:function(){
        this.putString(this.sessionToken);
    }
});

