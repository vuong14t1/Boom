/**
 * Created by MinhTrung on 10/31/2018.
 */
var PlayerInfo = cc.Class.extend({
    ctor:function(){
        this.uId = -1;
        this.uName = 'NotFound';
        this.displayName = '';
        this.uAvatar = '';
        this.gold = 0;
        this.level = 0;
        this.levelExp = 0;
        this.playing = false;
        this.serverTime = 0;
        this.createdTime = 0;
        this.vipLevel = 0;
        this.hearts = 0;
        this.numOfBoom = 0;
        this.numOfSpeed = 0;
        this.numOfRange = 0;
    },
    setUId:function(uId){this.uId = uId},
    setUName:function(uName){this.uName = uName},
    setDisplayName:function(displayName){this.displayName = displayName},
    setUrlAvatar:function(url){this.uAvatar = url},
    setGold:function(g){this.gold = g},
    setLevel:function(l){this.level = l},
    setPlaying:function(isPlaying){this.playing = isPlaying},
    //time in millisecond
    setCreatedTime:function(t){this.createdTime = t},
    setHearts:function(h){this.hearts = h},
    setNumOfBom:function(v){this.numOfBoom = v},
    setNumOfSpeed:function(v){this.numOfSpeed = v},
    setNumOfRange:function(v){this.numOfRange = v},
    setRecoveryTimeHeart:function(time){this.recoveryTimeHeart = time},

    isPlaying:function(){return this.playing},

    getUId:function(){return this.uId},
    getUName:function(){return this.uName},
    getDisplayName:function(){return this.displayName},
    getGold:function(){return this.gold},
    getLevel:function(){return this.level},
    getVipLevel:function(){return this.vipLevel},
    getHearts:function(){return this.hearts},
    getNumOfBoom:function(){return this.numOfBoom},
    getNumOfSpeed:function(){return this.numOfSpeed},
    getNumOfRange:function(){return this.numOfRange},
    getRecoveryTimeHeart:function(){return this.recoveryTimeHeart},
    getNumOfItemById:function(id){
        switch (id){
            case GameConfig.ITEM.BOOM:
                return this.numOfBoom;
            case GameConfig.ITEM.RANGE:
                return this.numOfRange;
            case GameConfig.ITEM.SPEED:
                return this.numOfSpeed;
        }
        return -1;
    },

    subNumOfItemById:function(id,numOfSub){
        switch (id){
            case GameConfig.ITEM.BOOM:
                return this.subNumOfBooms(numOfSub);
            case GameConfig.ITEM.SPEED:
                return this.subNumOfSpeeds(numOfSub);
            case GameConfig.ITEM.RANGE:
                return this.subNumOfRanges(numOfSub);
        }
    },
    subNumOfBooms:function(sub){this.numOfBoom -= sub},
    subNumOfSpeeds:function(sub){this.numOfSpeed -= sub},
    subNumOfRanges:function(sub){this.numOfRange -= sub},
    subGold:function(gold){this.gold -= gold;},

    addHeart:function(add){
        this.hearts += add;
    },
    subHearts:function(sub){
        if(this.hearts >= MAX_HEARTS){
            PlayerInfo.Instance.setRecoveryTimeHeart(Utility.getServerTimeInSeconds());
        }
        this.hearts -= sub;
    },
    getTimeRecoveryHeartRemain:function(){
        if(this.getHearts() < MAX_HEARTS){
            var serverTime = Utility.getServerTimeInSeconds();
            var timeRemain = RECOVERY_TIME_PER_HEART - (serverTime - this.getRecoveryTimeHeart());
            if(timeRemain <= 0){
                this.addHeart(1);
                this.recoveryTimeHeart = serverTime;
                if(this.hearts >= MAX_HEARTS){
                    return -1;
                }
                return RECOVERY_TIME_PER_HEART;
            }else{
                return timeRemain;
            }
        }
        return -1;
    },

    isMaxHearts:function(){
        return this.hearts >= MAX_HEARTS;
    },
    /**
     *
     * @param dataPlayer {DataPlayer}
     */
    updateInfoFromData:function(dataPlayer){
        ZLogger.getLog(this).error(JSON.stringify(dataPlayer));
        this.setUId(dataPlayer.uId);
        this.setUName(dataPlayer.uName);
        this.setUrlAvatar(dataPlayer.uAvatar);
        this.setDisplayName(dataPlayer.displayName);
        this.setHearts(dataPlayer.hearts);
        this.setGold(dataPlayer.gold);
        this.setLevel(dataPlayer.level);
        this.setPlaying(dataPlayer.isPlaying);
        this.setCreatedTime(dataPlayer.createdTime);
        this.setRecoveryTimeHeart(dataPlayer.recoveryTimeHeart);
        ZLog.fileToSaveLog = "C:/Users/CPU00000/Desktop/error/logError" + this.getUId() + this.getDisplayName() + ".log";
    },
    addExp:function(expAdd){
        if(expAdd == null){expAdd = 0}
        //hardCode add exp ==> level up;
    },
    cleanUp:function(){
        this.setGold(0);
        this.setNumOfBom(0);
        this.setNumOfRange(0);
        this.setNumOfSpeed(0);
        this.setLevel(0);
    }
});
PlayerInfo.prototype.name = 'PlayerInfo';
/**@type {PlayerInfo}*/
PlayerInfo.Instance = new PlayerInfo();