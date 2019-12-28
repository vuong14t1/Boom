/**
 * Created by MinhTrung on 10/31/2018.
 */
var RInventoryInfo = cc.Class.extend({
    numOfBoom:undefined,
    numOfSpeed:undefined,
    numOfRange:undefined,
    ctor:function(){

    },
    setNumOfBoom:function(b){this.numOfBoom = b;},
    setNumOfSpeed:function(s){this.numOfSpeed = s},
    setNumOfRange:function(r){this.numOfRange = r},

    getNumOfBoom:function(){return this.numOfRange},
    getNumOfSpeed:function(){return this.numOfSpeed},
    getNumOfRange:function(){return this.numOfRange},
    toString:function(){
        return cc.formatStr("{boom:%s,speed:%s,range:%s}",this.numOfBoom,this.numOfSpeed,this.numOfRange);
    }
});