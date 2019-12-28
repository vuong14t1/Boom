/**
 * Created by bachbv on 11/27/2015.
 */

var BaseUINode = cc.Node.extend({
    _className: "BaseUINode",

    ctor:function(uiJson){
        this._super();
        this._deepSyncChildren = 1;
        this._uiJson = uiJson;
        this._rootNode = null;
    },

    localize: function(){
        // override me
    },

    getClassName: function(){
        return this._className;
    },

    setDeepSyncChildren: function(deep){
        this._deepSyncChildren = deep;
    },

    syncAllChildren:function() {
        this._rootNode = ccs.load(this._uiJson, "res/").node;
        this.addChild(this._rootNode);

        this._syncChildrenInNode(this._rootNode, 0);
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

    handleUIByType: function(node){
        var name = node.getName();
        var newUI = null;
        if(UIUtils.isButton(name)){
            node.setPressedActionEnabled && node.setPressedActionEnabled(true);
            node.addTouchEventListener && node.addTouchEventListener(this._onTouchUIEvent, this);
            //this.addToListButton(node);
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

    onTouchUIBeganEvent:function(sender){
        // override me
    },

    onTouchUIMovedEvent:function(sender){
        // override me
    },

    onTouchUIEndEvent:function(sender){
        // override me
    },

    onTouchUICancelEvent:function(sender){
        // override me
    },
});