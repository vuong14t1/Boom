/**
 * Created by VitaminB on 7/3/2017.
 */
var _animDBPool = {};
var DBAnimation = cc.Class.extend({

    ctor: function(key, path){
        this._armatureNode = null;
        this._action = "run";
        this.loadAnimationData(key, path);
        this.buildArmature();
    },

    onComplete: function(callback){
        this._armatureNode && this._armatureNode.setCompleteListener(function(sender){
            callback && callback(sender);
        });
    },

    /**
     *  DBEventData = {
            Z_ORDER_UPDATED:            "zorderUpdate",
            ANIMATION_FRAME_EVENT:      "animationFrameEvent",
            BONE_FRAME_EVENT:           "boneFrameEvent",
            SOUND:                      "sound",
            FADE_IN:                    "fadeIn",
            FADE_OUT:                   "fadeOut",
            START:                      "start",
            COMPLETE:                   "complete",
            LOOP_COMPLETE:              "loopComplete",
            FADE_IN_COMPLETE:           "fadeInComplete",
            FADE_OUT_COMPLETE:          "fadeOutComplete"
        };
     * @param dbEvent
     * @param callback
     * @param priority
     */
    addEventListener: function(dbEvent, callback, priority){
        if(this._armatureNode != null){
            if(priority === undefined) priority = 1;

            this._armatureNode.getCCEventDispatcher().addEventListenerWithFixedPriority(cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: dbEvent,
                callback: function (event) {
                    callback && callback(event);
                }
            }), priority);
        }
    },

    removeEventListener: function(dbEvent) {
        if (this._armatureNode != null) {
            //this._armatureNode.getCCEventDispatcher().removeListener(this._eventCallback[dbEvent]);
            this._armatureNode.getCCEventDispatcher().removeCustomListeners(dbEvent);
        }
    },

    /**
     * -1: default or loop forever
     * @param action
     * @param playTime
     * @param time
     * @param numOfLoop
     */
    play: function(action, playTime, time, numOfLoop){
        if(action !== undefined) this._action = action;
        if(playTime === undefined) playTime = -1;
        if(time === undefined) time = -1;
        if(numOfLoop === undefined) numOfLoop = -1;

        if(this._armatureNode){
            this._armatureNode.getAnimation().gotoAndPlay(this._action, playTime, time, numOfLoop);
        }
        else{
            ZLog.debug("DB animation armatureNode == null");
        }
    },

    /**
     *
     */
    playOnce: function(action){
        if(action === undefined) action = this._action;
        this._armatureNode && this._armatureNode.getAnimation().gotoAndPlay(action, -1, -1, 1);
    },
    playOnceByLanguage:function(action){
        var lang = languageMgr.getCurrentLanguage();
        if(action === undefined) {
            action = this._action + "_" + lang;
        }else{
            action += "_" + lang;
        }
        this._armatureNode && this._armatureNode.getAnimation().gotoAndPlay(action, -1, -1, 1);
    },

    /**
     *
     */
    playForever: function(action){
        if(action === undefined) action = this._action;
        this._armatureNode && this._armatureNode.getAnimation().gotoAndPlay(action, -1, -1, 0);
    },

    /**
     *
     * @param key
     * @param path
     */
    loadAnimationData: function(key, path){
        this._key = key;
        this._path = path === undefined ? ("res/animations/" + key) : path;

        loadAnimationData(this._key, this._path);
    },

    buildArmature: function(){
        if(this._key){
            this._armatureNode = __getArmatureNode(this._key);

            if(this._armatureNode == null){
                ZLog.error("DBAnimation cannot build armature");
            }
        }
        else{
            ZLog.error("DBAnimation key null");
        }
    },

    getArmature: function(){
        return this._armatureNode;
    },

    getInnerBoundingBox: function(){
        return this._armatureNode.getInnerBoundingBox();
    },

    pooling: function(){
        if(!_animDBPool.hasOwnProperty(this._key)){
            _animDBPool[this._key] = [];
        }

        _animDBPool[this._key].push(this._armatureNode);
    },

    unPooling: function(){
        if(_animDBPool.hasOwnProperty(this._key)){
            var idx = _animDBPool[this._key].indexOf(this._armatureNode);
            (idx > -1) && _animDBPool[this._key].splice(idx, 1);
        }
    },

    cleanUp: function () {
        db.DBCCFactory.getInstance().removeTextureAtlas(this._key, false);
    }
});

/**
 *
 * @param keyAnim
 * @returns {*}
 * @private
 */
__getArmatureNode = function(keyAnim){
    if(_animDBPool[keyAnim] && _animDBPool[keyAnim].length > 0){
        //ZLog.debug('getAnimation: ' + keyAnim + ' from pool');
        return _animDBPool[keyAnim].shift();
    }
    else{
        var anim = db.DBCCFactory.getInstance().buildArmatureNode(keyAnim);

        // auto-retain
        anim.retain();

        return anim;
    }
};

loadAnimationData = function(key, path){
    db.DBCCFactory.getInstance().loadTextureAtlas(path + "/texture.plist", key);
    db.DBCCFactory.getInstance().loadDragonBonesData(path + "/skeleton.xml", key);
};