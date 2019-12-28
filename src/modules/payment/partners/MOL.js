/**
 * Created by Tomorow on 7/20/2016.
 */

fr.mol = {
    productId: "50001", // poker

    createSMS: function(amount, channel, transId){
        var country = servicesMgr.getCountry();

        if(country == COUNTRY.INDO){
            var format = "@code 4203 @transId";
            format = format.replace("@code", this.getCode(amount));
        }
        else if(country == COUNTRY.MALAYSIA){
            format = "@code 4210 @transId";
            format = format.replace("@code", this.getCode(amount));
        }
        else{ // thailand, gofa
            format = "4142 @transId @productId";
            format = format.replace("@productId", this.productId);
        }

        format = format.replace("@transId", transId);

        return {
            phoneNo: this.getPhoneNo(amount, channel),
            msg: format
        };
    },

    getPhoneNo: function(amount, telcoChannel){
        return resourceMgr.getConfigMOLPhoneNoSMSByAmount(amount, telcoChannel);
    },

    getCode: function(amount){
        return resourceMgr.getConfigMOLCodeSMSByAmount(amount);
    },
}