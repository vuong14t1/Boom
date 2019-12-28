/**
 * Created by bachbv on 1/26/2016.
 */

fr.Avatar = cc.Node.extend({

    ctor: function (url, size) {
        this._super();
        this.isSocialAvatar = url.indexOf("http") >= 0;
        this.callback = null;

        this.setCascadeOpacityEnabled(true);

        if(this.isSocialAvatar){
            this.defaultAvatar = new cc.Sprite(res.avatar_default);
        }
        else{
            this.defaultAvatar = new cc.Sprite(res[url]);
        }

        this.defaultAvatar.setPosition(0, 0);
        this.defaultAvatar.setCascadeOpacityEnabled(true);
        this.defaultAvatar.setScaleX(size.width / this.defaultAvatar.getContentSize().width);
        this.defaultAvatar.setScaleY(size.height / this.defaultAvatar.getContentSize().height);
        this.defaultAvatar.setCascadeOpacityEnabled(true);

        this.addChild(this.defaultAvatar);

        if(cc.sys.isNative) {
            this.avatar = fr.AsyncSprite.create(size, this.onFinishLoad.bind(this));
            this.addChild(this.avatar);
        }
        else {
            this.avatar = null;
        }

        this.updateAvatar(url);

        return true;
    },

    updateAvatar:function(url) {
        this.defaultAvatar.setVisible(true);
        if(this.avatar)
            this.avatar.setVisible(false);

        if(this.isSocialAvatar){
            if(cc.sys.isNative)
                this.avatar.updatePath(url.replace("https:", "http:"),this.getStorePath(url));
            else {
                cc.textureCache.addImageAsync(url, function(texture) {

                    this.avatar = new cc.Sprite(texture);
                    this.addChild(this.avatar);

                    this.avatar.setScaleX(this.size.width / this.avatar.getContentSize().width);
                    this.avatar.setScaleY(this.size.height / this.avatar.getContentSize().height);
                    this.defaultAvatar.setVisible(false);
                    this.avatar.setVisible(true);
                }.bind(this), this);
            }
        }
    },

    setSprite: function(url){
        this.isSocialAvatar = url.indexOf("http") >= 0;

        if(this.isSocialAvatar){
            this.updateAvatar(url);
        }
        else{
            this.defaultAvatar.setVisible(true);
            this.avatar.setVisible(false);

            this.getSprite().setTexture(res[url]);
        }
    },

    getSprite: function(){
        if(this.isSocialAvatar){
            return this.avatar;
        }
        else{
            return this.defaultAvatar;
        }
    },

    onFinishLoad:function(result) {
        if(result) {
            this.defaultAvatar.setVisible(false);
            this.avatar.setVisible(true);
        }
        else
        {
            this.defaultAvatar.setVisible(true);
            this.avatar.setVisible(false);
        }
    },

    getStorePath:function(url) {
        if(PlatformUtils.isIOs()){
            return jsb.fileUtils.getWritablePath() + CryptoJS.MD5(url);
        }
        else{
            return fr.NativeService.getFolderUpdateAssets() +"/" + CryptoJS.MD5(url);
        }
    }
});

fr.CircleAvatar = cc.Node.extend({

    ctor: function (url, originalSize, size) {
        this._super();
        this.callback = null;
        this.originalSize = originalSize;
        this.size = size || originalSize;
        this.clippingAvatar = null;
        this.setCascadeOpacityEnabled(true);

        this.setSprite(url);
        return true;
    },

    /**
     *
     * @param fileName {String}
     */
    setAvatarBorder: function(fileName){
        if(this.imgBorder == null){
            this.imgBorder = new cc.Sprite();
            this.addChild(this.imgBorder, 3);
        }

        if(fileName.indexOf("#") >= 0){
            this.imgBorder.setSpriteFrame(fileName.replace("#", ""));
        }
        else{
            this.imgBorder.setTexture(fileName);
        }

        this.imgBorder.setScaleX(this.size.width / this.originalSize.width);
        this.imgBorder.setScaleY(this.size.height / this.originalSize.height);
    },

    getListener: function(){
        return this.avatarListener;
    },

    /**
     *
     * @param callback {Function}
     */
    addTouchAvatarListener: function(callback){
        this.callback = callback;

        this.avatarListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                return cc.rectContainsPoint(rect, locationInNode);
            },
            onTouchEnded: function (touch, event) {
                callback && callback();
            }
        });

        cc.eventManager.addListener(this.avatarListener, this.getSprite());
    },

    /**
     *
     * @param url
     * @private
     */
    _updateAvatar:function(url) {
        this.defaultAvatar.setVisible(true);
        if(this.clippingAvatar) this.clippingAvatar.setVisible(false);

        if(this.isSocialAvatar){
            if(cc.sys.isNative)
                this.avatar.updatePath(url, this.getStorePath(url));
            else {
                //if(url.indexOf('avatar.talk.zdn.vn') != -1) {
                //    url = "https://crossorigin.me/"+url;
                //}
                //cc.loader.loadImg(url.replace("https:", "http:"), {isCrossOrigin: true} ,function(err, img) {
                //    if(err) {
                //        ZLog.error("Cant load avatar");
                //        return;
                //    }
                //    if(this.avatar != null) {
                //        this.avatar.removeFromParent();
                //    }
                //    this.avatar = new cc.Sprite(img);
                //    this.avatar.setScaleX(this.size.width / this.avatar.width);
                //    this.avatar.setScaleY(this.size.height / this.avatar.height);
                //
                //    this.clippingAvatar = Utility.makeCircleAvatar(this.avatar, this.size);
                //    this.clippingAvatar.setCascadeOpacityEnabled(true);
                //    this.addChild(this.clippingAvatar);
                //
                //    var sprite = this.clippingAvatar.getChildByName("sprite");
                //    sprite.setScaleX(this.size.width / sprite.width);
                //    sprite.setScaleY(this.size.height / sprite.height);
                //
                //    this.defaultAvatar.setVisible(false);
                //    this.clippingAvatar.setVisible(true);
                //}.bind(this), this);
            }
        }
    },

    onFinishLoad:function(result) {
        if(result) {
            this.defaultAvatar.setVisible(false);
            this.clippingAvatar.setVisible(true);

            // re-children
            var children = this.defaultAvatar.getChildren();
            for(var i = 0, length = this.defaultAvatar.getChildren().length; i < length; ++i){
                if(children[i].getName() == 'sprite') continue;

                Utility.switchParent(children[i], this.clippingAvatar);
            }

            var sprite = this.clippingAvatar.getChildByName("sprite");
            sprite.setScaleX(this.size.width / sprite.width);
            sprite.setScaleY(this.size.height / sprite.height);
        }
        else
        {
            this.defaultAvatar.setVisible(true);
            this.clippingAvatar.setVisible(false);
        }
    },

    getStorePath:function(url) {
        if(PlatformUtils.isIOs() || PlatformUtils.isWinPhone()){
            return jsb.fileUtils.getWritablePath() + CryptoJS.MD5(url);
        }
        else{
            //ZLog.debug("getStorePath: \n -%s \n- %s", url,  fr.NativeService.getFolderUpdateAssets() +"/" + CryptoJS.MD5(url));
            return fr.NativeService.getFolderUpdateAssets() +"/" + CryptoJS.MD5(url);
        }
    },

    resize: function(newSize){
        if(this.originalSize == null) return;

        this.size = newSize;
        var stencilDefault = this.defaultAvatar.getStencil();
        var rateScaleX = newSize.width / this.originalSize.width;
        var rateScaleY = newSize.height / this.originalSize.height;

        stencilDefault.setScaleX(rateScaleX);
        stencilDefault.setScaleY(rateScaleY);

        if(cc.sys.isNative) {
            var stencilAvatar = this.clippingAvatar.getStencil();
            var sprite = this.clippingAvatar.getChildByName("sprite");
            sprite.setContentSize(newSize);
            sprite.setScaleX(rateScaleX);
            sprite.setScaleY(rateScaleY);

            stencilAvatar.setScaleX(rateScaleX);
            stencilAvatar.setScaleY(rateScaleY);
        }

        this.imgBorder.setScaleX(rateScaleX);
        this.imgBorder.setScaleY(rateScaleY);
    },

    setSprite: function(url){
        if(url === undefined || url.length == 0) {
            url = "avatar_default";
        }
        this.isSocialAvatar = url.indexOf("http") >= 0;

        if(this.defaultAvatar == null){
            this.defaultAvatar = Utility.makeCircleAvatar(new cc.Sprite(res.avatar_default), this.size);
            this.defaultAvatar.setCascadeOpacityEnabled(true);
            this.addChild(this.defaultAvatar, 1);
        }

        if(this.isSocialAvatar){
            if(this.avatar == null){
                this.avatar = fr.AsyncSprite.create(this.size, this.onFinishLoad.bind(this));
                this.clippingAvatar = Utility.makeCircleAvatar(this.avatar, this.size);
                this.clippingAvatar.setCascadeOpacityEnabled(true);
                this.addChild(this.clippingAvatar, 2);
            }
            // re-children fix cho truong hop co avatar oy ==> sau do cap nhat lai avatar moi
            var children = this.clippingAvatar.getChildren();
            for(var i = 0, length = this.clippingAvatar.getChildren().length; i < length; ++i){
                if(children[i].getName() == 'sprite') continue;
                Utility.switchParent(children[i], this.defaultAvatar);
            }
            this._updateAvatar(url);
        }
        else{
            this.defaultAvatar.setVisible(true);
            this.clippingAvatar && this.clippingAvatar.setVisible(false);
            if(this.clippingAvatar){
                // re-children ==> fix cho truong hop co avatar oy ==> sau do cap nhat lai default
                var children = this.clippingAvatar.getChildren();
                for(var i = 0, length = this.clippingAvatar.getChildren().length; i < length; ++i){
                    if(children[i].getName() == 'sprite') continue;
                    Utility.switchParent(children[i], this.defaultAvatar);
                }
            }
            this.defaultAvatar.getChildByName("sprite").setTexture(res[url] ? res[url] : url);
        }
    },

    getSprite: function(){
        if(this.isSocialAvatar){
            return this.clippingAvatar.getChildByName("sprite");
        }
        else{
            return this.defaultAvatar.getChildByName("sprite");
        }
    },
});
