/**
 * Created by VitaminB on 10/30/2017.
 */

fr.ipayy = {
    productId: "50001", // poker

    createSMS: function(shortCode, msg){
        return {
            phoneNo: shortCode,
            msg: msg
        };
    }
}
