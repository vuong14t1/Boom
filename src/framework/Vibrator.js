/**
 * Created by bachbv on 4/2/2017.
 */

var Vibrator = {

    init: function(){
        this._mutingVibrator = fr.UserData.getBoolean(UserDataKey.VIBRATION, false);
    },
    setMutingVibrator: function(p){
        if(this._mutingVibrator === p) return;
        this._mutingVibrator = p;
        fr.UserData.setBoolean(UserDataKey.VIBRATION, p);
    },
    isMutingVibrator: function(){
        return this._mutingVibrator;
    },
    vibrateDevice: function(milliseconds){
        if(servicesMgr.isUsePortal() || this._mutingVibrator) return;   // neu game trong portal thi ko rung vi crash :v

        if(PlatformUtils.isAndroid()){
            jsb.reflection.callStaticMethod("com/gsn/baseframework/MVibrator", "vibrate", "(I)V", milliseconds);
        }
        else if(PlatformUtils.isIOs()){

        }
        else if(PlatformUtils.isWinPhone()){

        }
    },

    cancelVibratingDevice: function(){
        if(servicesMgr.isUsePortal()) return;

        if(PlatformUtils.isAndroid()){
            jsb.reflection.callStaticMethod("com/gsn/baseframework/MVibrator", "cancel", "()V");
        }
        else if(PlatformUtils.isIOs()){

        }
        else if(PlatformUtils.isWinPhone()){

        }
    },

    vibrateScene: function(scene, offset){
        if(scene && scene instanceof cc.Node){
            if(offset === undefined){
                offset = 3;
            }

            var pos = scene.getPosition();
            var moveRight1 = cc.MoveTo(0.01, pos.x + offset, pos.y);
            var moveLeft1 = cc.MoveTo(0.02, pos.x - offset, pos.y);
            var moveRight2 = cc.MoveTo(0.02, pos.x + offset, pos.y);
            var moveLeft2 = cc.MoveTo(0.01, pos.x, pos.y);

            scene.runAction(cc.sequence(moveRight1, moveLeft1, moveRight2, moveLeft2));
        }
    },
};
