/**
 * Created by MinhTrung on 4/23/2018.
 */

var GUIVerifyOtp = BaseGUI.extend({

    _className: "GUIVerifyOtp",

    ctor: function(){
        this._super();

        this.btnClose = null;
        this.lbTitle = null;
        this.lbMsg = null;
        this.imgBgInput = null;
        this.btnVerify = null;
        this.ebOTPNumber = null;
        this.data = null;

        this.init();
    },

    init: function(){
        this._super();
        this.setDeepSyncChildren(2);
        this.syncAllChildren(res.node_p_verify_otp, this);
        this.alignCenter();
        this.lbTitle.ignoreContentAdaptWithSize(true);
        this.ebOTPNumber.setMaxLength(20);
        this.ebOTPNumber.setRealColor(cc.color('#9f8dad'));
        this.ebOTPNumber.setPlaceHolderColor(cc.color('#E5E5E5'));
        this.ebOTPNumber.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.btnVerify.setTitleStroke("#bb4d16", 1);
    },

    onTouchUIEndEvent: function(sender){
        switch (sender) {
            case this.ebOTPNumber:
                sceneMgr.showGUIEditBox(sender);
                break;

            case this.btnClose:
                this.hide();
                break;

            case this.btnVerify:
                var otp = this.ebOTPNumber.getRealString();
                if(otp.length == 0){
                    Notifications.show("ERROR_OTP_EMPTY");
                }
                else{
                    paymentModule.sendVerifyOtpSea(this.data.paymenttype, this.data.transid, this.data.partnertransid, otp);
                }
                break;
        }
    },

    hide: function(hasEffect){
        fr.UserData.setString(UserDataKey.TRANS_OTP_DATA, '{"empty": 1}');
        this._super(hasEffect);
    },

    localize: function(){
        this._super();

        this.lbTitle.setZString('VERIFY_OTP', true);
        this.lbMsg.setString(languageMgr.getString('TEXT_DETAIL_OTP'));
        this.btnVerify.setTitleText(languageMgr.getString('VERIFY').toUpperCase());

    },

    setData: function(data){
        this.data = data;
    },

    show: function(hasEffect, showFog){
        fr.UserData.setString(UserDataKey.TRANS_OTP_DATA, JSON.stringify(this.data));
        this.ebOTPNumber.setRealString('');

        this._super(hasEffect, showFog);
    },


});