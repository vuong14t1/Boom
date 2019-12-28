var Mob = AnimatedEntity.extend({
    ctor: function (uiBoard) {
        this._super(uiBoard);
        this._direction = GameConst.DIRECTION.UP;
        this._alive = true;
        this._moving = false;
        this._timeAfter = 0;
    },

    update: function (dt) {
    },

    calculateMoving: function () {

    },

    move: function () {

    },

    kill: function () {},

    afterKill: function () {},

    canMove: function (x, y) {
    },


});