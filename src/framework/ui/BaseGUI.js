/**
 * Created by bachbv on 1/16/2017.
 */

var UIKey = {
    AUTO_SCALE: "-auto-scale",
    DISABLE_PRESSED_SCALE: "-disable-pressed-scale",
    DISABLE_HOVER: "-disable-hover",
    PASSWORD: "-password"
};

var GUIMgr = {
    _queue: [],
    numOfFullScreen: 0,

    isEmpty: function(){
        return this._queue.length == 0;
    },

    isInQueue: function(gui){
        return this._queue.indexOf(gui) >= 0;
    },

    getQueueLength: function(){
        return this._queue.length;
    },

    getQueue: function(){
        return this._queue;
    },

    push: function(gui){
        var index = this._queue.indexOf(gui);
        if(index < 0){
            this._queue.push(gui);
            if(gui.isFullScreen) {
                ++this.numOfFullScreen;
                sceneMgr.setVisibleLayersBehind(false);
            }
        }
    },

    remove: function(gui){
        //ZLog.error("remove " + gui.getClassName());
        var index = this._queue.indexOf(gui);
        if(index >= 0){
            this._queue.splice(index, 1);
            if(gui.isFullScreen) --this.numOfFullScreen;
        }

        if(this.numOfFullScreen <= 0) sceneMgr.setVisibleLayersBehind(true);
    },

    hideAllInScene: function(scene){
        if(scene === undefined) scene = sceneMgr.getCurrentScene();
        if(scene == null) return;

        //ZLog.error("hideAllInScene: " + scene.getClassName());
        var length = this._queue.length;
        var index = 0;
        this.numOfFullScreen = 0;
        for(var i = 0; i < length; ++i){
            if(getSceneOfGUI(this._queue[index]) == scene){
                //ZLog.error(i + ". hide gui = " + this._queue[index].getClassName());
                this._queue[index].hide(false);
            }
            else{
                ++index;
            }
        }
    },

    removeAll: function(){
        //ZLog.error("removeAll: " + this._queue.length);
        this._queue.splice(0);
    }
};

var BaseGUI = cc.Layer.extend({
    _className: "BaseGUI",

    ctor:function(){
        this._super();
        this._deepSyncChildren = 1;
        this._isRegistryTouchOutGUIEvent = false;
        this._listButtons = [];

        this.touchLock = false;
        this.isFullScreen = false;
        this.languageListenerEvent = null;
        this.btnOnHighlight = -1;
        this.languageDirty();

        this.initActions();
        //listen mouse on button
        this.initHoverListener();
    },

    initActions: function(){
        var speedShow = 0.2;
        var fadeIn = cc.fadeIn(speedShow);
        var scaleIn = cc.scaleTo(speedShow, 1.1, 1.1);
        var scaleOut = cc.scaleTo(speedShow * 0.5, 1.0, 1.0);
        this.setActionShow(cc.sequence(
            cc.spawn(fadeIn, scaleIn),
            scaleOut
        ));

        speedShow = 0.15;
        var fadeOut = cc.fadeOut(speedShow);
        scaleOut = cc.scaleTo(speedShow, 0.01, 0.01);
        this.setActionHide(cc.spawn(fadeOut, scaleOut));
    },

    initHoverListener: function(){
        if(!cc.sys.isNative){
            if( 'mouse' in cc.sys.capabilities ) {
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseMove: function(event){
                        var pointer = false;
                        var pos = event.getLocation(), target = event.getCurrentTarget();

                        if(!target.isVisible()) return;

                        if (!target.disableMouseEvent){
                            if(sceneMgr.isShowFog()){
                                var aboveFog = !(target instanceof BaseScene) && compareZOrder(target, sceneMgr.getFog()) > 0;
                                //ZLog.debug("aboveFog = " + aboveFog);
                            }
                            else{
                                aboveFog = true;
                            }

                            if(aboveFog){
                                for (var i = 0; i < target._listButtons.length; i++){
                                    if (target.hasContain(target._listButtons[i], pos) && aboveFog){
                                        //cc.log(JSON.stringify(target._listButton[i]._name))
                                        target.onHoverIn && target.onHoverIn(target._listButtons[i]);
                                        pointer = true;
                                    }
                                    else{
                                        target.onHoverOut && target.onHoverOut(target._listButtons[i]);
                                    }
                                }

                                if (pointer){
                                    //ZLog.debug("gameCanvas = pointer, " + target._className);
                                    cc.$("#gameCanvas").style.cursor = "pointer";
                                }
                                else {
                                    //ZLog.debug("gameCanvas = default, " + target._className);
                                    cc.$("#gameCanvas").style.cursor = "default";
                                }
                            }
                        }
                    }.bind(this)
                }, this);
            }
        }
    },

    addToListButton: function(btn) {
        this._listButtons.push(btn);
    },

    /**
     * check button contain point
     * @param btn
     * @param pos
     * @returns {boolean}
     */
    hasContain: function(btn, pos){
        var realPos = btn.getParent().convertToWorldSpace(btn.getPosition());
        var width = btn.getBoundingBox().width;
        var height = btn.getBoundingBox().height;
        var anchorPoint = btn.getAnchorPoint();

        if (!btn.isVisible() || !btn.getParent().isVisible()) return false;

        return (realPos.x - width * anchorPoint.x <= pos.x && realPos.x + width * (1 - anchorPoint.x) > pos.x
            && (realPos.y - height * anchorPoint.y <= pos.y && realPos.y + height * (1 - anchorPoint.y) > pos.y));
    },

    highlightButton: function(btn) {
        //if(index != -1)
        //    this._listButtons[index].setScale(1.1);
        if(btn == null || (btn.customData && btn.customData.indexOf(UIKey.DISABLE_HOVER) > -1)) {
            return;
        }

        btn.setScale(1.07);
    },

    removeHighlightButton: function(btn) {
        //if(index != -1)
        //    this._listButtons[index].setScale(1.0);
        if(btn) btn.setScale(1.0);
    },

    languageDirty: function(){
        //ZLog.error("languageDirty at %s", this._className);
        this.isLanguageDirty = true;
    },

    localize: function(){
        this.isLanguageDirty = false;
        //ZLog.debug("update localize at %s", this._className);
    },

    updateLocalization: function(){
        if(this.isLanguageDirty){
            this.localize();
        }
    },

    addCustomEvent: function (eventName, funcCallBack) {
        this.languageListenerEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: eventName,
            callback: function (event) {
                funcCallBack(event);
            }.bind(funcCallBack)
        });
        cc.eventManager.addListener(this.languageListenerEvent, 1);

        //ZLog.debug("add language listener at %s", this._className);
    },

    getClassName: function(){
        return this._className;
    },

    setDeepSyncChildren: function(deep){
        this._deepSyncChildren = deep;
    },

    onEnter: function(){
        this._super();

        if(this.languageListenerEvent == null){
            this.addCustomEvent(LanguageMgr.langEventName, this.languageDirty.bind(this));
        }

        this.updateLocalization();
    },

    onExit: function(){
        //if(this.languageListenerEvent){
        //    ZLog.debug("remove language listener at %s", this._className);
        //    cc.eventManager.removeListener(this.languageListenerEvent);
        //    this.languageListenerEvent = null;
        //}

        this._super();
    },

    syncAllChildren:function(url, parent){
        this._rootNode = ccs.load(url, "res/").node;
        parent.addChild(this._rootNode);
        this._syncChildrenInNode(this._rootNode, 0);
    },

    doLayout: function(size){
        this._rootNode.setContentSize(size);
        ccui.helper.doLayout(this._rootNode);
    },

    alignCenter: function(){
        this.setContentSize(cc.winSize);
        if(this._rootNode){
            this._rootNode.setPosition(GV.VISIBALE_SIZE.width >> 1, GV.VISIBALE_SIZE.height >> 1);
        }
        else{
            cc.warn("BaseGUI.alignCenter(): this._rootNode = null");
        }
    },

    _syncChildrenInNode: function(node, deep){
        if(deep >= this._deepSyncChildren) return;

        var allChildren = node.getChildren();
        if(allChildren === null || allChildren.length == 0) return;

        var childName;
        for(var i = 0; i < allChildren.length; i++) {
            childName = allChildren[i].getName();

            if(childName in this && this[childName] === null)
            {
                this[childName] = allChildren[i];
                this.handleUIByType(allChildren[i]);
                this.handleCustomData(allChildren[i]);
            }
            this._syncChildrenInNode(allChildren[i], deep + 1);
        }
    },

    handleUIByType: function(node){
        var name = node.getName();
        var newUI = null;
        if(UIUtils.isButton(name)){
            node.setPressedActionEnabled && node.setPressedActionEnabled(true);
            node.addTouchEventListener && node.addTouchEventListener(this._onTouchUIEvent, this);
            this.addToListButton(node);
        }
        else if(UIUtils.isCheckbox(name)){
            node.setPressedActionEnabled && node.setPressedActionEnabled(true);
            node.addTouchEventListener && node.addTouchEventListener(this._onTouchUIEvent, this);
        }
        else if(UIUtils.isControlSwitch(name)){
            newUI = UIUtils.toControlSwitch(node);
            newUI.addTargetWithActionForControlEvents(this, this.onControlSwitchChange.bind(this), cc.CONTROL_EVENT_VALUECHANGED);
        }
        else if(UIUtils.isEditBox(name)){
            if(node.isTouchEnabled()){
                node.addTouchEventListener && node.addTouchEventListener(this._onTouchUIEvent, this);
            }
            else{
                ZLog.error('BaseGUI need setTouchEnabled - ' + name);
            }
            UIUtils.toEditBox(node);
        }
        else if(UIUtils.isHtmlText(name)){

            newUI = UIUtils.toHtmlText(node);
            newUI.setPosition(node.getPosition());
        }

        // remove old ui and update refer to new ui
        if(newUI != null) {
            newUI.setName(node.getName());
            node.getParent().addChild(newUI);
            node.removeFromParent(true);

            this[newUI.getName()] = newUI;
        }
    },

    handleCustomDataByName: function(name){
        var node = ccui.helper.seekWidgetByName(this._rootNode, name);
        if(node){
            this.handleCustomData(node);
        }
    },

    handleCustomData: function(node){
        if(node.customData){
            var data = node.customData;

            if(data && data.indexOf(UIKey.DISABLE_PRESSED_SCALE) > -1){
                node.setPressedActionEnabled && node.setPressedActionEnabled(false);
            }

            if(data && data.indexOf(UIKey.PASSWORD) > -1){
                node.isPassword = true;
            }
        }

        return node;
    },

    /**
     * bg cua GUI can dat ten la imgBg
     * @param b
     */
    setRegistryTouchOutOfGUI: function(b){
        this._isRegistryTouchOutGUIEvent = b;
    },

    isRegistryTouchOutOfGUI: function(touchedPos){
        return this._isRegistryTouchOutGUIEvent;
    },

    handleTouchOutGUI: function(){
        // override me

        // default: hide this GUI
        this.setVisible(false);
    },

    _onTouchUIEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                this.onTouchUIBeganEvent(sender);
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.onTouchUIMovedEvent(sender);
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.onTouchUIEndEvent(sender);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                this.onTouchUICancelEvent(sender);
                break;
        }
    },

    _showFog: function(){
        sceneMgr.showFog(this, this.getClassName());
    },

    _hideFog: function(){
        sceneMgr.hideFog(this);
    },

    setActionShow: function(action){
        var iAction = cc.sequence(action, cc.callFunc(this.onShowComplete.bind(this)));
        iAction.retain();
        iAction.setTag(888);
        this._actionShow = iAction;
    },

    setActionHide: function(action){
        var iAction = cc.sequence(action, cc.callFunc(this.onHideComplete.bind(this)));
        iAction.retain();
        iAction.setTag(777);
        this._actionHide = iAction;
    },

    showFromPos: function(pos, hasEffect, showFog){
        if(hasEffect === undefined) hasEffect = true;
        if(showFog === undefined) showFog = true;

        var delta = cc.pSub(pos, this._rootNode.getPosition());
        this.setPosition(delta);
        this.show(hasEffect, showFog);

        if(hasEffect){
            var action = cc.moveTo(0.2, cc.p(0, 0));
            this.runAction(action);
        }
    },

    show: function(hasEffect, showFog){
        this.updateLocalization();

        if(hasEffect === undefined) hasEffect = true;
        if(showFog === undefined) showFog = true;
        showFog && this._showFog();

        GUIMgr.push(this);

        this.stopAllActions();
        this.setVisible(true);

        if(hasEffect){
            this.setScale(0.01);
            this.setOpacity(66);
            if(this.getActionByTag(888) == null) this.runAction(this._actionShow);
        }else{
            this.setScale(1);
            this.setOpacity(255);
            this.onShowComplete();
        }
    },

    showAtCurrentScene: function(zOrder){
        if(zOrder === undefined) zOrder = 4;

        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.GUI);
            if (this.parent != layer) {
                this.removeFromParent(false);
                layer.addChild(this, zOrder);
            }
        }

        this.show();
    },

    hide: function(hasEffect){
        if(hasEffect === undefined) hasEffect = true;

        if(!this.isVisible()){
            return;
        }

        GUIMgr.remove(this);

        this._hideFog();
        if(hasEffect){
            this.setOpacity(255);
            if(this.getActionByTag(777) == null) this.runAction(this._actionHide);
        }
        else{
            this.setVisible(false);
            this.onHideComplete();
        }
    },

    onTouchOutGUI: function(){
        // override me
    },

    onShowComplete: function(){
        // override me
    },

    onHideComplete: function(){
        this.setVisible(false);
    },

    onTouchUIBeganEvent:function(sender){
        if(this.touchLock) return true;

        Audio.playEffect(res.s_button_click);
        return false;
    },

    onTouchUIMovedEvent:function(sender){
        // override me
        return false;
    },

    onTouchUIEndEvent:function(sender){
        if(this.touchLock) return true;

        // anti spam, block touch in 200ms
        this.touchLock = true;
        _.delay(function(){
            this.touchLock = false;
        }.bind(this), 300);

        return false;
    },

    onTouchUICancelEvent:function(sender){
        // override me
        return false;
    },

    onHoverIn: function(sender){
        this.highlightButton(sender);
    },

    onHoverOut: function(sender){
        this.removeHighlightButton(sender);
    },

    onControlSwitchChange:function(sender, controlEvent){
        // override me
    }
});