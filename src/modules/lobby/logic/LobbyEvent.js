/**
 * Created by MinhTrung on 10/30/2018.
 */
var LobbyEvent = BaseListener.extend({
    ctor:function(){
        this._super("LobbyEvent");
    },
    dispatchCustomEvent:function(eventName,customData){
        ZLogger.getLog(this).debug(cc.formatStr("dispatchCustomEvent: %s-{%s}" ,ZLog.getKey(LobbyEventName,eventName),(customData == null ? "" : JSON.stringify(customData))));
        this._super(eventName,customData);
    },
});
LobbyEvent.prototype.name = "LobbyEvent";
/**@type {LobbyEvent}*/
LobbyEvent.Instance = new LobbyEvent();