
var CustomTableView = cc.TableView.extend({
    _className: "CustomTableView",
    _maxCell: 100,

    _cellSize: null,
    _cellClass: cc.TableViewCell,
    _cellConstructorArgs: null,

    _cbSizeForIndex: null,
    _cbUpdateData: null,
    _cbNumOfCells: null,
    _cbReachBottom: null,

    ctor: function (delegate, viewSize, direction) {
        direction = (direction == undefined) ? cc.SCROLLVIEW_DIRECTION_VERTICAL : direction;
        viewSize = (viewSize == undefined) ? cc.size(0, 0) : viewSize;
        this._data = [];
        this._super(this, viewSize);

        this.setDirection(direction);
        this.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.setDelegate(delegate);
    },

    localize: function() {
        var length = this.numberOfCellsInTableView();

        for(var i = 0; i < length; ++i){
            var cell = this.cellAtIndex(i);
            if(cell != null) cell.localize();
        }
    },

    setPosition: function(x, y){
        // adjust from center to anchor point (0, 0)
        this._super(x - (this.getViewSize().width >> 1), y - (this.getViewSize().height >> 1));

        return this;
    },

    reloadData: function(fromIndex){
        if(fromIndex === undefined) fromIndex = 0;

        var contentOffset = this.getContentOffset();
        if(this.getDirection() == cc.SCROLLVIEW_DIRECTION_VERTICAL){
            contentOffset.y = -(this.numberOfCellsInTableView() - fromIndex) * this.tableCellSizeForIndex().height + contentOffset.y;
            var numOfCellInView = Math.ceil(this.getViewSize().height / this.tableCellSizeForIndex().height);
        }
        else{
            contentOffset.x = -(this.numberOfCellsInTableView() - fromIndex) * this.tableCellSizeForIndex().width + contentOffset.x;
            numOfCellInView = Math.ceil(this.getViewSize().width / this.tableCellSizeForIndex().width);
        }

        this._super();
        if(numOfCellInView <= fromIndex){
            this.setContentOffset(contentOffset);
        }
    },

    setData: function(data, updateUI){
        if(data == null) return;
        if(updateUI === undefined) updateUI = true;

        this._data = data;
        if(updateUI) this.reloadData();

        return this;
    },

    appendData: function(data, updateUI){
        if(data == null) return;
        if(updateUI === undefined) updateUI = true;

        var prevLength = this._data.length;
        _.appendArray(this._data, data);
        this.reloadData(prevLength);

        return this;
    },

    getData: function(){
        return this._data;
    },

    setCellClass: function(clazz){
        this._cellConstructorArgs = arguments;

        return this;
    },

    getCellSize: function(){
        return this._cellSize;
    },

    setCellSize: function(size){
        this._cellSize = size;

        return this;
    },

    setTableCellSizeForIndex: function(callback){
        this._cbSizeForIndex = callback;

        return this;
    },

    setUpdateDataAtIndex: function (callback) {
        this._cbUpdateData = callback;

        return this;
    },

    setReachBottomCb: function (callback) {
        this._cbReachBottom = callback;

        return this;
    },

    setNumberOfCellsCb: function (callback) {
        this._cbNumOfCells = callback;

        return this;
    },

    setMaxCell: function(max){
        this._maxCell = max;

        return this;
    },

    getMaxCell: function(){
        return this._maxCell;
    },

    isReachBottom: function(idx){
        return (this.numberOfCellsInTableView() - 1) <= idx && idx < this.getMaxCell();
    },

    onReachBottom: function(idx){
        this._cbReachBottom && this._cbReachBottom(idx);
    },

    goToBottom: function(){
        var contentOffset = this.getContentOffset();
        contentOffset.y = 0;
        this.setContentOffset(contentOffset);
    },

    //====================================================================================
    // table view handler
    //====================================================================================

    tableCellSizeForIndex: function (table, idx) {
        table = (table === undefined) ? this : table;

        if(table._cbSizeForIndex)
            return table._cbSizeForIndex(idx);
        else
            return table._cellSize;
    },

    tableCellAtIndex: function (table, idx) {
        var cell = table.dequeueCell();
        if (cell == null) {
            cell = newObject.apply(null, table._cellConstructorArgs);
            cell.setCellSize && cell.setCellSize(table._cellSize);

            if(table.getDelegate && !cc.sys.isNative){
                cell.addHoverListener && cell.addHoverListener(table.getDelegate());
            }

            if(cell == null){
                ZLog.debug("tableCellAtIndex: null at " + idx);
                return new cc.TableViewCell();
            }
        }

        if(table._cbUpdateData){
            table._cbUpdateData(cell, idx);
        }
        else{
            cell.setData(table._data[idx], idx + 1);
        }

        if(table.isReachBottom(idx)){
            table.onReachBottom(idx);
        }

        return cell;
    },

    numberOfCellsInTableView: function (table) {
        table = (table === undefined) ? this : table;

        if(table._cbNumOfCells)
            return table._cbNumOfCells(table);
        else
            return table._data.length;
    },

});
