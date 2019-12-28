/**
 * Created by MinhTrung on 9/18/2018.
 */
var UICharacterWaiting = BaseUINode.extend({
    imgAvatar:null,
    txtId:null,
    txtName:null,

    ctor:function(){
        this._super(res.node_lobby_character);
        //this.setDeepSyncChildren(2);
        this.syncAllChildren();
    },
    setId:function(id){
        if(id === undefined) {
            ZLog.error("fail to set id CharacterWaiting");
            this.txtId.setString("");
            return;
        }
        this.txtId.setString(id);
    },

    setName:function(name){
        this.txtName.setString(name);
    },


});