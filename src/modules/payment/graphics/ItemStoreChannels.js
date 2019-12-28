/**
 * Created by MinhTrung on 4/5/2018.
 */
var ItemStoreChannels = BaseTableCell.extend({


    ctor: function(context, scale) {
        this.btn = null;
        this.logo = null;
        this._super(res.node_p_item_channels);
        this._cellScale = scale;
        this.setDeepSyncChildren(2);
        this.syncAllChildren();
        this.init();
    },
    init:function(){
        this._rootNode.setScale(this._cellScale);
    },
    onTouchUIEndEvent: function(sender){
        paymentModule.getGUIStoreGold().selectChannelStore(this._data.channels,this._data.telcoChannel,this._index);
    },

    getData: function(){
        return this._data;
    },

    setData: function(data, index){
        /*
         data
         {
             "channels": 2,
             "isHighLight": false,
             "telcoChannel": "abc"
         }
         */
        this._data = data;
        this._index = index;
        //bg
        this.loadBackGround();

        //logo
        this.loadLogo();

        //
        //if(data.channels == ChannelStore.CASH_CARD){
        //    this.btn.setTitleText( data.telcoChannel+ data.isHighLight);
        //}else{
        //    this.btn.setTitleText(ZLog.getKey(ChannelStore,data.channels) + data.isHighLight);
        //}



    },
    loadLogo:function(){
        var textureLogo = "img_p_gplay.png";
        if(this._data.channels == ChannelStore.CASH_CARD){
            switch (this._data.telcoChannel){
                case TELCO_CHANNELS.TELENOR:
                    textureLogo =res.img_p_telenor;
                    break;
                case TELCO_CHANNELS.OOREDOO:
                    textureLogo =res.img_p_ooredoo;
                    break;
                case TELCO_CHANNELS.EASY_POINTS:
                    textureLogo =res.img_p_easy_points;
                    break;
            }
            this.logo.setTexture(textureLogo);
        }else{
            switch (this._data.channels){
                case ChannelStore.IAP_Android:
                    textureLogo ='img_p_gplay.png';
                    break;
                case ChannelStore.IAP_IOS:
                    textureLogo ='img_p_app_store.png';
                    break;
                case ChannelStore.DCB:
                    textureLogo ='img_p_sms.png';
                    break;
            }
            this.logo.setSpriteFrame(textureLogo);
        }
    },

    loadBackGround:function(){
        var texture = "bg_p_channels.png";
        if(this._data.isHighLight){
            texture = "bg_p_channels_choose.png";
        }
        this.btn.loadTextures(texture,texture,texture,ccui.Widget.PLIST_TEXTURE);


    }

});