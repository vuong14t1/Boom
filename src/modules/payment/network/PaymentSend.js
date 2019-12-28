/**
 * Created by bachbv on 1/6/2016.
 */

CmdSendIAPAndroid = BaseOutPacket.extend({
    ctor: function (data, paymentItem) {
        this._super();
        this.data = data;
        this.paymentItem = paymentItem;
        this.initData(10);
        this.setCmdId(CMD.PAYMENT_IN_APP_PURCHASE_ANDROID);
    },

    putData:function(){
        this.putString(JSON.stringify(this.data.purchaseData));
        this.putString(this.data.signature);
        this.putInt(this.paymentItem);
    }
});

CmdSendIAPIOs = BaseOutPacket.extend({
    ctor: function (receipt, paymentItem) {
        this._super();
        this.receipt = receipt;
        this.paymentItem = paymentItem;
        this.initData(2);
        this.setCmdId(CMD.PAYMENT_IN_APP_PURCHASE_IOS);
    },

    putData:function(){
        this.putString(this.receipt);
        this.putInt(this.paymentItem);
    }
});

CmdSendPaymentTrans = BaseOutPacket.extend({
    ctor: function (data) {
        this._super();
        this.data = data;
        this.initData(2);
        this.setCmdId(CMD.PAYMENT_CREATE_TRANS);
    },

    putData:function(){
        this.putInt(this.data.paymentType);
        this.putString(this.data.countryId);
        this.putLong(this.data.amount);
        this.putString(this.data.email);
        this.putString(this.data.pinCode);
        this.putString(this.data.serial);
        this.putString(this.data.extraData);
        this.putString(this.data.orderDesc);
    }
});

CmdSendZMPSubmitCard = BaseOutPacket.extend({
    ctor: function(data) {
        this._super();
        this.data = data;
        this.initData(2);
        this.setCmdId(CMD.PAYMENT_ZMP_SUBMIT_CARD);
    },

    putData: function() {
        this.putString(this.data.platform);
        this.putString(this.data.embedData);

        // tren server nguoc, nen client cung gui nguoc
        // 2 sai thanh dung
        this.putString(this.data.serial);
        this.putString(this.data.pinCode);

        this.putInt(this.data.pmcID);
    }
});

CmdSendZMPRegSMS = BaseOutPacket.extend({
    ctor: function(data) {
        this._super();
        this.data = data;
        this.initData(2);
        this.setCmdId(CMD.PAYMENT_ZMP_REG_SMS);
    },

    putData: function() {
        this.putString(this.data.platform);
        this.putString(this.data.embedData);
        this.putLong(this.data.amount);
        this.putString(this.data.netWorkOperation);
    }
});

CmdSendZMPGetStatus = BaseOutPacket.extend({
    ctor: function(transID) {
        this._super();
        this.transID = transID;
        this.initData(2);
        this.setCmdId(CMD.PAYMENT_ZMP_GET_STATUS);
    },

    putData: function() {
        this.putLong(this.transID);
    }
});

CmdSendVerifyOtpSea = BaseOutPacket.extend({
    ctor: function(data) {
        this._super();
        this.data = data;
        this.initData(2);
        this.setCmdId(CMD.PAYMENT_SEA_VERIFY_OTP);
    },

    putData: function() {
        this.putString(this.data.transId);
        this.putString(this.data.partnerTransId);
        this.putInt(this.data.paymentType);
        this.putString(this.data.otp);
    }
});

CmdSendFirstPayUpdate = BaseOutPacket.extend({
    ctor: function() {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.PAYMENT_FIRST_PAY_UPDATE);
    }
});