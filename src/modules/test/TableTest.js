/**
 * Created by MinhTrung on 3/23/2018.
 */
var TableTest = cc.Node.extend({
    _className :"TableTest",

    _dataCallBack:[
    ],
    _table:null,
    btn:null,

    ctor:function(){
        this._super();

        var self = this;
        this._table = new CustomTableView(this, cc.size(100, GV.VISIBALE_SIZE.height), cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._table
            .setPosition(80,-GV.VISIBALE_SIZE.height/2 + 15)
            .setCellClass(ItemTest, this)
            .setCellSize(cc.size(80, 40))
            .setUpdateDataAtIndex(function(cell, idx){
                cell.setData(self._dataCallBack[idx], idx + 1);
            })
            .setNumberOfCellsCb(function(){
                return self._dataCallBack.length;
            });
        this._table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this._table.setVisible(false);
        this.addChild(this._table);


        this.btn = new ItemTest();
        this.btn.setData({name:"Auto [Off]",callback:this.toggleTest.bind(this)});
        this.btn.setPosition(0,0);
        this.addChild(this.btn);
    },
    setAutoCheatTitle:function(title){
        this.btn.setAutoCheatTitle(title);
    },
    onEnter:function(){
        this._super();
        this._table.reloadData();
    },
    toggleTest:function(){
        this._table.setVisible(!this._table.isVisible());
    },

    addTestFunction:function(name,callback){
        var self = this;
        this._dataCallBack.push(
            {
                name:name,
                callback:function(){
                    self.toggleTest();
                    _.isFunction(callback) && callback();
                }
            });
        this._table.reloadData();
    }
});