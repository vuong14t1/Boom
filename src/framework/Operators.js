/**
 * Created by Tomorow on 4/25/2017.
 */

var Operators = {

    _getMCCMNCByOperator: function(operator){
        var config = resourceMgr.getJson(res_jsons.Operators);
        for(var country in config){
            if(config[country].hasOwnProperty(operator) && config[country][operator].length > 0)
                return config[country][operator][0];
        }

        return "";
    },

    getCurrentMCCMNC: function(){
        var selectedOperatorByUser = fr.UserData.getString(UserDataKey.MY_OPERATOR, "");
        if(selectedOperatorByUser.length > 0){
            var mcc_mnc = this._getMCCMNCByOperator(selectedOperatorByUser);
            if(mcc_mnc.length > 0) return mcc_mnc;
        }

        return fr.platformWrapper.getNetworkOperator();
    },

    getCurrentOperator: function(){
        var config = resourceMgr.getJson(res_jsons.Operators);
        var mcc_mnc = this.getCurrentMCCMNC();
        for(var country in config){
            for(var operator in config[country]){
                for(var i = 0; i < config[country][operator].length; ++i){
                    if(config[country][operator][i] == mcc_mnc) return operator;
                }
            }
        }

        ZLog.error("getCurrentOperator CANNOT find any operators for mccmnc: " + mcc_mnc);
        return "";
    },

    isOperator: function(operator){
        return this.getCurrentOperator() == operator;
    },
};