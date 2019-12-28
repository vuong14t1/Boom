/**
 * Created by CPU11015-local on 2/23/2018.
 */
CmdSendLobbyQuickPlay = BaseOutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(2);
        this.setCmdId(CMD.LOBBY_QUICK_PLAY);
    }
});


//CmdSendLobbyJoinRoom = BaseOutPacket.extend({
//    ctor:function(roomId)
//    {
//        this._super();
//        this.initData(2);
//        this.setCmdId(CMD.LOBBY_JOIN_ROOM);
//        this.roomId = roomId;
//    },
//    putData: function(){
//        this.putInt(this.roomId);
//    }
//});


//CmdSendLobbyCreateGame = BaseOutPacket.extend({
//    ctor:function(data)
//    {
//        this._super();
//        this._data = data;
//        this.initData(2);
//        this.setCmdId(CMD.LOBBY_CREATE_GAME);
//    },
//    putData: function(){
//        this.putInt(this._data.structureId);
//        this.putString(this._data.tableName);
//        this.putByte(this._data.maxPlayers);
//        this.putString(this._data.password);
//    }
//});
