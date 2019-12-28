/**
 * Created by VitaminB on 11/10/2017.
 */

var PaymentResourceMgr = ResourcesMgr.prototype;

PaymentResourceMgr.getNumOfGPack = _.memoize(function(){
    return resourceMgr.getConfigBaseGoldPacks().length;
});

PaymentResourceMgr.getConfigGPackNearest = function(xu){
    var packs = resourceMgr.getConfigBaseGoldPacks();
    var indexPack = -1;
    for(var i = 0; i < packs.length; ++i){
        if(packs[i].xuCost > xu){
            indexPack = i == 0 ? 0 : i - 1;
            break;
        }
    }

    if(indexPack < 0){
        indexPack = packs.length - 1;
    }

    return packs[indexPack];
};

PaymentResourceMgr.getConfigGPack = _.memoize(function(packId){
    var config = resourceMgr.getJson(res_jsons.GoldPack);
    var configPack = _.assign(new ConfigGPack(), config['BasePack'][packId]);

    config = null;
    return configPack;
});

PaymentResourceMgr.getConfigBaseGoldPacks = _.memoize(function(){
    var config = _.map(resourceMgr.getJson(res_jsons.GoldPack)["BasePack"], function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(obj){
        return obj.packId != "GP_0";
    });
});

PaymentResourceMgr.getConfigZaloSMSPackAvailable = _.memoize(function(){
    var config = _.map(resourceMgr.getJson(res_jsons.GoldPack)["ZaloSMSPack"], function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(o){
        return o.isAvailable;
    });
});

PaymentResourceMgr.getConfigZMPSMSPackAvailable = _.memoize(function(){
    var config = _.map(resourceMgr.getJson(res_jsons.GoldPack)["ZingSMSPack"], function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(o){
        return o.isAvailable;
    });
});

PaymentResourceMgr.getConfigBluePaySMSPackAvailable = _.memoize(function(){
    var config = _.map(resourceMgr.getJson(res_jsons.GoldPack)["BluePaySMSPackTH"], function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(obj){
        return obj.isAvailable;
    });
});

PaymentResourceMgr.getConfigMOLSMSPackAvailable = _.memoize(function(){
    var country = servicesMgr.getCountry();
    //just do only for myanmar
    if(country == COUNTRY.MYANMAR){
        var config = resourceMgr.getJson(res_jsons.GoldPack)["MOL_MM"];
    }
    //if(country == COUNTRY.INDO){
    //    var config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackID"];
    //}
    //else if(country == COUNTRY.MALAYSIA){
    //    config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackMY"];
    //}
    //else if(country == COUNTRY.MYANMAR){
    //    config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackMM"];
    //}
    //else{ // thailand, gofa
    //    config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackTH"];
    //}

    config = _.map(config, function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(o){
        return o.isAvailable;
    });
}, function(){
    return _.join([servicesMgr.getCountry(), _.join(servicesMgr.getListPaymentMethods())]);
});

PaymentResourceMgr.getConfigCODADCBPackAvailable = _.memoize(function(){
    var config;

    //just do only for myanmar
    if(servicesMgr.getCountry() == COUNTRY.MYANMAR) {
        config = resourceMgr.getJson(res_jsons.GoldPack)["CODA_MM"];
    }
    //else if(servicesMgr.getCountry() == COUNTRY.MYANMAR) {
    //    config = resourceMgr.getJson(res_jsons.GoldPack)["CODASMSPackMM"];
    //}

    config = _.map(config, function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(o){
        return o.isAvailable;
    });

}, function(){
    return _.join([servicesMgr.getCountry(), _.join(servicesMgr.getListPaymentMethods())]);
});

PaymentResourceMgr.getConfigCODASMSPackAvailable = _.memoize(function(){
    var config = resourceMgr.getJson(res_jsons.GoldPack)["CODASMSPackMM"];

    config = _.map(config, function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(o){
        return o.isAvailable;
    });

}, function(){
    return _.join([servicesMgr.getCountry(), _.join(servicesMgr.getListPaymentMethods())]);
});

PaymentResourceMgr.getConfigIpayySMSPackAvailable = _.memoize(function(){
    var config = resourceMgr.getJson(res_jsons.GoldPack)["IPAYYSMSPackIN"];

    config = _.map(config, function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(o){
        return o.isAvailable;
    });
});

PaymentResourceMgr.getConfigIpayyDCBPackAvailable = _.memoize(function(){
    var config = resourceMgr.getJson(res_jsons.GoldPack)["IPAYYDCBPackIN"];

    config = _.map(config, function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(o){
        return o.isAvailable;
    });
});

PaymentResourceMgr.getConfigFortumoSMSPackAvailable = _.memoize(function(){
    var config = resourceMgr.getJson(res_jsons.GoldPack)["FORTSMSPackIN"];

    config = _.map(config, function(obj, key){
        obj.packId = key;
        return obj;
    });

    return _.filter(config, function(o){
        return o.isAvailable;
    });
});

PaymentResourceMgr.getConfigSMSByKey = function(packSMSKey){
    var smsPacks = resourceMgr.getConfigSMSPack();
    for(var payment in smsPacks){
        for(var i = 0; i < smsPacks[payment].length; ++i){
            if(packSMSKey == smsPacks[payment][i].packId){
                return smsPacks[payment][i];
            }
        }
    }

    var dcbPacks = resourceMgr.getConfigDCBPack();
    for(payment in dcbPacks){
        for(var i = 0; i < dcbPacks[payment].length; ++i){
            if(packSMSKey == dcbPacks[payment][i].packId){
                return dcbPacks[payment][i];
            }
        }
    }

    ZLog.error("not found or not loaded SMSByKey or DCBByKey: %s", packSMSKey);
    return null;
};

PaymentResourceMgr.getConfigSMSByCost = _.memoize(function(paymentSystem, cost){
    //ZLog.debug("getConfigSMSByCost: " + paymentSystem + ", " + cost);
    var smsPacks = resourceMgr.getConfigSMSPack()[paymentSystem];

    return _.find(smsPacks, function(obj){
        return obj.cost == cost;
    });
}, function(){
    return _.join(arguments);
});

PaymentResourceMgr.getConfigIAPPacks = _.memoize(function(){
    var packs = resourceMgr.getJson(res_jsons.InAppPurchase)["InAppPurchase"];
    packs = _.map(packs, function(obj, key){
        return {
            gold: obj.gold,
            usdCost: obj.usdCost,
            localeCost: obj.localeCost,
            vPoint: obj.vPoint,
            productId: key
        };
    });

    return _(packs)
        .map(function(obj, idx){
            obj.index = idx;
            return obj;
        })
        .orderBy(['gold'], ['desc'])
        .value();
});

PaymentResourceMgr.getConfigIAPPackByProductId = _.memoize(function(productId){
    ZLog.debug("getConfigIAPPackByProductId: " + productId);

    return _.find(resourceMgr.getConfigIAPPacks(), function(obj){
        return productId.indexOf(obj.productId) >= 0;
    });
});

PaymentResourceMgr.getConfigSMSPack = function(){
    var result = {};
    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.BLUE_PAY)){
        result[PAYMENT_SYSTEM.BLUE_PAY] = resourceMgr.getConfigBluePaySMSPackAvailable();
    }

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.MOL)){
        result[PAYMENT_SYSTEM.MOL] = resourceMgr.getConfigMOLSMSPackAvailable();
    }

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.CODA)){
        result[PAYMENT_SYSTEM.CODA] = resourceMgr.getConfigCODASMSPackAvailable();
    }

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZMPAY)){
        result[PAYMENT_SYSTEM.ZMPAY] = resourceMgr.getConfigZMPSMSPackAvailable();
    }

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZALO)){
        result[PAYMENT_SYSTEM.ZALO] = resourceMgr.getConfigZaloSMSPackAvailable();
    }

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IPAYY)){
        result[PAYMENT_SYSTEM.IPAYY] = resourceMgr.getConfigIpayySMSPackAvailable();
    }

    return result;
};

PaymentResourceMgr.getConfigDCBPack = function(){
    var result = {};

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.CODA)){
        result[PAYMENT_SYSTEM.CODA] = resourceMgr.getConfigCODADCBPackAvailable();
    }

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.MOL)){
        result[PAYMENT_SYSTEM.MOL] = resourceMgr.getConfigMOLSMSPackAvailable();
    }

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IPAYY)){
        result[PAYMENT_SYSTEM.IPAYY] = resourceMgr.getConfigIpayyDCBPackAvailable();
    }

    return result;
};

PaymentResourceMgr.getConfigFirstSMSPack = function(){
    var listSMS = resourceMgr.getConfigSMSPack();

    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZMPAY)){
        return _.nth(listSMS[PAYMENT_SYSTEM.ZMPAY], -1);    // the last pack
    }
    else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.CODA)){
        return listSMS[PAYMENT_SYSTEM.CODA][0];
    }
    else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.MOL)){
        return listSMS[PAYMENT_SYSTEM.MOL][0];
    }
    else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.BLUE_PAY)){
        return listSMS[PAYMENT_SYSTEM.BLUE_PAY][0];
    }
    else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IPAYY)){
        return _.find(listSMS[PAYMENT_SYSTEM.IPAYY], function(obj){
            return obj.cost > 14;
        });
    }

    ZLog.error("not found or not loaded getConfigFirstSMSPack: %s");
    return null;
};

PaymentResourceMgr.getConfigBluePayPhoneNoSMSByAmount = _.memoize(function(amount, channel){
    //ZLog.debug("getConfigBluePayPhoneNoSMSByAmount: " + amount + ", " + channel);
    if(channel && channel.length > 0){
        if(channel == TELCO_CHANNELS.TRUE){
            channel += "money";
        }
        channel = channel.toUpperCase();

        var config = resourceMgr.getJson(res_jsons.GoldPack)["BluePaySMSPackTH"];
        for(var key in config){
            if(config[key]["cost"] == amount){
                for(var channelName in config[key]["skull"]){
                    if(channel == channelName){
                        return config[key]["skull"][channel];
                    }
                }
            }
        }
    }

    return "";
}, function(){
    return _.join(arguments);
});

PaymentResourceMgr.getConfigMOLPhoneNoSMSByAmount = _.memoize(function(amount, channel){
    //ZLog.debug("getConfigMOLPhoneNoSMSByAmount: " + amount + ", " + channel);

    if(channel && channel.length > 0){
        if(channel == TELCO_CHANNELS.TRUE){
            channel += "money";
        }
        channel = channel.toUpperCase();

        var country = servicesMgr.getCountry();
        if(country == COUNTRY.INDO){
            var config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackID"];
        }
        else if(country == COUNTRY.THAILAND || country == COUNTRY.GOFA){
            config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackTH"];
        }
        else if(country == COUNTRY.MALAYSIA){
            config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackMY"];
        }

        var first = _.find(config, function(obj){
            return obj.cost == amount;
        });

        if(first){
            var phoneNo = _.find(first['skull'], function(value, key){
                return key == channel;
            });

            if(phoneNo) return phoneNo;
        }
    }

    return "";

}, function(){
    return _.join(arguments);
});

PaymentResourceMgr.getConfigMOLCodeSMSByAmount = _.memoize(function(amount){
    var country = servicesMgr.getCountry();
    if(country == COUNTRY.INDO){
        var config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackID"];
    }
    else if(country == COUNTRY.MALAYSIA){
        config = resourceMgr.getJson(res_jsons.GoldPack)["MOLSMSPackMY"];
    }
    else{
        return "";
    }

    for(var key in config){
        if(config[key]["cost"] == amount){
            return config[key]["code"];
        }
    }

    return "";
});

PaymentResourceMgr.getConfigCardByKey = _.memoize(function(packCardKey){
    var cardPacks = resourceMgr.getConfigAllCardPacks();

    for(var i = 0; i < cardPacks.length; ++i){
        if(packCardKey == cardPacks[i].packId){
            return cardPacks[i];
        }
    }

    ZLog.error("not found or not loaded cardByKey: %s", packCardKey);
    return null;
});

PaymentResourceMgr.getConfigAllCardPacks = _.memoize(function(){
    return _.flatten(_.map(resourceMgr.getJson(res_jsons.CardGoldPack), function(obj){
        return _.map(obj, function(obj2, key){
            obj2.packId = key;
            return obj2;
        })
    }));
});

PaymentResourceMgr.getConfigCardGoldPacks = function(telco){
    var packs = [];
    if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZMPAY)){
        packs = resourceMgr.getConfigZMPCardGoldPacks();
    }
    else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM._2C2P)){
        packs = resourceMgr.getConfig2C2PCardGoldPacks();
    }
    else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.MOL)){
        packs = resourceMgr.getConfigMOLCardGoldPacks();
    }
    else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.BLUE_PAY)){
        packs = resourceMgr.getConfigBluePayCardGoldPacks();
    }

    if(telco !== undefined){
        telco = telco.toUpperCase();
        if(telco == 'TRUE') telco = 'TRUEMONEY';
        packs = _.filter(packs, function(obj){
            return obj['isAvailable'].hasOwnProperty(telco) && obj['isAvailable'][telco];
        });
    }

    return _(packs)
        .map(function(obj, index){
            obj.index = index;
            return obj;
        })
        .orderBy(['gold'], ['desc'])
        .value();
};

PaymentResourceMgr.getConfigZMPCardGoldPacks = _.memoize(function(){
    return _.map(resourceMgr.getJson(res_jsons.CardGoldPack)["ZaloCardPack"], function(obj, key){
        obj.packId = key;
        return obj;
    });
});

PaymentResourceMgr.getConfigMOLCardGoldPacks = _.memoize(function(){
    var country = servicesMgr.getCountry();
    switch (country){
        case COUNTRY.THAILAND:
            var key = "MOLCardPackTH";
            break;

        case COUNTRY.MALAYSIA:
            key = "MOLCardPackMY";
            break;

        case COUNTRY.INDO:
            key = "MOLCardPackID";
            break;

        case COUNTRY.MYANMAR:
        default:
            return [];
    }

    return _.map(resourceMgr.getJson(res_jsons.CardGoldPack)[key], function(obj, key){
        obj.packId = key;
        return obj;
    });
});

PaymentResourceMgr.getConfigBluePayCardGoldPacks = _.memoize(function(){
    return _.map(resourceMgr.getJson(res_jsons.CardGoldPack)["BluePayCardPackTH"], function(obj, key){
        obj.packId = key;
        return obj;
    });
});

PaymentResourceMgr.getConfig2C2PCardGoldPacks = _.memoize(function(){
    return _.map(resourceMgr.getJson(res_jsons.CardGoldPack)["2C2P_MM"], function(obj, key){
        obj.packId = key;
        return obj;
    });
});

/**
 *
 * @param country
 * @param paymentSystem
 * @returns {*}
 */
PaymentResourceMgr.getConfigPaymentSMSDefault = function(country, paymentSystem){
    var configByCountry = resourceMgr.getJson(res_jsons.PS)['country'][country];
    if(configByCountry == null) return null;
    if(configByCountry['sms'] == null) return null;
    var configByOperator = configByCountry['sms']["default"];
    if(configByOperator == null || !_.isArray(configByOperator) || configByOperator.length == 0) return null;

    for(var i = 0; i < configByOperator.length; ++i){
        if(configByOperator[i]['partner'] == paymentSystem) {
            ZLog.debug("configByOperator default = " + JSON.stringify(configByOperator[i]));
            return configByOperator[i];
        }
    }

    return null;
};

/**
 *
 * @param country
 * @param operator
 * @returns {*}
 */
PaymentResourceMgr.getConfigPaymentDCBByOperator = function(country, operator){
    var configByCountry = resourceMgr.getJson(res_jsons.PS)['country'][country];
    if(configByCountry == null) {
        ZLog.error("getConfigPaymentSMSByOperator CANNOT find this COUNTRY config for: " + JSON.stringify(arguments));
        return PS_ERROR.COUNTRY_NOT_FOUND;
    }

    var configByOperator = configByCountry['dcb'][operator];
    if(configByOperator == null) {
        ZLog.error("getConfigPaymentSMSByOperator CANNOT find this OPERATOR config for: " + JSON.stringify(arguments));
        return PS_ERROR.OPERATOR_NOT_FOUND;
    }

    //ZLog.debug("getConfigPaymentSMSByOperator = " + JSON.stringify(configByOperator));
    configByOperator = _.orderBy(configByOperator, ["priority"], ["desc"]);
    //ZLog.debug("getConfigPaymentSMSByOperator = " + JSON.stringify(configByOperator));
    return configByOperator;
};

PaymentResourceMgr.getConfigPaymentSMSByOperator = function(country, operator){
    var configByCountry = resourceMgr.getJson(res_jsons.PS)['country'][country];
    if(configByCountry == null) {
        ZLog.error("getConfigPaymentSMSByOperator CANNOT find this COUNTRY config for: " + JSON.stringify(arguments));
        return PS_ERROR.COUNTRY_NOT_FOUND;
    }

    var configByOperator = configByCountry['sms'][operator];
    if(configByOperator == null) {
        ZLog.error("getConfigPaymentSMSByOperator CANNOT find this OPERATOR config for: " + JSON.stringify(arguments));
        return PS_ERROR.OPERATOR_NOT_FOUND;
    }

    configByOperator = _.orderBy(configByOperator, ["priority"], ["desc"]);
    //ZLog.debug("getConfigPaymentSMSByOperator = " + JSON.stringify(configByOperator));
    return configByOperator;
};

PaymentResourceMgr.getConfigPaymentTelcoByTelcoChannel = function(country, telcoChannel){
    var configByCountry = resourceMgr.getJson(res_jsons.PS)['country'][country];
    if(configByCountry == null) {
        ZLog.error("getConfigPaymentTelcoByTelcoChannel CANNOT find this COUNTRY config for: " + JSON.stringify(arguments));
        return PS_ERROR.COUNTRY_NOT_FOUND;
    }

    var configByOperator = configByCountry['telco'][telcoChannel];
    if(configByOperator == null) {
        ZLog.error("getConfigPaymentTelcoByTelcoChannel CANNOT find this TELCO CHANNEL config for: " + JSON.stringify(arguments));
        return PS_ERROR.OPERATOR_NOT_FOUND;
    }

    configByOperator = _.orderBy(configByOperator, ["priority"], ["desc"]);
    //ZLog.debug("getConfigPaymentSMSByOperator = " + JSON.stringify(configByOperator));
    return configByOperator;
};

/**
 *
 * @param country
 * @param operator
 * @param paymentSystems
 * @returns {*}
 */
PaymentResourceMgr.getConfigPaymentDCB = function(country, operator, paymentSystems){
    if(arguments.length != 3){
        ZLog.error("getConfigPaymentSMS require 3 args: " + JSON.stringify(arguments));
        return PS_ERROR.PARAM_INVALID;
    }

    var errorCode = this.getConfigPaymentDCBByOperator(country, operator);
    if(errorCode < 0) return errorCode;

    var listPayment = errorCode;
    var listSystem = _.isArray(paymentSystems) ? paymentSystems : [paymentSystems];
    var result = [];
    for(var i = 0; i < listPayment.length; ++i){
        for(var j = 0; j < listSystem.length; ++j){
            if(listPayment[i]['partner'] == listSystem[j]) {
                result.push(listPayment[i]);
            }
        }
    }

    if(result.length == 0){
        ZLog.error("getConfigPaymentSMS require PAYMENT_TYPE_NOT_FOUND:" + JSON.stringify(arguments));
        return PS_ERROR.PAYMENT_TYPE_NOT_FOUND;
    }

    //ZLog.debug("getConfigPaymentSMS = " + JSON.stringify(result));
    return result;
};

PaymentResourceMgr.getConfigPaymentSMS = function(country, operator, paymentSystems){
    if(arguments.length != 3){
        ZLog.error("getConfigPaymentSMS require 3 args: " + JSON.stringify(arguments));
        return null;
    }

    var errorCode = this.getConfigPaymentSMSByOperator(country, operator);
    if(errorCode < 0) return errorCode;

    var listPayment = errorCode;
    var listSystem = _.isArray(paymentSystems) ? paymentSystems : [paymentSystems];
    var result = [];
    for(var i = 0; i < listPayment.length; ++i){
        for(var j = 0; j < listSystem.length; ++j){
            if(listPayment[i]['partner'] == listSystem[j]) {
                result.push(listPayment[i]);
            }
        }
    }

    if(result.length == 0){
        ZLog.error("getConfigPaymentSMS require PAYMENT_TYPE_NOT_FOUND:" + JSON.stringify(arguments));
        return PS_ERROR.PAYMENT_TYPE_NOT_FOUND;
    }

    //ZLog.debug("getConfigPaymentSMS = " + JSON.stringify(result));
    return result;
};

/**
 *
 * @param country
 * @param telcoChannel
 * @param paymentSystems
 */
PaymentResourceMgr.getConfigPaymentTelco = function(country, telcoChannel, paymentSystems){
    if(arguments.length != 3){
        ZLog.error("getConfigPaymentTelco require 3 args: " + JSON.stringify(arguments));
        return null;
    }

    var errorCode = this.getConfigPaymentTelcoByTelcoChannel(country, telcoChannel);
    if(errorCode < 0) return errorCode;

    var listPayment = errorCode;
    var listSystem = _.isArray(paymentSystems) ? paymentSystems : [paymentSystems];
    var result = [];
    for(var i = 0; i < listPayment.length; ++i){
        for(var j = 0; j < listSystem.length; ++j){
            if(listPayment[i]['partner'] == listSystem[j]) {
                result.push(listPayment[i]);
            }
        }
    }

    if(result.length == 0){
        ZLog.error("getConfigPaymentTelco require PAYMENT_TYPE_NOT_FOUND:" + JSON.stringify(arguments));
        return PS_ERROR.PAYMENT_TYPE_NOT_FOUND;
    }

    //ZLog.debug("getConfigPaymentTelco = " + JSON.stringify(result));
    return result;
};

PaymentResourceMgr.getRecommendedPurchaseForDeal = function(dealId){
    var smsPacks = resourceMgr.getConfigSMSPack();
    var dcbPacks = resourceMgr.getConfigDCBPack();

    var pack = null;
    if(dealId == ExclusiveDealId.DEAL_1){
        if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZALO)){
            pack = smsPacks[PAYMENT_SYSTEM.ZALO][0];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZMPAY)){
            pack = smsPacks[PAYMENT_SYSTEM.ZMPAY][0];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.MOL)){
            pack = smsPacks.hasOwnProperty(PAYMENT_SYSTEM.MOL) ? smsPacks[PAYMENT_SYSTEM.MOL][0] : dcbPacks[PAYMENT_SYSTEM.MOL][0];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.BLUE_PAY)){
            pack = smsPacks[PAYMENT_SYSTEM.BLUE_PAY][0];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.CODA)){
            pack = dcbPacks[PAYMENT_SYSTEM.CODA][0];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IPAYY)){
            pack = smsPacks.hasOwnProperty(PAYMENT_SYSTEM.IPAYY) ? smsPacks[PAYMENT_SYSTEM.IPAYY][0] : dcbPacks[PAYMENT_SYSTEM.IPAYY][0];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IAP)){
            var iapPack = resourceMgr.getConfigIAPPackByProductId(iapProductList[0]);
            pack = {
                gold: iapPack.gold,
                cost: iapPack.usdCost,
                vPoint: iapPack.vPoint,
                packId: iapProductList[0]
            };
        }
    }
    else if(dealId == ExclusiveDealId.DEAL_2){
        if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZALO)){
            pack = _.nth(smsPacks[PAYMENT_SYSTEM.ZALO], -1);
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZMPAY)){
            pack = _.nth(smsPacks[PAYMENT_SYSTEM.ZMPAY], -1);
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.MOL)){
            pack = smsPacks.hasOwnProperty(PAYMENT_SYSTEM.MOL) ? smsPacks[PAYMENT_SYSTEM.MOL][1] : dcbPacks[PAYMENT_SYSTEM.MOL][0];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.BLUE_PAY)){
            pack = smsPacks[PAYMENT_SYSTEM.BLUE_PAY][1];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.CODA)){
            pack = _.find(dcbPacks[PAYMENT_SYSTEM.CODA], function(o){
                return o.cost >= 900;
            });
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IPAYY)){
            pack = smsPacks.hasOwnProperty(PAYMENT_SYSTEM.IPAYY) ? smsPacks[PAYMENT_SYSTEM.IPAYY][0] : dcbPacks[PAYMENT_SYSTEM.IPAYY][0];
        }
        else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IAP)){
            iapPack = resourceMgr.getConfigIAPPackByProductId(iapProductList[0]);
            pack = {
                gold: iapPack.gold,
                cost: iapPack.usdCost,
                vPoint: iapPack.vPoint,
                packId: iapProductList[0]
            };
        }
    }

    smsPacks = null;
    return pack;
};

PaymentResourceMgr.getConfigIAPPortalPacks = _.memoize(function(){
    var packageName = fr.platformWrapper.getPackageName();
    var packs = resourceMgr.getJson(res_jsons.InAppPurchase)['packResolver'];
    var list = [];
    for(var key in packs){
        for(var i = 0, length = packs[key]['packageName'].length; i < length; ++i){
            if(packs[key]['packageName'][i] == packageName){
                packs[key].packId = key;
                list.push(packs[key]);
            }
        }
    }

    return _(list)
        .uniqBy("target")
        .map(function(o){
            return o.packId;
        })
        .value();
});

PaymentResourceMgr.getConfigIAPPortalPackIdByPackId = _.memoize(function(packId){
    var packageName = fr.platformWrapper.getPackageName();
    var packs = resourceMgr.getJson(res_jsons.InAppPurchase)['packResolver'];
    if(packs){
        for(var key in packs){
            for(var i = 0, length = packs[key]['packageName'].length; i < length; ++i){
                if(packId == packs[key]['target'] && packageName == packs[key]['packageName'][i]) return key;
            }
        }
    }

    return '';
});

PaymentResourceMgr.getConfigIAPPackIdByIAPPortalPackId = _.memoize(function(portalPackId){
    var pack = resourceMgr.getJson(res_jsons.InAppPurchase)['packResolver'][portalPackId];
    return pack ? pack['target'] : '';
});