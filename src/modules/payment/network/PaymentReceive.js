/**
 * Created by bachbv on 1/6/2016.
 */
CmdReceiveIAPAndroid = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();

            this.purchaseData = null;
            this.signature = null;
        },

        readData: function () {
            var dataString = this.getString();
            try{
                this.purchaseData = JSON.parse(dataString);
            }
            catch(err){
                this.purchaseData = {};
                ZLog.debug("JSON parse error: " + dataString);
            }

            this.signature = this.getString();
        }
    }
);

CmdReceiveIAPIOs = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();

            this.transList = [];
        },

        readData: function () {
            var length = this.getShort();
            for(var i = 0; i < length; ++i){
                this.transList.push({
                    productId: this.getString(),
                    quantity: this.getInt()
                });
            }
        }
    }
);

CmdReceivePaymentTrans = BaseInPacket.extend(
    {
        readData: function () {
            this.retCode = this.getInt();
            this.transId = this.getString();
            this.url = this.getString();
            this.partnerTransId = this.getString();
            this.shortCode = this.getString();
            this.message = this.getString();
            this.instruction = this.getString();
        }
    }
);

CmdReceiveZMPSubmitCard = BaseInPacket.extend({
    readData: function() {
        this.retCode = this.getInt();
        this.transID = this.getLong();
    }
});

CmdReceiveZMPRegSMS = BaseInPacket.extend({
    ctor: function() {
        this._super();
        this.retCode = null;
        this.transID = null;
        this.returnMessage = null;
        this.smsServicePhones = null;
    },

    readData: function() {
        this.retCode = this.getInt();
        this.transID = this.getLong();
        this.returnMessage = this.getString();

        if(this.retCode == ZING_CARD_CODE.SUCCESS){
            try{
                var str = this.getString();
                this.smsServicePhones = JSON.parse(str);
            }
            catch(err){
                ZLog.error("CmdReceiveZMPRegSMS: error parse smsServicePhones: " + str);
            }

            str = null;
        }
    }
});

CmdReceiveZMPGetStatus = BaseInPacket.extend({
    ctor: function() {
        this._super();
        this.retCode = null;
        this.transID = null;
        this.returnMessage = null;
        this.isProcessing = null;
        this.ppValue = null;
    },

    readData: function() {
        this.retCode = this.getInt();
        this.transID = this.getLong();
        this.returnMessage = this.getString();
        this.isProcessing = this.getBool();
        this.ppValue = this.getLong();
    }
});

CmdReceivePaymentUpdate = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();

            this.providerID = null;
            this.paymentChannel = null;
            this.paymentItem = null;
            this.amount = null;
            this.other = null;
        },

        readData: function () {
            this.providerID = this.getInt();
            this.paymentChannel = this.getInt();
            this.paymentItem = this.getInt();
            this.amount = this.getLong();
            this.other = this.getString();
        },
    }
);

CmdReceiveSeaVerifyOtp = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();

            this.retCode = null;

        },

        readData: function () {
            this.retCode = this.getInt();
        }
    }
);

CmdReceiveFirstPayUpdate = BaseInPacket.extend(
    {
        ctor: function () {
            this._super();
            this.listBonus1StPay = [];

        },

        readData: function () {
            var length  = this.getShort();
            for(var i = 0 ; i < length; i ++){
                this.listBonus1StPay.push(this.getString());
            }
        }
    }
);