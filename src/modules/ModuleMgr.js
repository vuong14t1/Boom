/**
 * Created by VitaminB on 7/13/2015.
 */
/**@type {PingModule}*/
var pingModule = null;
/**@type {PaymentModule}*/
var paymentModule = null;
/**@type {LoginModule}*/
var loginModule = null;
/**@type {PlayerModule}*/
var playerModule = null;
/**@type {LobbyModule}*/
var lobbyModule = null;
/**@type {MGameModule}*/
var gameModule = null;

var ModuleMgr = cc.Class.extend({

    ctor: function(){
        this._nextId = 0;

        pingModule      = new PingModule(this.getNextModuleId());
        paymentModule   = new PaymentModule(this.getNextModuleId());
        loginModule     = new LoginModule(this.getNextModuleId());
        playerModule    = new PlayerModule(this.getNextModuleId());
        lobbyModule     = new LobbyModule(this.getNextModuleId());

        this._registerListener();
    },

    /**
     *
     * @private
     */
    _registerListener: function(){
        pingModule.registerListener();
        paymentModule.registerListener();
        loginModule.registerListener();
        playerModule.registerListener();
        lobbyModule.registerListener();
    },

    getNextModuleId: function(){
        return this._nextId++;
    },

    resetData: function(){
        //this._eventModule.resetData();
    },

    cleanUp: function(){
        for(var i in this){
            if(this[i] instanceof BaseModule){
                this[i].cleanUp && this[i].cleanUp();
            }
        }
    }

});