/**
 * Created by VitaminB on 7/13/2015.
 */
var SceneLoading = BaseScene.extend({
    _className: "SceneLoading",

    ctor: function(){
        this._super();

        // init variables
        this.imgBg = null;
        this.lbMsg = null;
        this.lbPercent = null;
        this.lbVersion = null;
        this._numberOfSprites = 0;
        this._numberOfLoadedSprites = 0;
        this.imgProgressBar = null;
        this.imgBgProgress = null;
        this.imgIcon = null;
        this._originalX = null;
        this.init();
    },

    init: function(){
        this._super();
        var layerBg = this.getLayer(GV.LAYERS.BG);
        this.syncAllChildren(res.scene_loading, layerBg);
        this.doLayout(GV.VISIBALE_SIZE);
        GV.VERSION_FULL = fr.platformWrapper.getAppVersion() + '.' + GV.VERSION;


        //this.animLoading = new DBAnimation(res.anim_loading);
        //this.animLoading.getArmature().setPosition(this.imgBg.width >> 1, this.imgBg.height >> 1);
        //this.animLoading.playForever();
        //this.imgBg.addChild(this.animLoading.getArmature());
        //
        //this.lbVersion.setVisible(true);
        //this.setVersion(GV.VERSION_FULL);
        //
        //this.lbPercent.setString("");
        //this.imgIcon.setPositionX(this.imgProgressBar.getPositionX() - (this.imgProgressBar.width >> 1) - (this.imgIcon.width >> 2));
        //this._originalX = this.imgIcon.getPositionX();
        //
        //this.lbMsg.ignoreContentAdaptWithSize(true);
        //this.lbMsg.setZString('PLEASE_WAIT');
        //this.lbMsg.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        //this.lbMsg.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);

    },

    setVersion: function(version){
        this.lbVersion.setString(GV.MODE + " | v" + version);
    },

    /**
     *load texture array by String
     * @param {Array} textureArr
     */
    loadTextures: function(textureArr){
        this._numberOfSprites += textureArr.length;

        if(cc.sys.isNative) {
            var texCache = cc.textureCache;
            for(var i = 0; i < textureArr.length; ++i){
                texCache.addImageAsync(textureArr[i], this.loadingCallBack.bind(this), this);
            }
        }
        else {
            // TODO for web
            //for(var i = 0; i < textureArr.length; ++i){
            //    cc.loader.load(textureArr[i], function(err, res) {
            //        if(!err) {
            //            this.loadingCallBack();
            //        }
            //        else
            //            ZLog.error("can not load %s", res);
            //    }.bind(this));
            //}
        }
    },

    loadPlistFiles: function(){
        //table
        //resourceMgr.loadPlist(res.boom_prototype_plist);
        resourceMgr.loadPlist(res.boom_base_map_plist);

        resourceMgr.loadPlist(res.pack_main_store_plist);
    },

    loadAnimations: function(animation_list) {
        for(var i=0; i<animation_list.length; i++)
            cc.loader.load(animation_list[i], function(err, res) {
                if(err)
                    cc.log("error to load %s", res);
            });
    },

    loadDBAnimations: function(){
        //var list = [
        //    res.anim_btn_quick_play,
        //    res.anim_btn_create_table,
        //    res.anim_btn_add_gold
        //];
        var list = [];
        var format = "res/animations/@key";
        for(var i = 0; i < list.length; ++i){
            var path = format.replace('@key', list[i]);
            loadAnimationData(list[i], format.replace('@key', list[i]));
        }
    },

    loadingCallBack:function (obj) {
        ++this._numberOfLoadedSprites;
        var percent = (this._numberOfLoadedSprites / this._numberOfSprites) * 100;
        //var width = Math.floor(this.imgProgressBar.width);
        //var delta = percent * width * 0.01;
        this.lbPercent.setString(percent.toFixed(cc.sys.isNative ? 0 : 2) + '%');
        //this.imgProgressBar.setPercent(percent);
        //this.imgIcon.setPositionX(this._originalX + delta);
        if (this._numberOfLoadedSprites == this._numberOfSprites) {
            // load json files before init modules
            resourceMgr.loadJsonList(this.loadDone.bind(this));
        }
    },

    /**
     * auto call this function when all texture loaded
     * may be change scene or whatever
     */
    loadDone: function(){
        cc.director.setAnimationInterval(1.0 / GV.FRAME_RATE);

        // load sprite frames
        this.loadPlistFiles();

        // load DragonBones
        this.loadDBAnimations();

        // init notification mgr
        //notificationMgr.onStart();

        // init module mgr
        moduleMgr = new ModuleMgr();

        _.delay(function(){
            languageMgr.updateLang();
            sceneMgr.viewSceneById(GV.SCENE_IDS.GAME);

            //cc.async.parallel([
            //    function() {
            //        ZLog.error("view seneLobby");
            //        //sceneMgr.viewSceneById(GV.SCENE_IDS.LOBBY);
            //    },
            //    function() {
            //        ZLog.error("view scene Login");
            //        sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
            //    },
            //    function() {
            //        ZLog.error("view seneLobby");
            //        sceneMgr.viewSceneById(GV.SCENE_IDS.LOBBY);
            //    },
            //    function() {
            //        ZLog.error("view scene Login");
            //        //sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
            //    }
            //]);
            // cheat payment if enable
            //if(Cheat.isEnable && Cheat.isEnablePayment) servicesMgr.setListPaymentMethods(Cheat.payments);
        }, 500);
        //if(GV.MODE == BUILD_MODE.DEV){
        //    _.delay(function(){
        //        languageMgr.updateLang();
        //        sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
        //
        //        // cheat payment if enable
        //        //if(Cheat.isEnable && Cheat.isEnablePayment) servicesMgr.setListPaymentMethods(Cheat.payments);
        //    }, 500);
        //}
        //else
        //{
        //    // get info from service
        //    cc.log("sendRequest");
        //
        //    servicesMgr.sendRequest(function(){
        //        // cheat payment if enable
        //        if(Cheat.isEnable && Cheat.isEnablePayment) servicesMgr.setListPaymentMethods(Cheat.payments);
        //
        //        if(!fr.portal.loginByCache() && !fr.portal.loginByPriority()){
        //            if(servicesMgr.isUsePortal()){
        //                fr.NativeService.endGame();
        //                return;
        //            }
        //
        //            // clean last login method in cache
        //            fr.UserData.setString(UserDataKey.LOGIN_METHOD, "");
        //            sceneMgr.viewSceneById(GV.SCENE_IDS.LOGIN);
        //        }
        //    });
        //}
    },

    onEnter: function(){
        this._super();
        cc.director.setAnimationInterval(1.0 / 60);
        cc.log("onEnter SceneLoading");
        if(cc.sys.isNative){
            cc.log("onEnter SceneLoading res_preload");
            this.loadTextures(res_preload);
        }
        else {
            // TODO for web
            //this.loadTextures(texture_preload);
            //this.loadAnimations(animation_preload);
        }
    },

    onExit: function(){
        this._super();

        //cc.textureCache.removeTextureForKey(res.img_bg_loading);
        //cc.textureCache.removeTextureForKey(res.img_progress_bar_header);
        //cc.textureCache.removeTextureForKey(res.img_process_bar);
        //cc.textureCache.removeTextureForKey(res.img_bg_process);

        sceneMgr.removeScene(GV.SCENE_IDS.LOADING);
    }
});
