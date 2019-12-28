/**
 * Created by bachbv on 12/29/2015.
 */

var GUIWaiting = BaseGUI.extend({
    _className: "GUIWaiting",

    ctor: function(){
        this._super();

        this.imgWaitingProgress = null;
        this._isShowing = false;
        this.init();
    },

    init: function(){
        this._super();
        this.syncAllChildren(res.node_waiting, this);
        this.alignCenter();
    },

    showAtCurrentScene: function(){
        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.CURSOR);
            if (this.parent != layer) {
                this.removeFromParent(false);
                layer.addChild(this, 4);

                this._isShowing = false;
            }
        }

        this.show();
    },

    show: function(){
        GUIMgr.push(this);

        if(!this.isVisible()){
            this.setVisible(true);
        }

        if(this._isShowing) return;
        this._isShowing = true;
        this.setOpacity(128);
        this._showFog();

        var speedShow = 0.2;
        var fadeIn = cc.fadeIn(speedShow);

        this.stopAllActions();
        this.runAction(fadeIn);

        var rotationAction = cc.repeatForever(cc.rotateBy(1.5, 300));
        this.imgWaitingProgress.runAction(rotationAction);
    },

    hide: function(hasEffect){
        if(hasEffect === undefined) hasEffect = true;
        if(!this._isShowing){
            return;
        }

        this._isShowing = false;
        this.setOpacity(255);

        GUIMgr.remove(this);
        sceneMgr.hideFog(this);

        if(hasEffect){
            var speedShow = 0.2;
            var fadeOut = cc.fadeOut(speedShow);

            this.stopAllActions();
            this.runAction(
                cc.sequence(
                    fadeOut,
                    cc.callFunc(function(sender){
                        sender.stopAllActions();
                        sender.setVisible(false);
                    })
                )
            );
        }
        else{
            this.setVisible(false);
        }
    },
});
