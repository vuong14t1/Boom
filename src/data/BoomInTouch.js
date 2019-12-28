/**
 * Created by MinhTrung on 11/2/2018.
 */
var BoomInTouch = cc.Class.extend({
    time:undefined,
    location:undefined,
    ctor:function(time,location){
        this.time = time;
        this.location = location;
    },
    setTime:function(t){
        this.time = t;
    },
    setLocation:function(location){
        this.location = location;
    },
    getTime:function(){return this.time},
    getLocation:function(){return this.location}
});