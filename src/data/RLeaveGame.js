/**
 * Created by MinhTrung on 11/1/2018.
 */
var RLeaveGame = cc.Class.extend({
    positionPlayer:undefined,
    reason:undefined,
    ctor:function(){},

    setPositionPlayer:function(pos){this.positionPlayer = pos},
    setReason:function(reason){this.reason = reason},

    getPositionPlayer:function(){return this.positionPlayer},
    getReason:function(){return this.reason}
});