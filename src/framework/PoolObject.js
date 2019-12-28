/**
 * Created by KienVN on 5/23/2015.
 */

var PoolObject = cc.Class.extend({
    ctor:function(){
        this.poolObjects = {};
        this.maxInstance = 9999;
    },

    setMaxInstance: function(v){
        this.maxInstance = v
    },

    getMaxInstance: function(){
        return this.maxInstance;
    },

    get: function(objClass, arg){
        var obj = null;
        var pid = objClass.prototype.__pid;

        if (!pid) {
            var desc = { writable: true, enumerable: false, configurable: true };
            desc.value = ClassManager.getNewID();
            Object.defineProperty(objClass.prototype, '__pid', desc);
        }

        if(pid in this.poolObjects) {
            var listObjects = this.poolObjects[pid];
            if(listObjects.length > 0){
                obj = listObjects[0];
                listObjects.splice(0,1);
                //obj.release && obj.release();
                obj.reuse && obj.reuse(arg);
            }
        }

        if(obj == null) {
            if(arg != null) {
                obj = new objClass(arg);
            }
            else {
                obj = new objClass();
            }
        }

        return obj;
    },

    /**
     * add object want to pool
     * return false if can't pool => need to remove all clean
     * @param obj
     * @returns {boolean}
     */
    push: function(obj){
        var pid = obj.constructor.prototype.__pid;

        if (!pid) {
            var desc = { writable: true, enumerable: false, configurable: true };
            desc.value = ClassManager.getNewID();
            Object.defineProperty(obj.constructor.prototype, '__pid', desc);
        }

        // ignore this obj if length reach the limit
        if(this.poolObjects[pid] && this.poolObjects[pid].length >= this.maxInstance) return false;

        obj.retain && obj.retain();
        obj.unuse && obj.unuse();

        if(pid in this.poolObjects) {
            this.poolObjects[pid].push(obj);
        }
        else{
            var list = [];
            list.push(obj);
            this.poolObjects[pid] = list;
        }
        return true;
    }
});