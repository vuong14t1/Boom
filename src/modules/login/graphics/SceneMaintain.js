/**
 * Created by bachbv on 3/19/2016.
 */

var SceneMaintain = BaseScene.extend({
    _className: "SceneMaintain",

    ctor: function(){
        this._super();

        // init variables
        this.lbMsg = null;

        this.init();
    },

    init: function(){
        this._super();
        this.syncAllChildren(res.node_dialog_maintain_resource, this.getLayer(GV.LAYERS.BG));
        this.doLayout(GV.VISIBALE_SIZE);
    },

    setMessage: function(msg){
        this.lbMsg.setString(msg);
    },

    localize: function(){
        this._super();

        //this.lbMsg.setString(languageMgr.getString("SYSTEM_MAINTAIN"));
    },
});