/**
 * Created by bachbv on 4/17/2017.
 */


TooltipLocation = {
    TOP_RIGHT: 0,
    TOP_LEFT: 1,
    BOTTOM_RIGHT: 2,
    BOTTOM_LEFT: 3,
};
var Tooltip = {
    _padding: 20,

    init: function(){
        this._init = true;
        this._minSize = cc.p(100, 50);
        this._location = null;

        this._nodeContainer = ccs.load(res.node_tooltip, "res/").node;
        this._nodeContainer.setCascadeOpacityEnabled(true);
        this._nodeContainer.retain();

        this._imgBg = this._nodeContainer.getChildByName('imgTooltip');
        this._imgBg.setCascadeOpacityEnabled(true);

        this._htmlContent = new HtmlText(res.UTM_AVO_P13, 13);
        this._htmlContent.setMode(HtmlTextMode.WRAP_WIDTH, cc.size(GV.VISIBALE_SIZE.width >> 1, 1));
        this._nodeContainer.addChild(this._htmlContent);

        var self = this;
        this.imgBgListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchEnded: function (touch, event) {
                self.hide();
            }
        });

        cc.eventManager.addListener(this.imgBgListener, this._imgBg);
    },

    setPadding: function(p){
        this._padding = p;
    },

    isShowing: function(){
        //ZLog.debug("visible = %s, opacity = %d", this._nodeContainer.visible, this._nodeContainer.getOpacity());
        return this._nodeContainer && this._nodeContainer.visible && this._nodeContainer.getOpacity() > 0;
    },

    /**
     *
     * @private
     */
    _updateParent: function(){
        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.GUI);
            if (this._nodeContainer.parent != layer) {
                this._nodeContainer.removeFromParent(false);
                layer.addChild(this._nodeContainer, 999);
            }
        }
    },

    /**
     *
     * @private
     */
    _updateSize: function(){
        var contentSize = this._htmlContent.getRealContentSize();
        var imgSize = this._imgBg.getContentSize();

        this._imgBg.width = Math.max(contentSize.width + (this._padding << 1), imgSize.width);
        this._imgBg.height =  Math.max(contentSize.height + (this._padding << 1), imgSize.height);

        contentSize = null;
        imgSize = null;
    },

    /**
     *
     * @private
     */
    _updateComponentsPosition: function(){
        var offset = 52; // distance to peak
        var contentYOffset = 7;

        switch (this._location){
            case TooltipLocation.TOP_LEFT:
                this._imgBg.setFlippedX(true);
                this._imgBg.setFlippedY(true);
                this._imgBg.x += (this._imgBg.width >> 1) - offset;
                this._htmlContent.setPosition(this._imgBg.x, this._imgBg.y - contentYOffset);
                break;

            case TooltipLocation.TOP_RIGHT:
                this._imgBg.setFlippedX(false);
                this._imgBg.setFlippedY(true);
                this._imgBg.x -= (this._imgBg.width >> 1) - offset;
                this._htmlContent.setPosition(this._imgBg.x, this._imgBg.y - contentYOffset);
                break;

            case TooltipLocation.BOTTOM_LEFT:
                this._imgBg.setFlippedX(true);
                this._imgBg.setFlippedY(false);
                this._imgBg.x += (this._imgBg.width >> 1) - offset;
                this._htmlContent.setPosition(this._imgBg.x, this._imgBg.y + contentYOffset);
                break;

            case TooltipLocation.BOTTOM_RIGHT:
                this._imgBg.setFlippedX(false);
                this._imgBg.setFlippedY(false);
                this._imgBg.x -= (this._imgBg.width >> 1) - offset;
                this._htmlContent.setPosition(this._imgBg.x, this._imgBg.y + contentYOffset);
                break;
        }
    },

    /**
     *
     * @param worldPos
     * @param targetSize
     * @private
     */
    _calculatePositionShowing: function(worldPos, targetSize){
        var norToCenter = cc.pNormalize(cc.pSub(cc.p(GV.VISIBALE_SIZE.width >> 1, GV.VISIBALE_SIZE.height * 0.75), worldPos));
        if(cc.pointEqualToPoint(norToCenter, cc.p(0, 0))){
            norToCenter.y = 1;
        }

        if(norToCenter.x >= 0 && norToCenter.y > 0){
            this._location = TooltipLocation.BOTTOM_LEFT;
        }
        else if(norToCenter.x >= 0 && norToCenter.y < 0){
            this._location = TooltipLocation.TOP_LEFT;
        }
        else if(norToCenter.x < 0 && norToCenter.y > 0){
            this._location = TooltipLocation.BOTTOM_RIGHT;
        }
        else if(norToCenter.x < 0 && norToCenter.y < 0){
            this._location = TooltipLocation.TOP_RIGHT;
        }

        var offset = -6;
        var dBetween2Center = (((targetSize.height + this._imgBg.height) >> 1) + offset) / Math.abs(norToCenter.y);
        norToCenter = cc.pMult(norToCenter, dBetween2Center);
        this._imgBg.setPosition(worldPos.x, worldPos.y + norToCenter.y);

        norToCenter = null;
    },

    showText: function(textContent, target){
        if(!target || !textContent){
            ZLog.error("showText tooltip");
            return;
        }

        this._htmlContent.setString(languageMgr.getString(textContent));
        if(target && target instanceof cc.Node){
            this.imgBgListener.setEnabled(true);
            this._nodeContainer.setVisible(true);

            var targetSize = target.getContentSize();
            var targetAnchorPoint = target.getAnchorPoint();

            // re-position to center of target
            var dx = (0.5 - targetAnchorPoint.x) * targetSize.width;
            var dy = (0.5 - targetAnchorPoint.y) * targetSize.height;
            var centerTargetPos = cc.pAdd(target.getPosition(), cc.p(dx, dy));
            var worldPos = target.getParent().convertToWorldSpace(centerTargetPos);

            this._updateParent();
            this._updateSize();
            this._calculatePositionShowing(worldPos, targetSize);
            this._updateComponentsPosition();
        }
        else{
            ZLog.error('Tooltip - target is not a node');
        }
    },

    hide: function(){
        this._htmlContent.removeElements(false);
        this.imgBgListener.setEnabled(false);

        // invisible and resize bg
        this._nodeContainer.setVisible(false);
        this._imgBg.width = this._minSize.x;
        this._imgBg.height = this._minSize.y;

        // cleanUp all components
    },

    cleanUp: function(){
        this._htmlContent.cleanUp();

        this._imgBg.removeFromParent();
        this._nodeContainer.removeFromParent();

        this._minSize = null;
        this._imgBg = null;
        this._nodeContainer = null;
    },
};
