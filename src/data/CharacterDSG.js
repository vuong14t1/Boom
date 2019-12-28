/**
 * Created by MinhTrung on 11/1/2018.
 */
var CharacterDSG = cc.Class.extend({
    positionPlayer:undefined,
    booms:undefined,
    ranges:undefined,
    speeds:undefined,
    uId:undefined,
    name:undefined,

    ctor:function(){

    },
    setUId:function(uId){this.uId = uId},
    setName:function(name){this.name = name},
    setPositionPlayer:function(pos){this.positionPlayer = pos},
    setBooms:function(bom){this.booms = bom},
    setRange:function(r){this.ranges = r},
    setSpeed:function(s){this.speeds = s},

    getUId:function(){return this.uId},
    getName:function(){return this.name;},
    getBooms:function(){return this.booms},
    getSpeeds:function(){return this.speeds},
    getRanges:function(){return this.ranges},
    getPositionPlayer:function(){return this.positionPlayer}
});