/**
 * Created by CPU02447_LOCAL on 10/15/2017.
 */

var GUIEditBox = BaseGUI.extend({
    _className: "GUIEditBox",

    ctor: function(){
        this._super();

        this.imgBg = null;
        this.imgBgEditBox = null;

        this._targetTextField = null;
        this.init();
    },

    init: function(){
        this._super();
        this.syncAllChildren(res.node_edit_box, this);
        this.alignCenter();

        var offset = 20;
        this.imgBgEditBox.width = GV.VISIBALE_SIZE.width - (offset << 1);
        this._tfEditBox = new cc.EditBox(cc.size(this.imgBgEditBox.width - 8,50), new cc.Scale9Sprite(res.img_transparent));
        this._tfEditBox.setString('');
        this._tfEditBox.setPosition(this.imgBgEditBox.x, this.imgBgEditBox.y);
        this._tfEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._tfEditBox.setFont(res.UTM_AVO_P13, 24);
        this._tfEditBox.setFontColor(cc.color(0, 0, 0));
        this._tfEditBox.setPlaceholderFont(res.UTM_AVO_P13, 24);
        this._tfEditBox.setPlaceholderFontColor(cc.color(120, 120, 120));
        this._tfEditBox.setDelegate(this);
        this._rootNode.addChild(this._tfEditBox);
    },

    /**
     * This method is called when the edit box text was changed.
     * @param {cc.EditBox} sender
     * @param {String} text
     */
    editBoxTextChanged: function (sender, text) {
        ZLog.debug('GUIEditBox - editBoxTextChanged: ' + text);
    },

    /**
     * This method is called when the return button was pressed or the outside area of keyboard was touched.
     * @param {cc.EditBox} sender
     */
    editBoxReturn: function (sender) {
        ZLog.debug('GUIEditBox - editBoxReturn: ');
    },

    editBoxEditingDidBegin: function(editBox){
        ZLog.debug('GUIEditBox - editBoxEditingDidBegin: ');
    },

    editBoxEditingDidEnd: function(editBox){
        ZLog.debug('GUIEditBox - editBoxEditingDidEnd: ');

        if(this._targetTextField == null){
            ZLog.error('GUIEditBox - targetTextField should be a ccui.Text');
        }
        else{
            this._targetTextField.setRealString(this._tfEditBox.getString());
            this._targetTextField = null;
            this._tfEditBox.setString('');
        }
        _.delay(this.hide.bind(this, false), 50);
    },

    setTargetTextField: function(targetTextField){
        if(targetTextField instanceof ccui.Text){
            this._targetTextField = targetTextField;
        }
        else{
            ZLog.error('GUIEditBox - targetTextField should be a ccui.Text');
        }
    },

    getTargetTextField: function(){
        return this._targetTextField;
    },

    _updateConfig: function(){
        this._tfEditBox.setInputMode(this._targetTextField.getInputMode());
        this._tfEditBox.setInputFlag(this._targetTextField.getInputFlag());
        this._tfEditBox.setMaxLength(this._targetTextField.getMaxLength());
        this._tfEditBox.setPlaceHolder(servicesMgr.isUsePortal() ? '' : this._targetTextField.getPlaceHolder());
        this._tfEditBox.setFont(res.UTM_AVO_P13, 24);
        this._tfEditBox.setPlaceholderFont(res.UTM_AVO_P13, 24);
    },

    show: function(){
        this._updateConfig();
        this._super(false, true);
        this._tfEditBox.setString(this._targetTextField.getRealString());
        this._tfEditBox.setVisible(true);
    },

    showAtCurrentScene: function(){
        var zOrder = 4;
        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.CURSOR);
            if (this.parent != layer) {
                this.removeFromParent(false);
                layer.addChild(this, zOrder);
            }
        }

        this.show();
    }
});