/**
 * Created by CPU00000 on 4/17/2018.
 */
var LobbyResourceMgr =   ResourcesMgr.prototype;
LobbyResourceMgr.getConfigGameInfoByStructureId =function(structureId){
    return resourceMgr.getJson(res_jsons.Channels)['GameStructures'][structureId];
};
LobbyResourceMgr.getConfigGameInfoByLeastStructureId =function(){
    var listStructure = LobbyResourceMgr.getConfigGameStructure();
    for(var key in listStructure){
        return resourceMgr.getJson(res_jsons.Channels)['GameStructures'][key];
    }
};
LobbyResourceMgr.getConfigGameStructure = function(){
    return resourceMgr.getJson(res_jsons.Channels)['GameStructures'];
};
LobbyResourceMgr.getConfigInfoChannelById = function(channelId){
    return resourceMgr.getJson(res_jsons.Channels)['GameStructures'][channelId];
};
LobbyResourceMgr.getConfigChannelByChannelId = _.memoize(function(channelId){
    return resourceMgr.getJson(res_jsons.Channels)['Channels'][channelId];
});
LobbyResourceMgr.getConfigChannelByStructureId = function(structureId){
    return parseInt(structureId / 1000);
};
LobbyResourceMgr.getConfigChannel = function(){
    return resourceMgr.getJson(res_jsons.Channels)['Channels'];
};
LobbyResourceMgr.getConfigVip = function(){
    return resourceMgr.getJson(res_jsons.VIP)['VIPLevel'];
};
LobbyResourceMgr.getGoldNewAccount = function(){
    return resourceMgr.getJson(res_jsons.Once)['Once']['goldNewAccount'];
};
LobbyResourceMgr.getGoldLikeFanPage = function(){
    return resourceMgr.getJson(res_jsons.Once)['Once']['goldLikeFanPage'];
};
LobbyResourceMgr.getGoldRateApp = function(){
    return resourceMgr.getJson(res_jsons.Once)['Once']['goldRateApp'];
};
LobbyResourceMgr.findMaxChannelAvailable = function(){
    var listChannel = resourceMgr.getConfigChannel();
    for(var i = _.size(listChannel); i > 0 ; i--){
        if(listChannel[i]['available'] == 1){
            return i;
        }
    }
};
LobbyResourceMgr.getConfigStructureByStake = function(stake){
    if(_.isNaN(stake)) return;
    var gameStructure = LobbyResourceMgr.getConfigGameStructure();
    for(var key in gameStructure){
        if(gameStructure[key].stake == stake){
            return key;
        }
    }
    return;
};
LobbyResourceMgr.getJackpotGoldByChannel = function(channel){
    return resourceMgr.getJson(res_jsons.Channels)['Jackpot'][channel]
};