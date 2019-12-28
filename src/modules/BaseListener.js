/**
 * Created by MinhTrung on 10/30/2018.
 */
var BaseListener = cc.Class.extend({
    enable:true,
    prefix:"BaseListener",

    ctor:function(prefix){
        this.prefix = prefix;
    },

    setEnable:function(b){
        this.enable = b;
    },

    addListener:function(eventName,func,nodeOrPriority){
        if(nodeOrPriority === undefined) nodeOrPriority = 1;
        var action;
        if(typeof func === 'function'){
            if(nodeOrPriority instanceof cc.Node){
                action = cc.EventListener.create({
                    event: cc.EventListener.CUSTOM,
                    eventName: this.getKey(eventName),
                    callback: func.bind(nodeOrPriority)
                });
            }else{
                action = cc.EventListener.create({
                    event: cc.EventListener.CUSTOM,
                    eventName: this.getKey(eventName),
                    callback: func
                });
            }
            return cc.eventManager.addListener(action,nodeOrPriority);
        }else{
            ZLogger.getLog(this).error("addListener need a function at agr 2");
            return null;
        }

    },
    removeListener:function(listener){
        cc.eventManager.removeListener(listener);
    },
    removeCustomListeners:function(eventName){
        cc.eventManager.removeCustomListeners(this.getKey(eventName));
    },
    /**
     *
     * @param eventName {GameEventName|number}
     * @param customData
     */
    dispatchCustomEvent:function(eventName,customData){
        if(!this.enable) {
            ZLogger.getLog(this).error("is disabled event");
            return;
        }
        cc.eventManager.dispatchCustomEvent(this.getKey(eventName),customData);
    },
    /*
     * var ev = new cc.EventCustom(eventName);
     * ev.setUserData(optionalUserData);
     */
    dispatchEvent: function(ev){
        if(!this.enable) {
            ZLogger.getLog(this).error("is disabled event");
            return;
        }
        cc.eventManager.dispatchEvent(ev);
    },
    /**
     *
     * @param eventName {GameEventName|number}
     * @returns {string}
     */
    getKey: function(eventName) {
        return this.prefix + eventName;
    }
});