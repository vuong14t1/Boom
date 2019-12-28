/**
 * Created by CPU00000 on 4/20/2018.
 */
var GUIMaintain = BaseGUI.extend({

    ctor: function(){
        this._super();
        this.imgTitle = null;
        this.btnOk = null;
        this.lbMsg = null;
        this.init();

    },

    init: function(){
        this.setDeepSyncChildren(2);
        this.syncAllChildren(res.node_dialog_maintain_resource, this);
        this.alignCenter();
    },

    localize: function(){
        this._super();
        this.imgTitle.setTexture(languageMgr.getImgPath("title_notice"));
        this.setMessage(languageMgr.getString("DISCONNECT_KICK"));
    },

    setMessage: function(msg){
        if(msg === undefined) return;
        this.lbMsg.setString(msg+ "");
    },
    onTouchUIEndEvent: function(sender){
        switch (sender){
            case this.btnOk:
                if(servicesMgr.isUsePortal()){
                    fr.NativeService.endGame();
                    return;
                }
                this.hide();
                moduleMgr.getPlayerModule().logOut();

                // clean up the session key
                fr.UserData.setStringCrypt(fr.portal.getCurrentSocial() + UserDataKey.SESSION_KEY, "");
                break;
        }
    }
});