/**
 * Created by bachbv on 1/22/2017.
 */

CmdSendGetPlayerInfo = BaseOutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.PLAYER_GET_INFO);
    }
});

CmdSendGetServerTime = BaseOutPacket.extend({
    ctor:function(id)
    {
        this._super();
        this.id = id;
        this.initData(2);
        this.setCmdId(CMD.GET_SERVER_TIME);
    },
    putData: function(){
        this.putInt(this.id);
    }
});


CmdSendCheatInfo = BaseOutPacket.extend({
    /**
     *
     * @param sendCheatInfo {SendCheatInfo}
     */
    ctor:function(sendCheatInfo)
    {
        this._super();
        this.sendCheatInfo = sendCheatInfo;
        this.initData(2);
        this.setCmdId(CMD.CHEAT_OPTION);
    },
    putData: function(){
        this.putInt(this.sendCheatInfo.expAdd);
        this.putLong(this.sendCheatInfo.gold);
        this.putInt(this.sendCheatInfo.hearts);
        this.putInt(this.sendCheatInfo.booms);
        this.putInt(this.sendCheatInfo.speeds);
        this.putInt(this.sendCheatInfo.ranges);
    }
});












CmdSendGetPlayerInfoDetail = BaseOutPacket.extend({
    ctor:function(uId)
    {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.PLAYER_GET_INFO_DETAIL);

        if(uId === undefined){
            this.uId = playerModule.getPlayerInfo().uId;
        }
        else{
            this.uId = uId;
        }
    },

    putData: function(){
        this.putInt(this.uId);
    }
});

CmdSendPlayerUpdateTelco = BaseOutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.PLAYER_UPDATE_TELCO);
    }
});

CmdSendPlayerUpgradeVip = BaseOutPacket.extend({
    ctor:function(data)
    {
        this._super();
        this._data = data;
        this.initData(2);
        this.setCmdId(CMD.PLAYER_UPGRADE_VIP);

    },

    putData: function(){
        this.putByte(this._data.toVip);
    }
});


CmdSendGetPlayerCheat = BaseOutPacket.extend({
    ctor:function(data)
    {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.PLAYER_CHEAT);
        this.uId = data.uId;
        this.listAttribute = data.listAttribute;
    },

    putData: function(){
        this.putInt(this.uId);
        this.putShort(this.listAttribute.length);
        for (var i in this.listAttribute) {
            this.putShort(this.listAttribute[i].type);
            this.putLong(this.listAttribute[i].value);
        }
    }
});



CmdSendLogout = BaseOutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(2);
        this.setControllerId(0);
        this.setCmdId(CMD.USER_LOG_OUT);
    }
});
CmdSendClaimDailySupportGold = BaseOutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.PLAYER_CLAIM_DAILY_SUPPORTED_GOLD);
    }
});
CmdSendClaimRateApp = BaseOutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.PLAYER_CLAIM_RATE_APP);
    }
});
CmdSendClaimLikeFanPage = BaseOutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.PLAYER_CLAIM_LIKE_PAGE);
    }
});

CmdSendUpdateUrlAvatar = BaseOutPacket.extend({
    ctor:function(url)
    {
        this._super();
        this.url = url;
        this.initData(2);
        this.setCmdId(CMD.PLAYER_UPDATE_URL_AVATAR);
    },

    putData:function(){
        this.putString(this.url);
    }
});

CmdSendCheatAttribute = BaseOutPacket.extend({
    ctor:function(data) {
        this.data = data;

        this._super();
        this.initData(10);
        this.setCmdId(CMD.CHEAT_SET_USER_ATTRIBUTE);
    },

    putData:function(){
        this.putInt(this.data.uId);
        this.putString(this.data.attribute);
        this.putLong(this.data.value);
    }
});

CmdSendTestTypeData = BaseOutPacket.extend({
    ctor:function(data)
    {
        this.data = data;

        this._super();
        this.initData(2);
        this.setCmdId(CMD.TEST_TYPE_DATA);
    },

    putData:function(){
        this.putByte(this.data["v_bool"] || 1);
        this.putByte(this.data["v_byte"] || 2);
        this.putShort(this.data["v_short"] || 3);
        this.putInt(this.data["v_int"] || 4);
        this.putLong(this.data["v_long"] || 5);
        this.putDouble(this.data["v_double"] || 6);
        this.putString(this.data["v_string"] || "7");

        ZLog.debug("PUT: " + JSON.stringify(this.data));
    }
});