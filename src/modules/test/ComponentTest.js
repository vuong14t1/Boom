/**
 * Created by MinhTrung on 11/20/2018.
 */
var ComponentTest = cc.Component.extend({
    ctor:function(){
        this._super();
    },
    getName:function(){
        return "ComponentTest";
    },
    onEnter:function(){
        ZLog.debug("onEnter Component");
    },
    setId:function(id){
        this.id = id;
    },
    update:function(dt){
        ZLog.debug("update %s" + this.id);
    }
});