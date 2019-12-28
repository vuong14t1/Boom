/**
 * Created by Tomorow on 4/5/2017.
 */

BroadcastReceiverAction = {
    CLAIM_REWARD: 0
};

BroadcastReceiverId = {
    CLAIM_JACPOT:    0,
    EVENT_EGGS_SMASH_LAST_DAY:      1,
    RESET_INFO_WARNING:             999
};

var BroadcastReceiver = {
    _pool: [],
    _visibleSize: cc.size(250, 25),
    _speedText: 0.02,

    init: function(){
        this._mask = new cc.Sprite(res.img_announce);
        this._mask.setScaleX(this._visibleSize.width / this._mask.getContentSize().width);
        this._mask.setScaleY(this._visibleSize.height / this._mask.getContentSize().height);

        this._container = new cc.ClippingNode();
        this._container.setStencil(this._mask);
        this._container.setVisible(false);
        this._container.setPosition((GV.VISIBALE_SIZE.width >> 1) + this._visibleSize.width * 0.45, GV.VISIBALE_SIZE.height - this._visibleSize.height* 1.5 );
        this._container.retain();
        this._container.addChild(this._mask);
        this._lbMsg = new HtmlText(res.UTM_AVO_P13_BOLD, 14);
        this._lbMsg.setPosition(0,-2);
        this._container.addChild(this._lbMsg);
    },

    _convert: function(obj){
        if(obj == null) return null;

        switch (obj.id){
            case BroadcastReceiverId.CLAIM_JACPOT:
                var value = obj.param2;
                value = value.split("|");
                var goldClaim = value[0];
                if(sceneMgr.isScene(GV.SCENE_IDS.TABLE)){
                    var goldJackpot = value[1];
                    sceneMgr.getScene(GV.SCENE_IDS.TABLE).updateJackpot && sceneMgr.getScene(GV.SCENE_IDS.TABLE).updateJackpot(goldJackpot);
                }
                return {
                    msg: languageMgr.getString("EVENT_CLAIM_JACKPOT")
                        .replace("@name", obj.param1)
                        .replace("@reward", Utility.formatMoneyFull(goldClaim)),
                    loop: 2
                };
                break;

            default :
                ZLog.error('convert broadcast obj failed - ' + JSON.stringify(obj));
                break;
        }

        if(obj.msg != null) return obj;
        return null;
    },

    _run: function(data){
        ZLog.debug("BroadcastReceiver run: " + JSON.stringify(data));
        this._lbMsg.setString(data.msg.replace(/\n/g,' ').replace("<br>", " "));
        this._lbMsg.stopAllActions();

        var s = this._visibleSize.width + this._lbMsg.getRealContentSize().width + 10;
        this._lbMsg.x = s >> 1;


        var container = this._container;
        this._lbMsg.runAction(
            cc.sequence(
                cc.delayTime(2),
                cc.callFunc(function(){
                    container.setVisible(true);
                }),
                cc.moveBy(this._speedText * s, -s, 0),
                cc.callFunc(this.onComplete.bind(this))
            )
        );
    },

    addNotification: function(obj){
        ZLog.debug("broadcast addNotification: " + JSON.stringify(obj));
        var notificationData = this._convert(obj);
        if(notificationData != null){
            this._pool.push(notificationData);
        }

        if(!this._container.isVisible()){
            this._show();
        }
    },

    removeNotificationById: function(id){
        for(var i = 0; i < this._pool.length; ++i){
            if(this._pool[i].hasOwnProperty("id") && this._pool[i].id == id){
                this._pool.splice(i, 1);
                --i;
            }
        }
    },

    onComplete: function(){
        if(this._pool.length == 0){
            this.hide();
            return;
        }

        var isNext = false;
        var data = this._pool[0];
        if(data != null && data.loop != null && data.loop > 0){
            --data.loop;

            if(data.loop <= 0) isNext = true;
        }
        else{
            isNext = true;
        }

        if(isNext){
            this._pool.splice(0, 1);

            if(this._pool.length == 0){
                this.hide();
                return;
            }
        }

        this._run(this._pool[0]);
    },

    _updateParent: function(){
        var curScene = sceneMgr.getCurrentScene();
        if(curScene != null) {
            var curSceneId = sceneMgr.getCurrentSceneId();
            var sizeWidth = this._visibleSize.width;
            var posX = (GV.VISIBALE_SIZE.width >> 1) + this._visibleSize.width * 0.45;
            var posY = GV.VISIBALE_SIZE.height - this._visibleSize.height* 1.5 ;

            //TODO open quest
            switch (curSceneId){
                case GV.SCENE_IDS.TABLE:
                    var TableScene = sceneMgr.getScene(GV.SCENE_IDS.TABLE);
                    var bgJackpot = TableScene.bgJackpot;
                    var btnDailyQuest = TableScene.btnDailyQuest;
                    var posJackpot = bgJackpot.getParent().convertToWorldSpace(bgJackpot);
                    var posDailyQuest = btnDailyQuest.getParent().convertToWorldSpace(btnDailyQuest);

                    var posLeftTable = cc.p(posJackpot.x + bgJackpot.width/2*bgJackpot.getScaleX(),posJackpot.y);
                    var posRightTable = cc.p(posDailyQuest.x - btnDailyQuest.width/2, posDailyQuest.y);
                    sizeWidth = cc.pDistance(posLeftTable,posRightTable)-10;
                    posX =  (posLeftTable.x + posRightTable.x)/2;
                    posY = GV.VISIBALE_SIZE.height - this._visibleSize.height * 1.1;
                    break;
                case GV.SCENE_IDS.LIST_TABLES:
                    //calculate pos + size
                    //btnRefreshListTable
                    //btnCreateTable
                    var posBtnSearch = curScene.btnRefreshListTable.getParent().convertToWorldSpace(curScene.btnRefreshListTable.getPosition());
                    var posBtnCreate = curScene.btnCreateTable.getParent().convertToWorldSpace(curScene.btnCreateTable.getPosition());
                    sizeWidth = cc.pDistance(posBtnSearch,posBtnCreate) - 30;
                    posX = posBtnSearch.x + sizeWidth/2;
                    sizeWidth = sizeWidth - curScene.btnRefreshListTable.width/2 - curScene.btnCreateTable.width/2;
                    break;

                case GV.SCENE_IDS.REGISTER_VIP:
                    posX = GV.VISIBALE_SIZE.width - sizeWidth/2 - 65;
                    posY = GV.VISIBALE_SIZE.height - this._visibleSize.height * 1.1;
                    break;

                case GV.SCENE_IDS.LOBBY:
                    //calculate pos + size
                    var lobbyScene = sceneMgr.getScene(GV.SCENE_IDS.LOBBY);
                    var nodeSafeBox = lobbyScene.nodeSafeBox;
                    var lbGameInfo = lobbyScene.lbInfoGame;
                    var posSafeBox = nodeSafeBox.getParent().convertToWorldSpace(nodeSafeBox);
                    var posInfo = lbGameInfo.getParent().convertToWorldSpace(lbGameInfo);

                    var posLeft = cc.p(posInfo.x + lbGameInfo.width*lbGameInfo.getScaleX(),posInfo.y);
                    var posRight = cc.p(posSafeBox.x - 40, posSafeBox.y);
                    //DrawNode(lobbyScene.getLayer(GV.LAYERS.EFFECT),posLeft);
                    //DrawNode(lobbyScene.getLayer(GV.LAYERS.EFFECT),posRight);
                    sizeWidth = cc.pDistance(posLeft,posRight)-15;
                    if(sizeWidth > this._visibleSize.width) sizeWidth = this._visibleSize.width;
                    posX =  (posLeft.x + posRight.x)/2;
                    posY = GV.VISIBALE_SIZE.height * 0.92;
                    break;
                default:
                    break;
            }
            /*switch (curSceneId){
                case GV.SCENE_IDS.TABLE:
                    //calculate pos + size
                    sizeWidth = GV.VISIBALE_SIZE.width/2 - curScene.bgJackpot.width/2 - curScene.btnMenu.width;
                    posX = GV.VISIBALE_SIZE.width - curScene.btnMenu.width - sizeWidth/2 -15;
                    posY = GV.VISIBALE_SIZE.height - this._visibleSize.height* 1.1;
                    break;
                case GV.SCENE_IDS.LIST_TABLES:
                    //calculate pos + size
                    //btnRefreshListTable
                    //btnCreateTable
                    var posBtnSearch = curScene.btnRefreshListTable.getParent().convertToWorldSpace(curScene.btnRefreshListTable.getPosition());
                    var posBtnCreate = curScene.btnCreateTable.getParent().convertToWorldSpace(curScene.btnCreateTable.getPosition());
                    sizeWidth = cc.pDistance(posBtnSearch,posBtnCreate) - 30;
                    posX = posBtnSearch.x + sizeWidth/2;
                    sizeWidth = sizeWidth - curScene.btnRefreshListTable.width/2 - curScene.btnCreateTable.width/2;
                    break;
                //TODO add change position foreach scenes
                case GV.SCENE_IDS.LOBBY:
                    //calculate pos + size
                    //sizeWidth = this._visibleSize.width *1.4;
                    posX = GV.VISIBALE_SIZE.width * 0.48;//curScene.lbInfoGame.getParent().convertToWorldSpace(curScene.lbInfoGame.getPosition()).x - (curScene.lbInfoGame.width * curScene.lbInfoGame.getScaleX()) - 10 - this._visibleSize.width * 0.5;
                    posY = GV.VISIBALE_SIZE.height - this._visibleSize.height* 1.1;
                    break;
                default:
                    break;
            }*/
            this._mask.setScaleX(sizeWidth/ this._mask.getContentSize().width);
            this._container.setPosition(posX,posY);

            //DrawNode(curScene.getLayer(GV.LAYERS.CURSOR),this._container.getPosition());
            var layer = curScene.getLayer(GV.LAYERS.EFFECT);
            if (this._container.parent != layer) {
                this._container.removeFromParent(false);
                layer.addChild(this._container, 2);
            }
        }
    },

    _show: function(){
        if(this._pool.length > 0){
            this._updateParent();
            //this._container.setVisible(true);

            this._run(this._pool[0]);
        }
    },

    continue: function(){
        if(sceneMgr.isScene(GV.SCENE_IDS.LOADING) || sceneMgr.isScene(GV.SCENE_IDS.REGISTER_VIP)) return;

        this._container.setVisible(false);
        this._show();
    },

    hide: function(){
        this._container.setVisible(false);
    }
};