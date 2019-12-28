/**
 * Created by CPU11015-local on 1/17/2018.
 */
var DataPlayer = function(){
    this.uId = null;
    this.uName = null;
    this.displayName = null;
    this.uAvatar = null;
    this.gold = null;
    this.level = null;
    this.levelExp = null;
    this.isPlaying = null;
    this.serverTime = null;
    this.createdTime = null;
    this.hearts = 0;
    this.recoveryTimeHeart = 0;
};

/**
 *
 * @param inPack
 * @returns {DataPlayer}
 */
DataPlayer.unPack = function(inPack){
    var player = new DataPlayer();
    player.uId          = inPack.getInt();
    player.uName        = inPack.getString();
    player.displayName  = inPack.getString();
    player.hearts       = inPack.getInt();
    player.gold         = inPack.getLong();
    player.level        = inPack.getInt();
    player.levelExp     = inPack.getLong();
    player.isPlaying    = inPack.getByte();
    player.uAvatar      = inPack.getString();
    player.uDefaultAvatar = inPack.getString();
    player.serverTime   = inPack.getLong();
    player.createdTime  = inPack.getLong();
    player.recoveryTimeHeart  = inPack.getLong();
    return player;
};
