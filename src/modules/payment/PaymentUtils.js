/**
 * Created by Tomorow on 4/25/2017.
 */

var PaymentUtils = function(){

    return {
        /**
         * PS.json ==> country => operator >
         * @param config
         * @returns {*}
         */
        isWebViewType: function(config){
            return config['isWebView'];
        },

        /**
         * PS.json ==> country => operator >
         * @param config
         * @returns {*}
         */
        isNeedPhoneNumber: function(config){
            return config && config['needPhoneNumber'];
        },

        /**
         * PS.json ==> country => operator >
         * @param listSMSConfig
         * @returns {boolean}
         */
        isSupportPostPaidAndPrePaid: function(listSMSConfig){
            if(listSMSConfig.length == 1) return false;

            var isPrePaid = false;
            var isPostPaid = false;
            for(var i = 0; i < listSMSConfig.length; ++i){
                if(listSMSConfig[i]['canPostpaid'])
                    isPostPaid = true;
                else
                    isPrePaid = true;
            }

            return isPrePaid && isPostPaid;
        },

        isLocalPaymentSystemSupported: function(paymentSystem){
            var list = resourceMgr.getJson(res_jsons.PS)['paymentSystems'];
            for(var i = 0; i < list.length; ++i){
                if(list[i] == paymentSystem) return true;
            }

            return false;
        },

        /**
         * PS.json =>country => dcb=>
         * @param country
         * @param paymentSystems
         * @returns {boolean}
         */
        isLocalDCBSupported: function(country, paymentSystems){
            var configByCountry = resourceMgr.getJson(res_jsons.PS)['country'][country];
            if(configByCountry == null) {
                return false;
            }

            for(var operator in configByCountry['dcb']){
                var arr = configByCountry['dcb'][operator];
                for(var i = 0; i < arr.length; ++i){
                    for(var j = 0; j < paymentSystems.length; ++j){
                        if(arr[i]['partner'] == paymentSystems[j]) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        isLocalSMSSupported: function(country, paymentSystems){
            var configByCountry = resourceMgr.getJson(res_jsons.PS)['country'][country];
            if(configByCountry == null) {
                //ZLog.error("isLocalSMSSupported CANNOT find this COUNTRY config for: " + JSON.stringify(arguments));
                return false;
            }

            for(var operator in configByCountry['sms']){
                var arr = configByCountry['sms'][operator];
                for(var i = 0; i < arr.length; ++i){
                    for(var j = 0; j < paymentSystems.length; ++j){
                        if(arr[i]['partner'] == paymentSystems[j]) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        isLocalTelcoSupported: function(country, paymentSystems){
            return this.getListTelcoChannel(country, paymentSystems).length > 0;
        },

        isValidCardInputFormat: function(telco, pinCode, serial){
            if(pinCode == serial) return false;

            switch (telco){
                //case TELCO_CHANNELS.VIETTEL:
                //case TELCO_CHANNELS.MOBI_PHONE:
                //case TELCO_CHANNELS.VINA_PHONE:
                case TELCO_CHANNELS.DTAC_HAPPY:
                case TELCO_CHANNELS.MOL_POINTS:
                    return CARD_REG[telco].PIN_CODE.test(pinCode) && CARD_REG[telco].SERIAL.test(serial);

                case TELCO_CHANNELS.TRUE:
                case TELCO_CHANNELS.AIS:
                case TELCO_CHANNELS.EASY_POINTS:
                    return CARD_REG[telco].PIN_CODE.test(pinCode);
            }

            return true;
        },

        /**
         *
         * @param listSMSPaymentType
         * @returns {*}
         */
        getPrePaid: function(listSMSPaymentType){
            for(var i = 0; i < listSMSPaymentType.length; ++i){
                if(!listSMSPaymentType[i]['canPostpaid']) return listSMSPaymentType[i];
            }

            return null;
        },

        /**
         *
         * @param listSMSPaymentType
         * @returns {*}
         */
        getPostPaid: function(listSMSPaymentType){
            for(var i = 0; i < listSMSPaymentType.length; ++i){
                if(listSMSPaymentType[i]['canPostpaid']) return listSMSPaymentType[i];
            }

            return null;
        },

        getCurrency: function(){
            var country = servicesMgr.getCountry();

            switch (country){
                case COUNTRY.VIETNAM:
                    return CURRENCY.VND;

                case COUNTRY.INDO:
                    return CURRENCY.IDR;

                case COUNTRY.MALAYSIA:
                    return CURRENCY.MYR;

                case COUNTRY.THAILAND:
                case COUNTRY.GOFA:
                    return CURRENCY.THB;

                case COUNTRY.MYANMAR:
                    return CURRENCY.MMK;

                case COUNTRY.INDIA:
                    return CURRENCY.INR;

                default :
                    return CURRENCY.USD;
            }
        },

        /**
         *
         * @param country
         * @param paymentSystems
         * @param isDCB
         */
        getAvailableOperators: _.memoize(function(country, paymentSystems, isDCB){
            if(isDCB === undefined) isDCB = false;

            var configByCountry = resourceMgr.getJson(res_jsons.PS)['country'][country];
            if(configByCountry == null) {
                return [];
            }

            var result = [];
            var operators = isDCB ? configByCountry['dcb'] : configByCountry['sms'];
            for(var operatorName in operators){
                if(operatorName == 'default') continue;

                var operatorArr = operators[operatorName];
                for(var i = 0; i < operatorArr.length; ++i){
                    for(var j = 0; j < paymentSystems.length; ++j){
                        if(operatorArr[i]['partner'] == paymentSystems[j]) {
                            result.push(operatorName);
                            break;
                        }
                    }
                }
            }

            result = _.uniq(result);
            return result;

        }, function(){
            return _.join(arguments);
        }),

        /**
         *
         * @param country
         * @param paymentSystems
         */
        getListTelcoChannel: _.memoize(function(country, paymentSystems){
            var configByCountry = resourceMgr.getJson(res_jsons.PS)['country'][country];
            if(configByCountry == null) {
                ZLog.error("getListTelcoChannel CANNOT find this COUNTRY config for: " + JSON.stringify(arguments));
                return [];
            }

            var result = [];
            for(var telcoChannel in configByCountry['telco']){
                var arr = configByCountry['telco'][telcoChannel];
                for(var i = 0; i < arr.length; ++i){
                    for(var j = 0; j < paymentSystems.length; ++j){
                        if(arr[i]['partner'] == paymentSystems[j]) {
                            result.push(telcoChannel);
                            break;
                        }
                    }
                }
            }

            result = _.uniq(result);
            return result;

        }, function(){
            return _.join(arguments);
        }),

        getSMSTotalGold: _.memoize(function(packId){
            var config = resourceMgr.getConfigSMSByKey(packId);
            var gold = 0;
            if(config){
                var bonusPercent = PaymentUtils.getSMSPercentBonus(packId);
                gold = bonusPercent * config['gold'];
            }

            return gold;
        }, function(){
            var eventFirstTime = eventModule.getEventById(EVENT_ID.FIRST_TIME);
            var myVipLevel = playerModule.getVipLevel();
            var firstTime = (eventFirstTime.hasEventInfo() && eventFirstTime.isFirstSMSAvailable()) ? '1' : '0';
            var promotion = eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable() ? '1' : '0';

            // cache key for memoize: packId + vip + eventFirstTime + eventPromotion
            return arguments[0] + '_' + myVipLevel + firstTime + promotion;
        }),

        getTelcoTotalGold: _.memoize(function(packId){
            var configPack = resourceMgr.getConfigCardByKey(packId);
            var gold = 0;
            if(configPack){
                var bonusPercent = PaymentUtils.getTelcoPercentBonus(packId);
                var configVip = resourceMgr.getConfigMyVIP();
                var goldAccumulate = configPack.gold * (1 + configVip["buyGoldBonusRate"]);
                var eventDeal = eventModule.getSpecialEventById(EVENT_ID.EXCLUSIVE_DEALS);
                var rejectedByDeal = (eventDeal.hasEventInfo() && eventDeal.canCompleteDeal(goldAccumulate)) ? 0 : 1;
                var bonusFromEvent = eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable()
                    ? (1 + resourceMgr.getConfigPurchasePromotionPercent())
                    : 1;

                gold = bonusPercent * configPack['gold'] + rejectedByDeal * resourceMgr.getConfigEventFirstTimeCardBonus() * bonusFromEvent;
            }

            return gold;
        }, function(){
            var eventFirstTime = eventModule.getEventById(EVENT_ID.FIRST_TIME);
            var myVipLevel = playerModule.getVipLevel();
            var firstTime = (eventFirstTime.hasEventInfo() && eventFirstTime.isFirstCashCardAvailable()) ? '1' : '0';
            var promotion = eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable() ? '1' : '0';
            var canCompleteDeal = '';

            if(arguments.length > 0){
                var packId = arguments[0];
                var configVip = resourceMgr.getConfigMyVIP();
                var configPack = resourceMgr.getConfigCardByKey(packId);
                if(configPack){
                    var goldAccumulate = configPack.gold * (1 + configVip["buyGoldBonusRate"]);
                    var eventDeal = eventModule.getSpecialEventById(EVENT_ID.EXCLUSIVE_DEALS);
                    canCompleteDeal = (eventDeal.hasEventInfo() && eventDeal.canCompleteDeal(goldAccumulate)) ? '1' : '0';
                }
            }

            // cache key for memoize: vip + eventFirstTime + eventPromotion + completeDeal
            return arguments[0] + '_' + myVipLevel + firstTime + promotion + canCompleteDeal;
        }),

        getIAPTotalGold: _.memoize(function(packId){
            var config = resourceMgr.getConfigIAPPackByProductId(packId);
            var gold = 0;
            if(config){
                var bonusPercent = PaymentUtils.getIAPPercentBonus(packId);
                gold = bonusPercent * config['gold'];
            }

            return gold;
        }, function(){
            var eventFirstTime = eventModule.getEventById(EVENT_ID.FIRST_TIME);
            var myVipLevel = playerModule.getVipLevel();
            var firstTime = (eventFirstTime.hasEventInfo() && eventFirstTime.isFirstIAPAvailable()) ? '1' : '0';
            var promotion = eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable() ? '1' : '0';

            // cache key for memoize: vip + eventFirstTime + eventPromotion
            return arguments[0] + '_' + myVipLevel + firstTime + promotion;
        }),

        /**
         * calculate total sms bonus percent from vip and events
         */
        getSMSPercentBonus: _.memoize(function(packId){
            var eventFirstTime = eventModule.getEventById(EVENT_ID.FIRST_TIME);
            var configVip = resourceMgr.getConfigMyVIP();
            var percent = 1 + configVip["buyGoldBonusRate"];
            var canCompleteDeal = 0;
            if(packId != null){
                var configPack = resourceMgr.getConfigSMSByKey(packId);
                if(configPack){
                    var goldAccumulate = configPack.gold * percent;
                    var eventDeal = eventModule.getSpecialEventById(EVENT_ID.EXCLUSIVE_DEALS);
                    canCompleteDeal = (eventDeal.hasEventInfo() && eventDeal.canCompleteDeal(goldAccumulate)) ? 1 : 0;
                }
            }

            // if user purchases this pack and complete any deals, user won't get bonus first sms
            if(!canCompleteDeal && eventFirstTime.hasEventInfo() && eventFirstTime.isFirstSMSAvailable()){
                percent *= (1 + resourceMgr.getConfigEventFirstTimeSMSBonusPercent());
            }

            if(eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable()){
                percent *= (1 + resourceMgr.getConfigPurchasePromotionPercent());
            }

            return percent;
        }, function(){
            var eventFirstTime = eventModule.getEventById(EVENT_ID.FIRST_TIME);
            var myVipLevel = playerModule.getVipLevel();
            var firstTime = (eventFirstTime.hasEventInfo() && eventFirstTime.isFirstSMSAvailable()) ? '1' : '0';
            var promotion = eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable() ? '1' : '0';
            var canCompleteDeal = '';

            if(arguments.length > 0){
                var packId = arguments[0];
                var configVip = resourceMgr.getConfigMyVIP();
                var configPack = resourceMgr.getConfigSMSByKey(packId);
                if(configPack){
                    var goldAccumulate = configPack.gold * (1 + configVip["buyGoldBonusRate"]);
                    var eventDeal = eventModule.getSpecialEventById(EVENT_ID.EXCLUSIVE_DEALS);
                    canCompleteDeal = (eventDeal.hasEventInfo() && eventDeal.canCompleteDeal(goldAccumulate)) ? '1' : '0';
                }
            }

            // cache key for memoize: vip + eventFirstTime + eventPromotion + completeDeal
            return myVipLevel + firstTime + promotion + canCompleteDeal;
        }),

        /**
         * calculate total telco bonus percent from vip and events
         */
        getTelcoPercentBonus: _.memoize(function(){
            var configVip = resourceMgr.getConfigMyVIP();
            var percent = 1 + configVip["buyGoldBonusRate"];

            if(eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable()){
                percent *= (1 + resourceMgr.getConfigPurchasePromotionPercent());
            }

            return percent;
        }, function(){
            var myVipLevel = playerModule.getVipLevel();
            var promotion = eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable() ? '1' : '0';

            // cache key for memoize: vip + eventPromotion
            return myVipLevel  + promotion;
        }),

        /**
         * calculate total iap bonus percent from vip and events
         */
        getIAPPercentBonus: _.memoize(function(packId){
            var eventFirstTime = playerModule.getEventById(EVENT_ID.FIRST_TIME);
            var configVip = resourceMgr.getConfigMyVIP();
            var percent = 1 + configVip["buyGoldBonusRate"];
            var canCompleteDeal = 0;
            if(packId != null){
                var configPack = resourceMgr.getConfigIAPPackByProductId(packId);
                if(configPack){
                    var goldAccumulate = configPack.gold * percent;
                    var eventDeal = eventModule.getSpecialEventById(EVENT_ID.EXCLUSIVE_DEALS);
                    canCompleteDeal = (eventDeal.hasEventInfo() && eventDeal.canCompleteDeal(goldAccumulate)) ? 1 : 0;
                }
            }

            // if user purchases this pack and complete any deals, user won't get bonus first iap
            if(!canCompleteDeal && eventFirstTime.hasEventInfo() && eventFirstTime.isFirstIAPAvailable()){
                percent *= (1 + resourceMgr.getConfigEventFirstTimeIAPBonusPercent());
            }

            if(eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable()){
                percent *= (1 + resourceMgr.getConfigPurchasePromotionPercent());
            }

            return percent;
        }, function(){ // this function will return a key for caching
            var eventFirstTime = eventModule.getEventById(EVENT_ID.FIRST_TIME);
            var myVipLevel = playerModule.getVipLevel();
            var firstTime = (eventFirstTime.hasEventInfo() && eventFirstTime.isFirstIAPAvailable()) ? '1' : '0';
            var promotion = eventModule.getSpecialEventById(SPECIAL_EVENT_ID.PURCHASE_PROMOTION).isAvailable() ? '1' : '0';
            var canCompleteDeal = '';

            if(arguments.length > 0){
                var packId = arguments[0];
                var configVip = resourceMgr.getConfigMyVIP();
                var configPack = resourceMgr.getConfigIAPPackByProductId(packId);
                if(configPack){
                    var goldAccumulate = configPack.gold * (1 + configVip["buyGoldBonusRate"]);
                    var eventDeal = eventModule.getSpecialEventById(EVENT_ID.EXCLUSIVE_DEALS);
                    canCompleteDeal = (eventDeal.hasEventInfo() && eventDeal.canCompleteDeal(goldAccumulate)) ? '1' : '0';
                }
            }

            // cache key for memoize: vip + eventFirstTime + eventPromotion + completeDeal
            return myVipLevel + firstTime + promotion + canCompleteDeal;
        })
    };
}();