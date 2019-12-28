/**
 * Created by bachbv on 1/6/2016.
 */
var PaymentModule = BaseModule.extend({

    _className: "PaymentModule",

    ctor: function(moduleId){
        this._super(moduleId);
        this._curSMSTrans = null;
        this._curCashCardTrans = null;
        this._lastPackSMS = {
            pack: null,
            type: PAYMENT_ITEMS.GOLD
        };
        this._lastPackIAP = {
            pack: null,
            type: PAYMENT_ITEMS.GOLD
        };
        this._guiStoreItem = null;

        this.setListenerValue(8000, 8800);
    },

    //=========================================================
    // RECEIVE
    //=========================================================
    processPackages: function(cmd){
        if(this._curPackage == null){
            cc.warn("%s NOT FOUND curPackage with cmd (%d)", this.getClassName(), cmd);
            return;
        }


        var error = this._curPackage.getError();
        var lastVipLevel = playerModule.getVipLevel();
        var lastGold = playerModule.getGold();
        switch (cmd){
            case CMD.PAYMENT_IN_APP_PURCHASE_ANDROID:
                if(error == ERROR_CODE.SUCCESS ||
                    error == ERROR_CODE.PAYMENT_TRANSACTION_DUPLICATED ||
                    error == ERROR_CODE.PAYMENT_TRANSACTION_SANDBOX_TO_PRODUCTION){

                    fr.iap.finishTransactions(this._curPackage.purchaseData, this._curPackage.signature);
                }else{
                    Popups.showError(error);
                }
                break;

            case CMD.PAYMENT_IN_APP_PURCHASE_IOS:
                sceneMgr.hideGUIWaiting();

                if(error == ERROR_CODE.SUCCESS){
                    fr.iap.finishTransactions(this._curPackage.transList);
                }
                else{
                    if(this._curPackage.transList && this._curPackage.transList.length > 0){
                        fr.iap.finishTransactions(this._curPackage.transList, false);
                    }
                    Popups.showError(error);
                }
                break;

            case CMD.PAYMENT_CREATE_TRANS:
                retCode = this._curPackage.retCode;
                if(retCode == TRANS_ERROR_CODE.SUCCESS){
                    sceneMgr.hideGUIWaiting();

                    if(this._curSMSTrans != null){
                        if(this._curSMSTrans.isWebView){
                            /*if(this._curSMSTrans.paymentType.extraData){
                                var arrExtra = this._curSMSTrans.paymentType.extraData.split(":");
                                var paymentItem = arrExtra[arrExtra.length - 1];
                                if(paymentItem > 0 && paymentItem == PAYMENT_ITEMS.SAFE_BOX){
                                    var guiWebView = this.getGUIWebView();
                                    guiWebView.showAtCurrentScene();
                                    guiWebView.loadURLWebView(this._curPackage.url);
                                    return;
                                }
                            }
                            if(this._guiStoreGold && this._guiStoreGold.isVisible()){
                                this._guiStoreGold.loadPaymentURL(this._curPackage.url);
                            }*/

                            lobbyModule.getGUIWebView().loadURLWebView(this._curPackage.url);

                            //else if(this._guiStoreItem && this._guiStoreItem.isVisible()){
                            //    this._guiStoreItem.loadPaymentURL(this._curPackage.url);
                            //}
                        }
                        else if(this._curSMSTrans.needOtp){
                            this.showGUIVerifyOtp(this._curSMSTrans.paymentType, this._curPackage.transId, this._curPackage.partnerTransId);
                        }
                        else if(this._curPackage.transId && this._curPackage.transId.length > 0){
                            this.sendSMS(this._curPackage);
                        }
                        else{
                            Popups.showMessage("SMS trans ID not found");
                        }

                        this._curSMSTrans = null;
                    }
                    else if(this._curCashCardTrans != null){
                        if(this._guiStoreGold && this._guiStoreGold.isVisible()){
                            //this._guiStoreGold.loadPaymentURL(this._curPackage.url);
                            lobbyModule.getGUIWebView().loadURLWebView(this._curPackage.url);
                        }
                        else if(this._guiStoreItem && this._guiStoreItem.isVisible()){
                            this._guiStoreItem.loadPaymentURL(this._curPackage.url);
                        }

                        this._curCashCardTrans = null;
                    }
                    else{
                        //Popups.showMessage("current Cash Card and sms trans ID null");
                    }
                }
                else{
                    this.showGetTransError(retCode);
                }
                break;

            case CMD.PAYMENT_ZMP_SUBMIT_CARD:
                retCode = this._curPackage.retCode;

                if(retCode != ZING_CARD_CODE.SUCCESS) {
                    this.sendZMPGetStatus(this._curPackage.transID);
                }
                break;

            case CMD.PAYMENT_ZMP_REG_SMS:
                retCode = this._curPackage.retCode;
                if(retCode == ZING_CARD_CODE.SUCCESS){
                    sceneMgr.hideGUIWaiting();
                    fr.platformWrapper.sendSMS(this._curPackage.smsServicePhones["servicePhone"], this._curPackage.smsServicePhones["smsSyntax"]);
                }
                else{
                    this.showZMPError(retCode, this._curPackage.returnMessage);
                }
                break;

            case CMD.PAYMENT_ZMP_GET_STATUS:
                retCode = this._curPackage.retCode;
                var message = this._curPackage.returnMessage;

                if(retCode != ZING_CARD_CODE.SUCCESS){
                    this.showZMPError(retCode, this._curPackage.returnMessage);
                }
                else{
                    sceneMgr.hideGUIWaiting();
                }
                break;

            case CMD.PAYMENT_UPDATE:
                if(error == ERROR_CODE.SUCCESS){
                    if(this._curPackage.paymentItem == PAYMENT_ITEMS.GOLD){
                        // add vip point by sms
                        if(this._curPackage.paymentChannel == PAYMENT_CHANNELS.SMS){
                            SMS_CALLBACK = false;
                            var config = resourceMgr.getConfigSMSByKey(this._curPackage.other);
                            if(config){
                                playerModule.addVipPoint(config.vPoint);

                                // save success operator
                                var tmpOperator = fr.UserData.getString(UserDataKey.MY_OPERATOR_TMP, "");
                                if(tmpOperator.length > 0){
                                    fr.UserData.setString(UserDataKey.MY_OPERATOR, tmpOperator);
                                    fr.UserData.setString(UserDataKey.MY_OPERATOR_TMP, "");

                                    // log to service
                                    OpenTracker.track(TrackingAction.OPERATOR_SUCCESS, tmpOperator);
                                }


                                this.addBonus1StPay(this._curPackage.other);
                            }else{
                                Popups.showMessage("Doesn't have config");
                            }

                            if(this._guiStoreGold && this._guiStoreGold.isVisible()){
                                this._guiStoreGold.setVisibleWebView(false);
                            }
                        }
                        else if(this.isPaymentByCard(this._curPackage.paymentChannel)){
                            config = resourceMgr.getConfigCardByKey(this._curPackage.other);
                            if(config){
                                playerModule.addVipPoint(config.vPoint);
                            }
                        }

                        var addedGold = this._curPackage.amount;
                        // add gold
                        playerModule.addGold(addedGold);
                        playerModule.showGUIReceiveGold(addedGold);

                        //update view
                        if(this.getGUIStoreGold().isVisible()){
                            this.getGUIStoreGold().reloadUI();
                            this.getGUIStoreGold().updateMyInfo();
                        }

                        if(sceneMgr.isScene(GV.SCENE_IDS.REGISTER_VIP)){
                            sceneMgr.getCurrentScene().updateInfoPlayer && sceneMgr.getCurrentScene().updateInfoPlayer();
                        }
                    }
                    //ZLog.error("isContainBonus1StPay" + this.isContainBonus1StPay());
                    //else if(this._curPackage.paymentItem == PAYMENT_ITEMS.ES_TICKETS){
                    //    // process in event module: cmd = 3522
                    //}
                }
                else{
                    Popups.showError(error);
                }
                break;
            case CMD.PAYMENT_SEA_VERIFY_OTP:
                var retCode = this._curPackage.retCode;
                if(retCode == TRANS_ERROR_CODE.SUCCESS) {
                    this.hideGUIVerifyOtp();
                }
                else{
                    Notifications.show("ERROR_OTP_INPUT");
                }
                break;

            case CMD.PAYMENT_FIRST_PAY_UPDATE:
                this.listBonus1StPay = this._curPackage.listBonus1StPay;

                var goldRequired = resourceMgr.getConfigChannelByChannelId(1)['minRequire'];
                var isOutOfGold = playerModule.getGold() < goldRequired && playerModule.getNumOfDailySupported() >= MAX_DAILY_SUPPORTED_GOLD;

                if(this.isContainBonus1StPay()
                    && (isOutOfGold || playerModule.getDayOld() > DAY_OLD_CAN_SHOW_FIRST_PAY)
                    && !sceneMgr.isScene(GV.SCENE_IDS.TABLE)){

                    this.showGUIFirstPay();
                }
                break;

            default :
                break;
        }
    },

    createReceivedPackage: function(cmd, pkg){
        var pk = null;
        switch (cmd){
            case CMD.PAYMENT_UPDATE:
                pk = this.getInPacket(CmdReceivePaymentUpdate);
                break;

            case CMD.PAYMENT_IN_APP_PURCHASE_ANDROID:
                pk = this.getInPacket(CmdReceiveIAPAndroid);
                break;

            case CMD.PAYMENT_IN_APP_PURCHASE_IOS:
                pk = this.getInPacket(CmdReceiveIAPIOs);
                break;

            case CMD.PAYMENT_CREATE_TRANS:
                pk = this.getInPacket(CmdReceivePaymentTrans);
                break;

            case CMD.PAYMENT_ZMP_SUBMIT_CARD:
                pk = this.getInPacket(CmdReceiveZMPSubmitCard);
                break;

            case CMD.PAYMENT_ZMP_REG_SMS:
                pk = this.getInPacket(CmdReceiveZMPRegSMS);
                break;

            case CMD.PAYMENT_ZMP_GET_STATUS:
                pk = this.getInPacket(CmdReceiveZMPGetStatus);
                break;
            case CMD.PAYMENT_SEA_VERIFY_OTP:
                pk = this.getInPacket(CmdReceiveSeaVerifyOtp);
                break;
            case CMD.PAYMENT_FIRST_PAY_UPDATE:
                pk = this.getInPacket(CmdReceiveFirstPayUpdate);
                break;

            default :
                break;
        }

        return pk;
    },

    getGUIIAP: function(){
        if(this._guiInAppPurchase == null){
            this._guiInAppPurchase = new GUIInAppPurchase();
            this._guiInAppPurchase.retain();
        }

        return this._guiInAppPurchase;
    },

    getGUIStoreGold: function(){
        if(this._guiStoreGold == null){
            this._guiStoreGold = new GUIStoreGold();
            this._guiStoreGold.setVisible(false);
            this._guiStoreGold.retain();
        }

        return this._guiStoreGold;
    },

    getLastPackIAP: function(){
        return this._lastPackIAP;
    },

    getLastSMSPurchase: function(){
        return this._lastPackSMS;
    },

    getPMCIDByTelcoChannel: function(telcoName){
        switch (telcoName) {
            case TELCO_CHANNELS.ZING:
                return 1;

            case TELCO_CHANNELS.MOBI_PHONE:
                return 2;

            case TELCO_CHANNELS.VINA_PHONE:
                return 3;

            case TELCO_CHANNELS.VIETTEL:
                return 4;
        }
    },

    /**
     *
     * @param purchaseInfo
     * @param paymentTypeData
     */
    getSMSTransaction: function(purchaseInfo, paymentTypeData){
        this._curSMSTrans = new DataPaymentTrans();

        var curCountry = servicesMgr.getCountry();
        if(curCountry == COUNTRY.GOFA) curCountry = COUNTRY.THAILAND;

        this._curSMSTrans.paymentSystem = paymentTypeData['partner'];
        this._curSMSTrans.paymentType = paymentTypeData['paymentType'];
        this._curSMSTrans.isWebView = paymentTypeData['isWebView'];
        this._curSMSTrans.pinCode = paymentTypeData['phoneNumber'] ? paymentTypeData['phoneNumber'] : '';
        this._curSMSTrans.needOtp = paymentTypeData['needOtp'];

        if(this._curSMSTrans.paymentType > 0){
            var playerInfo = PlayerInfo.Instance;
            this._curSMSTrans.telcoChannel = purchaseInfo.operator;
            this._curSMSTrans.countryId = curCountry;
            this._curSMSTrans.amount = purchaseInfo.cost;
            this._curSMSTrans.extraData = playerInfo.uName + ":" + playerInfo.uId + ":" + purchaseInfo.paymentItem;

            ZLog.error(".........." + JSON.stringify(this._curSMSTrans));
            this.sendGetPurchaseTransaction(this._curSMSTrans);
            var log = "&amount=" + purchaseInfo.cost
                + "&currency=" + PaymentUtils.getCurrency()
                + "&curOperator=" + purchaseInfo.operator
                + "&phoneNumber=" + this._curSMSTrans.pinCode;
            OpenTracker.track(TrackingAction.PURCHASE_SMS, log);
        }
        else{
            Popups.showMessage("getSMSTransaction paymentType <= 0");
        }
    },

    getTelcoTransaction: function(paymentTypeData){
        this._curCashCardTrans = new DataPaymentTrans();

        var curCountry = servicesMgr.getCountry();
        if(curCountry == COUNTRY.GOFA) curCountry = COUNTRY.THAILAND;

        this._curCashCardTrans.paymentSystem = paymentTypeData['partner'];
        this._curCashCardTrans.paymentType = paymentTypeData['paymentType'];
        this._curCashCardTrans.isWebView = paymentTypeData['isWebView'];

        this._curCashCardTrans.countryId = curCountry;

        this.sendGetPurchaseTransaction(this._curCashCardTrans);
    },

    hideGUIVerifyOtp:function(){
        if(this._guiVerifyOtp){
            this._guiVerifyOtp.hide();
        }
    },

    isPaymentByCard: function(channel){
        return channel == PAYMENT_CHANNELS.CARD || channel == PAYMENT_CHANNELS.ZING_CARD || channel == PAYMENT_CHANNELS.PRE_PAID_CARD;
    },

    isBonus1StPay:function(pack){
        var config = resourceMgr.getConfigSMSByKey(pack);
        for (var i in this.listBonus1StPay) {
            var cost = this.listBonus1StPay[i].split('_')[1] - 0;
            //ZLog.debug(config.packId +"|" +configHadBonus.packId +" ===========" + config.cost +"|" + configHadBonus.cost);
            if(config.cost == cost){
                return false;
            }
        }
        return true;
    },

    isContainBonus1StPay:function(){
        var costHadBought = [];
        for (var i in this.listBonus1StPay) {
            var cost = this.listBonus1StPay[i].split('_')[1] - 0;
            var configHadBonus = resourceMgr.getConfigSMSByCost(PAYMENT_SYSTEM.CODA, cost);
            if(configHadBonus == null) continue;
            costHadBought.push(configHadBonus.cost);
        }
        var config = PaymentResourceMgr.getConfigCODADCBPackAvailable();
        for (var index in config) {
            if(!_.includes(costHadBought,config[index].cost)){
                return true;
            }
        }
        return false;
    },

    getMinBonus1StPay:function(){
        var costHadBought = [];
        for (var i in this.listBonus1StPay) {
            var cost = this.listBonus1StPay[i].split('_')[1] - 0; // convert to number
            var configHadBonus = resourceMgr.getConfigSMSByCost(PAYMENT_SYSTEM.CODA, cost);
            if(configHadBonus == null) continue;
            costHadBought.push(configHadBonus.cost);
        }

        var config = PaymentResourceMgr.getConfigCODADCBPackAvailable();
        var bonusRemain = [1];
        for (var index in config) {
            if(!_.includes(costHadBought,config[index].cost)){
                bonusRemain.push(config[index]['bonus1StPay']);
            }
        }

        return _.min(bonusRemain);
    },

    addBonus1StPay:function(packId){
        var config = resourceMgr.getConfigSMSByKey(packId);
        if(config == null) return;

        var key = servicesMgr.getCountry() + '_' + config.cost;
         if(_.includes(this.listBonus1StPay, key)) return;
         this.listBonus1StPay.push(key);
    },
    /**
     *
     * @param dcbPack
     * @param pInfo
     */
    purchaseDCB: function(dcbPack, pInfo){
        if(pInfo === undefined) pInfo = {};

        // init default purchase info
        var defaultInfo = {
            paymentItem: PAYMENT_ITEMS.GOLD,
            operator: Operators.getCurrentOperator(),
            cost: dcbPack.cost,
            packId: dcbPack.packId,
            phoneNumber: '',
            isDCB: true
        };
        var requireShowOperators = !pInfo.hasOwnProperty('operator');

        // merge default info to real purchase info
        var purchaseInfo = _.assignWith(pInfo, defaultInfo, function(targetValue, srcValue){
            return _.isUndefined(targetValue) ? srcValue : targetValue;
        });

        // save last purchase info
        ZLog.debug("this.setLastSMSPurchase(purchaseInfo);" + JSON.stringify(purchaseInfo));
        this.setLastSMSPurchase(purchaseInfo);
        ZLog.debug("this.getGUIStoreGold().setCurrentDCBPack(dcbPack)" + JSON.stringify(dcbPack));
        this.getGUIStoreGold().setCurrentDCBPack(dcbPack);
        var errorOrConfig = PaymentResourceMgr.getConfigPaymentDCBByOperator(servicesMgr.getCountry(),this.operatorName);

        this.getSMSTransaction(purchaseInfo, listDCBPaymentType[0]);

        /*var showSelectOperator = function(requirePhoneNumber){
            OpenTracker.track(TrackingAction.OPERATOR_CANNOT_DETECT);

            if(purchaseInfo.paymentItem == PAYMENT_ITEMS.GOLD){
                if(!paymentModule.getGUIStoreGold().isVisible()){
                    paymentModule.getGUIStoreGold();
                }

                paymentModule.getGUIStoreGold().showSelectDCBOperator(requirePhoneNumber);
            }
            else if(this._guiStoreItem){
                //this._guiStoreItem.showSelectSMSOperator(requirePhoneNumber);
            }
            else{
                ZLog.error('purchaseDCB: GUI store for this item not found: ' + purchaseInfo.paymentItem);
            }
        }.bind(this);

        var country = servicesMgr.getCountry();
        var listPaymentMethods = servicesMgr.getListPaymentMethods();
        var errorCode = resourceMgr.getConfigPaymentDCB(country, purchaseInfo.operator, listPaymentMethods);
        //var log = "&amount=" + purchaseInfo.cost
        //    + "&currency=" + PaymentUtils.getCurrency()
        //    + "&curOperator=" + purchaseInfo.operator;
        //OpenTracker.track(TrackingAction.PURCHASE_SMS, log);

        if(errorCode < 0){
            if(errorCode == PS_ERROR.OPERATOR_NOT_FOUND){
                // get default config
                var defaultConfig = resourceMgr.getConfigPaymentSMSDefault(country, listPaymentMethods[0]);
                if(defaultConfig == null){
                    showSelectOperator();
                    return;
                }
                else{
                    purchaseInfo.operator = defaultConfig['operator'];
                    // if has default config then continue
                    errorCode = [defaultConfig];
                }
            }
            else{
                Popups.showMessage("CONFIG_NOT_FOUND");
                return;
            }
        }

        // error code is payment type list if this purchase has config
        // a little bit confusion :D
        var listDCBPaymentType = errorCode;
        listDCBPaymentType[0].phoneNumber = purchaseInfo.phoneNumber;

        // if config requires phone number or arguments miss 'operator' property
        // then will show popup to get user phone number
        if(PaymentUtils.isNeedPhoneNumber(listDCBPaymentType[0]) && purchaseInfo.phoneNumber.length == 0){
            if(requireShowOperators){
                showSelectOperator();
            }
            else{
                this.showGUIInputPhoneNumber(purchaseInfo, listDCBPaymentType[0], function(_paymentTypeData){
                    this.getSMSTransaction(purchaseInfo, _paymentTypeData);
                }.bind(this));
            }
        }
        // easiest way, just get transaction in background
        else{
            this.getSMSTransaction(purchaseInfo, listDCBPaymentType[0]);
        }*/
    },

    /**
     *
     * @param packId
     * @param paymentItem
     */
    purchaseIAP: function(packId, paymentItem){
        this.setLastPackIAP(packId, paymentItem);
        fr.iap.payForProduct(packId);
    },

    /**
     *
     * @param smsPack
     * @param pInfo
     */
    purchaseSMS: function(smsPack, pInfo){
        if(pInfo === undefined) pInfo = {};

        // init default purchase info
        var defaultInfo = {
            paymentItem: PAYMENT_ITEMS.GOLD,
            operator: Operators.getCurrentOperator(),
            cost: smsPack.cost,
            packId: smsPack.packId,
            phoneNumber: '',
            isDCB: false
        };
        var requireShowOperators = !pInfo.hasOwnProperty('operator');

        // merge default info to real purchase info
        var purchaseInfo = _.assignWith(pInfo, defaultInfo, function(targetValue, srcValue){
            return _.isUndefined(targetValue) ? srcValue : targetValue;
        });

        // save last purchase info
        this.setLastSMSPurchase(purchaseInfo);
        this.getGUIStoreGold().setCurrentSMSPack(smsPack);

        // priority cascade
        if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZMPAY)){
            this.sendGetRegSMS(purchaseInfo);
        }
        else {
            var showSelectOperator = function(){
                OpenTracker.track(TrackingAction.OPERATOR_CANNOT_DETECT);

                if(purchaseInfo.paymentItem == PAYMENT_ITEMS.GOLD){
                    if(!paymentModule.getGUIStoreGold().isVisible()){
                        paymentModule.getGUIStoreGold();
                    }

                    paymentModule.getGUIStoreGold().showSelectSMSOperator();
                }
                else if(this._guiStoreItem){
                     this._guiStoreItem.showSelectSMSOperator();
                }
                else{
                    ZLog.error('purchaseSMS: GUI store for this item not found: ' + purchaseInfo.paymentItem);
                }
            }.bind(this);

            var country = servicesMgr.getCountry();
            var listPaymentMethods = servicesMgr.getListPaymentMethods();
            var errorCode = resourceMgr.getConfigPaymentSMS(country, purchaseInfo.operator, listPaymentMethods);

            if(errorCode < 0){
                if(errorCode == PS_ERROR.OPERATOR_NOT_FOUND){
                    // get default config
                    var defaultConfig = resourceMgr.getConfigPaymentSMSDefault(country, listPaymentMethods[0]);
                    if(defaultConfig == null){
                        showSelectOperator();
                        return;
                    }
                    else{
                        purchaseInfo.operator = defaultConfig['operator'];
                        // if this purchase has default config then continue
                        errorCode = [defaultConfig];
                    }
                }
                else{
                    Popups.showMessage("CONFIG_NOT_FOUND");
                    return;
                }
            }

            // error code is payment type list if this purchase has config
            // a little bit confusion :D
            var listSMSPaymentType = errorCode;
            listSMSPaymentType[0].phoneNumber = purchaseInfo.phoneNumber;

            // if partner supports post-paid and pre-paid
            // then will show popup confirm what method uses
            if(PaymentUtils.isSupportPostPaidAndPrePaid(listSMSPaymentType)){
                this.showGUIConfirmSMS(purchaseInfo.cost, listSMSPaymentType, function(_paymentTypeData){
                    this.getSMSTransaction(purchaseInfo, _paymentTypeData);
                }.bind(this));
            }
            // if config requires phone number or arguments miss 'operator' property
            // then will show popup to get user phone number
            else if(PaymentUtils.isNeedPhoneNumber(listSMSPaymentType[0]) && purchaseInfo.phoneNumber.length == 0){
                if(requireShowOperators){
                    showSelectOperator();
                }
                else{
                    this.showGUIInputPhoneNumber(purchaseInfo, listSMSPaymentType[0], function(_paymentTypeData){
                        this.getSMSTransaction(purchaseInfo, _paymentTypeData);
                    }.bind(this));
                }
            }
            // if config requires confirmation then will show this popup
            else if(servicesMgr.isConfirmSMS()){
                this.showGUIConfirmSMS(purchaseInfo.cost, listSMSPaymentType[0], function(_paymentTypeData){
                    this.getSMSTransaction(purchaseInfo, _paymentTypeData);
                }.bind(this));
            }
            // easiest way, just get transaction in background
            else{
                this.getSMSTransaction(purchaseInfo, listSMSPaymentType[0]);
            }
        }
    },

    purchaseTelco: function(telcoName, pinCode, serial, paymentItem){
        if(paymentItem === undefined) paymentItem = PAYMENT_ITEMS.GOLD;

        var playerInfo = PlayerInfo.Instance;
        var embedData = playerInfo.uName + ":" + playerInfo.uId + ":" + paymentItem;
        if(telcoName == TELCO_CHANNELS.VIETTEL ||
            telcoName == TELCO_CHANNELS.MOBI_PHONE ||
            telcoName == TELCO_CHANNELS.VINA_PHONE ||
            telcoName == TELCO_CHANNELS.ZING){

            var dataTrans = new DataZingCardTrans();
            dataTrans.pinCode = pinCode;
            dataTrans.serial = serial;
            dataTrans.embedData = embedData;
            dataTrans.pmcID = this.getPMCIDByTelcoChannel(telcoName);

            this.sendZMPSubmitCard(dataTrans);
        }
        else{
            // create trans data
            dataTrans = new DataPaymentTrans();
            dataTrans.telcoChannel = telcoName;
            dataTrans.countryId = servicesMgr.getCountry();
            dataTrans.amount = 0;
            dataTrans.extraData = embedData;

            var errorCode = resourceMgr.getConfigPaymentTelco(dataTrans.countryId, telcoName, servicesMgr.getListPaymentMethods());
            if(errorCode < 0){
                Popups.showMessage("CANNOT_FIND_CONFIG");
                return;
            }
            dataTrans.paymentSystem = errorCode[0]['partner'];
            dataTrans.paymentType = errorCode[0]['paymentType'];

            // append pin code and serial
            if(telcoName == TELCO_CHANNELS.DTAC_HAPPY){
                dataTrans.pinCode = serial + pinCode;
                dataTrans.serial = "";
            }
            else{
                dataTrans.pinCode = pinCode;
                dataTrans.serial = serial || "";
            }

            this.sendGetPurchaseTransaction(dataTrans);
        }

        dataTrans = null;
    },

    /**
     * resume flow entering OPT
     */
    resumeOTP: function(){
        var transOPTDataStr = fr.UserData.getString(UserDataKey.TRANS_OTP_DATA, "");
        if(transOPTDataStr && transOPTDataStr.length > 0){
            try{
                var transOPTData = JSON.parse(transOPTDataStr);
                if(transOPTData && !transOPTData.hasOwnProperty('empty')){
                    paymentModule.showGUIVerifyOtp(transOPTData.paymenttype, transOPTData.transid, transOPTData.partnertransid);
                }

            }
            catch(e){
                ZLog.error('trans OTP data parse error: ' + e.message);
            }
        }
    },

    sendGetPurchaseTransaction: function(data){
        sceneMgr.showGUIWaiting();

        ZLog.debug("CREATE_TRANS | %s", JSON.stringify(data));
        var pk = this.getOutPacket(CmdSendPaymentTrans, data);
        this.send(pk);
    },

    sendGetRegSMS: function(purchaseInfo){
        if(Operators.isOperator(TELCO_CHANNELS.VIETTEL)
            || Operators.isOperator(TELCO_CHANNELS.VINA_PHONE)
            || Operators.isOperator(TELCO_CHANNELS.MOBI_PHONE)){

            sceneMgr.showGUIWaiting();

            var playerInfo = PlayerInfo.Instance;
            var data = {
                platform: fr.platformWrapper.getOsName(),
                embedData: playerInfo.uName + ":" + playerInfo.uId + ":" + purchaseInfo.paymentItem,
                amount: purchaseInfo.cost,
                netWorkOperation: Operators.getCurrentMCCMNC()
            };

            var log = "&amount=" + purchaseInfo.cost + "&currency=" + PaymentUtils.getCurrency() + "&curOperator=" + Operators.getCurrentOperator();
            OpenTracker.track(TrackingAction.PURCHASE_SMS, log);

            var pk = this.getOutPacket(CmdSendZMPRegSMS, data);
            this.send(pk);
        }
        else{
            // log to service
            OpenTracker.track(TrackingAction.OPERATOR_CANNOT_DETECT);

            if(this._guiStoreItem != null && this._guiStoreItem.isVisible()){
                this._guiStoreItem.showSelectSMSOperator();
            }
            else if(this._guiStoreGold && this._guiStoreGold.isVisible()){
                this._guiStoreGold.showSelectSMSOperator();
            }
            else{
                Popups.showMessage(languageMgr.getString("NOTIFICATION_PAYMENT_TYPE_NOT_FOUND").replace("@value", fr.platformWrapper.getNetworkOperator()));
            }
        }
    },

    //=========================================================

    //=========================================================
    // SEND
    //=========================================================
    sendIAPAndroid: function(purchase){
        ZLog.debug('sendIAPAndroid:' + JSON.stringify(purchase) + ', type = ' + this._lastPackIAP.type);

        var pk = this.getOutPacket(CmdSendIAPAndroid, purchase, this._lastPackIAP.type);
        this.send(pk);
    },

    sendIAPIOS: function(receipt){
        ZLog.debug('sendIAPIOS:' + receipt + ', type = ' + this._lastPackIAP.type);
        var pk = this.getOutPacket(CmdSendIAPIOs, receipt, this._lastPackIAP.type);
        this.send(pk);
    },

    sendSMS: function(data){
        switch (this._curSMSTrans.paymentSystem){
            case PAYMENT_SYSTEM.CODA:
                var sms = fr.coda.createSMS(this._curSMSTrans.amount, this._curSMSTrans.telcoChannel, data.instruction);

                if(sms) {
                    if(sms.phoneNo) {
                        Popups.showMessage(data.instruction, function(){
                            fr.platformWrapper.sendSMS(sms.phoneNo, sms.msg);
                        });
                    }else{
                        Popups.showMessage(sms);
                    }

                    return;
                }
                break;

            case PAYMENT_SYSTEM.BLUE_PAY:
                sms = fr.bluepay.createSMS(this._curSMSTrans.amount, this._curSMSTrans.telcoChannel, data.transId);
                break;

            case PAYMENT_SYSTEM.MOL:
                sms = fr.mol.createSMS(this._curSMSTrans.amount, this._curSMSTrans.telcoChannel, data.transId);
                break;

            case PAYMENT_SYSTEM.IPAYY:
                sms = fr.ipayy.createSMS(data.shortCode, data.message);
                break;

            default :
                break;
        }

        if(sms){
            fr.platformWrapper.sendSMS(sms.phoneNo, sms.msg);
        }
        else{
            ZLog.debug("SMS Data null");
        }
    },

    sendVerifyOtpSea:function(paymentType, transId, partnerTransId, otp){
        ZLog.debug("send sendVerifyOtp: %s %s %s %s", paymentType, transId, partnerTransId, otp);
        var log = "&otp=" + otp + "&paymentType=" + paymentType;
        OpenTracker.track(TrackingAction.PURCHASE_SMS, log);
        var data = {
            paymentType: paymentType,
            transId: transId,
            partnerTransId: partnerTransId,
            otp: otp
        };
        var pk = this.getOutPacket(CmdSendVerifyOtpSea, data);
        this.send(pk);
    },

    sendZMPGetStatus: function(transID) {
        ZLog.debug("send sendZMPGetStatus: %s", transID);
        var pk = this.getOutPacket(CmdSendZMPGetStatus, transID);
        this.send(pk);
    },

    sendZMPSubmitCard: function(data) {
        sceneMgr.showGUIWaiting();

        var playerInfo = PlayerInfo.Instance;
        data.platform = fr.platformWrapper.getOsName();
        data.embedData = playerInfo.uName + ":" + playerInfo.uId;

        ZLog.debug("sendZMPSubmitCard: %s", JSON.stringify(data));
        var pk = this.getOutPacket(CmdSendZMPSubmitCard, data);
        this.send(pk);
    },

    sendFirstPayUpdate: function() {
        ZLog.debug("send pay ment 1st bonus");
        var pk = this.getOutPacket(CmdSendFirstPayUpdate);
        this.send(pk);
    },

    setCurrentSMSTransData: function(data){
        this._curSMSTrans = data;
    },

    setGUIStoreItem: function(gui){
        this._guiStoreItem = gui;
    },

    setLastPackIAP: function(pack, paymentItem){
        this._lastPackIAP.pack = pack;
        this._lastPackIAP.type = paymentItem;
    },

    setLastSMSPurchase: function(purchaseInfo){
        this._lastPackSMS = purchaseInfo;
    },

    showGUIFirstPay: function(){
        if(this._guiFirstPay == null){
            this._guiFirstPay = new GUIFirstP();
            this._guiFirstPay.setVisible(false);
            this._guiFirstPay.retain();
        }

        this._guiFirstPay.showAtCurrentScene();
    },

    showGetTransError: function(error){
        Popups.showMessage("ERROR_CODE_TRANS_" + Math.abs(error));
    },

    showGUIConfirmSMS: function(amount, paymentTypeData, callback){
        if(this._guiConfirmSMS == null){
            this._guiConfirmSMS = new GUIConfirmSMS();
            this._guiConfirmSMS.retain();
        }

        this._guiConfirmSMS.setData({
            amount: amount,
            paymentTypeData: paymentTypeData,
            callback: callback
        });
        this._guiConfirmSMS.showAtCurrentScene(Z_ORDER.PAYMENT_GUI + 2);
    },

    showGUIIAP: function(){
        this.getGUIIAP();
        this._guiInAppPurchase.showAtCurrentScene(Z_ORDER.PAYMENT_GUI);
    },

    showGUIInputPhoneNumber: function(purchaseInfo, paymentTypeData, callback){
        if(this._guiInputPhoneNumber == null){
            this._guiInputPhoneNumber = new GUIInputPhoneNumber();
            this._guiInputPhoneNumber.retain();
        }

        this._guiInputPhoneNumber.setData({
            purchaseInfo: purchaseInfo,
            paymentTypeData: paymentTypeData,
            callback: callback
        });

        this._guiInputPhoneNumber.showAtCurrentScene(Z_ORDER.PAYMENT_GUI + 2);
    },

    showGUIPurchase: function(){
        var paymentSystem = servicesMgr.getEnablePaymentSystem();
        var log = paymentSystem + "&level=" + playerModule.getLevel() + "&vipLevel=" +
            playerModule.getVipLevel() + "&installDate=" + servicesMgr.getInstallDate();
        OpenTracker.track(TrackingAction.PAYMENT_SYSTEM, log);

        if(servicesMgr.isOnlyEnablePayment(PAYMENT_SYSTEM.IAP)){
            this.showGUIIAP();
        }
        else{
            var guiBaseStore = this.showGUIStoreGold();
            if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.ZMPAY)){
                guiBaseStore.selectChannelStore(ChannelStore.CASH_CARD);
            }
            else if(PaymentUtils.isLocalSMSSupported(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods())){
                guiBaseStore.selectChannelStore(ChannelStore.SMS);
            }
            else if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IAP)){
                guiBaseStore.selectChannelStore(PlatformUtils.isIOs() ? ChannelStore.IAP_IOS : ChannelStore.IAP_Android);
            }
            else if(PaymentUtils.isLocalDCBSupported(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods())){
                guiBaseStore.selectChannelStore(ChannelStore.DCB);
            }
        }
    },

    showGUIStoreGold: function(){
        this.getGUIStoreGold().showAtCurrentScene(Z_ORDER.PAYMENT_GUI);
        return this._guiStoreGold;
    },

    showGUIVerifyOtp:function(paymentType, transId, partnerTransId){
        if(this._guiVerifyOtp == null){
            this._guiVerifyOtp = new GUIVerifyOtp();
            this._guiVerifyOtp.retain();
        }

        this._guiVerifyOtp.setData({
            paymenttype: paymentType,
            transid: transId,
            partnertransid: partnerTransId
        });

        this._guiVerifyOtp.showAtCurrentScene(Z_ORDER.PAYMENT_GUI + 2);
    },

    //function not use
    //showPopupReceiveGold: function(amount, callback){
    //    var content = {text: languageMgr.getString("NOTIFICATION_RECEIVED_GOLD").replace("@gold", Utility.formatMoneyFull(amount))};
    //    var listButtons = [
    //        {btnName: 'ok', hide: true, callback: callback}
    //    ];
    //
    //    Popups.show(content, listButtons);
    //},

    showZMPError: function(retCode, message){
        switch(retCode) {
            case ZING_CARD_CODE.SUCCESS:
                break;

            case ZING_CARD_CODE.IN_PROCESSING:
                if(message != null && message != "") {
                    var text = GameUtils.getPerfectText(message, res.UTM_AVO_P13_BOLD, 30, 505, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                    Popups.showMessage(text);
                }
                else
                    Popups.showMessage("ZING_PAYMENT_IN_PROCESS");
                break;

            case ZING_CARD_CODE.FAIL:
            default:
                if(message != null && message != "") {
                    text = GameUtils.getPerfectText(message, res.UTM_AVO_P13_BOLD, 30, 505, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                    Popups.showMessage(text);
                }
                else
                    Popups.showMessage("ZING_PAYMENT_FAIL");
                break;
        }
    },

    updateStoreGold: function(){
        if(this._guiStoreGold && this._guiStoreGold.isVisible()){
            this._guiStoreGold.updateStoreGold();
        }
    },

    isFreeTime: function(){
        if(!FREE_TIME_TO_ENABLE_TELCO) return false;

        var date = new Date(Utility.getClientTimeInMilliseconds());
        var curDay = date.getDay();
        var curHours = date.getHours();

        // neu tu 0-8h, 12h, hoac 22h mo het telco
        if((0 <= curHours && curHours <= 7) || ((curHours == 12) || (curHours == 22))) return true;

        // hoac
        // day 0: sunday, day 7: saturday
        // cuoi tuan mo them luc 11h, 21h, 23h
        return (curDay == 0 || curDay == 6)
            && ((9 <= curHours && curHours <= 13) || (20 <= curHours && curHours <= 23));
    }
});