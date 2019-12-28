/**
 * Created by Tomorow on 6/7/2016.
 */

fr.bluepay = {
    privateProductId: "0305",
    liveProductId: "0293",

    createSMS: function(amount, channel, transId){
        var format = "2@productId@transId";

        format = format.replace("@productId", GV.MODE == BUILD_MODE.LIVE ? this.liveProductId : this.privateProductId);
        format = format.replace("@transId", transId);

        return {
            phoneNo: this.getPhoneNo(amount, channel),
            msg: format
        };
    },

    getPhoneNo: function(amount, telcoChannel){
        return resourceMgr.getConfigBluePayPhoneNoSMSByAmount(amount, telcoChannel);
    },
}