/**
 * Created by MinhTrung on 4/5/2018.
 */
var ItemStoreDCB = BaseTableCell.extend({


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
        this.imgStrike = null;

        this._super(res.node_p_item_shelf_dcb);
        this._cellScale = scale;

        this.animItem = null;

        this.setDeepSyncChildren(3);
        this.syncAllChildren();
        this.init();
    },
    init:function(){
        this._rootNode.setScale(this._cellScale);
        this.lbTotalGold.ignoreContentAdaptWithSize(true);
        this.lbVipPoint.ignoreContentAdaptWithSize(true);
        this.lbOldGold.ignoreContentAdaptWithSize(true);
        /*this.itemGold.playEffectGold = function(maxNumOfIcon){
            this.removeAllChildren(true);
            maxNumOfIcon = maxNumOfIcon || 12;
            var numOfIcon = _.random(5,maxNumOfIcon);
            for (var num = 0 ; num < numOfIcon ; num ++) {
                var icon = new cc.Sprite("#item_particle_4.png");
                //loai effect
                //vi tri ban dau
                //so effect thuc hien
                //danh sach cac action theo so lan
                //  vi tri moi sau moi lan
                //  thoi gian move
                //  ti le scale
                //  thoi gian an
                //  thoi gian hien
                var pos = cc.p(_.random(this.width*0.1,this.width*0.8,true),_.random(this.height*0.1,this.height*0.5,true));
                var numOfRepeat = _.random(3,7);
                var action = [];

                //loai 1
                var mode = _.random(0,1);
                action.unshift(cc.delayTime(_.random(0,2))); // delay first time
                icon.setPosition(pos);
                icon.setOpacity(0);
                this.addChild(icon);

                switch (mode){
                    case 0:
                        var offsetMoveY =  _.random((this.height - pos.y)/numOfRepeat*0.2,(this.height - pos.y)/numOfRepeat,true);
                        var offsetMoveX =  _.random(this.width*0.1,this.width*0.3,true);
                        for(var i = 0; i < numOfRepeat; i ++){
                            //hien ==> move ==> an
                            var time = _.random(1,1.2,true);
                            var timeDiv2 = time/2;
                            var timeDiv3 = time/3;
                            action.push(
                                cc.spawn(

                                    cc.bezierBy(time,[cc.p(0,0),cc.p(offsetMoveX,offsetMoveY/2),cc.p(0,offsetMoveY)]),
                                    cc.sequence(
                                        cc.scaleTo(time*0.1, _.random(0.3,0.7,true)),
                                        cc.delayTime(timeDiv3),
                                        cc.scaleTo(timeDiv2,0)

                                    ),
                                    cc.sequence(
                                        cc.fadeTo(timeDiv2, _.random(100,255)),
                                        cc.delayTime(timeDiv3),
                                        cc.fadeTo(timeDiv3,0)
                                    )
                                )
                            );
                        }
                        action.push(cc.callFunc(function(sender,pos){ //end of action clear
                            sender.setOpacity(0);
                            sender.setPosition(cc.p(_.random(this.width*0.1,this.width*0.8,true),_.random(this.height*0.1,this.height*0.5,true)));
                        }.bind(this,icon,pos)));
                        icon.runAction(cc.sequence(action).repeatForever());
                        break;
                    case 1:
                    default :
                        var offsetMoveY =  _.random((this.height - pos.y)/numOfRepeat*0.2,(this.height - pos.y)/numOfRepeat,true);
                        for(var i = 0; i < numOfRepeat; i ++){
                            //hien ==> move ==> an
                            var time = _.random(0.6,1.2,true);
                            var timeDiv2 = time/2;
                            var timeDiv3 = time/3;
                            action.push(
                                cc.spawn(
                                    cc.moveBy(time,0,offsetMoveY),
                                    cc.sequence(
                                        cc.scaleTo(timeDiv3, _.random(0.3,0.7,true)),
                                        cc.scaleTo(timeDiv3,0),
                                        cc.delayTime(timeDiv3)

                                    ),
                                    cc.sequence(
                                        cc.fadeTo(timeDiv2, _.random(100,255)),
                                        cc.fadeTo(timeDiv3,0),
                                        cc.delayTime(timeDiv3)
                                    )
                                )
                            );
                        }
                        action.push(cc.callFunc(function(sender,pos){ //end of action clear
                            sender.setOpacity(0);
                            sender.setPosition(cc.p(_.random(this.width*0.1,this.width*0.9,true),_.random(this.height*0.1,this.height*0.5,true)));
                        }.bind(this,icon,pos)));
                        icon.runAction(cc.sequence(action).repeatForever());
                        break;
                }
            }
        }.bind(this.itemGold);*/
        this._initAnimItemShop();
    },
    _initAnimItemShop:function(){
        this.animItem = new DBAnimation(res.anim_item_shop);
        this.animItem.getArmature().setPosition(GV.VISIBALE_SIZE.width>>1,GV.VISIBALE_SIZE.height>>1);
        //this.animItem.onComplete(function(){
        //    anim.getArmature().removeFromParent(false);
        //    anim.pooling();
        //});
        this.animItem.getArmature().setPosition(-192,0);
        this._rootNode.addChild(this.animItem.getArmature());
    },

    onTouchUIEndEvent: function(sender){
        //show ui select operator ==> if can't detect
        ZLog.debug("showSelectDCBOperator");
        //paymentModule.purchaseDCB(this.getData());
        moduleMgr.getPaymentModule().getGUIStoreGold().setCurrentPack(this._data);
        moduleMgr.getPaymentModule().getGUIStoreGold().showSelectDCBOperator();
        //moduleMgr.getPaymentModule().purchaseDCB(this._data)
    },

    getData: function(){
        return this._data;
    },

    setData: function(data, index){
        /*
         {
          "cost": 5000,
          "gold": 38000000,
          "vPoint": 830,
          "bonus1StPay": 0.7,
          "skull": {
              "DUMMY": 22200
              },
          "code": 550,
          "isAvailable": 1,
          "packId": "CODA_MM_10",
          "index": 4
          },
         */
        this._data = data;
        this._index = index;
        var is1StBonus = paymentModule.isBonus1StPay(this._data.packId);
        var vipLevel = playerModule.getVipLevel();
        if(is1StBonus){
            this.lbOldGold.setString(Utility.formatMoneyFull(this._data.gold,""));
            this.lbTotalGold.setString(Utility.formatMoneyFull(this._data.gold * (1 + this._data['bonus1StPay']),"" ));
            this.imgStrike.width = this.lbOldGold.getContentSize().width;
            this.htmlMsg.setString(languageMgr.getString("BONUS_FIRST_TIME")
                .replace("@percent", Math.zFloor(this._data['bonus1StPay'] * 100))
                .replace("@style",res.UTM_AVO_P13_BOLD)
            );
        }
        else if(vipLevel > 0){
            var vipConfig = resourceMgr.getConfigVip()[vipLevel];
            this.lbOldGold.setString(Utility.formatMoneyFull(this._data.gold,""));
            this.lbTotalGold.setString(Utility.formatMoneyFull(this._data.gold * (1 + vipConfig['buyGoldBonusRate']),"" ));
            this.imgStrike.width = this.lbOldGold.getContentSize().width;
            this.htmlMsg.setString(languageMgr.getString("BONUS_VIP")
                .replace("@percent", Math.zFloor(vipConfig['buyGoldBonusRate'] * 100))
                .replace("@style",res.UTM_AVO_P13_BOLD)
            );
        }
        else{
            this.lbTotalGold.setString(Utility.formatMoneyFull(this._data.gold,"" ));
        }

        var isShowOldGold = is1StBonus || vipLevel > 0;
        this.lbOldGold.setVisible(isShowOldGold);
        this.imgStrike.setVisible(isShowOldGold);
        this.htmlMsg.setVisible(isShowOldGold);

        this.lbCurrency.setString(PaymentUtils.getCurrency());
        this.lbMoney.setString(Utility.formatMoneyFull(this._data.cost,""));

        this.lbVipPoint.setString("+" + this._data.vPoint );

        //this.lbVipPoint.setPositionX(this.lbTotalGold.getPositionX() + this.lbTotalGold.getContentSize().width + 5);
        //this.itemVPoint.setPositionX(this.lbVipPoint.getPositionX() + this.lbVipPoint.getContentSize().width + 5);
        //

        var textureGold = 6; // default
        if(index < 6){
            textureGold = index;
        }
        textureGold = 6 - textureGold;
        /*this.itemGold.setSpriteFrame("icon_p_gold_" + textureGold +".png");
        this.itemGold.playEffectGold(maxOfIcon);*/
        this.animItem.playForever("" + textureGold);

    }

});