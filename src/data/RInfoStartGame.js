/**
 * Created by MinhTrung on 11/1/2018.
 */
var RInfoStartGame = cc.Class.extend({
    timeStart:undefined,
    /**@type {CharacterDSG[]}*/
    infoCharacterDSGs:undefined,
    ctor:function(){
        this.infoCharacterDSGs = [];
    },
    
    setTimeStart:function(time){
        this.timeStart = time;
    },
    addCharacterDSG:function(character){
        this.infoCharacterDSGs.push(character);
    },

    getTimeStart:function(){return this.timeStart},
    /**
     *
     * @returns {CharacterDSG[]}
     */
    getCharacterDSGs:function(){return this.infoCharacterDSGs}

});