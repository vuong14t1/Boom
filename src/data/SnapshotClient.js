/**
 * Created by MinhTrung on 11/2/2018.
 */
var SnapshotClient = cc.Class.extend({
    timeServer:undefined,
    sequence:undefined,
    posX:undefined,
    posY:undefined,
    direction:undefined,
    velocity:undefined,
    ctor:function(){},

    setTimeServer:function(time){
        this.timeServer = time;
    },
    setSequence:function(sequence){
        this.sequence = sequence
    },
    setPosX:function(x){this.posX = x},
    setPosY:function(y){this.posY = y},
    setDirection:function(dir){this.direction = dir},
    setVelocity:function(v){this.velocity = v},

    getTimeServer:function(){return this.timeServer},
    getSequence:function(){return this.sequence},
    getPosX:function(){return this.posX},
    getPosY:function(){return this.posY},
    getDirection:function(){return this.direction},
    getVelocity:function(){return this.velocity}

});