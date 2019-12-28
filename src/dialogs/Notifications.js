/**
 * Created by bachbv on 2/12/2017.
 */

var Notifications = {
    _init: false,
    _imgBg: null,
    _lbMsg: null,
    _speedShow: 0,
    _callback: null,
    _color: null,
    _isDirty: false,
    _isRunning: false,
    _curContent: null,

    init: function(){
        if(this._init) return;
        this._init = true;
        this._queue = [];

        this._marginTop = 10;
        this._imgBg = new cc.LayerColor(cc.color(0, 0, 0, 230), GV.VISIBALE_SIZE.width, 60 + this._marginTop);
        this._imgBg.setPosition(0, GV.VISIBALE_SIZE.height - this._imgBg.height);
        this._imgBg.retain();

        this._btnCallBack = new ccui.Button(res.btn_green_103x47, res.btn_green_103x47, res.btn_green_103x47);
        this._btnCallBack.setTitleFontName(res.UTM_AVO_P13_BOLD);
        this._btnCallBack.setTitleFontSize(20);
        this._btnCallBack.setAnchorPoint(0, 0.5);
        this._btnCallBack.setPosition(0, (this._imgBg.height - this._marginTop) >> 1);
        this._btnCallBack.setVisible(false);
        this._btnCallBack.setPressedActionEnabled(true);
        this._btnCallBack.addTouchEventListener(this._onTouchUIEvent, this);

        this._btnClose = new ccui.Button(res.btn_close, res.btn_close, res.btn_close);
        this._btnClose.setAnchorPoint(1, 0.5);
        this._btnClose.setPosition(GV.VISIBALE_SIZE.width - 3, (this._imgBg.height - this._marginTop) >> 1);
        this._btnClose.setPressedActionEnabled(true);
        this._btnClose.addTouchEventListener(this._onTouchUIEvent, this);

        this._lbMsg = new ccui.Text("", res.UTM_AVO_P13, 20);
        this._lbMsg.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._lbMsg.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this._lbMsg.setPosition((this._imgBg.width - this._btnCallBack.width) >> 1, (this._imgBg.height - this._marginTop) >> 1 - 5);

        this._imgBg.addChild(this._lbMsg);
        this._imgBg.addChild(this._btnCallBack);
        this._imgBg.addChild(this._btnClose);

        this.setSpeedShow(0.4);
    },

    setSpeedShow: function(s){
        this._speedShow = s;
    },

    _isSameText: function(text){
        return (this._curContent && this._curContent.text == text);
    },

    /**
     *
     * @private
     */
    _done: function(){
        this._imgBg.setVisible(false);
        this._isRunning = false;
        this._curContent = null;

        this._next();
    },

    /**
     *
     * @private
     */
    _updateParent: function(){
        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.CURSOR);
            if (this._imgBg.parent != layer) {
                this._imgBg.removeFromParent(false);
                layer.addChild(this._imgBg);
            }
        }
    },

    _next: function(){
        this._sort();

        if(this._queue.length > 0) this._run(this._queue.shift());
    },

    /**
     *
     * @param objContent
     * @private
     */
    _run: function(objContent){
        if(Utility.getServerTime() > objContent.expireTime){
            // run next notification if this is expired
            this._next();

            ZLog.debug("Notification expired: " + Utility.getServerTime() + " : " + JSON.stringify(objContent));
            return;
        }
        this._curContent = objContent;
        ZLog.debug("Notification run: " + Utility.getServerTime() + " : " + JSON.stringify(objContent));

        // update duration
        objContent.duration = Math.min(objContent.duration, objContent.expireTime - Utility.getServerTime());

        this._updateParent();

        // update msg
        this._lbMsg.setString(objContent.text);

        this._callback = objContent.callback;
        this._btnCallBack.setVisible(this._callback != null);
        if(this._btnCallBack.isVisible()) {
            var offset = 20;
            this._btnCallBack.setTitleText(objContent['titleBtnCallBack'] ? objContent['titleBtnCallBack'] : languageMgr.getString("OK").toUpperCase());
            this._lbMsg.setPosition((this._imgBg.width - this._btnCallBack.width - offset) >> 1, ((this._imgBg.height - this._marginTop) >> 1) - 2);
            this._btnCallBack.x = this._lbMsg.x + ((this._lbMsg.width + offset) >> 1) + 5;
        }
        else{
            this._lbMsg.setPosition(this._imgBg.width >> 1, ((this._imgBg.height - this._marginTop) >> 1) - 2);
        }

        // update position
        this._imgBg.stopAllActions();
        this._imgBg.y = GV.VISIBALE_SIZE.height + (this._imgBg.height >> 1);
        this._imgBg.setVisible(true);

        // create action
        var moveIn = cc.moveTo(this._speedShow, this._imgBg.x, GV.VISIBALE_SIZE.height - this._imgBg.height + this._marginTop).easing(cc.easeBackOut());
        var delay = cc.delayTime(objContent.duration);
        var moveOut = cc.moveTo(this._speedShow, this._imgBg.x, GV.VISIBALE_SIZE.height + this._imgBg.height + this._marginTop).easing(cc.easeBackIn());

        this._imgBg.runAction(cc.sequence(moveIn, delay, moveOut, cc.callFunc(this._done, this)));
    },

    continue: function(){
        if(!this._init) return;

        if(this._curContent == null) {
            this._next();
        }
        else{
            this._isRunning = true;
            this._run(this._curContent);
        }
    },

    /**
     * show a message text
     * @param contentObjOrStr
     */
    show: function(contentObjOrStr){
        if(!this._init){
            this.init();
        }

        if(_.isString(contentObjOrStr)) contentObjOrStr = {text: contentObjOrStr};
        if(!contentObjOrStr.hasOwnProperty("text")) contentObjOrStr.text = "";

        contentObjOrStr.text = (contentObjOrStr.hasOwnProperty("isKey") && !contentObjOrStr.isKey)
            ? contentObjOrStr.text
            : languageMgr.getString(contentObjOrStr.text).replace('\n', ' ');
        if(this._isSameText(contentObjOrStr.text)) return;

        contentObjOrStr.duration = contentObjOrStr.hasOwnProperty("duration") ? contentObjOrStr.duration : 3;
        contentObjOrStr.priority = contentObjOrStr.hasOwnProperty("priority") ? contentObjOrStr.priority : 0;
        contentObjOrStr.expireTime = contentObjOrStr.hasOwnProperty("expireTime") ? contentObjOrStr.expireTime : Number.MAX_VALUE;
        contentObjOrStr.tag = contentObjOrStr.hasOwnProperty("tag") ? contentObjOrStr.tag : NotificationsTag.NONE;

        this._queue.push(contentObjOrStr);
        this._isDirty = true;

        if(!this._isRunning) {
            this._isRunning = true;
            _.delay(this._next.bind(this), 100);
        }
    },

    _sort: function(){
        if(this._isDirty) this._queue = _.orderBy(this._queue, ['priority', 'expireTime'], ['desc', 'asc']);
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

    },

    onTouchUIMovedEvent:function(sender){

    },

    onTouchUIEndEvent:function(sender){
        this.hide();

        if(sender == this._btnCallBack){
            this._callback && this._callback();
            this._callback = null;
            this._curContent = null;
        }
        else{
            this.removeCurrent();
        }

        this._next();
    },

    onTouchUICancelEvent:function(sender){

    },

    hide: function(){
        this._isRunning = false;
        if(this._imgBg){
            this._imgBg.setVisible(false);
        }
    },

    removeCurrent: function(){
        this._curContent = null;
    },

    removeByTag: function(tag){
        if(this._curContent && this._curContent.tag == tag){
            this.hide();
            this.removeCurrent();
        }

        for(var i = 0; i < this._queue.length; ++i){
            if(this._queue[i].tag == tag){
                this._queue.splice(i, 1);
                --i;
            }
        }
    },

    removeAll: function(){
        if(!this._init) return;

        this.hide();
        this.removeCurrent();
        this._queue.splice(0);
    },

    cleanUp: function () {
        // stop current notification
        if(this._lbMsg){
            this._lbMsg.stopAllActions();
            this._lbMsg.removeFromParentAndCleanup();
        }

        if(this._imgBg){
            this._imgBg.stopAllActions();
            this._imgBg.removeFromParentAndCleanup();
        }
    },
};

NotificationsTag = {
    NONE:                   -1,
    MTT_REGISTER:           1,
    MTT_WAITING_REBUY:      2,
    MTT_AUTO_SUGGESTION:    3
};
