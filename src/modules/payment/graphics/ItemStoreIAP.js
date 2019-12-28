/**
 * Created by MinhTrung on 4/5/2018.
 */
var ItemStoreIAP = BaseTableCell.extend({


    ctor: function(context, scale) {

        this.bg = null;
        this.btnPurchase = null;
        this.lbCurrency = null;
        this.lbMoney = null;
        this.lbOldGold = null;
        this.lbTotalGold = null;
        this.htmlMsg = null;
        this.lbVipPoint = null;
        this.itemVPoint = null;
        this.itemGold = null;
        this.imgStrike = null;

        this._super(res.node_p_item_shelf_iap);
        this._cellScale = scale;

        this.setDeepSyncChildren(2);
        this.syncAllChildren();
        this.init();
    },
    init:function(){
        this._rootNode.setScale(this._cellScale);
        this.lbTotalGold.ignoreContentAdaptWithSize(true);
        this.lbVipPoint.ignoreContentAdaptWithSize(true);
        this.lbOldGold.ignoreContentAdaptWithSize(true);

    },
    onTouchUIEndEvent: function(sender){
        ZLog.debug("purchaseIAP");
        moduleMgr.getPaymentModule().purchaseIAP(this._data.productId, PAYMENT_ITEMS.GOLD);
    },

    getData: function(){
        return this._data;
    },

    setData: function(data, index){
        /*
         {
             "gold": 5000000,
             "usdCost": 0.99,
             "localeCost": {
                 "vi": 22000,
                 "international": 0.99
                 },
             "vPoint": 167,
             "productId": "pack_1",
             "index": 0
         }
         */
        this._index = index;
        this._data = data;

        this.lbCurrency.setString(PaymentUtils.getCurrency());
        this.lbMoney.setString(Utility.formatMoneyFull(this._data.usdCost,""));
        this.lbOldGold.setString(Utility.formatMoneyFull(this._data.gold * 0.8,""));
        this.lbTotalGold.setString(Utility.formatMoneyFull(this._data.gold ,""));
        this.lbVipPoint.setString("+" + this._data.vPoint );

        this.lbVipPoint.setPositionX(this.lbTotalGold.getPositionX() + this.lbTotalGold.getContentSize().width + 5);
        this.itemVPoint.setPositionX(this.lbVipPoint.getPositionX() + this.lbVipPoint.getContentSize().width + 5);
        this.htmlMsg.setString(this._data.productId);

        this.imgStrike.width = this.lbOldGold.getContentSize().width;


        var textureGold = 6; // default
        if(index < 6){
            textureGold =index;
        }
        this.itemGold.setSpriteFrame("icon_p_gold_" + textureGold +".png");

    }

});