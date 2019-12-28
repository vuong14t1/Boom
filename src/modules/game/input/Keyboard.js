var Keyboard = cc.Class.extend({
    ctor: function (scene) {
        this._scene = scene;
        this._space = false;
        this._left = false;
        this._right = false;
        this._up = false;
        this._down = false;
        this.addEventListener();
    },

    addEventListener: function () {
        if( 'keyboard' in cc.sys.capabilities ) {
            // this.setKeyboardEnabled(true);
            var that = this;
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:  function(keyCode, event){
                    this.keyPressed(keyCode);
                }.bind(this),
                onKeyReleased: function(keyCode, event){
                    this.keyReleased(keyCode);
                }.bind(this)
            }, this._scene);
        }
    },

    keyPressed: function (keyCode) {
        switch (keyCode) {
            case cc.KEY.space:
                this._space = true;
                break;
            case cc.KEY.up:
                this._up = true;
                break;
            case cc.KEY.down:
                this._down = true;
                break;
            case cc.KEY.left:
                this._left = true;
                break;
            case cc.KEY.right:
                this._right = true;
                break;
        }
    },

    keyReleased: function (keyCode) {
        switch (keyCode) {
            case cc.KEY.space:
                this._space = false;
                break;
            case cc.KEY.up:
                this._up = false;
                break;
            case cc.KEY.down:
                this._down = false;
                break;
            case cc.KEY.left:
                this._left = false;
                break;
            case cc.KEY.right:
                this._right = false;
                break;
        }
    },


});