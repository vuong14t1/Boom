/**
 * Created by bachbv on 1/10/2017.
 */

ANIMATION_STATUS = {
    INIT: 0,
    PLAYING: 2,
    STOP: 3,
    CALLBACK_FUNC: 4,
    DONE: 5
};

INFINITY = 99999999;

var FBFAnimation = cc.Node.extend({
    _className: "FBFAnimation",

    ctor: function(frameName, numOfFrame, duration, numOfRepeat) {
        this._super();

        // init variables
        this._animName = "";
        this._frameName = frameName;
        this._curFrame = null;
        this. _curIndexFrame = null;
        this._curNumOfRepeat = 0;
        this._status = ANIMATION_STATUS.INIT;
        this._duration = 1;
        this._lifeTime = 0;
        this._numOfRepeat = 1;
        this._timePerFrame = 1;
        this._timeCurFrame = 0;
        this._numOfFrames = numOfFrame;
        this._active = true;
        this._timeCurExecuteFuncCallBack = 0;
        this._timeExecuteFuncCallback = 0;
        this._callback = null;

        if(duration === undefined){
            duration = 1;
        }

        if(numOfRepeat === undefined){
            numOfRepeat = INFINITY;
        }

        this.setRepeat(numOfRepeat);
        this.setDuration(duration);
        this.initFrameTexture();

        // enable opacity and color for children
        this.setCascadeOpacityEnabled(true);
        this.setCascadeColorEnabled(true);
    },

    /**
     * init current frame and calculate width, height
     */
    initFrameTexture: function(){
        this._curFrame = new cc.Sprite();
        this.addChild(this._curFrame);
    },

    getCurrentFrameIndex: function(){
        return this._curIndexFrame;
    },

    getFrameName: function(idx){
        return ('@name@index.png').replace('@name', this._frameName).replace('@index', idx);
    },

    updateFrame: function(idx){
        this._curFrame && this._curFrame.setSpriteFrame(this.getFrameName(idx));
    },

    /**
     * life cycle
     * @param dt
     */
    update: function(dt){
        if(!this.isVisible() || this._active == false) return;

        if(this._status == ANIMATION_STATUS.PLAYING){
            this._timeCurFrame += dt;

            //cc.log(this._curFrame);
            //cc.log(dt);
            if(this._timeCurFrame >= this._timePerFrame){
                // next frame
                this._curIndexFrame = (this._curIndexFrame + 1) % this._numOfFrames;
                this._timeCurFrame -= this._timePerFrame;

                // invisible current frame
                //this._curFrame.setVisible(false);

                // check curFrame to update num of repeat
                if(this._lifeTime <= 0 && this._curIndexFrame == 0 && this._numOfRepeat > 0){
                    // increase num of repeat
                    ++this._curNumOfRepeat;

                    if(this._curNumOfRepeat >= this._numOfRepeat){
                        this.setStatus(ANIMATION_STATUS.CALLBACK_FUNC);
                        return;
                    }
                }

                // visible next frame
                //this._curFrame = this._listFrame[this._curIndexFrame];
                //this._curFrame.setVisible(true);
                this.updateFrame(this._curIndexFrame);
            }
            else{

            }

            // case the life Time 's still
            if(this._lifeTime > 0){
                this._lifeTime -= dt;
                if(this._lifeTime <= 0){
                    this.setStatus(ANIMATION_STATUS.CALLBACK_FUNC);
                    //cc.log("CALLBACK_FUNC "+ gv.ModuleMgr.battleMgr._curLoop+ " "+dt + + Utility.getCurrentTime());
                }
            }
        }
        else if(this._status == ANIMATION_STATUS.STOP){

        }
        else if(this._status == ANIMATION_STATUS.CALLBACK_FUNC){
            if(this._callback == null){
                this.setStatus(ANIMATION_STATUS.DONE);
            }
            else{
                this._timeCurExecuteFuncCallBack += dt;
                if(this._timeCurExecuteFuncCallBack >= this._timeExecuteFuncCallback){
                    this.executeCallBackFunc();
                }
            }
        }
        else if(this._status == ANIMATION_STATUS.DONE){

        }
        else{

        }
    },

    /**
     *
     * @param {Number} width
     * @param {Number} height
     */
    setWidthHeight: function(width, height){
        this.widthFrame = width;
        this.heightFrame = height;
    },

    setCompleteCb: function(cb){
        this._callback = cb;
    },

    /**
     * execute the callback function if has
     */
    executeCallBackFunc: function(){
        this._callback && this._callback();
        this._callback = null;
    },

    /**
     * reset all counter variables
     */
    resetValues: function(){
        if(this._curFrame){
            this._curFrame.setVisible(false);
        }

        this._active = true;
        this._curFrame.setVisible(true);
        this._curIndexFrame = 0;
        this.updateFrame(this._curIndexFrame);
        this._curNumOfRepeat = 0;
        this._timeCurExecuteFuncCallBack = 0;
        this._timeCurFrame = 0;
        this._timeCurExecuteFuncCallBack = 0;
        this._timeExecuteFuncCallback = 0;
        this._callback = null;
    },

    /**
     *
     * @param status
     */
    setStatus: function(status){
        this._status = status;
    },

    /**
     * update when change time of animation
      */
    updateTimePerFrame: function(){
        this._timePerFrame = this._duration / this._numOfFrames;
        //cc.log("time per frame = %d", this._timePerFrame);
    },

    /**
     * set life time for animation
     * @param time
     */
    setLifeTime: function(time){
        if(time === undefined){
            time = INFINITY;
        }

        this._lifeTime = time;
    },

    setFlippedX: function(b){
        this._curFrame.setFlippedX(b);
    },

    isFlippedX: function(){
        this._curFrame.isFlippedX();
    },

    /**
     * interval time from start to end of animation
     * @param duration
     */
    setDuration: function(duration){
        if(duration === undefined){
            duration = 1;
        }

        this._duration = duration;
        this.updateTimePerFrame();
    },

    /**
     * num of repeat of animation
     * @param num
     */
    setRepeat: function(num){
        if(num === undefined){
            num = 0;
        }

        this._numOfRepeat = num;
    },

    /**
     * run animation
     * @param resume
     */
    play: function(resume){
        if(resume === undefined){
            resume = false;
        }

        if(resume){
            this.setStatus(ANIMATION_STATUS.PLAYING);
        }
        else{
            this.replay();
        }
        this.scheduleUpdate();
    },

    /**
     * reset all attributes to default and run animation
     */
    replay: function(){
        this.setStatus(ANIMATION_STATUS.PLAYING);
        this.resetValues();
    },

    /**
     * stop update animation
     */
    stop: function(){
        this.setStatus(ANIMATION_STATUS.STOP);
    },

    /**
     * true if the animation still alive
     * @returns {boolean}
     */
    isActive: function(){
        return this._active;
    },

    getClassName: function(){
        return this._className;
    },

    /**
     * clean up all
     */
    release: function () {
        //this._super();

        this.cleanUp();
    },

    /**
     * clean up all
     */
    cleanUp: function(){
        this._active = false;
        this._curFrame && this._curFrame.removeFromParent(true);

        this.removeFromParent(true);
    },
});

///**
// * get animation from pool if has,
// * else create a new animation by name, list frames
// * @param animName
// * @param animFrames
// * @param duration
// * @param numOfRepeat
// * @returns {*}
// */
//FBFAnimation.createAnimation = function(animName, animFrames, duration, numOfRepeat){
//    var animation = Pool.getFromPool(FBFAnimation, animName);
//    if(animation && animation._numOfFrames == animFrames.length){
//        animation.setRepeat(numOfRepeat);
//        animation.setDuration(duration);
//    }
//    else{
//        animation = null;
//    }
//
//    if(animation == null){
//        animation = new FBFAnimation(animName, animFrames, duration, numOfRepeat);
//        if(animation){
//            animation.retain();
//        }
//    }
//
//    return animation;
//};