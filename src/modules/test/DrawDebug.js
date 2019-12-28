/**
 * Created by MinhTrung on 9/11/2018.
 */
var DrawNode = function(obj, pos,color) {
    //return;
    color = color || cc.color.RED;
    var node = new cc.DrawNode();
    node.drawDot(pos,1, color);
    _.delay(function () {
        node.removeFromParent(true);
    }, 2000);
    obj.addChild(node, 999);

};
var DrawBoder = function(obj, posBottomLeft, posTopRight,color) {
    //return;
    color = color || cc.color.RED;
    var drawNode = new cc.DrawNode();
    var lineWidth = 1;
    drawNode.drawSegment(cc.p(posBottomLeft.x,posBottomLeft.y), cc.p(posBottomLeft.x,posTopRight.y),lineWidth,color); //|
    drawNode.drawSegment(cc.p(posBottomLeft.x,posTopRight.y), cc.p(posTopRight.x,posTopRight.y),lineWidth,color); //```
    drawNode.drawSegment( cc.p(posTopRight.x,posTopRight.y), cc.p(posTopRight.x,posBottomLeft.y),lineWidth,color);//   |
    drawNode.drawSegment(cc.p(posTopRight.x,posBottomLeft.y),cc.p(posBottomLeft.x,posBottomLeft.y),lineWidth,color);//_
    //drawNode.drawSegment(posBottomLeft, posTopRight,lineWidth,cc.Color(250,0,0,255));
    obj.addChild(drawNode, 999);

};

var DrawCircle = function(obj,pos,radius,color) {
    color = color || cc.color.RED;
    radius = radius || 20;
    var drawNode = new cc.DrawNode();
    var lineWidth = 1;
    drawNode.drawCircle(pos,radius,0,100,true,0,0,color); //|
    obj.addChild(drawNode, 999);
};
