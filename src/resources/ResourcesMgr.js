/**
 * Created by VitaminB on 7/12/2015.
 */

var ResourcesMgr = cc.Class.extend({

    ctor: function(){
        this._jsonsLoaded = {};
        this._plistsLoaded = {};
        this._nodesJsonLoaded = {};
    },

    getJson: function(key){
        if(this._jsonsLoaded[key]){
            return this._jsonsLoaded[key];
        }
        else{
            ZLog.error("---> " + key + " is not exist or not loaded yet");
        }
    },

    _loadJsonListFromJson: function(data, callback){
        if(data){
            var self = this;

            var counter = 0;
            var length = data.length;
            _.forEach(data, function(item){
                item = cc.loader.resPath + item ;
                cc.loader.loadJson(item, function(err, data){
                    ++counter;

                    if(!err){
                        ZLog.debug("---> loaded success " + item);
                        var fileName = Utility.getFileName(item);
                        self._jsonsLoaded[fileName] = data;

                        // update the json file name for res
                        res_jsons[fileName] = fileName;
                    }else{
                        ZLog.error("----> load failed " + item);
                    }

                    if(counter == length){
                        ZLog.debug("--------------> FINISH LOADING JSON LIST <-------------- ");
                        callback && callback();
                    }
                });
            });
        }else{
            ZLog.error("----> jsonList error");
        }
    },

    loadJsonList: function(callback){
        var self = this;
        ZLog.debug("--------------> START LOADING JSON LIST <-------------- ");
        cc.loader.loadJson(cc.loader.resPath + GV.RES_JSON_LIST, function(err, data){
            if(!err){
                ZLog.debug("******** load success " + GV.RES_JSON_LIST);
                self._loadJsonListFromJson(data, callback);
            }else{
                ZLog.error("******** load failed " + GV.RES_JSON_LIST);
                callback && callback();
            }
        });
    },

    loadPlist: function(fileName){
        if(!this._plistsLoaded.hasOwnProperty(fileName)){
            this._plistsLoaded[fileName] = true;

            ZLog.debug('load plist: ' + fileName);
            cc.spriteFrameCache.addSpriteFrames(fileName);
        }
    },

    unloadPlist: function(fileName){
        if(this._plistsLoaded.hasOwnProperty(fileName)){
            delete this._plistsLoaded[fileName];
            cc.spriteFrameCache.removeSpriteFramesFromFile(fileName);
        }
    },

    getConfigTable: function(tableKey){
        return resourceMgr.getJson(res_jsons.Tables)['tables']['table_' + tableKey];
    },

    getConfigLevel: function(level){
        return resourceMgr.getJson(res_jsons.Level)['Level'][level];
    },

    getConfigRookieQuest: function(day){
        if(day == null) return resourceMgr.getJson(res_jsons.Quest)['Rookie'];
        return resourceMgr.getJson(res_jsons.Quest)['Rookie'][day];
    },

    getConfigMaxLevel: function(){
        return 500;
    },

    getConfigAllTableCashGame: _.memoize(function(){
        //ZLog.debug("getConfigAllTableCashGame");
        var gameStructures = resourceMgr.getJson(res_jsons.Channels)['GameStructures'];
        var allChannels = resourceMgr.getConfigAllChannelCashGame();
        var result = [];

        for(var key in gameStructures){
            var channel = resourceMgr.getConfigChannelByStructureId(key);
            var available = false;
            for(var i in allChannels){
                if(channel == allChannels[i].channelId){
                    available = true;
                    break;
                }
            }

            if(available) {
                gameStructures[key].structureId = key;
                result.push(gameStructures[key]);
            }
        }

        //var arrTable = _.map(gameStructures, function(structure, key){
        //    structure.structureId = key;
        //    return structure;
        //});

        return _.orderBy(result, ['buyInMin'], ['asc']);
    }),

    getConfigNotification: function(notificationKey){
        return resourceMgr.getJson(res_jsons.Notifications)['Notifications'][notificationKey];
    },

    getConfigAllChannelCashGame: _.memoize(function(){
        //ZLog.debug("getConfigAllChannelCashGame");
        var jsonChannel = resourceMgr.getJson(res_jsons.Channels)['Channels'];

        var arrChannel = _.map(jsonChannel, function(channelConfig, key){
            channelConfig.channelId = key;
            return channelConfig;
        });

        return _.filter(arrChannel, function(o){
            return o.available;
        });
    })
});

var res_jsons = {
    AutoTesting:"",

    Notifications:"",
    MoneyCardScore:"",
    Channels: "",
    Tables:"",
    Level: "",

    VIP: "",
    Quest: "",

    Operators: '',
    CardGoldPack: '',
    GoldPack: '',
    InAppPurchase: "",
    PS:"",
    Once: "",
    SafeBox: "",

    Game:"",
    Map:""
};
