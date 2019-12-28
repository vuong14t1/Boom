/**
 * Created by bachbv on 1/20/2016.
 */

var iapProductList = ["pack_1", "pack_2", "pack_3", "pack_4", "pack_5", "pack_6"];
var iapSuffix = "";

fr.iap = null;
fr.iosiap = {
    pluginIAP: null,
    serverMode: false,
    
    init:function(){
        this.callback = null;
        if(plugin.PluginManager == null) return false;
        
        if(fr.iosiap.pluginIAP == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.iosiap.pluginIAP = pluginManager.loadPlugin("IOSIAP");
            fr.iosiap.pluginIAP.setListener(fr.iosiap);

            if(isPortalIAPEnable()) iapProductList = resourceMgr.getConfigIAPPortalPacks();
            else {
                iapProductList = _.map(iapProductList, function(value){
                    return value + iapSuffix;
                });
            }

            ZLog.debug("iosiap init success");
            fr.iosiap.requestProducts();
            fr.iosiap.setServerMode(true);
        }
        return true;
    },
    
    setServerMode: function(mode){
        this.serverMode = mode;
        this.pluginIAP.callFuncWithParam("setServerMode");
    },
    
    requestProducts: function(){
        this.pluginIAP.callFuncWithParam("requestProducts", plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, iapProductList.toString()));
    },
    
    finishTransactions: function(listTrans, isSuccess){
        if(isSuccess === undefined) isSuccess = true;
        ZLog.debug("iosiap finishTransactions");

        var lastIAP = paymentModule.getLastPackIAP();
        if(listTrans && lastIAP && lastIAP.type == PAYMENT_ITEMS.GOLD){
            ZLog.debug("length = %d", listTrans.length);
            
            var numOfGold = 0;
            var numOfVipPoint = 0;
            var pack = null;
            for(var i = 0; i < listTrans.length; ++i){
                if(listTrans[i].productId && listTrans[i].productId.length > 0){
                    ZLog.debug("--> Transaction for product: %s - quantity: %d", listTrans[i].productId, listTrans[i].quantity);
                    if(this.pluginIAP){
                        this.pluginIAP.callFuncWithParam("finishTransaction",
                            plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, listTrans[i].productId));
                    }

                    pack = resourceMgr.getConfigIAPPackByProductId(listTrans[i].productId);
                    if(pack){
                        numOfGold += PaymentUtils.getIAPTotalGold(listTrans[i].productId) * listTrans[i].quantity;
                        numOfVipPoint += pack.vPoint * listTrans[i].quantity;
                    }
                }
            }
            
            if(isSuccess && numOfGold > 0){
                playerModule.addGold(numOfGold);
                playerModule.addVipPoint(numOfVipPoint);
            }
        }
    },
    
    payForProduct: function(productId){
        if(this.pluginIAP){
            var paramMap = {};
            paramMap["productId"] = isPortalIAPEnable() ? productId : productId + iapSuffix;
            this.pluginIAP.payForProduct(paramMap);
        }
    },
    
    onPayResult: function (ret, receipt, productInfo) {
        if(ret == plugin.ProtocolIAP.PayResultCode.PaySuccess){
            ZLog.debug("iosiap onPayResult PaySuccess");
            
            // send receipt to game server
            if(receipt && receipt.length > 0){
                paymentModule.sendIAPIOS(receipt);
            }
            else{
                ZLog.debug("iosiap onPayResult receipt is empty");
            }
        }
        else{
            sceneMgr.hideGUIWaiting();

            if(ret == plugin.ProtocolIAP.PayResultCode.PayFail){
                ZLog.debug("iosiap onPayResult PayFail");
            }
            else if(ret == plugin.ProtocolIAP.PayResultCode.PayCancel){
                ZLog.debug("iosiap onPayResult PayCancel");
            }
            else if(ret == plugin.ProtocolIAP.PayResultCode.PayTimeOut){
                ZLog.debug("iosiap onPayResult PayTimeOut");
            }
        }
    },
    
    onRequestProductsResult: function(ret, productInfo){
        if(ret == plugin.ProtocolIAP.RequestProductCode.RequestFail){
            ZLog.debug("iosiap onRequestProductsResult fail");
        }
        else if(ret == plugin.ProtocolIAP.RequestProductCode.RequestSuccess){
            ZLog.debug("iosiap onRequestProductsResult success");
        }
        else{
            ZLog.debug("iosiap onRequestProductsResult code = %d", ret);
        }
    },
};

fr.androidiap = {
    pluginIAP: null,
    isPaying: false,

    init:function(){
        if(plugin.PluginManager == null) return false;

        if(fr.androidiap.pluginIAP == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.androidiap.pluginIAP = pluginManager.loadPlugin("IAPGooglePlay");

            if(isPortalIAPEnable()) {
                iapProductList = resourceMgr.getConfigIAPPortalPacks();
            }
            else {
                iapProductList = _.map(iapProductList, function(value){
                    return value + iapSuffix;
                });
            }

            fr.androidiap.pluginIAP.setListener(fr.androidiap);
            fr.androidiap.configDeveloperInfo();
            ZLog.debug("android iap init success");
        }
        return true;
    },

    configDeveloperInfo: function(){
        var packageName = fr.platformWrapper.getPackageName();
        var publicKey = resourceMgr.getConfigGoogleIAP(packageName);
        ZLog.debug("android configDeveloperInfo", packageName, publicKey);
        this.pluginIAP.configDeveloperInfo({
            itemPacks: iapProductList.join("|"),
            GooglePlayAppKey: publicKey
        });
    },

    refresh: function(){
        sceneMgr.hideGUIWaiting();
        this.isPaying = false;
        this.pluginIAP.callFuncWithParam("refreshPurchases", null);
    },

    payForProduct: function(productId){
        if(isPortalIAPEnable()){
            productId = resourceMgr.getConfigIAPPortalPackIdByPackId(productId);
        }
        else{
            productId += iapSuffix;
        }

        ZLog.debug("payForProduct productId = ", productId);
        if(this.pluginIAP && !this.isPaying){
            this.isPaying = true;
            setTimeout(this.refresh.bind(this), IAP_PURCHASE_DELAY);

            var paramMap = {};
            paramMap["productId"] = productId;
            this.pluginIAP.payForProduct(paramMap);
        }
    },

    finishTransactions: function(purchaseData, signature){
        var lastIAP = paymentModule.getLastPackIAP();
        if(purchaseData){
            if(purchaseData.productId === undefined) {
                ZLog.debug("iap android finishTransactions: productId is undefined");
                return;
            }

            // convert portal packId to game packId
            var packId = isPortalIAPEnable() ? resourceMgr.getConfigIAPPackIdByIAPPortalPackId(purchaseData.productId) : purchaseData.productId;
            if(packId == null || packId.length == 0){
                Popups.showMessage('IAP packId not found: ' + purchaseData.productId + '\n' + fr.platformWrapper.getPackageName());
                return;
            }

            if(lastIAP.type == PAYMENT_ITEMS.GOLD){
                // add gold
                var configIAP = resourceMgr.getConfigIAPPackByProductId(packId);
                if(configIAP == null){
                    Popups.showMessage('config IAP packId not found: ' + packId + '\n' + fr.platformWrapper.getPackageName());
                    return;
                }
                var gold = PaymentUtils.getIAPTotalGold(packId);
                playerModule.addGold(gold);

                // add vip point
                playerModule.addVipPoint(configIAP.vPoint);

                configIAP = null;
            }
            else {
                // other items handled in some module
                // just finish purchase
            }

            // send to finish purchase
            if(this.pluginIAP){
                this.pluginIAP.callFuncWithParam("consumePurchase",
                    plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify({purchaseData: purchaseData, signature: signature})));
            }
        }
    },

    consumeTest: function(){
        if(this.pluginIAP){
            ZLog.debug("consumeTest");
            this.pluginIAP.callFuncWithParam("consumeTest", null);
        }
    },

    onPayResult: function (ret, msg) {
        if(ret == -1){
            ZLog.debug("onPayResult refresh iap purchases");
            return;
        }

        if(ret == plugin.ProtocolIAP.PayResultCode.PaySuccess){
            ZLog.debug("android iap onPayResult PaySuccess");

            // send receipt to game server
            if(msg && msg.length > 0){
                this.isPaying = false;
                try{
                    paymentModule.sendIAPAndroid(JSON.parse(msg));
                }
                catch(err){
                    ZLog.debug("JSON parse error: " + msg);
                }
            }
            else{
                sceneMgr.hideGUIWaiting();
                ZLog.debug("android iap onPayResult receipt is empty");
            }
        }
        else{
            sceneMgr.hideGUIWaiting();

            if(ret == plugin.ProtocolIAP.PayResultCode.PayFail){
                ZLog.debug("android iap onPayResult PayFail");
            }
            else if(ret == plugin.ProtocolIAP.PayResultCode.PayCancel){
                ZLog.debug("android iap onPayResult PayCancel");
            }
            else if(ret == plugin.ProtocolIAP.PayResultCode.PayTimeOut){
                ZLog.debug("android iap onPayResult PayTimeOut");
            }
        }
    },
};