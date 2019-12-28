/**
 * Created by MinhTrung on 3/23/2018.
 */
var ItemTest = BaseTableCell.extend({
    _className :"ItemTest",

    btn:null,
    _data:null,
    _callback:null,

    ctor:function(){
        this._super(res.node_cheat_item);
        this.syncAllChildren();

    },

    getData: function(){
        return this._data;
    },

    setData: function(data,index){
        this._data = data;
        if(data){
            this.btn.setTitleText(data.name);
        }
    },

    onTouchUIEndEvent:function(sender){
        if(_.isFunction(this._data.callback)){
            this._data.callback();
        }
    },
    cleanUp: function(){
        this.removeAllChildren();
        this.removeFromParent();
    },
    setAutoCheatTitle:function(title){
        this.btn.setTitleText(title);
    }
});