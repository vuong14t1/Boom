/**
 * Created by eXtraKute on 2017-06-02.
 */

fr.coda = {
    productId: "", // poker

    createSMS: function (amount, channel, instruction) {
        var country = servicesMgr.getCountry();
        var skull;
        var format;
        var instruct = instruction;

        if ((country == COUNTRY.INDO && (channel == TELCO_CHANNELS.TELKOMSEL || channel == TELCO_CHANNELS.XL))
            || (country == COUNTRY.MYANMAR && (channel == TELCO_CHANNELS.OOREDOO))) {

            var arr = instruct.split('\"');
            if (arr.length > 0) {
                format = arr[1];
            }

            arr = instruct.split('.');
            var arr1 = arr[0].split(' ');
            skull = arr1[arr1.length - 1];

            return {
                phoneNo: skull,
                msg: format
            };
        }
        else {
            return instruct;
        }
    }
};