/**
 * Created by bachbv on 2/14/2017.
 */

var Popups = {
    _init: false,
    _nodeContainer: null,
    _listButtons: null,
    _imgBg: null,
    _lbTitle: null,
    _imgTitle: null,
    _lbMsg: null,
    _padding: 0,
    _speedShow: 0,
    _minSize: null,
    _okCallbackFunc: null,
    _closeCallbackFunc: null,
    _cancelCallbackFunc: null,
    _otherCallbackFunc: null,
    _willHide: false,
    _isShowing: false,
    _touchLock: false,

    init: function(){
        this._init = true;
        this._isShowing = false;
        this._minSize = cc.size(449, 282);

        this._nodeContainer = new cc.Node();
        this._nodeContainer.setCascadeColorEnabled(true);
        this._nodeContainer.setVisible(false);
        Utility.modifiedNodeToCenter(this._nodeContainer);
        this._nodeContainer.retain();

        this._imgBg = new cc.Scale9Sprite(res.bg_popups, cc.rect(0, 0, 449, 282), cc.rect(148, 93, 153, 96));
        this._imgBg.setCascadeColorEnabled(true);
        this._imgBg.setCascadeOpacityEnabled(true);
        this._imgBg.setPosition(GV.VISIBALE_SIZE.width >> 1, GV.VISIBALE_SIZE.height * 0.53);

        this._lbTitle = new ccui.Text("", res.UTM_AVO_P13_BOLD, 33);
        this._lbTitle.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._lbTitle.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);

        this._imgBgTitle = new cc.Sprite(res.img_bg_title);

        this._imgTitle = new cc.Sprite();
        this._imgTitle.setVisible(false);

        this._lbMsg = new HtmlText(res.UTM_AVO_P13, 25);
        this._lbMsg.setMode(HtmlTextMode.WRAP_WIDTH, cc.size(550, 10));
        this._lbMsg.setDefaultFontColor(cc.color('#724426'));
        this._nodeContainer.setCascadeOpacityEnabled(true);

        this._listButtons = [];

        this._btnClose = new ccui.Button();
        this._btnClose.setTouchEnabled(true);
        this._btnClose.loadTextures(res.btn_close_5, res.btn_close_5, res.btn_close_5);
        this._btnClose.addTouchEventListener(this.touchEvent, this);
        this._btnClose.setPressedActionEnabled(true);

        this._imgPositive = new cc.Sprite();
        this._btnPositive = new ccui.Button();
        this._btnPositive.setTouchEnabled(true);
        this._btnPositive.loadTextures(res.btn_green_145x62, res.btn_green_145x62, res.btn_green_145x62);
        this._btnPositive.addTouchEventListener(this.touchEvent, this);
        this._btnPositive.setPressedActionEnabled(true);
        this._btnPositive.setVisible(false);
        this._btnPositive.setTitleFontSize(24);
        this._btnPositive.setTitleFontName(res.UTM_AVO_P13_BOLD);
        this._btnPositive.setTitleStroke('#005A00', 1);

        this._imgPositive.setPosition(this._btnPositive.getContentSize().width >> 1, (this._btnPositive.getContentSize().height >> 1));
        this._btnPositive.addChild(this._imgPositive);

        this._imgNegative = new cc.Sprite();
        this._btnNegative = new ccui.Button();
        this._btnNegative.setTouchEnabled(true);
        this._btnNegative.loadTextures(res.btn_red_145x62, res.btn_red_145x62, res.btn_red_145x62);
        this._btnNegative.addTouchEventListener(this.touchEvent, this);
        this._btnNegative.setPressedActionEnabled(true);
        this._btnNegative.setVisible(false);
        this._btnNegative.setTitleFontSize(18);
        this._btnNegative.setTitleFontName(res.UTM_AVO_P13_BOLD);
        this._btnNegative.setTitleStroke('#600000', 1);

        this._imgNegative.setPosition(this._btnNegative.getContentSize().width >> 1, (this._btnNegative.getContentSize().height >> 1));
        this._btnNegative.addChild(this._imgNegative);

        this._imgOther = new cc.Sprite();
        this._btnOther = new ccui.Button();
        this._btnOther.setTouchEnabled(true);
        this._btnOther.loadTextures(res.btn_blue_145x62, res.btn_blue_145x62, res.btn_blue_145x62);
        this._btnOther.addTouchEventListener(this.touchEvent, this);
        this._btnOther.setPressedActionEnabled(true);
        this._btnOther.setVisible(false);
        this._btnOther.setTitleFontName(res.UTM_AVO_P13_BOLD);
        this._btnOther.setTitleFontSize(18);
        this._btnOther.setTitleStroke('#B87700', 1);

        this._imgOther.setPosition(this._btnOther.getContentSize().width >> 1, (this._btnOther.getContentSize().height >> 1));
        this._btnOther.addChild(this._imgOther);

        // add children to container
        this._nodeContainer.addChild(this._imgBg);
        this._imgBg.addChild(this._imgBgTitle);
        this._imgBg.addChild(this._lbMsg);
        this._imgBg.addChild(this._lbTitle);
        this._imgBg.addChild(this._imgTitle);
        this._imgBg.addChild(this._btnClose);
        this._imgBg.addChild(this._btnPositive);
        this._imgBg.addChild(this._btnNegative);
        this._imgBg.addChild(this._btnOther);

        this.setPadding(25);
        this.setSpeedShow(0.2);
    },

    setPadding: function(p){
        this._padding = p;
    },

    setSpeedShow: function(s){
        this._speedShow = s;
    },

    setTitle: function(title){
        this._lbTitle.setString(title);
    },

    monitorWebView: function(view){
        if(this._listWebView == null){
            this._listWebView = [];
        }

        if(view && view instanceof ccui.WebView){
            this._listWebView.push({view: view, visible: view.isVisible()});
        }
    },

    hideWebView: function(){
        if(this._listWebView && this._listWebView.length > 0){
            _.forEach(this._listWebView, function(obj){
                if(obj.view){
                    obj.visible = obj.view.isVisible();
                    obj.view.setVisible(false);
                }
            });
        }
    },

    restoreWebView: function(){
        if(this._listWebView && this._listWebView.length > 0){
            _.forEach(this._listWebView, function(obj){
                if(obj.view && obj.visible){
                    obj.view.setVisible(obj.visible);
                }
            });
        }
    },

    /**
     *
     * @private
     */
    _updateSize: function(){
        var msgSize = this._lbMsg.getRealContentSize();
        this._imgBg.width = Math.max(this._minSize.width, msgSize.width + this._padding * 2);
        this._imgBg.height = Math.max(this._minSize.height, msgSize.height + 170 + this._padding * 2);
    },

    /**
     *
     * @private
     */
    _updateComponentsPosition: function(){
        var offsetStart = this._btnPositive.width / 3;
        var lengthPart = (this._imgBg.width - offsetStart * 2) / this._listButtons.length;

        if(lengthPart - this._btnPositive.width < 10){
            // scale img width and stretch buttons
            var delta = Math.abs(lengthPart - this._btnPositive.width) + 10;
            this._imgBg.width += delta * this._listButtons.length;
            lengthPart += delta;
        }

        for(var i = 0; i < this._listButtons.length; ++i){
            this._listButtons[i].setPosition(offsetStart + lengthPart * (i + 0.5), this._listButtons[i].getSize().height / 2 + 20 );
        }

        this._lbMsg.setPosition((this._imgBg.width >> 1) -5, this._imgBg.height * 0.53);
        this._lbTitle.setPosition(this._imgBg.width >> 1, this._imgBg.height * 0.90);
        this._imgBgTitle.setPosition(this._imgBg.width >> 1, this._imgBg.height * 0.935);
        this._imgTitle.setPosition(this._imgBg.width >> 1, this._imgBg.height * 0.935 + 6);

        var btnSize = this._btnClose.getContentSize();
        this._btnClose.setPosition(this._imgBg.width - btnSize.width * 0.55, this._imgBg.height- btnSize.height * 0.5);
    },

    /**
     *
     * @private
     */
    _updateParent: function(){
        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.GUI_EFFECT);
            if (this._nodeContainer.parent != layer) {
                this._nodeContainer.removeFromParent(false);
                layer.addChild(this._nodeContainer, 2);
            }
        }
    },

    /**
     *
     * @private
     */
    _fadeInOut: function(){
        if(this._nodeContainer){
            this._nodeContainer.stopAllActions();
            this._nodeContainer.setVisible(true);
            this._nodeContainer.setScale(0.5);
            this._nodeContainer.setOpacity(128);

            var fadeIn = cc.fadeIn(this._speedShow);
            var scaleIn = cc.scaleTo(this._speedShow, 1.1, 1.1);
            var scaleOut = cc.scaleTo(0.1, 1.0, 1.0);

            this._nodeContainer.runAction(cc.sequence(cc.spawn(fadeIn, scaleIn), scaleOut, cc.callFunc(function(sender) {
                sender.setOpacity(255);
            })));
        }
    },

    /**
     *
     * @private
     */
    _visibleFunctionButtons: function(b){
        this._btnPositive.setVisible(b);
        this._btnOther.setVisible(b);
        this._btnNegative.setVisible(b);
    },

    /**
     *
     */
    showError: function(errorCode, callback){
        var listButtons = null;

        switch (errorCode){
            case ERROR_CODE.FAIL:
            case ERROR_CODE.MAINTAIN_SYSTEM:
            case ERROR_CODE.PARAM_INVALID:
            case ERROR_CODE.ROOM_NOT_EXIST:
            case ERROR_CODE.ROOM_FULL:
            case ERROR_CODE.NOT_ENOUGH_MIN_BUY_IN:
            case ERROR_CODE.OUT_BUY_IN_RANGE:
            case ERROR_CODE.ALREADY_IN_GAME:
            case ERROR_CODE.GAME_STRUCTURE_INVALID:
            case ERROR_CODE.PLAYER_ACTION_INVALID:
            case ERROR_CODE.NOT_ENOUGH_XU:
            case ERROR_CODE.NOT_ENOUGH_GOLD:
            case ERROR_CODE.TOO_MUCH_GOLD_TO_RECEIVE_SUPPORT:
            case ERROR_CODE.REACH_MAX_DAILY_SUPPORT_TIME:
                listButtons = [
                    {btnName: 'close', hide: true, callback: callback},
                    {btnName: 'ok', hide: true, callback: callback}
                ];
                break;

            default:
                listButtons = [
                    {btnName: 'close', hide: true, callback: callback},
                    {btnName: 'ok', hide: true, callback: callback}
                ];
                break;
        }

        var text = languageMgr.getString("ERROR_CODE_" + errorCode);
        if(errorCode == ERROR_CODE.UNFIT_TO_JOIN) {
            text = text.replace("@channel", "" + (sceneMgr.getScene(GV.SCENE_IDS.LIST_TABLES)._curChannelId - 1000));
        }
        this.show({text: text}, listButtons);
    },

    /**
     *
     */
    showMessage: function(message, callback){
        var content = {text: languageMgr.getString(message)};
        var listButtons = [
            {btnName: 'ok', hide: true, callback: callback},
            {btnName: 'close', hide: true, callback: callback}
        ];

        this.show(content, listButtons);
    },

    showMessageFunction: function(message, callbackOK,callBackClose){
        var content = {text: languageMgr.getString(message)};
        var listButtons = [
            {btnName: 'ok', hide: true, callback: callbackOK},
            {btnName: 'close', hide: true, callback: callBackClose}
        ];

        this.show(content, listButtons);
    },

    /**
     *
     */
    showMessageFromOperator: function(message, callback){
        var content = {text: languageMgr.getString(message)};
        var listButtons = [
            {btnName: 'ok', hide: true, callback: callback},
            {btnName: 'close', hide: true, callback: callback}
        ];

        this.show(content, listButtons);
    },

    /**
     *
     */
    /*showMessageNotEnoughGold: function(message) {
        var content = {text: languageMgr.getString(message)};
        var listButtons = null;
        if (servicesMgr.isEnablePayment()) {
            listButtons = [
                {
                    btnName: 'other', titleText: languageMgr.getString("SHOP"), hide: true,
                    callback: function () {
                        paymentModule.showGUIPurchase();
                    }
                }
            ];
        }else{
            listButtons = [
                {btnName: 'ok', hide: true}
            ];
        }

        this.show(content, listButtons);
    },*/
    showMessageNotEnoughGold: function(message) {
        var content = {text: languageMgr.getString(message)};
        var listButtons = null;
        if (servicesMgr.isEnablePayment()) {
            listButtons = [
                {
                    btnName: 'ok', imgTitleText: "img_shop" , hide: true,
                    callback: function () {
                        paymentModule.showGUIPurchase();
                    }
                },
                {
                    btnName: 'cancel', hide: true

                }
            ];
        }else{
            listButtons = [
                {btnName: 'ok', hide: true}
            ];
        }

        this.show(content, listButtons);
    },
    showShopMessage:function(message,callback){
        var content = {text: languageMgr.getString(message)};
        var listButtons = [
            {
                btnName: 'ok', imgTitleText: "img_shop" , hide: true,
                callback: callback
            }
        ];
        this.show(content, listButtons);
    },
    /**
     * listButtonObj:
     *  ex: [{btnName: 'ok', hide: true, callback: {caller: .., funcName: ..., args: [...]}},
     *      ...
     *      ]
     *      btnName: name of button will added and execute the callback when clicked end
     *              'ok', 'cancel', 'other', 'close'
     *      hide: the popup will hide if true
     * @param {Object} content
     * @param listButtonObj
     * @param showFog
     */
    show: function(content, listButtonObj, showFog){
        if(!this._init){
            this.init();
        }

        if(!cc.sys.isNative && this.isShowing()) {
            setTimeout(function() {
                this.show(content, listButtonObj, showFog);
            }.bind(this), 1000);
            return;
        }

        if(content == null) return;

        PlatformUtils.ignoreKeyBack = true;
        sceneMgr.hideGUIWaiting();
        //lobbyModule._guiWebView && lobbyModule._guiWebView.hide(false);

        if(showFog === undefined){
            showFog = true;
        }

        if(content.title){
            this._imgTitle.setVisible(false);
            this._lbTitle.setVisible(true);

            this.setTitle(content.title);
        }
        else{
            this._imgTitle.setVisible(true);
            this._imgTitle.setTexture(languageMgr.getImgPath('title_notice'));
            this._lbTitle.setVisible(false);
        }

        this._visibleFunctionButtons(false);
        if(listButtonObj !== undefined){
            this._addButtons(listButtonObj);
        }

        this._lbMsg.setString(content.text);
        this._updateParent();
        this._updateSize();
        this._updateComponentsPosition();
        this._fadeInOut();

        if(showFog && !this.isShowing()){
            sceneMgr.showFog(this._nodeContainer, "Popup");
        }
        this._isShowing = true;

        this.hideWebView();
    },

    showReconnect: function(msg){
        var content = {text: msg};
        if(!sceneMgr.isScene(GV.SCENE_IDS.LOGIN)){
            var listButtons = [
                {btnName: 'other', titleText: languageMgr.getString("RETRY"), hide: true, callback: {caller: connector, funcName: connector.reconnect, args: []}},
                {btnName: 'close', callback: {caller: sceneMgr, funcName: sceneMgr.viewSceneById, args: [GV.SCENE_IDS.LOGIN]}}
            ];
        }
        else{
            listButtons = [
                {btnName: 'ok', hide: true},
                {btnName: 'close', hide: true}
            ];
        }

        Popups.show(content, listButtons);
    },

    hide: function(){
        this._willHide = false;
        PlatformUtils.ignoreKeyBack = false;

        if(this.isShowing()){
            // restore web view visible
            this.restoreWebView();

            this._isShowing = false;
            this._nodeContainer.stopAllActions();
            this._nodeContainer.setOpacity(255);
            sceneMgr.hideFog(this._nodeContainer);

            var fadeOut = cc.fadeOut(this._speedShow);
            var scaleOut = cc.scaleTo(this._speedShow, 0.6, 0.6);

            this._nodeContainer.runAction(
                cc.sequence(
                    cc.spawn(fadeOut, scaleOut),
                    cc.callFunc(function(sender){
                        sender.setVisible(false);
                        //GUITutorial.showTutorial(sceneMgr.getCurrentScene());
                    })
                )
            );
        }
    },

    isShowing: function(){
        //ZLog.debug("visible = %s, opacity = %d", this._nodeContainer.visible, this._nodeContainer.getOpacity());
        return this._isShowing;
    },

    cleanUp: function () {
        if(this._nodeContainer) {
            this._nodeContainer.stopAllActions();
            this._nodeContainer.removeFromParentAndCleanup();
        }
    },

    /**
     *
     * @param {Array} listBtn
     * @private
     */
    _addButtons: function(listBtn){
        this._listButtons.splice(0, this._listButtons.length);

        // clean old callback
        this._okCallbackFunc = null;
        this._cancelCallbackFunc = null;
        this._otherCallbackFunc = null;
        this._closeCallbackFunc = null;

        this._btnClose.setTouchEnabled(true);

        if(listBtn){
            var obj = null;
            var btnName = '';
            for(var i = 0; i < listBtn.length; ++i){
                obj = listBtn[i];
                btnName = obj.btnName.toLowerCase();
                if(btnName === 'ok'){
                    this._okCallbackFunc = obj.callback;
                    this._btnPositive.setTouchEnabled(true);
                    this._btnPositive.setVisible(true);
                    this._listButtons.push(this._btnPositive);

                    if(obj.imgTitleText && obj.imgTitleText.length > 0){
                        this._imgPositive.setVisible(true);
                        this._btnPositive.setTitleText("");

                        if(obj.imgTitleText.startsWith('#')){
                            this._imgPositive.setSpriteFrame(obj.imgTitleText);
                        }
                        else{
                            this._imgPositive.setTexture(languageMgr.getImgPath(obj.imgTitleText));
                        }
                    }
                    else{
                        this._imgPositive.setVisible(false);
                        this._btnPositive.setTitleText((obj.titleText != null ? obj.titleText.toUpperCase() : languageMgr.getString("OK").toUpperCase()));
                    }
                }
                else if(btnName === 'close'){
                    this._btnClose.setTouchEnabled(true);
                    this._closeCallbackFunc = obj.callback;
                }
                else if(btnName === 'cancel'){
                    this._cancelCallbackFunc = obj.callback;
                    this._btnNegative.setTouchEnabled(true);
                    this._btnNegative.setVisible(true);
                    this._listButtons.push(this._btnNegative);

                    if(obj.imgTitleText && obj.imgTitleText.length > 0){
                        this._imgNegative.setVisible(true);
                        this._btnNegative.setTitleText("");

                        if(obj.imgTitleText.startsWith('#')){
                            this._imgNegative.setSpriteFrame(obj.imgTitleText);
                        }
                        else{
                            this._imgNegative.setTexture(languageMgr.getImgPath(obj.imgTitleText));
                        }
                    }
                    else{
                        this._imgNegative.setVisible(false);
                        this._btnNegative.setTitleText((obj.titleText != null ? obj.titleText : languageMgr.getString("CANCEL").toUpperCase()));
                    }
                }
                else if(btnName === 'other'){
                    this._otherCallbackFunc = obj.callback;
                    this._btnOther.setTouchEnabled(true);
                    this._btnOther.setVisible(true);
                    this._listButtons.push(this._btnOther);

                    if(obj.imgTitleText){
                        this._imgOther.setVisible(true);
                        this._btnOther.setTitleText("");

                        if(obj.imgTitleText.startsWith('#')){
                            this._imgOther.setSpriteFrame(obj.imgTitleText);
                        }
                        else{
                            this._imgOther.setTexture(languageMgr.getImgPath(obj.imgTitleText));
                        }
                    }
                    else{
                        this._imgOther.setVisible(false);
                        if(obj.titleText){
                            var text = obj.titleText.toUpperCase();
                            this._btnOther.setTitleFontSize(text.length > 15 ? 14 : 18);
                            this._btnOther.setTitleText(text);
                            if(this._btnOther.width - 20 < this._btnOther.getTitleRenderer().width){
                                this._btnOther.setScaleX((this._btnOther.getTitleRenderer().width + 40)/this._btnOther.width);
                                this._btnOther.getTitleRenderer().setScaleX(this._btnOther.width/(this._btnOther.getTitleRenderer().width + 40));
                                ZLog.error(this._btnOther.width);
                            }else{
                                this._btnOther.setScaleX(1);
                                this._btnOther.getTitleRenderer().setScaleX(1);
                            }
                        }
                    }
                }

                if(obj.hasOwnProperty('hide')){
                    this._willHide = obj.hide;
                }
            }
        }
    },

    /**
     * obj parameters require:
     *  - caller: _target that call function
     *  - funcName: name of function will call
     *  - args: parameters of function by array object
     * @param cbFunc
     * @private
     */
    _executeCallback: function(cbFunc){
        if(cbFunc){
            if(cc.isFunction(cbFunc)){
                cbFunc();
            }
            else{
                if(cbFunc.hasOwnProperty("func")){
                    cbFunc.func();
                    cbFunc = null;
                }
                else if(cbFunc.hasOwnProperty('caller')
                    && cbFunc.hasOwnProperty('funcName')
                    && cbFunc.hasOwnProperty('args')){

                    cbFunc.funcName.apply(cbFunc.caller, cbFunc.args);

                    cbFunc = null;
                }
            }
        }
    },

    /**
     *
     * @private
     */
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                Audio.playEffect(res.s_button_click);
                break;

            case ccui.Widget.TOUCH_MOVED:

                break;

            case ccui.Widget.TOUCH_ENDED:
                if(this._touchLock) return true;
                // anti spam, block touch in 200ms
                this._touchLock = true;
                _.delay(function(){
                    this._touchLock = false;
                }.bind(this), 300);

                sender.setTouchEnabled(false);

                if(sender === this._btnClose){
                    this.hide();
                    this._executeCallback(this._closeCallbackFunc);
                }
                else if(sender === this._btnPositive){
                    if(this._willHide){
                        this.hide();
                    }

                    this._executeCallback(this._okCallbackFunc);
                }
                else if(sender === this._btnNegative){
                    this.hide();
                    this._executeCallback(this._cancelCallbackFunc);
                }
                else if(sender === this._btnOther){
                    if(this._willHide){
                        this.hide();
                    }
                    this._executeCallback(this._otherCallbackFunc);
                }
                break;

            case ccui.Widget.TOUCH_CANCELED:

                break;

            default:
                break;
        }
    },

    getClassName: function() {
        return "Popups";
    }
};