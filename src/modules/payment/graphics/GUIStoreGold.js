/**
 * Created by VitaminB on 12/11/2017.
 */

var GUIStoreGold = GUIStoreBase.extend({

    _className: "GUIStoreGold",

    ctor: function(){
        this._super(PAYMENT_ITEMS.GOLD);
    },

    init: function(){
        this._super();

        this.initVip();
    },

    initVip: function(){

    },

    onTouchUIEndEvent: function (sender) {
        var handled = this._super(sender);
        if(handled) return handled;

        // TODO
    },

    localize: function(){
        this._super();
    },


});