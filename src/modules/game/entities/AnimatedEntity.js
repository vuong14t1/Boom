var AnimatedEntity = Entity.extend({
    ctor: function () {
        this._super();
        this._animate = 0;
        this.MAX_ANIMATE = 2; //2s
    },

    animate: function (dt) {
        if(this._animate <= this.MAX_ANIMATE) {
            this._animate += dt;
        }else {
            this._animate = 0;
        }
    }
});