/**
 * Created by MinhTrung on 10/3/2018.
 */
var CPositionTest = cc.Class.extend({
    ctor:function(){
        ZLog.debug("======CPositionTest=====");
        this.test1();
        this.test2();

        var i = 0;
        while(this["testAbsPosition" + i]!= null){
            this["testAbsPosition" + i]();
            i++;
        }

        i = 0;
        while(this["testMiddlePosition" + i]!= null){
            ZLog.debug("======CPositionTest=====" + "testMiddlePosition" + i);
            this["testMiddlePosition" + i]();
            i++;
        }
        ZLog.debug("======EndCPositionTest=====");
    },
    testAbsPosition0:function(){
        var cPos = new CPosition(1,1,5,5);
        var nPos = new CPosition(2,2,5,5);
        this.expect(GameUtils.getAbsCPosition(cPos,nPos) , 18);
    },
    testAbsPosition1:function(){
        var cPos = new CPosition(1,1,5,6);
        var nPos = new CPosition(2,2,5,5);
        this.expect(GameUtils.getAbsCPosition(cPos,nPos) , 17);
    },
    testAbsPosition2:function(){
        var cPos = new CPosition(1,1,1,6);
        var nPos = new CPosition(1,1,1,5);
        this.expect(GameUtils.getAbsCPosition(cPos,nPos) , 1);
    },
    testAbsPosition3:function(){
        var cPos = new CPosition(1,1,1,5);
        var nPos = new CPosition(1,1,1,6);
        this.expect(GameUtils.getAbsCPosition(cPos,nPos) , 1);
    },
    testAbsPosition4:function(){
        var cPos = new CPosition(1,1,1,5);
        var nPos = new CPosition(1,1,3,6);
        this.expect(GameUtils.getAbsCPosition(cPos,nPos) , 3);
    },
    testAbsPosition5:function(){
        var cPos = new CPosition(1,2,1,5);
        var nPos = new CPosition(1,1,1,7);
        this.expect(GameUtils.getAbsCPosition(cPos,nPos) , 7);
    },
    testAbsPosition6:function(){
        var cPos = new CPosition(1,1,1,5);
        var nPos = new CPosition(1,2,1,7);
        this.expect(GameUtils.getAbsCPosition(cPos,nPos) ,11);
    },
    testAbsPosition7:function(){
        var cPos = new CPosition(2,1,1,5);
        var nPos = new CPosition(1,2,1,7);
        this.expect(GameUtils.getAbsCPosition(cPos,nPos) ,20);
    },

    testMiddlePosition0:function(){
        var aPos        = new CPosition(1,1,5,5);
        var middlePos   = new CPosition(2,1,5,5);
        var bPos        = new CPosition(3,1,5,5);
        this.expect(GameUtils.isMiddleCPosition(aPos,middlePos,bPos) ,true);
    },
    testMiddlePosition1:function(){
        var aPos        = new CPosition(1,1,5,5);
        var middlePos   = new CPosition(2,1,5,5);
        var bPos        = new CPosition(3,2,5,5);
        this.expect(GameUtils.isMiddleCPosition(aPos,middlePos,bPos) ,false);
    },
    testMiddlePosition2:function(){
        var aPos        = new CPosition(1,1,5,5);
        var middlePos   = new CPosition(1,1,5,5);
        var bPos        = new CPosition(1,2,5,5);
        this.expect(GameUtils.isMiddleCPosition(aPos,middlePos,bPos) ,false);
    },
    testMiddlePosition3:function(){
        var aPos        = new CPosition(1,1,5,4);
        var middlePos   = new CPosition(1,1,5,5);
        var bPos        = new CPosition(1,2,5,5);
        this.expect(GameUtils.isMiddleCPosition(aPos,middlePos,bPos) ,true);
    },
    testMiddlePosition4:function(){
        var aPos        = new CPosition(1,2,5,4);
        var middlePos   = new CPosition(1,1,5,5);
        var bPos        = new CPosition(1,1,5,5);
        this.expect(GameUtils.isMiddleCPosition(aPos,middlePos,bPos) ,true);
    },
    testMiddlePosition5:function(){
        var aPos        = new CPosition(1,1,5,4);
        var middlePos   = new CPosition(6,1,5,5);
        var bPos        = new CPosition(8,1,5,5);
        this.expect(GameUtils.isMiddleCPosition(aPos,middlePos,bPos) ,false);
    },
    testMiddlePosition6:function(){
        var aPos        = new CPosition(1,1,5,5);
        var middlePos   = new CPosition(6,1,1,5);
        var bPos        = new CPosition(8,1,5,5);
        this.expect(GameUtils.isMiddleCPosition(aPos,middlePos,bPos) ,true);
    },
    test1:function(){
        var cPos = new CPosition(1,1,5,5);
        var nPos = new CPosition(2,2,5,5);
        this.expect(cPos.getOffset(nPos) , 18);
    },
    test2:function(){
        var cPos = new CPosition(1,1,5,5);
        var nPos = new CPosition(2,1,0,5);
        this.expect(cPos.getOffset(nPos), 6);
    },

    expect:function(data, value){
        if(data != value){
            ZLog.error(data +"\t" + value +"\t" + (data == value));
        }
    }
});