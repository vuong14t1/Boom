/**
 * Created by bachbv on 1/22/2017.
 */

/**
 * PLAYER INFO
 */
CmdReceiveGetPlayerInfo = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
            this.dataPlayer = null;
        },
        readData: function () {
            this.dataPlayer = DataPlayer.unPack(this);
        }
    }
);

/**
 * PLAYER INFO DETAIL
 */
CmdReceiveGetPlayerInfoDetail = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();

            this.dataPlayer = null;
        },

        readData: function () {
            if(this.getError() == 0) {
                this.dataPlayer = {};
                this.dataPlayer.uId = this.getInt();
                this.dataPlayer.uName = this.getString();
                this.dataPlayer.displayName = this.getString();
                this.dataPlayer.avatarURL = this.getString();
                this.dataPlayer.gold = this.getLong();
                this.dataPlayer.level = this.getShort();
                this.dataPlayer.vipLevel = this.getByte();
                this.dataPlayer.totalGame = this.getShort();
                this.dataPlayer.totalWin = this.getShort();
                this.dataPlayer.totalLose = this.getShort();
                this.dataPlayer.totalPenalty = this.getShort();
                this.dataPlayer.version = this.getString();
            }
        }
    }
);
CmdReceiveGetServerTime = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
            this.id = null;
            this.time = null;
        },
        readData: function () {
            this.id = this.getInt();
            this.time = this.getLong();
        }
    }
);

CmdReceiveGetInventoryInfo = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
            this.rInventoryInfo = new RInventoryInfo();
        },
        readData: function () {
            this.rInventoryInfo.setNumOfBoom(this.getInt());
            this.rInventoryInfo.setNumOfSpeed(this.getInt());
            this.rInventoryInfo.setNumOfRange(this.getInt());
        }
    }
);

CmdReceiveAddExp = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
            this.numOfExpAdd = 0;
        },
        readData: function () {
            this.numOfExpAdd = this.getLong();
        }
    }
);











CmdReceivePlayerUpdateTelco = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
        },

        readData: function(){
            if(this.getError() == ERROR_CODE.SUCCESS){
                var tmpFreeTime = FREE_TIME_TO_ENABLE_TELCO;
                var tmpLevel = MIN_LEVEL_TO_OPEN_CODA;

                FREE_TIME_TO_ENABLE_TELCO = this.getByte();
                MIN_LEVEL_TO_OPEN_CODA = this.getInt();

                GUI_STORE_DIRTY = tmpFreeTime != FREE_TIME_TO_ENABLE_TELCO || tmpLevel != MIN_LEVEL_TO_OPEN_CODA;
            }
        }
    }
);

CmdReceiveClaimDailySupportGold = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
            this.gold = null;
        },
        readData: function(){
            if(this.getError() == 0){
                this.gold = this.getLong();
            }
        }
    }
);
CmdReceiveClaimRateApp = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
        },

        readData: function(){
            if(this.getError() == 0){

            }
        }
    }
);
CmdReceiveClaimDailyLikeFanPage = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
        },

        readData: function(){
            if(this.getError() == 0){

            }
        }
    }
);
CmdReceivePlayerCheat = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();

        }

    }
);
CmdReceivePlayerInfoVip = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
        }

    }
);

/**
 * ADD EXP
 */
CmdReceiveAddExp = BaseInPacket.extend({
    readData: function () {
        this.amount = this.getLong();
    }
});

/**
 *  SYSTEM MAINTAIN
 */
CmdReceiveSystemMaintain = BaseInPacket.extend({
    readData: function () {
        this.remainTime = this.getInt();
    }
});

/**
 *  CHEAT ATTRIBUTE
 */
CmdReceiveCheatAttribute = BaseInPacket.extend({

});

/**
 *  TEST TYPE DATA
 */
CmdReceiveTestTypeData = BaseInPacket.extend({
    ctor:function()
    {
        this._super();
        this.remainTime = 0;
    },

    readData: function () {
        this.data = {};
         this.data["v_bool"] = this.getByte();
         this.data["v_byte"] = this.getByte();
         this.data["v_short"] = this.getShort();
         this.data["v_int"] = this.getInt();
         this.data["v_long"] = this.getLong();
        this.data["v_double"] = this.getDouble();
         this.data["v_string"] = this.getString();

        ZLog.debug("GET: " + JSON.stringify(this.data));
    }
});