/**
 * Created by bachbv on 11/27/2015.
 */

BaseInPacket = fr.InPacket.extend({
    getLong: function() {
        return parseInt(this._super());
    }
});

BaseOutPacket = fr.OutPacket.extend({
    put_byte: function(value){
        this.putByte(value);
    }
});

BaseOutBaseCmd = BaseOutPacket.extend({
    ctor:function(cmd)
    {
        this._super();
        this.initData(2);
        this.setCmdId(cmd);
    }
});