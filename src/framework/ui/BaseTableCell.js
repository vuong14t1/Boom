/**
 * Created by Tomorow on 6/7/2016.
 */

var BaseTableCell = cc.TableViewCell.extend({
    _className: "BaseTableCell",

    ctor: function(uiJson, size){
        this._super();
        this._deepSyncChildren = 1;
        this._cellScale = 1;
        this._rootNode = null;
        this._uiJson = uiJson;
        this.cellSize = size ? size : cc.size(0, 0);
    },

    getCellSize: function(){
        return this.cellSize;
    },

    getRootNode: function(){
        return this._rootNode;
    },

    localize: function(){

    },

    setDeepSyncChildren: function(deep){
        this._deepSyncChildren = deep;
    },

    getClassName: function(){
        return this._className;
    },

    syncAllChildren:function(){
        this._rootNode = ccs.load(this._uiJson, "res/").node;
        this.setContentSize(this.cellSize);
        this._rootNode.setContentSize(this.cellSize);
        this._rootNode.setPosition(this.cellSize.width >> 1, this.cellSize.height >> 1);
        this.addChild(this._rootNode);

        this._syncChildrenInNode(this._rootNode, 0);
    },

    setCellSize: function(size){
        if(size === undefined || size == null) size = cc.size(0, 0);

        this.setContentSize(size);
        this.cellSize = size;
        if(this._rootNode){
            this._rootNode.setContentSize(this.cellSize);
            this._rootNode.setPosition(this.cellSize.width >> 1, this.cellSize.height >> 1);
        }
    },

    addHoverListener: function(context){

    },

    _syncChildrenInNode: function(node, deep){
        if(deep >= this._deepSyncChildren) return;

        var allChildren = node.getChildren();
        if(allChildren === null || allChildren.length == 0) return;

        var nameChild;
        for(var i = 0; i < allChildren.length; i++) {
            nameChild = allChildren[i].getName();

            if(nameChild in this && this[nameChild] === null)
            {
                this[nameChild] = allChildren[i];
                this.handleUIByType(allChildren[i]);
                this.handleCustomData(allChildren[i]);
            }

            /*if(nameChild in this && this[nameChild] === null){
                this[nameChild] = allChildren[i];
                if(nameChild.indexOf("btn") != -1 || nameChild.indexOf("cb") != -1)
                {
                    this[nameChild].setPressedActionEnabled && this[nameChild].setPressedActionEnabled(true);
                    this[nameChild].addTouchEventListener && this[nameChild].addTouchEventListener(this._onTouchUIEvent, this);
                    this[nameChild].setSwallowTouches && this[nameChild].setSwallowTouches(false);
                }

                this.handleCustomData(this[nameChild]);
            }*/
            this._syncChildrenInNode(allChildren[i], deep + 1);
        }
    },
    handleUIByType: function(node){
        var name = node.getName();
        var newUI = null;
        if(UIUtils.isButton(name)){
            node.setPressedActionEnabled && node.setPressedActionEnabled(true);
            node.addTouchEventListener && node.addTouchEventListener(this._onTouchUIEvent, this);
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
        //ZLog.debug("handleCustomData = " + node.customData);
        if(node.customData){
            var data = node.customData;

            if(data && data.indexOf(UIKey.DISABLE_PRESSED_SCALE) > -1){
                node.setPressedActionEnabled && node.setPressedActionEnabled(false);
            }
        }

        return node;
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

    setToMouseOver:function(btnList) {
        // override me
    }
});