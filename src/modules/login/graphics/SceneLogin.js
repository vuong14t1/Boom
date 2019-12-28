/**
 * Created by bachbv on 11/24/2015.
 */

var SceneLogin = BaseScene.extend({
    _className: "SceneLogin",

    btnBack:null,
    ebLoginUsername: null,
    ebLoginPass: null,
    btnLogin: null,

    ctor: function(){
        this._super();

        this.init();
        this.addKeyboardListener(null,this.pressBackKeyEvent.bind(this));

    },

    init: function(){
        this._super();
        this.setDeepSyncChildren(2);
        this.syncAllChildren(res.scene_login, this.getLayer(GV.LAYERS.BG));

        this.doLayout(GV.VISIBALE_SIZE);

        this.ebLoginUsername.ignoreContentAdaptWithSize(true);
        this.ebLoginPass.ignoreContentAdaptWithSize(true);
        //this.ebLoginUsername.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        //this.ebLoginUsername.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);


        if(!servicesMgr.isEnableRegister()) {


        }
    },

    onEnter: function(){
        this._super();

        var uName = GV.MODE != BUILD_MODE.LIVE
            ? fr.UserData.getString(UserDataKey.SESSION_KEY + "_dev", "")
            : fr.UserData.getString(SocialName.ZAcc + UserDataKey.USER_NAME, "");
        var uPass = fr.UserData.getStringCrypt(SocialName.ZAcc + UserDataKey.PASSWORD, "");
        (uName.length > 0) && this.ebLoginUsername.setRealString(uName);
        (uPass.length > 0) && this.ebLoginPass.setRealString(uPass);

        // cheat
        GV.MODE != BUILD_MODE.LIVE && this.ebLoginUsername.setRealString(Date.now() % 10000);

        //call back from GUI Setting ==> move to login Zacc
        this.callbackOnEnter && this.callbackOnEnter();
        this.callbackOnEnter = null;
    },
    a:0,
    b:1,
    c:2,
    testFun:function(){
        this.a =1;
        this.b = 1;
        this.c = this.a + this.b;

        var a = 1;
        var b = 1;
        var c = b + a;
    },
    onEnterTransitionDidFinish:function() {
        this._super();

        var start = Utility.getClientTime();
        for(var i =0;i< 50; i ++){
            for(var j =0;j< 10; j ++){
                for(var k =0;k< 10000; k ++){
                    //var a = function(){
                    //    var a =1;
                    //    var b = 1;
                    //    var c = a + b;
                    //}
                    this.testFun && this.testFun();
                }

            }
        }
        var end = Utility.getClientTime();
        ZLog.debug("aaaaaaaa " +(end - start));
        //
        //var sp = new UIBomExplosion();
        //sp.setPosition(100,100);
        //sp.play(2,3,4,5);
        //this.getLayer(GV.LAYERS.EFFECT).addChild(sp);
        //ZLog.error(strftime('%Y%m%d%H%M',Utility.getClientTime()));
        //ZLog.error(Utility.getClientTime());

        //region TEST EFFECT
        //this.testAnimationCharacter();
        //this.testAnimationBricks();
        //this.testAnimationItem();
        //this.testAnimationBom();
        //this.testReduceMovement();
        //endregion
        //☺☻♥♦♣♠ $∞📩💣👟🗱①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ 💣	⓪

        //var oldOffset= -2493434300.5;
        //var newTime = 1543034771721;
        //var newClient = 1540541337427;
        //var newOffset = newClient - newTime;
        //oldOffset= Math.floor((oldOffset * 9 + newOffset) / 10);
        //ZLog.error(oldOffset);
        //if(Cheat.autoPlay) this.scheduleOnce(function(){this.onTouchUIEndEvent(this.btnLogin)}.bind(this),1);
        //this._animStun = new FBFAnimation("img_g_stun",4);
        //this._animStun.setPosition(200,200);
        //this._rootNode.addChild(this._animStun);
        //this._animStun.play();
        //this._animStun.stop();
        EntityBuilder.Instance.preLoadData();
        sceneMgr.getScene(GV.SCENE_IDS.GAME);
        ZLog.autoWriteLogToFile();

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan:function(touches,event){
                var s = '';
                for(var i in touches){
                    var touch = touches[i];
                    s += JSON.stringify(touch.getLocation());
                }
                ZLog.error("touch onTouchesBegan " + touches.length +"|" + s);
                return true;
            },
            onTouchesMoved:function(touches,event){
                var s = '';
                for(var i in touches){
                    var touch = touches[i];
                    s += JSON.stringify(touch.getLocation());
                }
                ZLog.error("touch onTouchesMoved: " + touches.length +"|" + s);
                return true;
            },
            onTouchesEnded:function(touches,event){
                var s = '';
                for(var i in touches){
                    var touch = touches[i];
                    s += JSON.stringify(touch.getLocation());
                }
                ZLog.error("touch onTouchesEnded " + touches.length +"|" + s);
                return true;
            },
            onTouchesCancelled:function(){
                ZLog.error("touch onTouchesCancelled");
                return true;
            }
        },this);
        //cc.eventManager.addListener({
        //    event:cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches:false,
        //    onTouchBegan:function(touch,event){
        //        var s = '';
        //        s += JSON.stringify(touch.getLocation());
        //        ZLog.error("touch onTouchBegan " + s);
        //        return true;
        //    },
        //    onTouchMoved:function(touch,event){
        //        var s = '';
        //        s += JSON.stringify(touch.getLocation());
        //        ZLog.error("touch onTouchMoved: " + s);
        //        return true;
        //    },
        //    onTouchEnded:function(touch,event){
        //        var s = '';
        //        s += JSON.stringify(touch.getLocation());
        //        ZLog.error("touch onTouchEnded " + s);
        //        return true;
        //    },
        //    onTouchCancelled:function(){
        //        ZLog.error("touch onTouchCancelled");
        //        return true;
        //    }
        //},this);
    },

    onTouchUIEndEvent: function (sender) {
        if(this._super()) return true;

        switch (sender) {
            case this.ebLoginPass:
            case this.ebLoginUsername:
                sceneMgr.showGUIEditBox(sender);
                break;
            case this.btnLogin:
                this.processLogin();
                break;
            case this.btnBack:
                this.processBack();
                break;
        }
    },

    onExit: function(){
        this._super();
        sceneMgr.removeScene(GV.SCENE_IDS.LOGIN);
        cc.textureCache.removeUnusedTextures && cc.textureCache.removeUnusedTextures();
    },

    localize: function(){
        this._super();

    },

    processLogin:function(){
        //sceneMgr.viewSceneById(GV.SCENE_IDS.SETTING_JOYSTICK);
        //return;
        if(Cheat.fakeData){
            Utility.setCurrentServerTime(Utility.getClientTime() - Cheat.rttTime);
            sceneMgr.viewSceneById(GV.SCENE_IDS.GAME_TEST);
            return;
        }
        switch (GV.MODE){
            case BUILD_MODE.DEV:
                this.loginOnDev();
                break;
            case BUILD_MODE.PRIVATE:
                this.loginOnDev();
                //this.loginOnPrivate();
                break;
            case BUILD_MODE.LIVE:
                this.loginOnLive();
                break;
        }
    },

    processBack:function(){
        var content = {text: languageMgr.getString("CONFIRM_EXIT_APP")};
        var listButtons = [
            {btnName: 'ok', hide: true, callback: function(){
                cc.director.end();
            }.bind(this)},
            {btnName: 'cancel', hide: true}
        ];
        Popups.show(content, listButtons);
    },

    loginOnDev:function(){

        var username = this.ebLoginUsername.getRealString();
        loginModule.setSessionKey(username); // is user name for dev
        fr.UserData.setString(UserDataKey.SESSION_KEY + "_dev", username);
        connector.connect();
        connectorUdp.connect();
    },

    loginOnPrivate:function(){
        var username = this.ebLoginUsername.getRealString();
        var password = this.ebLoginPass.getRealString();
        if(this.isValidInput(username,password)){
            fr.portal.login(
                SocialName.ZAcc,
                function(){

                },
                {username: username, password: password}
            );
        }
    },

    loginOnLive:function(){
        this.loginOnPrivate();
    },

    isValidInput:function(username,password){
        if(username.length == 0){
            Notifications.show("ERROR_USERNAME_EMPTY");
            return false;
        }
        else if(password.length == 0){
            Notifications.show("ERROR_PASSWORD_EMPTY");
            return false;
        }
        if(!usernameRegEx.test(username)){
            Notifications.show("ERROR_INVALID_USERNAME");
            return false;
        }
        if(!passwordRegEx.test(password)){
            Notifications.show("ERROR_INVALID_PASSWORD");
            return false;
        }
        return true;
    },

    pressBackKeyEvent:function(key,event){
        if(key == cc.KEY.back){
            if(Popups.isShowing()){
                Popups.hide();
            }else{
                this.processBack();
            }

        }
    },


    testAnimationCharacter:function(){
        var character = new UICharacter();
        character.setPosition(400,400);
        this.getLayer(GV.LAYERS.CURSOR).addChild(character);

        //region TEST MOVE
        var dir = GameConfig.DIR.NONE;
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:  function(keyCode, event){
                    ZLog.debug("press:" + ZLog.getKey(cc.KEY,keyCode));
                    if(keyCode == cc.KEY.up){
                        dir = GameConfig.DIR.UP;
                    } else if(keyCode == cc.KEY.down){
                        dir = GameConfig.DIR.DOWN;
                    } else if(keyCode == cc.KEY.left){
                        dir = GameConfig.DIR.LEFT;
                    } else if(keyCode == cc.KEY.right){
                        dir = GameConfig.DIR.RIGHT;
                    } else if (keyCode == cc.KEY.space){
                        dir = GameConfig.DIR.NONE;
                    }
                },
                onKeyReleased: function(keyCode, event){
                    ZLog.debug("release:" + ZLog.getKey(cc.KEY,keyCode));
                    //dir = GameConfig.DIR.NONE;
                }
            }, this);
        }

        this.schedule(function(){
            character.updateViewControl(dir);
        },0);
        //endregion

        //region TEST STATE
        //this.scheduleOnce(function(){
        //    character.enterStateUnavailable();
        //    this.scheduleOnce(function(){
        //        character.enterStateAvailable();
        //        this.scheduleOnce(function(){
        //            character.enterStateDying();
        //            this.scheduleOnce(function(){
        //                character.enterStateDied();
        //            },2);
        //        },2);
        //    },2);
        //},2);
        //endregion
    },

    testAnimationBricks:function(){
        var eItemBlock = new EItemBlock();
        eItemBlock.setState(new BlockStateExplosion());
        eItemBlock.getSprite().setPosition(100,100);
        this.getLayer(GV.LAYERS.CURSOR).addChild(eItemBlock.getSprite());
        this.schedule(function(dt){
            eItemBlock.update(dt);
            eItemBlock.render(dt*0.4);
        });

        //var brick = new UIItemBlock();
        //brick.setPosition(400,400);
        //this.getLayer(GV.LAYERS.CURSOR).addChild(brick);
        //brick.enterStateVisible();
        //
        //this.scheduleOnce(function(){
        //    brick.enterStateExploding();
        //    this.schedule(function(dt){
        //        brick.render(dt*0.1);
        //    });
        //    this.scheduleOnce(function(){
        //        brick.enterStateNone();
        //    },10)
        //},1)
    },

    testAnimationItem:function(){
        var itemBom = new UIItemSpeed();
        itemBom.setPosition(400,400);
        this.getLayer(GV.LAYERS.CURSOR).addChild(itemBom);

        //region Show get
        //this.scheduleOnce(function(){
        //    itemBom.enterStateVisible();
        //    this.scheduleOnce(function(){
        //        itemBom.enterStateAvailable();
        //        this.scheduleOnce(function(){
        //            itemBom.enterStatePlayerGet();
        //        },4)
        //    },2)
        //},2);
        //endregion

        //region Show explosion
        this.scheduleOnce(function(){
            itemBom.enterStateVisible();
            this.scheduleOnce(function(){
                itemBom.enterStateAvailable();
                this.scheduleOnce(function(){
                    itemBom.enterStateExplosion();
                },2)
            },2)
        },2);
        //endregion
    },

    testAnimationBom:function(){
        new CPositionTest();
        var ui = new UIBom();
        ui.setPosition(GV.VISIBALE_SIZE.width/2,GV.VISIBALE_SIZE.height/2);
        this.getLayer(GV.LAYERS.CURSOR).addChild(ui);

        //region Test STAte BOOM
        //this.scheduleOnce(function(){
        //    ui.enterStateWait();
        //    this.scheduleOnce(function(){
        //        ui.enterStateConfirm();
        //        this.scheduleOnce(function(){
        //            ui.enterStateWarning();
        //            this.scheduleOnce(function(){
        //                ui.enterStateExplosion(1,2,3,4);
        //
        //            },2)
        //        },2)
        //    },2)
        //},2);
        //endregion

        //region Explosion UIBomExplosion
        //this.scheduleOnce(function(){
        //    ui.play(1,2,3,4);
        //},2);
        //endregion
    },

    testTaskMgr:function(){

        //var state = false;
        //var value = 1;
        //TaskMgr.getInstance().addTask(function(){
        //    if(state == false){
        //        return false;
        //    }
        //    value ++;
        //    if(value >= 10){
        //        return true;
        //    }
        //    ZLog.debug("task 1 " + Utility.getClientTime());
        //    //state = true;
        //    return false;
        //},1,100);
        //TaskMgr.getInstance().addTask(function(){
        //    if(state == false){
        //        return false;
        //    }
        //    value ++;
        //    if(value >= 10){
        //        return true;
        //    }
        //    ZLog.debug("task 3 " + + Utility.getClientTime());
        //
        //    state = true;
        //    return false;
        //},3,200);
        //TaskMgr.getInstance().addTask(function(cb){
        //    ZLog.debug("task 5");
        //    state = true;
        //    return true;
        //},5);

        //cc.async.series([
        //    function(next){
        //        var count = 0;
        //        var myTimeOut = setTimeout(function(){
        //            ZLog.debug("func " + count);
        //            count ++;
        //            if(count > 10){
        //                clearTimeout(myTimeOut);
        //            }
        //        },1);
        //        ZLog.debug(next);
        //    },
        //    function(next){
        //        //while(1){
        //        //    ZLog.debug("func2");
        //        //}
        //        ZLog.debug("func2");
        //        //next();
        //    }
        //],
        //    function(func){
        //        ZLog.debug("done");
        //        func();
        //    }
        //);
    },

    testReduceMovement:function(){
        ZLog.error(GameUtils.isStraight(new CPosition(1,1,1,5),new CPosition(1,1,1,5),new CPosition(1,1,1,5)));
        var arr = [
            new CPosition(1,1,1,5),
            new CPosition(1,1,2,5),
            new CPosition(1,1,3,5),
            new CPosition(1,1,4,5),
            new CPosition(1,1,5,5),
            new CPosition(1,1,6,5),
            new CPosition(1,1,7,5),
            new CPosition(1,1,8,5),
            new CPosition(1,1,9,5),
            new CPosition(1,1,8,5),
            new CPosition(1,1,7,5),
            new CPosition(1,1,6,5),
            new CPosition(1,1,5,5),
            new CPosition(1,1,5,6),
            new CPosition(1,1,5,7),
            new CPosition(1,1,5,8),
            new CPosition(1,1,5,9)
        ];
        var arr1 = [
            new CPosition(1,1,1,5),
            new CPosition(1,1,2,5),
            new CPosition(1,1,1,5)
        ];
        var arr2 = [
            new CPosition(1,1,1,5),
            new CPosition(1,1,2,5)
        ];
        var arr3 = [
            new CPosition(1,1,1,5),
            new CPosition(1,1,1,5)
        ];
        var arr4 = [
            new CPosition(1,1,1,5),
            new CPosition(1,1,1,5),
            new CPosition(1,1,1,5),
            new CPosition(1,1,1,5)
        ];
        var arr5 = [
            new CPosition(1,1,1,5),
            new CPosition(1,1,2,5),
            new CPosition(1,1,2,5),
            new CPosition(1,1,3,5),
            new CPosition(1,1,4,5),
            new CPosition(1,1,5,5),
            new CPosition(1,1,6,5),
            new CPosition(1,1,7,5),
            new CPosition(1,1,6,5),
            new CPosition(1,1,5,5),
            new CPosition(1,1,5,6),
            new CPosition(1,1,5,7),
            new CPosition(1,1,5,8),
            new CPosition(1,1,5,9),
            new CPosition(1,2,5,1),
            new CPosition(1,2,5,2),
            new CPosition(1,2,5,3),
            new CPosition(1,2,5,4),
            new CPosition(1,2,5,5),
            new CPosition(1,2,6,5),
            new CPosition(1,2,7,5),
            new CPosition(1,2,8,5),
            new CPosition(1,2,7,5),
            new CPosition(1,2,6,5),
            new CPosition(1,2,5,5),
            new CPosition(1,2,5,4),
            new CPosition(1,2,5,3),
            new CPosition(1,2,5,2),
            new CPosition(1,2,5,3),
            new CPosition(1,2,5,4),
            new CPosition(1,2,5,5)
        ];
        var arr6 = [
            new CPosition(1,1,1,5),
            new CPosition(1,1,2,5),
            new CPosition(1,1,2,5),
            new CPosition(1,1,3,5),
            new CPosition(1,1,4,5),
            new CPosition(1,1,5,5),
            new CPosition(1,1,6,5),
            new CPosition(1,1,7,5),
            new CPosition(1,1,6,5),
            new CPosition(1,1,5,5),
            new CPosition(1,1,5,6),
            new CPosition(1,1,5,7),
            new CPosition(1,1,5,8),
            new CPosition(1,1,5,9),
            new CPosition(1,2,5,1),
            new CPosition(1,2,5,2),
            new CPosition(1,2,5,3),
            new CPosition(1,2,5,4),
            new CPosition(1,2,5,5),
            new CPosition(1,2,6,5),
            new CPosition(1,2,7,5),
            new CPosition(1,2,8,5),
            new CPosition(1,2,7,5),
            new CPosition(1,2,6,5),
            new CPosition(1,2,5,5),
            new CPosition(1,2,5,4),
            new CPosition(1,2,5,3),
            new CPosition(1,2,5,2),
            new CPosition(1,2,5,3),
            new CPosition(1,2,5,4),
            new CPosition(1,2,5,5),
            new CPosition(1,2,5,5),
            new CPosition(1,2,5,5),
            new CPosition(1,2,4,5)
        ];
        this.scheduleOnce(function(){
            //this.reduceMovement(arr);
            //this.reduceMovement(arr1);
            //this.reduceMovement(arr2);
            //this.reduceMovement(arr3);
            //this.reduceMovement(arr4);
            var start = Utility.getClientTime();
            GameUtils.reduceMovement(arr6);
            ZLog.error(Utility.getClientTime() - start);
            //this.reduceMovement(arr5);
        },3);
    },
});
