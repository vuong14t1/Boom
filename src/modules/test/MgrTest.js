/**
 * Created by MinhTrung on 11/20/2018.
 */
var MgrTest = cc.Sprite.extend({
    ctor:function(){
        this._super();
        var componentA = new ComponentTest();
        this.addComponent(componentA);
        componentA.setId(1);
        this._componentContainer = new cc.ComponentContainer(this);
        //
        //
        //var b= new ComponentTest();
        //b.setId(2);
        //this.addComponent(b);
    },
    addComponent:function(component){
        ZLog.debug("add component");
        this._super(component);
    },
    test:function(){
        var component = this.getComponent("ComponentTest");
        ZLog.debug(component.getName());
    },
    scheduleUpdate:function(){
        this._super();
        ZLog.debug("scheduleUpdate");
    },
    update:function(dt){
        ZLog.debug('ahihi');
    }
});