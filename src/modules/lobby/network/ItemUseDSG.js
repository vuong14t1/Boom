/**
 * Created by MinhTrung on 11/1/2018.
 */
var ItemUseDSG = cc.Class.extend({
    id:undefined,
    useGold:undefined,
    success:undefined,
    ctor:function(id){
        this.id = id;
        this.useGold = false;
        this.success = false;
    },
    /**
     *
     * @returns {GameConfig.ITEM.*}
     */
    getId:function(){
        return this.id;
    },
    isSuccess:function(){
        return this.success;
    },

    setUseGold:function(b){
        this.useGold = b;
    },

    isUseGold:function(){
        return this.useGold;
    },
    setSuccess:function(b){
        this.success = b;
    }
});