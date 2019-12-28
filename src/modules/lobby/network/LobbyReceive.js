/**
 * Created by Trunglm4 on 2/23/2018.
 */

CmdReceiveLobbyQuickPlay = BaseInPacket.extend({
    ctor: function () {
        this._super();
        this.rQuickPlay = new RQuickPlay();
    },

    readData: function () {
        if(this.getError() == ERROR_CODE.SUCCESS){
            this.rQuickPlay.setCurrentPlayer(this.getInt());
            this.rQuickPlay.setIdRoom(this.getLong());
            this.rQuickPlay.setIdMap(this.getInt());
            var length = this.getInt();
            for(var i =0 ; i < length ; i++){
                var character      = new CharacterDSG();
                character.setUId(this.getInt());
                character.setName(this.getString());
                character.setPositionPlayer(this.getInt());
                this.rQuickPlay.addCharacterDSG(character);
            }
        }
    }
});