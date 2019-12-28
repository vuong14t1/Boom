/**
 * Created by MinhTrung on 11/1/2018.
 */
var RQuickPlay = cc.Class.extend({
    numOfCurrentPlayer:undefined,
    idMap:undefined,
    idRoom:undefined,
    characterDSGs:undefined,
    ctor:function(){
        this.characterDSGs = [];
    },
    setCurrentPlayer:function(num){this.numOfCurrentPlayer = num},
    setIdMap:function(id){this.idMap = id},
    setIdRoom:function(id){this.idRoom = id},
    addCharacterDSG:function(characterDSG) {
        this.characterDSGs.push(characterDSG);
    },

    getIdMap:function(){return this.idMap},
    getIdRoom:function(){return this.idRoom},
    getCharacterDSGs:function(){return this.characterDSGs},

});