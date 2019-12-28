/**
 * Created by VitaminB on 3/24/2017.
 */

TimeoutMgr = {
    _timeoutListener: {intervalId: -1, delay: 2000, timeouts: {}},

    runTimeoutSchedule: function(){
        //ZLog.debug("!!! runTimeoutSchedule");
        this._timeoutListener.intervalId = setInterval(this.updateTimeoutSchedule.bind(this), this._timeoutListener.delay);
    },

    stopTimeoutSchedule: function(){
        //ZLog.debug("!!! stopTimeoutSchedule");
        if(this._timeoutListener.intervalId > 0){
            clearInterval(this._timeoutListener.intervalId);
            this._timeoutListener.intervalId = -1;
        }
    },

    updateTimeoutSchedule: function(){
        //ZLog.debug("!!! updateTimeoutSchedule");

        var isEmpty = true;
        for(var cmd in this._timeoutListener.timeouts){
            if(this._timeoutListener.timeouts[cmd] != null){
                this._timeoutListener.timeouts[cmd].update(this._timeoutListener.delay);

                if(this._timeoutListener.timeouts[cmd].isTimeout()){
                    this.removeTimeout(cmd);
                }
                else{
                    isEmpty = false;
                }
            }
        }

        if(isEmpty){
            this.stopTimeoutSchedule();
        }
    },

    addTimeout: function(key, deltaTime, callback){
        this._timeoutListener.timeouts[key] = {
            timeCreated: Utility.getServerTimeInSeconds(),
            deltaTime: deltaTime,
            callback: callback,
            isTimeout: function(){
                return this.deltaTime <= 0;
            },
            update: function(dt){
                this.deltaTime -= dt;

                if(this.isTimeout()){
                    this.callback && this.callback(this.timeCreated);
                    this.callback = null;
                }
            }
        };
        ZLog.debug("!!! " + key + " timeout after: " + (this._timeoutListener.timeouts[key].deltaTime / 1000) + "s | " + this._timeoutListener.timeouts[key].timeCreated);

        if(this._timeoutListener.intervalId < 0){
            this.runTimeoutSchedule();
        }
    },

    removeTimeout: function(key){
        if(this._timeoutListener.timeouts[key] != null){
            ZLog.debug("!!! " + key + " removed | " + this._timeoutListener.timeouts[key].timeCreated);
        }
        else ZLog.debug("!!! " + key + " removed | obj is null");

        this._timeoutListener.timeouts[key] = null;
    },

    removeTimeoutContains: function(key){
        for(var cmd in this._timeoutListener.timeouts){
            if(cmd.indexOf(key) >= 0){
                this.removeTimeout(cmd);
            }
        }
    },

    cleanUp: function(){
        this.stopTimeoutSchedule();

        for(var key in this._timeoutListener.timeouts){
            this._timeoutListener.timeouts[key] = null;
        }
    }
};