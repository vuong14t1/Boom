var Bound = Entity.extend({
    ctor: function () {
        this._super();
        this._instance = null;
    },



    collide: function (entity) {
        return true;
    },
});
Bound.getInstance = function ()  {
    if(this._instance == null) {
        this._instance = new Bound();
    }
    return this._instance;
};
