/**
 * Created by Tomorow on 6/30/2016.
 */

var DataPaymentTrans = cc.Class.extend({

    ctor: function(){
        this.telcoChannel = "";
        this.paymentSystem = "";
        this.paymentType = "";
        this.countryId = "";
        this.amount = 0;
        this.email = "";
        this.pinCode = "";
        this.serial = "";
        this.isWebView = false;
        this.extraData = "";
        this.orderDesc = "";
        this.needOtp = false;
    },
});