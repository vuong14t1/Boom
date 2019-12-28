/**
 * Created by bachbv on 11/24/2015.
 */

var SceneTest = BaseScene.extend({
    _className: "SceneTest",

    ctor: function(){
        this._super();
        this.btnConnect = null;
        this.btnSendUdp = null;

        this.init();
    },

    init: function(){
        this._super();
        this.btnConnect = new ccui.Button(res.btn_blue_141x61,res.btn_blue_141x61,res.btn_blue_141x61,ccui.Widget.LOCAL_TEXTURE);
        this.btnConnect.setTitleText("connect");
        this.btnConnect.addTouchEventListener(this._onTouchUIEvent,this);

        this.btnSendUdp = new ccui.Button(res.btn_blue_141x61,res.btn_blue_141x61,res.btn_blue_141x61,ccui.Widget.LOCAL_TEXTURE);
        this.btnSendUdp.setTitleText("btnSendUdp");
        this.btnSendUdp.addTouchEventListener(this._onTouchUIEvent,this);

        this.btnConnect.setPosition(100,100);
        this.btnSendUdp.setPosition(300,100);

        this.btnConnect.setPressedActionEnabled(true);
        this.btnSendUdp.setPressedActionEnabled(true);

        this.getLayer(GV.LAYERS.EFFECT).addChild(this.btnConnect);
        this.getLayer(GV.LAYERS.EFFECT).addChild(this.btnSendUdp);
    },

    onEnter: function(){
        this._super();
        this.scheduleUpdate();
    },
    isSending:false,
    index:0,
    update:function(dt){
        if(this.isSending){
            this.index ++;
            lobbyModule.sendJoinGame(this.index, "abc");

        }
    },

    onEnterTransitionDidFinish:function() {
        this._super();
        Audio.stopMusic();

        var udpClient = fr.GsnClient.create();
        udpClient.setUseUDP(true);
        udpClient.connect("127.0.0.1",6123);

    },

    onExit: function(){
        this._super();
    },

    localize: function(){
        this._super();

    },

    onTouchUIEndEvent: function (sender) {
        if(this._super()) return true;

        switch (sender) {
            case this.btnSendUdp:
                //connector.connect();
                this.isSending = !this.isSending;
                //var id = _.random(0,100);
                //ZLog.error(id);
                //lobbyModule.sendJoinGame(id, "abc");
                break;
            case this.btnConnect:
                connector.connect();
                //loginModule.sendLogin("","user","abc");
                break;
        }
    }
});
