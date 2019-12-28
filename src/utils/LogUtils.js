/**
 * Created by bachbv on 2/23/2016.
 */

var ZLog = {
    isDebug: true,
    toFile:false,
    logToFile: fr.GsnClient.create(),
    fileToSaveLog:"C:/Users/CPU00000/Desktop/error/logError.txt",
    tempLog:'',
    debug: function(){
        if(this.isDebug){
            cc.log.apply(cc, arguments);
            if(this.toFile){this.tempLog += cc.formatStr.apply(cc, arguments) +"\n";}
            //this.toFile && this.logToFile.writeLogDebug(this.fileToSaveLog,cc.formatStr.apply(cc, arguments) +"\n");
        }
    },
    
    error: function () {
        if(this.isDebug){
            cc.error.apply(cc, arguments);
            if(this.toFile){this.tempLog +="ERROR: " + cc.formatStr.apply(cc, arguments) +"\n";}
            //this.toFile && this.logToFile.writeLogDebug(this.fileToSaveLog,"ERROR :  " + cc.formatStr.apply(cc, arguments) +"\n");
        }
    },

    json:function(obj){
        if(this.isDebug){
            for (var i in arguments) {
                if(typeof arguments[i] == "object"){
                    arguments[i] ="\n----------------------------\n"+
                                  JSON.stringify(arguments[i],null,8)+
                                  "\n----------------------------\n"
                }
            }
            cc.log.apply(cc, arguments);
        }
    },

    getKey:function(obj,value){
        var keys = Object.keys(obj);
        for (var key in keys) {
            if(obj[keys[key]] == value){
                return keys[key];
            }
        }
        return null;
    },

    autoWriteLogToFile:function(){
        if( !ZLog.toFile) return;
        TaskMgr.Instance.addTask(function(){
            ZLog.toFile && ZLog.logToFile.writeLogDebug(ZLog.fileToSaveLog,ZLog.tempLog);
            ZLog.tempLog = '';
            return false;
        },TaskMgrKey.WRITE_LOG_TO_FILE,ONE_SECOND)
    }
};
var ZLogger = cc.Class.extend({
    priority:2,
    name:"",
    debug:function(){
        if(this.priority >= ZLogger.basePriority){
            if(arguments[0] != null){
                arguments[0] = Utility.getClientTime() +"-"+this.name +"\t" + arguments[0];
            }
            ZLog.debug.apply(ZLog,arguments);
        }
    },
    error: function () {
        //if(this.priority >= ZLogger.basePriority)
        {
            if(arguments[0] != null){
                arguments[0] = this.name +"\t" + arguments[0];
            }
            ZLog.error.apply(ZLog,arguments);
        }
    },
    setName:function(name){
        this.name = name;
        return this;
    },
    setPriority:function(priority){
        //if(priority < ZLogger.basePriority){
        //    //ZLog.error("=============Disable Logger:%s %d ====================",this.name,priority);
        //}
        this.priority = priority;
    }
});
ZLogger.basePriority = 1;
ZLogger.container = {};
ZLogger.disableClazz = [
    //MGameModule,
    //MGameLogic,
    //MEntity,
    //MStateSync,
    //EMyCharacter,
    //ECharacter,
    //CPosition,
    //SSnapshots,
    //EItemBlock,
    //UIBom,
    //EBlock,
    //EBom
];

/**
 *
 * @param clazz
 * @returns {*|ZLogger}
 */
ZLogger.getLog = function(clazz){
    var pid,log,name;
    if(typeof clazz === "function"){
        pid = clazz.prototype.__pid;
        name = clazz.prototype.name;
    }
    if(typeof clazz === "object"){
        pid = clazz.__pid;
        name = clazz.name;
    }

    log = ZLogger.container[pid];
    if(log == null){
        log = new ZLogger();
        if(typeof clazz === "object"){
            if(_.includes(ZLogger.disableClazz,clazz.constructor)){
                log.setPriority(ZLogger.basePriority - 1);
            }
        }
        log.setName(name);
        ZLogger.container[pid] = log;
    }
    return log;
};