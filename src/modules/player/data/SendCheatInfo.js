/**
 * Created by MinhTrung on 11/1/2018.
 */
var SendCheatInfo = cc.Class.extend({
    gold:undefined,
    expAdd:undefined,
    hearts:undefined,

    booms:undefined,
    speeds:undefined,
    ranges:undefined,

    ctor:function(numOfHeart,numOfExpAdd){
        if(numOfExpAdd === undefined) numOfExpAdd = 0;
        if(numOfHeart === undefined) numOfHeart = 0;
        this.expAdd = numOfExpAdd;
        this.hearts = numOfHeart;

        this.gold = PlayerInfo.Instance.getGold();
        this.speeds = PlayerInfo.Instance.getNumOfSpeed();
        this.ranges = PlayerInfo.Instance.getNumOfRange();
        this.booms = PlayerInfo.Instance.getNumOfBoom();
    },
    setBooms:function(v){this.booms = v},
    setSpeed:function(s){this.speeds = s},
    setRanges:function(r){this.ranges = r},
    setGold:function(g){this.gold = g},
    setHearts:function(h){this.hearts = h},

    addExp:function(add){this.expAdd += add},
    addBooms:function(add){this.booms += add},
    addSpeeds:function(add){this.speeds += add},
    addRanges:function(add){this.ranges += add},
    addHearts:function(add){this.hearts += add}
});