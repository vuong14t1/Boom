/**
 * Created by MinhTrung on 05/04/2018.
 */

var GUIStoreBase = BaseGUI.extend({

    _className: "GUIStoreBase",

    ctor: function (item) {
        this._super();


        // init ui variables
        this.btnClose = null;

        this.imgBg = null;
        this.bgShelf = null;

        //this.bgGold = null;
        this.lbGold = null;

        this.bgRegister = null;
        this.imgVipIcon = null;
        this.htmlMsgRegister = null;
        this.btnRegister = null;
        this.bgBtnRegister = null;

        this.lvChannels = null;
        this.tvChannels = null;

        this.nodeChannels = null;

        this.nodeWebView = null;
        this.bgWebView = null;
        this.btnCloseWebView = null;

        this.nodeIAP = null;
        this.nodeDCB = null;
        this.nodeTelco = null;
        this.ebSerial = null;
        this.ebPinCode = null;
        this.nodeSelectDCBOperator = null;
        this.lbChooseOperators = null;

        this.nodeInputPhoneNumber = null;
        this.lbNumberPhone = null;
        this.ebNumberPhone = null;
        this.btnChooseOperators = null;

        this.btnOperator_0 = null;
        this.btnOperator_1 = null;
        this.btnOperator_2 = null;
        this.btnOperator_3 = null;
        this.imgOperatorChoose = null;
        this.imgEditBoxSerial = null;
        this.imgEditBoxPinCode = null;
        this.imgTitle = null;
        this.btnPurchaseCashCard = null;
        // other ui
        this.listChannel = [];
        this.listTelcoButtons = [];



        // data for ui
        this.dataChannels = null;

        this.dataIAPPacks = null;
        this.dataSMSPacks = null;
        this.dataDCBPacks = null;
        this.dataSMSOperators = null;
        this.dataDCBOperators = null;
        this.curSMSPack = null;
        this.curDCBPack = null;

        // init flags
        this._initIAP = false;
        this._initSMS = false;
        this._initDCB = false;
        this._initTelco = false;

        this._itemType = item;

        this._maxVipLevel = 3;
        this._currentVipLevel = null;
        this.lastLevel = 0;
        this.init();
    },

    init: function(){
        this._super();
        this.setDeepSyncChildren(4);
        this.syncAllChildren(res.node_p_store, this);
        this.alignCenter();
        this._resizeGUI();
         // calculate width of channel and (bg has 2 parts) and delta x
        this._leftPartWidth = this.bgShelf.getPositionX()  -  this.imgBg.getPositionX();
        this._rightPartWidth = this.bgShelf.getContentSize().width;
        this._centerOfRightPart = this._rightPartWidth >> 1;
        this._heightPartRight = 320;

        this.btnRegister.setTitleStroke("#944313",1);
        this.btnPurchaseCashCard.setTitleStroke("#197315",1);
        this.btnChooseOperators.setTitleStroke("#0f5674",1);
        this.ebNumberPhone.setPlaceHolderColor(cc.color("#E5E5E5"));
        this.htmlMsgRegister.setMode(HtmlTextMode.WRAP_WIDTH, cc.size(480, 10));
        this.htmlMsgRegister.setDefaultFontColor(cc.color('#e4adb9'));
        this.ebNumberPhone.setRealColor(cc.color('#9f8dad'));
        this.ebNumberPhone.setPlaceHolderColor(cc.color('#82738D'));

        this._currentVipLevel = playerModule.getPlayerInfo().vipLevel;
        this.lastLevel = playerModule.getLevel();

        //just ui

        this.initStoreLogo();
        this.initChannels();

        //this.initIAP();
        //this.initSMS();
        this.initDCB();
        this.initTelco();
        this.loadDefault();
        this.reloadUI();
    },
    _resizeGUI: function(){
        var scaleX = cc.director.getWinSize().width / MAX_DESIGN_SIZE.width;
        var scaleY = cc.director.getWinSize().height / MAX_DESIGN_SIZE.height;
        var r = scaleX > scaleY ? scaleY : scaleX;
        this._rootNode.setScale(r);
    },
    initChannels: function(){
        this.listChannel.splice(0);
        if(PaymentUtils.isLocalDCBSupported(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods())){
            this.listChannel.push(ChannelStore.DCB);
        }

        //if(servicesMgr.isEnablePayment(PAYMENT_SYSTEM.IAP)){
        //    if(PlatformUtils.isAndroid()|| PlatformUtils.isDesktop() ){ // is DEV env
        //        this.listChannel.push(ChannelStore.IAP_Android);
        //    }
        //    else if(PlatformUtils.isIOs(ChannelStore.IAP_IOS) ){
        //        this.listChannel.push(ChannelStore.IAP_IOS);
        //    }
        //}

        //don't have
        //if(PaymentUtils.isLocalSMSSupported(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods())){
        //    this.listChannel.push(ChannelStore.SMS);
        //}

        if(PaymentUtils.isLocalTelcoSupported(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods())){
            this.listChannel.push(ChannelStore.CASH_CARD);
        }
        this._initDataChannels();
        this._initUIChannels();
    },

    initDCB: function(){
        if(this.isEnableChannel(ChannelStore.DCB)) {
            this.dataDCBPacks = _.sample(resourceMgr.getConfigDCBPack());

            if (this.dataDCBPacks) {
                var self = this;
                this.dataDCBOperators = PaymentUtils.getAvailableOperators(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods(), true);
                this.dataDCBOperators = _.filter(this.dataDCBOperators, function(o){
                        if(o == TELCO_CHANNELS.MPT){
                            return playerModule.getLevel() >= MIN_LEVEL_TO_OPEN_CODA || paymentModule.isFreeTime();
                        }
                        return true;
                    });
                for (var i = 0; i < 4; i++) {
                    var operator = this.dataDCBOperators[i];

                    var textureLogo = "";
                    switch (operator){
                        case TELCO_CHANNELS.TELENOR:
                            textureLogo = res.img_p_telenor;
                            break;
                        case TELCO_CHANNELS.OOREDOO:
                            textureLogo = res.img_p_ooredoo;
                            break;
                        case TELCO_CHANNELS.MPT:
                            textureLogo = res.img_p_mpt;
                            break;
                    }
                    if(textureLogo != ""){
                        this["btnOperator_"+i].setVisible(true);
                        this["btnOperator_"+i].getChildByName("itemLogo").setTexture(textureLogo);
                    }else{
                        this["btnOperator_"+i].setVisible(false);
                    }
                }
                this.btnOperator_0.setPositionX(155);
                this.btnOperator_2.setPositionX(155);
                if(this.dataDCBOperators.length == 3){
                    this.btnOperator_2.setPositionX(245);
                }else if(this.dataDCBOperators.length == 1){
                    this.btnOperator_0.setPositionX(245);
                }
                //this.nodeInputPhoneNumber.setPosition(this.dataDCBOperators.length <= 2?this.btnOperator_2.getPosition():this.nodeInputPhoneNumber.getPosition());
                this.nodeInputPhoneNumber.setPositionY(50);
                this.lbChooseOperators.ignoreContentAdaptWithSize(true);
                this.lbNumberPhone.ignoreContentAdaptWithSize(true);

                this.ebNumberPhone.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
                this.ebNumberPhone.setMaxLength(20);
                this.btnChooseOperators.setTitleStroke("#3B61BF",1);

                // indexing dcb packs for animation
                this.dataDCBPacks = _(this.dataDCBPacks)
                    .map(function(obj, idx) {
                        obj.index = idx;
                        return obj;
                    })
                    .orderBy(['gold'], ['asc'])
                    .value();

                var tvWidth = this._rightPartWidth;
                //Math.max(600, this._rightPartWidth)
                var cellDesignSize = cc.size(500, 92);
                var cellScale = (this._rightPartWidth < cellDesignSize.width) ? (this._rightPartWidth / cellDesignSize.width) : 1;

                if (!this._initDCB) {

                    this.tvDCB = new CustomTableView(this, cc.size(tvWidth, this._heightPartRight), cc.SCROLLVIEW_DIRECTION_VERTICAL);
                    this.tvDCB
                        .setCellClass(this.getClassItemDCB(), this, cellScale)
                        .setCellSize(cc.size(cellDesignSize.width * cellScale, cellDesignSize.height * cellScale))
                        //.setPosition(this._centerOfRightPart-30, 0)
                        .setUpdateDataAtIndex(function(cell, idx) {
                            cell.setData(self.dataDCBPacks[idx], idx);
                        })
                        .setNumberOfCellsCb(function() {
                            return self.dataDCBPacks.length;
                        });
                    this.tvDCB.setTouchEnabled(true);
                    this.tvDCB.reloadData();
                    this.nodeDCB.addChild(this.tvDCB);
                    //DrawNode(this.nodeDCB, this.tvDCB.getPosition());
                    //DrawNode(this.tvDCB, cc.p(0,0));
                    //DrawNode(this.tvDCB, cc.p(this.tvDCB.getContentSize().width,this.tvDCB.getContentSize().height));
                }
                this._initDCB = true;
            }
        }
    },

    initIAP: function(){
        if(this._initIAP) return;
        //TODO init listview about IAP
        if(this.isEnableChannel(ChannelStore.IAP_Android) || this.isEnableChannel(ChannelStore.IAP_IOS)){

            //set banner if have

            //var tvWidth = this._rightPartWidth;
            //var cellDesignSize = cc.size(Math.max(750, this._rightPartWidth), 120);
            //var cellScale = (this._rightPartWidth < cellDesignSize.width) ? (this._rightPartWidth / cellDesignSize.width) : 1;
            //var size = cc.size(cellDesignSize.width * cellScale, cellDesignSize.height * cellScale);
            var tvWidth = this._rightPartWidth;
            //Math.max(600, this._rightPartWidth)
            var cellDesignSize = cc.size(500, 92);
            var cellScale = (this._rightPartWidth < cellDesignSize.width) ? (this._rightPartWidth / cellDesignSize.width) : 1;
            var self = this;

            this.dataIAPPacks = resourceMgr.getConfigIAPPacks();
            //ZLog.json(this.dataIAPPacks,"this.dataIAPPacks");
            this.tvIAPShelf = new CustomTableView(this, cc.size(tvWidth,  this._heightPartRight), cc.SCROLLVIEW_DIRECTION_VERTICAL);
            this.tvIAPShelf
                .setCellClass(this.getClassItemIAP(), this, cellScale)
                .setCellSize(cc.size(cellDesignSize.width * cellScale, cellDesignSize.height * cellScale))
                //.setPosition(this._centerOfRightPart, -33)
                .setUpdateDataAtIndex(function(cell, idx){
                    cell.setData(self.dataIAPPacks[idx], idx);
                })
                .setNumberOfCellsCb(function(){
                    return self.dataIAPPacks.length;
                });
            this.tvIAPShelf.reloadData();
            this.nodeIAP.addChild(this.tvIAPShelf);
            this._initIAP = true;
        }
    },

    initPaymentWebView: function(){
        if(cc.sys.platform != cc.sys.WIN32 && this.wvPayment == null) {
            var size = cc.size(this.bgWebView.width,this.bgWebView.height - 25);
            this.wvPayment = new ccui.WebView("google.com.vn");
            this.wvPayment.setVisible(false);
            this.wvPayment.setContentSize(size);
            this.wvPayment.setScalesPageToFit(true);
            this.wvPayment.setPosition(this.bgWebView.width>>1,(this.bgWebView.height - 25)>>1);
            this.nodeWebView.addChild(this.wvPayment, -1);
            Popups.monitorWebView(this.wvPayment);
        }
        this.nodeSelectDCBOperator.setVisible(false);
        this.nodeWebView.setVisible(true);
    },

    initStoreLogo: function(){
        // override me if necessary
    },

    initTelco: function(){
        if(this.isEnableChannel(ChannelStore.CASH_CARD)){
            this.dataTelco = PaymentUtils.getListTelcoChannel(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods());
            this.dataShelfTelco = PaymentResourceMgr.getConfig2C2PCardGoldPacks();
            // indexing sms packs for animation
            this.dataShelfTelco = _(this.dataShelfTelco)
                .map(function(obj, idx){
                    obj.index = idx;
                    return obj;
                })
                .orderBy(['gold'], ['asc'])
                .value();
            if(!this._initTelco){
                var self = this;
                var tvWidth = this._rightPartWidth;
                //var cellDesignSize = cc.size(Math.max(750, this._rightPartWidth), 120);
                var cellDesignSize = cc.size(500, 90);
                var cellScale =1;// (this._rightPartWidth < cellDesignSize.width) ? (this._rightPartWidth / cellDesignSize.width) : 1;
                this.tvTelcoShelf = new CustomTableView(this, cc.size(tvWidth, 200), cc.SCROLLVIEW_DIRECTION_VERTICAL);
                this.tvTelcoShelf
                    .setCellClass(this.getClassItemTelco(), this, cellScale)
                    .setCellSize(cc.size(cellDesignSize.width * cellScale, cellDesignSize.height * cellScale))
                    //.setPosition(this._centerOfRightPart, -50)
                    .setUpdateDataAtIndex(function(cell, idx){
                        cell.setData(self.dataShelfTelco[idx], idx);
                    })
                    .setNumberOfCellsCb(function(){
                        return self.dataShelfTelco.length;
                    });
                this.nodeTelco.addChild(this.tvTelcoShelf);
            }
            this.tvTelcoShelf.reloadData();
            this._initTelco = true;
        }
    },

    localize: function(){
        this._super();
        this._loadMsgRegister();
        this.lbChooseOperators.setString(languageMgr.getString('CHOOSE_OPERATOR'));
        this.lbNumberPhone.setString(languageMgr.getString('ENTER_PHONE_NUMBER'));
        this.ebNumberPhone.setPlaceHolder(languageMgr.getString('ENTER_SOMETHING'));
        this.imgTitle.setTexture(languageMgr.getImgPath("title_shop"));

    },
    _loadMsgRegister:function(){
        var nextVip = playerModule.getPlayerInfo().vipLevel + 1;
        var config = resourceMgr.getConfigVip();
        var vipConfig = config[nextVip];

        if(vipConfig != null){
            this.htmlMsgRegister.setVisible(true);
            this.btnRegister.setVisible(true);
            this.imgVipIcon.setVisible(true);

            var vipName = languageMgr.getString('NAME_VIP_'+nextVip);
            var buyGoldBonusRate = parseInt(vipConfig['buyGoldBonusRate'] * 100);
            this.imgVipIcon.setSpriteFrame('icon_vip_@level.png'.replace('@level', nextVip));
            this.htmlMsgRegister.setString(
                languageMgr.getString("VIP_UPGRADE_MSG")
                    .replace("@vipName", vipName)
                    .replace("@percent", buyGoldBonusRate)
            );
        }else{
            this.htmlMsgRegister.setVisible(false);
            this.btnRegister.setVisible(false);
            this.imgVipIcon.setVisible(false);

            ZLog.debug("config null");
        }
    },

    onShowComplete: function(){
        //fr.UserData.setString(UserDataKey.MY_OPERATOR, "");
    },

    //onTouchUIBeganEvent:function(sender){
    //    switch (sender){
    //        case this.btnOperator_0:
    //        case this.btnOperator_1:
    //        case this.btnOperator_2:
    //        case this.btnOperator_3:
    //            if(this.telcoName == this.dataDCBOperators[sender.getName().split("_")[1]]){
    //                this.imgOperatorChoose.setScale(1.1);
    //            }
    //            break;
    //    }
    //    this._super();
    //},

    onTouchUIEndEvent: function(sender){
        this.setVisibleWebView(false);
        var handled = this._super(sender);
        if(handled) return handled;

        //var listTelco = PaymentUtils.getListTelcoChannel(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods());
        //for(var i = 0; i < listTelco.length; ++i){
        //    if(sender == this["btnTelco" + listTelco[i]]){
        //        ZLog.debug("select channels " + "btnTelco" + listTelco[i]);
        //        //this.selectChannelStore(ChannelStore.CASH_CARD, listTelco[i]);
        //        return true;
        //    }
        //}

        switch (sender){
            case this.btnClose:
                this.hide();
                break;

            case this.btnIAPIOS:
                if(cc.sys.isNative)
                    this.selectChannelStore(ChannelStore.IAP_IOS);
                else
                    Popups.showMessage(languageMgr.getString("COMING_SOON"));
                break;

            case this.btnIAPAndroid:
                if(cc.sys.isNative)
                    this.selectChannelStore(ChannelStore.IAP_Android);
                else
                    Popups.showMessage(languageMgr.getString("COMING_SOON"));
                break;

            case this.btnDCB:
                this.selectChannelStore(ChannelStore.DCB);
                break;
            case this.ebNumberPhone:
            case this.ebPinCode:
            case this.ebSerial:
                sceneMgr.showGUIEditBox(sender);
                break;
            case this.btnOperator_0:
            case this.btnOperator_1:
            case this.btnOperator_2:
            case this.btnOperator_3:
                this._chooseOperators(sender);
                break;
            case this.btnChooseOperators:
                //this.loadPaymentURL("http://www.google.com.vn");
                this.processPaymentDCB();
                break;
            case this.btnPurchaseCashCard:
                this.processPaymentCashCard();
                break;
            case this.btnRegister:
                sceneMgr.viewSceneById(GV.SCENE_IDS.REGISTER_VIP);
                this.hide();
                break;
            case this.btnCloseWebView:
                this.selectChannelStore(this.channelStore,this.telcoChannel);
                break;
            default:
                return false;
        }

        return true;
    },
    tableCellTouched: function (table, cell) {
        if(table == this.tvDCB){
            this.setCurrentPack(cell.getData());
            this.showSelectDCBOperator();
        }
    },

    getClassItemChannels:function(){
        return ItemStoreChannels;
    },

    getClassItemDCB: function(){
        return ItemStoreDCB;
    },

    getClassItemIAP: function(){
        return ItemStoreIAP;
    },

    getClassItemTelco: function(){
        return ItemStoreTelco;
    },

    getItemType: function(){
        return this._itemType;
    },

    hide: function(hasEffect){
        this.setVisibleWebView(false);
        this._super(hasEffect);
    },

    isEnableChannel: function(channel){
        for(var i = 0; i < this.listChannel.length; ++i){
            if(channel == this.listChannel[i]) return true;
        }

        return false;
    },

    loadDefault:function(){
        this.selectChannelStore(this.dataChannels[0].channels,this.dataChannels[0].telcoName);
    },

    loadPaymentURL: function(url){
        url = url.replace("https:/", "http:/");

        this.initPaymentWebView();

        if(this.wvPayment){
            this.wvPayment.setVisible(true);
            this.wvPayment.loadURL(url);
        }
        else{
            ZLog.error("loadPaymentURL fail | " + url + " | webView null");
        }
    },

    processPaymentDCB:function(){
        //check choose operator
        if( this.operatorName  == null){
            Notifications.show("Please choose Operator!!!");
        }else{
            //check input phone number
            var errorOrConfig = PaymentResourceMgr.getConfigPaymentDCBByOperator(servicesMgr.getCountry(),this.operatorName);
            if(errorOrConfig < 0){
                switch (errorOrConfig){
                    case PS_ERROR.COUNTRY_NOT_FOUND:
                        Popups.showMessage("Can't not find you country");
                        break;
                    case PS_ERROR.OPERATOR_NOT_FOUND:
                        Popups.showMessage("Can't not find config that operator");
                        break;
                }
            }else{
                if(PaymentUtils.isNeedPhoneNumber(errorOrConfig[0])){
                    var phoneNumber = this.ebNumberPhone.getRealString().trim();
                    fr.UserData.setString(UserDataKey.PHONE_NUMBER + this.operatorName, phoneNumber);
                    if(phoneNumber == ""){
                        Notifications.show("Please input your phone number!!!");
                        return;
                    }
                }
                var paymentTypeData = errorOrConfig[0];
                var pack =  this.getCurrentPack();
                var purchaseInfo = {
                    paymentItem: PAYMENT_ITEMS.GOLD,
                    operator:this.operatorName,
                    phoneNumber:phoneNumber,
                    cost:pack.cost
                };
                paymentTypeData = _.assignWith(purchaseInfo, paymentTypeData, function(targetValue, srcValue){
                    return _.isUndefined(targetValue) ? srcValue : targetValue;
                });
                ZLog.json("purchaseInfo",purchaseInfo);
                ZLog.json("paymentTypeData",paymentTypeData);
                paymentModule.getSMSTransaction(purchaseInfo,paymentTypeData);
            }

        }
    },
    setCurrentPack:function(data){
        this.currentPack = data;
    },
    getCurrentPack :function(){
        return this.currentPack;
    },
    processPaymentCashCard:function(){
        // current  network had serial + pincode;
        var pinCode = this.ebPinCode.getRealString().trim();
        this.btnPurchaseCashCard.setTouchEnabled(false);
        setTimeout(function(){
            this.btnPurchaseCashCard.setTouchEnabled(true);
        }.bind(this), 1000);

        var curTelcoName = this.telcoChannel;
        if(pinCode.length > 0){
            if(this.imgEditBoxSerial.isVisible()){
                var serial = this.ebSerial.getRealString().trim();
                if(serial.length == 0){
                    Popups.showMessage("ENTER_SERIAL");
                    return;
                }
            }

            var msg = curTelcoName + "_" + serial + "_" + pinCode;
            if(!PaymentUtils.isValidCardInputFormat(curTelcoName, pinCode, serial)){
                msg = "wrong_" + msg;
                OpenTracker.track(TrackingAction.PURCHASE_CARD, msg);
                Popups.showMessage("NOTIFICATION_CASH_CARD_WRONG_FORMAT_" + curTelcoName.toUpperCase());
                return;
            }
            msg = "right_" + msg;
            OpenTracker.track(TrackingAction.PURCHASE_CARD, msg);

            moduleMgr.getPaymentModule().purchaseTelco(curTelcoName, pinCode, serial);

            // clear fields
            this.ebPinCode.cleanUpField();
            this.ebSerial.cleanUpField();
        }
        else{
            Popups.showMessage("ENTER_PIN_CODE");
        }

        pinCode = null;
        serial = null;
    },

    reloadConfig: function(){
        GUI_STORE_DIRTY = false;
        ZLog.debug('reload config ...');

        // clean up list channel and button
        this.listChannel.splice(0);
        for(var i = 0; i < this.listTelcoButtons.length; ++i){
            this.listTelcoButtons[i].removeFromParent(true);
        }
        this.listTelcoButtons.splice(0);

        this.initChannels();

        // init all table view of channel stores
        //this.initSMS();
        this.initDCB();
        this.initTelco();
        this.reloadUI();

        this.selectChannelStore();
        this.localize();
    },

    reloadUI:function(){
        ZLog.json(this.channelStore);
        var nextVip = playerModule.getPlayerInfo().vipLevel + 1;
        if(nextVip > 3){
            this.bgRegister.setVisible(false);
            var pos = cc.p(-160,-200);
            var size = cc.size(this._rightPartWidth,this._heightPartRight + 30);
            if(this.isEnableChannel(ChannelStore.IAP_Android) || this.isEnableChannel(ChannelStore.IAP_IOS)){
                this.tvIAPShelf.setViewSize(size);
            }
            if(this.isEnableChannel(ChannelStore.DCB)) {
                this.tvDCB.setViewSize(size);
            }
            if(this.isEnableChannel(ChannelStore.CASH_CARD)) {
                this.tvTelcoShelf.setViewSize(size);
            }

            this.nodeDCB.setPosition(pos);
            this.nodeIAP.setPosition(pos);
            this.nodeTelco.setPosition(pos);
        }else{
            this.bgRegister.setVisible(true);
            var pos = cc.p(-160,-170);
            var size = cc.size(this._rightPartWidth,this._heightPartRight);
            if(this.isEnableChannel(ChannelStore.IAP_Android) || this.isEnableChannel(ChannelStore.IAP_IOS)){
                this.tvIAPShelf.setViewSize(size);
            }
            if(this.isEnableChannel(ChannelStore.DCB)) {
                this.tvDCB.setViewSize(size);
            }
            if(this.isEnableChannel(ChannelStore.CASH_CARD)) {
                this.tvTelcoShelf.setViewSize(size);
            }

            this.nodeDCB.setPosition(pos);
            this.nodeIAP.setPosition(pos);
            this.nodeTelco.setPosition(pos);
        }
        this._loadMsgRegister();

        this.nodeWebView.setVisible(false);
        this.nodeInputPhoneNumber.setVisible(false);
        this.nodeSelectDCBOperator.setVisible(false);

        switch (this.channelStore){
            case ChannelStore.IAP_Android:
            case ChannelStore.IAP_IOS:
                this.nodeIAP.setVisible(true);
                this.tvIAPShelf.reloadData();
                break;
            case ChannelStore.DCB:
                this.nodeDCB.setVisible(true);
                this.tvDCB.reloadData();
                break;
            case ChannelStore.CASH_CARD:
                this.showTelcoInput(this.telcoChannel);
                this.nodeTelco.setVisible(true);
                this.tvTelcoShelf.reloadData();
                break;
        }
    },

    selectChannelStore: function(channel, telcoChannel,index){
        if(!this.isEnableChannel(channel)) return;
        this.channelStore = channel ||this.dataChannels[0].channels;
        this.telcoChannel = telcoChannel || this.dataChannels[0].telcoName;

        //update highlight = true
        for (var i in this.dataChannels) {
            this.dataChannels[i].isHighLight = !!(this.dataChannels[i].channels == channel && this.dataChannels[i].telcoChannel == telcoChannel);
        }
        this.tvChannels.reloadData();

        this.nodeWebView.setVisible(false);
        Popups.hideWebView();

        this.nodeIAP.setVisible(false);
        this.nodeTelco.setVisible(false);
        this.nodeDCB.setVisible(false);
        this.nodeSelectDCBOperator.setVisible(false);
        this.nodeWebView.setVisible(false);

        //this.imgBg3.setVisible(false);
        //
        switch (channel){
            case ChannelStore.IAP_Android:
            case ChannelStore.IAP_IOS:
                this.nodeIAP.setVisible(true);
                break;
            case ChannelStore.DCB:
                this.nodeDCB.setVisible(true);
                break;
            case ChannelStore.CASH_CARD:
                this.showTelcoInput(telcoChannel);
                this.nodeTelco.setVisible(true);
                break;
        }
    },

    setCurrentDCBPack: function(pack){
        this.curDCBPack = pack;
    },

    setCurrentSMSPack: function(pack){
        this.curSMSPack = pack;
    },

    setSelectedOperator: function(operator){
        this.selectedOperator = operator;
    },

    setVisiblePhoneNumberDCB: function(b, operator){
        if(b && operator){
            if(!this.nodeInputPhoneNumber.isVisible()){
                this.nodeInputPhoneNumber.runAction(cc.sequence(cc.show(), cc.fadeIn(0.2)));
                this.btnChooseOperators.stopAllActions();

                this.btnChooseOperators.runAction(
                    cc.moveTo(0.3,cc.p(350,50)))
            }
            var cachedNumber = fr.UserData.getString(UserDataKey.PHONE_NUMBER + operator, '');
            this.ebNumberPhone.setRealString(cachedNumber);
        }else {
            if (this.nodeInputPhoneNumber.isVisible()) {
                this.nodeInputPhoneNumber.runAction(cc.sequence(cc.fadeOut(0.2), cc.hide()));
                this.btnChooseOperators.stopAllActions();
                this.btnChooseOperators.runAction(
                    cc.moveTo(0.3,cc.p(245,50))
                );
            }
        }
    },

    setVisibleWebView: function(b){
        this.wvPayment && this.wvPayment.setVisible(b);
    },

    show: function(hasEffect, hasFog){
        var needReloadConfig = GUI_STORE_DIRTY
            || (this.dataDCBOperators.length < 3 && paymentModule.isFreeTime())
            || (this.dataDCBOperators.length > 1 && !paymentModule.isFreeTime());

        // reload config khi thoa man yeu cau
        if(!needReloadConfig && playerModule.getLevel() != this.lastLevel){
            this.lastLevel = playerModule.getLevel();
            needReloadConfig = this.lastLevel >= MIN_LEVEL_TO_OPEN_CODA;
        }
        needReloadConfig && this.reloadConfig();

        // log
        ZAccTracker.track(TrackingAction.OPEN_PAYMENT_GUI, this.dataDCBOperators.length);

        Audio.playEffect(res.s_open_shop);

        this.updateMyInfo();
        this.reloadUI();
        this.selectChannelStore();
        //this.updateStoreGold();
        //this.selectChannelStore(ChannelStore.IAP_Android);

        this._super(hasEffect, hasFog)
    },

    showSelectDCBOperator: function(btnSender){
        this.selectedOperator = null;
        this.nodeIAP.setVisible(false);
        this.nodeTelco.setVisible(false);
        this.nodeDCB.setVisible(false);
        this.nodeSelectDCBOperator.setVisible(true);

        this._chooseOperators(btnSender);
    },

    showTelcoInput: function(telcoName){
        this.ebSerial.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.telcoChannel = telcoName;
        ZLog.debug("Show telco name" + telcoName);

        /// load config by telco ==> available ==>active
         this.dataShelfTelco = PaymentResourceMgr.getConfig2C2PCardGoldPacks();
         // indexing sms packs for animation
         this.dataShelfTelco = _(this.dataShelfTelco)
             .filter(function(obj){
                 return obj.isAvailable[telcoName.toUpperCase()] == 1;
             })
             .map(function(obj, idx){
                 obj.index = idx;
                 return obj;
             })
             .orderBy(['gold'], ['asc'])
             .value();
        this.tvTelcoShelf.reloadData();

        switch (telcoName){
            case TELCO_CHANNELS.AIS:
            case TELCO_CHANNELS.TRUE:
            case TELCO_CHANNELS.TELKOMSEL:
            case TELCO_CHANNELS.EASY_POINTS:
                this.imgEditBoxSerial.setVisible(false);
                this.ebPinCode.setPlaceHolder(languageMgr.getString("ENTER_PIN_CODE_" + telcoName.toUpperCase()));
                this.ebPinCode.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
                break;

            case TELCO_CHANNELS.VINA_PHONE:
                this.ebSerial.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
            case TELCO_CHANNELS.ZING:
            case TELCO_CHANNELS.VIETTEL:
            case TELCO_CHANNELS.MOBI_PHONE:
            case TELCO_CHANNELS.MOL_POINTS:
            case TELCO_CHANNELS.DTAC_HAPPY: // only field but append (serial + pin code) before send to server,
                this.ebSerial.setPlaceHolder(languageMgr.getString("ENTER_SERIAL_" + telcoName.toUpperCase()));
                this.ebPinCode.setPlaceHolder(languageMgr.getString("ENTER_PIN_CODE_" + telcoName.toUpperCase()));
                this.imgEditBoxSerial.setVisible(true);
                break;

            default:
                this.imgEditBoxSerial.setVisible(false);
                this.ebPinCode.setPlaceHolder(languageMgr.getString("ENTER_PIN_CODE"));
                break;
        }

        if(this.imgEditBoxSerial.isVisible()){
            this.imgEditBoxPinCode.x = 195;
            this.imgEditBoxPinCode.y = 244;
            this.btnPurchaseCashCard.loadTextures("btn_p_purcharse_2.png", "btn_p_purcharse_2.png", "btn_p_purcharse_2.png", ccui.Widget.PLIST_TEXTURE);
        }
        else{
            this.imgEditBoxPinCode.x = 195;
            this.imgEditBoxPinCode.y = 286;
            this.btnPurchaseCashCard.loadTextures("btn_p_purcharse_1.png", "btn_p_purcharse_1.png", "btn_p_purcharse_1.png", ccui.Widget.PLIST_TEXTURE);
            this.tvTelcoShelf.setViewSize(cc.size(this._rightPartWidth,255));
            this.tvTelcoShelf.reloadData();
        }
    },

    updateGoldValueInDCB: function(){
        if(this.isEnableChannel(ChannelStore.DCB)){
            this.tvDCB && this.tvDCB.reloadData();
        }
    },

    updateGoldValueInIAP: function(){
        if(this.isEnableChannel(ChannelStore.IAP_Android) || this.isEnableChannel(ChannelStore.IAP_IOS)){
            this.tvIAPShelf && this.tvIAPShelf.reloadData();
        }
    },

    updateGoldValueInSMS: function(){
        if(this.isEnableChannel(ChannelStore.SMS)){
            this.tvSMS && this.tvSMS.reloadData();
        }
    },

    updateGoldValueInTelco: function(){
        if(this.isEnableChannel(ChannelStore.CASH_CARD)){
            this.tvTelcoShelf && this.tvTelcoShelf.reloadData();
        }
    },

    updateMyInfo: function (data) {
        data = (data === undefined) ? playerModule.getMyInfo() : data;
        if (data == null) return;

        this.lbGold.setString(Utility.formatMoney(data.gold, ''));
    },

    updateStoreGold: function(){
        //TODO update every thing you need
        //this.updateBanners();
        //this.updateBonusInChannels();
        //this.updateGoldValueInIAP();
        //this.updateGoldValueInSMS();
        this.updateGoldValueInDCB();
        //this.updateGoldValueInTelco();
    },

    _chooseOperators: function(btnSender) {
        //169.39    245.90
        //168.00    244.00
        if(btnSender == null){
            this.operatorName = null;
            this.imgOperatorChoose.setVisible(false);
            this.btnChooseOperators.setVisible(false);
            this.setVisiblePhoneNumberDCB(false);
        }else{
            this.operatorName = this.dataDCBOperators[btnSender.getName().split("_")[1]];
            var errorOrConfig = PaymentResourceMgr.getConfigPaymentDCBByOperator(servicesMgr.getCountry(),this.operatorName);
            if(errorOrConfig < 0){
                switch (errorOrConfig){
                    case PS_ERROR.COUNTRY_NOT_FOUND:
                        Popups.showMessage("Can't not find you country");
                        break;
                    case PS_ERROR.OPERATOR_NOT_FOUND:
                        Popups.showMessage("Can't not find config that operator");
                        break;
                }
            }else{
                (errorOrConfig instanceof Array) && this.setVisiblePhoneNumberDCB(PaymentUtils.isNeedPhoneNumber(errorOrConfig[0]), this.operatorName);
                this.imgOperatorChoose.setPosition(btnSender.getPositionX()+ 1.39, btnSender.getPositionY()+4);
                this.imgOperatorChoose.setVisible(true);
            }
            this.btnChooseOperators.setVisible(true);
        }
    },

    _initDataChannels:function(){
        this.dataChannels = [];
        for (var i in this.listChannel) {
            var data = {
                channels:this.listChannel[i],
                isHighLight: false
            };
            switch (this.listChannel[i]){
                case ChannelStore.IAP_IOS:
                case ChannelStore.IAP_Android:
                case ChannelStore.DCB:
                    this.dataChannels.push(data);
                    break;
                case ChannelStore.CASH_CARD:
                    var listTelco = PaymentUtils.getListTelcoChannel(servicesMgr.getCountry(), servicesMgr.getListPaymentMethods());
                    for (var iTel in listTelco) {
                        data = _.clone(data);
                        data["telcoChannel"] = listTelco[iTel];
                        this.dataChannels.push(data);
                    }
                    break;
                default :
                    ZLog.error("Can't find channels init data render");
                    break;

            }
        }
    },

    _initUIChannels:function(){
        var self = this;
        var tvWidth = 168;
        var cellDesignSize = cc.size(168, 67);
        var cellScale =1;// (this._leftPartWidth < cellDesignSize.width) ? (this._leftPartWidth / cellDesignSize.width) : 1;

        if(!this.initChannels.init){
            this.tvChannels = new CustomTableView(this, cc.size(tvWidth,300), cc.SCROLLVIEW_DIRECTION_VERTICAL);
            this.tvChannels
                .setCellClass(this.getClassItemChannels(), this, cellScale)
                .setCellSize(cc.size(cellDesignSize.width * cellScale, cellDesignSize.height * cellScale))
                .setUpdateDataAtIndex(function(cell, idx){
                    cell.setData(self.dataChannels[idx], idx);
                })
                .setNumberOfCellsCb(function(){
                    return self.dataChannels.length;
                });
            this.nodeChannels.addChild(this.tvChannels);
            this.initChannels.init = true;
        }


        this.nodeDCB.setVisible(false);
        this.nodeIAP.setVisible(false);
        this.nodeTelco.setVisible(false);
        this.nodeSelectDCBOperator.setPosition(this.nodeTelco.getPosition());

    }
});