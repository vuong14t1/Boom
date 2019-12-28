/**
 * Created by bachbv on 1/16/2017.
 */

getSceneOfGUI = function(gui){
    if(gui == null) return null;

    var curParent = gui.getParent() != null ? gui.getParent() : null;
    while(curParent != null && !(curParent instanceof BaseScene)){
        curParent = curParent.getParent();
    }

    return curParent;
};

getListZOrder = function(node){
    if(node == null) return -1;

    var curNode = node;
    var list = [];

    //ZLog.debug("---------------------------------------------");
    //if(node == sceneMgr.getFog()){
    //    ZLog.debug("is fog");
    //}
    //
    //if(curNode instanceof BaseScene){
    //    ZLog.debug("is scene " + curNode._className);
    //}
    //else if(curNode instanceof BaseGUI){
    //    ZLog.debug("is GUI " + curNode._className);
    //}

    while(!(curNode instanceof BaseScene) && curNode.getParent() != null){
        list.push(curNode.getLocalZOrder());
        //ZLog.debug(curNode.getLocalZOrder());

        curNode = curNode.getParent();
    }
    list.push(curNode);
    list.reverse();

    //var tmp = [].concat(list).slice(1);
    //ZLog.debug(JSON.stringify(tmp));
    //ZLog.debug("---------------------------------------------");

    return list;
};

compareZOrder = function(node1, node2){
    var list1 = getListZOrder(node1);
    var list2 = getListZOrder(node2);

    if(list1.length > 0 && list2.length > 0 && list1[0] == list2[0]){
        var length = Math.min(list1.length, list2.length);

        for(var i = 1; i < length; ++i){
            if(list1[i] > list2[i]){
                // zOrder node1 > node2
                //ZLog.debug("z1 = " + list1[i] + "> z2 = " + list2[i]);
                return 1;
            }
            else if(list1[i] == list2[i]){
                // continue;
            }
            else{
                // zOrder node1 < node2
                //ZLog.debug("z1 = " + list1[i] + "< z2 = " + list2[i]);
                return -1;
            }
        }

        return 1;
    }
    else{
        ZLog.error("cannot compare zOrder of 2 nodes");
        return 0;
    }
};

var SceneMgr = cc.Class.extend({

    ctor:function () {
        this._currentScene = null;
        this._listScenes = {};
        this._sceneFactory = null;
        this._currentSceneId = -1;
        this._prevSceneId = -1;
        this._fog = null;
        this._fogListener = null;
        this._guiWaiting = null;
        this.timeInScene = (new Date()).getTime();
        return true;
    },

    getRunningScene: function () {
        var currentScene = cc.director.getRunningScene();
        if (currentScene instanceof cc.TransitionScene) {
            currentScene = cc.director.getRunningScene().getInScene();
        }
        return currentScene;
    },

    /**
     *
     * @param {BaseScene} scene
     * @param {int} sceneId
     */
    addScene:function(scene, sceneId){
        this.removeScene(sceneId);
        this._listScenes[sceneId] = scene;
        scene.retain();
    },

    removeScene:function(sceneId) {
        if(this._listScenes[sceneId]){
            this._listScenes[sceneId].release();
            delete this._listScenes[sceneId];
        }
    },

    /**
     *
     * @param {int} sceneId
     * @returns {Layer}
     */
    getScene:function(sceneId)
    {
        if(this._listScenes[sceneId]) {
            return this._listScenes[sceneId];
        }
        else if(this._sceneFactory != null) {
            var screen = this._sceneFactory.createScreen(sceneId);
            if(screen != null) {
                this.addScene(screen,sceneId);
                return screen;
            }
        }

        ZLog.error("----> NOT FOUND scene id (%d)", sceneId);
        return null;
    },

    /**
     * get Layer by id in a scene
     * @param {int} layerId
     * @param {int} sceneId
     * @return {Layer} layer
     */
    getLayerInScene: function(layerId, sceneId){
        var scene = this.getScene(sceneId);

        if(scene){
            return scene.getLayer(layerId);
        }else{
            ZLog.error("----> NOT FOUND scene id (%d)", sceneId);
            return null;
        }
    },

    isExistScene: function(sceneId){
        return this._listScenes[sceneId];
    },

    viewSceneIdAddQueue:function(sceneId,isKeepPrevScene){
        TaskMgr.Instance.addQueueTask(function(){
            sceneMgr.viewSceneById(sceneId,isKeepPrevScene);
            return true;
        },TaskMgrKey.CHANGE_SCENE,ONCE_SECOND_HALF,NO_DELAY);
    },
    /**
     *
     * @param {int} sceneId
     * @param isKeepPrevScene
     */
    viewSceneById:function(sceneId, isKeepPrevScene){
        if(isKeepPrevScene === undefined){
            isKeepPrevScene = true;
        }

        if (sceneId == this._currentSceneId) {
            return this._currentScene;
        }

        if(!isKeepPrevScene) {
            this.removeScene(sceneId);
        }

        if(sceneId != this._currentSceneId && this._currentSceneId != -1) {
            var thisTime = (new Date()).getTime();
            var longTime = thisTime - this.timeInScene;
            var msg = "&oldScene=" + this.getSceneNameById(this._currentSceneId) + "&timeInScene=" + longTime + "&newScene=" + this.getSceneNameById(sceneId);

            OpenTracker.track(TrackingAction.CHANGE_SCENE, msg);
            this.timeInScene = thisTime;
        }

        this._prevSceneId = this._currentSceneId;
        this._currentSceneId = sceneId;
        this.viewScene(this.getScene(sceneId));

        //ZLog.debug("viewSceneById %s", ZLog.getKey(GV.SCENE_IDS,sceneId));
        return this._currentScene;
    },

    getSceneNameById:function(sceneId){
        for(var key in GV.SCENE_IDS){
            if(sceneId === GV.SCENE_IDS[key]){
                return key;
            }
        }
        return "NULL";
    },

    /**
     *
     * @param {cc.Layer} layer
     */
    viewScene:function(layer)
    {
        // check correct "Layer" type
        cc.arrayVerifyType(layer, cc.Layer);

        layer.removeFromParent(false);
        var scene = new cc.Scene();
        scene.addChild(layer);

        sceneMgr.cleanFogCache();

        // first scene showed without transition
        if(this._prevSceneId == -1 || this._currentSceneId == GV.SCENE_IDS.GAME){
            cc.director.runScene(scene);

        }else{
            var pTransition = this._sceneFactory.createTransition(scene);
            cc.director.runScene(pTransition);
        }
        this._currentScene = layer;
        BroadcastReceiver.continue();
    },

    setSceneFactory:function(sceneFactory)
    {
        this._sceneFactory = sceneFactory;
    },

    /**
     *
     * @returns {number|*}
     */
    getPrevSceneId:function()
    {
        return this._prevSceneId;
    },

    /**
     *
     * @returns {number|*}
     */
    getCurrentSceneId:function()
    {
        return this._currentSceneId;
    },

    isPrevScene: function(sceneId){
        return this._prevSceneId == sceneId;
    },

    isScene: function(sceneId){
        return this._currentSceneId == sceneId;
    },

    /**
     *
     * @returns {BaseScene}
     */
    getCurrentScene:function()
    {
        return this._currentScene;
    },

    _createFog: function(){
        this._fog = new cc.LayerColor(cc.color('#17101f'), GV.VISIBALE_SIZE.width, GV.VISIBALE_SIZE.height);
        this._fog.retain();
        this._fog.setOpacity(200);
        this._fog.setVisible(false);

        this._fogListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                return cc.rectContainsPoint(rect, locationInNode);
            },
            onTouchEnded: function (touch, event) {
                var topGUI = sceneMgr.getTopGUI();
                if(topGUI == null || topGUI.target == null || !topGUI.target.hasOwnProperty('imgBg')) return false;

                var locationInGUI = topGUI.target.imgBg.convertToNodeSpace(touch.getLocation());
                var guiBgSize = topGUI.target.imgBg.getContentSize();
                var rectGUI = cc.rect(0, 0, guiBgSize.width, guiBgSize.height);

                if(!cc.rectContainsPoint(rectGUI, locationInGUI) && topGUI.target.isRegistryTouchOutOfGUI && topGUI.target.isRegistryTouchOutOfGUI()){
                    topGUI.target.onTouchOutGUI();
                }
            }
        });

        cc.eventManager.addListener(this._fogListener, this._fog);
    },

    getTopGUI: function(){
        return this.showFog._listGUI && this.showFog._listGUI.length > 0 ? _.nth(this.showFog._listGUI, -1) : null;
    },

    /**
     *
     * @param target
     * @returns {number}
     */
    getIndexOfTarget: function(target){
        if(target == undefined || target == null || this.showFog._listGUI === undefined){
            return -1;
        }

        var listTarget = this.showFog._listGUI;
        for(var i = 0; i < listTarget.length; ++i){
            if(target == listTarget[i].target) return i;
        }

        return -1;
    },

    isShowFog: function(){
        return this._fog && this._fog.isVisible() && this._fog.getParent();
    },

    /**
     * show the fog with opacity
     * target had added to parent
     * @param target
     * @param guiName
     * @param opacity
     * @returns {boolean}
     */
    showFog: function(target, guiName, opacity){
        if(opacity === undefined) opacity = 225;
        if(this.showFog._listGUI === undefined) this.showFog._listGUI = [];
        var zOrder = target.getLocalZOrder() - 1;

        if(this._currentScene){
            var fog = this.getFog();
            fog.setVisible(true);

            var index = this.getIndexOfTarget(target);
            if(index >= 0){
                // re-order target
                var parentObj = this.showFog._listGUI.splice(index, 1)[0];
                parentObj.zOrder = zOrder;

                fog.removeFromParent(false);
                target.getParent().addChild(fog, zOrder);
                this.showFog._listGUI.push(parentObj);
            }
            else{
                parentObj = {
                    target: target,
                    name: guiName,
                    zOrder: zOrder,
                    opacity: opacity
                };

                var isHigherLayer = 1;
                if(this.showFog._listGUI.length > 0){
                    var lastObj = this.showFog._listGUI[this.showFog._listGUI.length - 1];
                    isHigherLayer = compareZOrder(target, lastObj.target);
                }

                if(isHigherLayer >= 0){
                    fog.removeFromParent(false);
                    target.getParent().addChild(fog, zOrder);

                    this.showFog._listGUI.push(parentObj);

                    this._hideBlindGUI();
                }
                else{
                    lastObj = this.showFog._listGUI.pop();
                    this.showFog._listGUI.push(parentObj);
                    this.showFog._listGUI.push(lastObj);
                }
            }

            if(opacity !== undefined){
                fog.setOpacity(opacity);
            }

            this._fogListener.setEnabled(true);
            return true;
        }

        return false;
    },

    _findFogOf: function(target){
        var list = this.showFog._listGUI;
        if(list && list.length > 0){
            for(var i = 0; i < list.length; ++i){
                if(target === list[i].target) return i;
            }
        }

        return -1;
    },

    _removeFogOf: function(target){
        var index = this._findFogOf(target);
        if(index >= 0){
            return this.showFog._listGUI.splice(index, 1)[0];
        }
        else{
            return null;
        }
    },

    hideFog: function(target){
        if(this.showFog._listGUI === undefined) this.showFog._listGUI = [];
        if(target == null || target === undefined) {
            ZLog.error("hideFog: no target found");
            return;
        }

        if(this.showFog._listGUI.length > 0){
            var fogOfTarget = this._removeFogOf(target);
            if(fogOfTarget){
                if(this.showFog._listGUI.length > 0){
                    var obj = this.showFog._listGUI[this.showFog._listGUI.length - 1];
                    var fog = this.getFog();
                    fog.setOpacity(obj.opacity);

                    // re-addChild to other parent
                    fog.removeFromParent(false);
                    obj.target.getParent().addChild(fog, obj.zOrder);
                }
            }
            else{
                //ZLog.error("hideFog: no fogOfTarget found");
            }

            this._hideBlindGUI();
        }

        // hide fog
        if(this.showFog._listGUI.length == 0){
            this.getFog().setVisible(false);
            this._fogListener.setEnabled(false);
        }
    },

    _hideBlindGUI: function(){
        var visible = true;
        for(var i = this.showFog._listGUI.length - 1; i >= 0; --i){
            this.showFog._listGUI[i].setVisible && this.showFog._listGUI[i].setVisible(visible);
            if(this.showFog._listGUI[i].isFullScreen) visible = false;
        }
    },

    cleanFogCache: function(){
        if(this.showFog._listGUI){
            this.showFog._listGUI.splice(0, this.showFog._listGUI.length);
        }

        if(this._fog) this._fog.setVisible(false);
    },

    /**
     * get the fog
     * @returns {cc.LayerColor}
     */
    getFog: function(){
        if(this._fog == null){
            this._createFog();
        }

        return this._fog;
    },

    showGUIEditBox: function(targetTextField){
        if(this._guiEditBox == null){
            this._guiEditBox = new GUIEditBox();
            this._guiEditBox.setVisible(false);
            this._guiEditBox.retain();
        }
        this._guiEditBox.setTargetTextField(targetTextField);
        this._guiEditBox.showAtCurrentScene();
    },

    isShowingGUIEditBox:function(){
        return this._guiEditBox && this._guiEditBox.isVisible();
    },

    showGUIWaiting: function(){
        if(this._guiWaiting == null){
            this._guiWaiting = new GUIWaiting();
            this._guiWaiting.setVisible(false);
            this._guiWaiting.retain();
        }

        //if(this._currentScene){
        //    var layer = this.getCurrentScene().getLayer(GV.LAYERS.CURSOR);
        //    this.showFog(layer, this._guiWaiting.getClassName());
        //
        //    if(this._guiWaiting.parent != layer){
        //        this._guiWaiting.removeFromParent(false);
        //        layer.addChild(this._guiWaiting, 1);
        //    }
        //
        //    this._guiWaiting.show();
        //}

        this._guiWaiting.showAtCurrentScene();
    },

    isGuiWaitingVisible:function(){
        if(this._guiWaiting == null){
            return false;
        }
        return this._guiWaiting.isVisible();
    },

    hideGUIWaiting: function(hasEffect){
        if(this._guiWaiting){
            this._guiWaiting.hide(hasEffect);
        }
    },

    setVisibleLayersBehind: function(b){
        var currentScene = this.getCurrentScene();
        if(currentScene != null){
            currentScene.getLayer(GV.LAYERS.BG).setVisible(b);
            currentScene.getLayer(GV.LAYERS.GAME).setVisible(b);
            currentScene.getLayer(GV.LAYERS.EFFECT).setVisible(b);
        }
    },
});