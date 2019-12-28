
(function(global){
    // custom gsn base framework
    global.fr = global.fr || {};
    if(global.fr.hasOwnProperty('OutPacket')){
        global.fr.OutPacket.extend = cc.Class.extend;
        global.fr.InPacket.extend = cc.Class.extend;
    }

    // custom pure ES5
    String.prototype.insertAt = function(index, subStr){
        if(index > 0){
            return this.substring(0, index) + subStr + this.substring(index);
        }
        else{
            return subStr + this;
        }
    };

    Math.zFloor = function(number){
        return ~~(number + .0000001);
    };

    Number.prototype.round = function(places){
        return parseFloat(this.toFixed(places));
        //return +(Math.round(this +"e+" + places) + "e-" + places);
    };

    // custom cocos2d-x
    global.ccui = global.ccui || {};
    if(global.ccui.hasOwnProperty('Button')){
        global.ccui.Button.prototype.enable = function(){
            this.setTouchEnabled(true);
            Filter.normalShader(this);
        };

        /**
         *
         * @param sepia
         */
        global.ccui.Button.prototype.disable = function(sepia){
            this.setTouchEnabled(false);

            if(sepia === undefined){
                Filter.grayShader(this);
            }
            else{
                Filter.sepiaShader(this, sepia);
            }
        };

        global.ccui.LoadingBar.prototype.setZPercent = function(percent){
            if(this.basePercent === undefined){
                var capInsets = this.getCapInsets();
                this.basePercent = Math.ceil(100 * (capInsets.x * 2 + capInsets.width) / this.getContentSize().width);
            }

            var basePercent = this.basePercent;

            if (0 < percent && percent < this.basePercent) percent = this.basePercent;
            if(percent > 100) percent = 100;

            this.setVisible(percent > 0);
            this.setPercent(percent);
        };

        global.ccui.LoadingBar.prototype._setZPercent = function(percent){
            this.setZPercent(percent);
        };

        global.ccui.LoadingBar.prototype.runPercent = function(from, to, duration, callback, callbackInterval){
            if(this.idInterval === undefined) this.idInterval = -1;
            if(this.uiPercent === undefined) this.uiPercent = 0;
            if(this.runPercentCb === undefined) this.runPercentCb = null;
            if(this.idInterval > -1) clearInterval(this.idInterval);

            this.uiPercent = from;
            this.runPercentCb = callback;

            var timeStep = 10;
            var numOfSteps = (duration * 1000) / timeStep;
            var percentStep = (to - from) / numOfSteps;
            this.idInterval = setInterval(function(){
                this.uiPercent += percentStep;
                this.setZPercent(this.uiPercent);
                callbackInterval && callbackInterval();

                if(this.uiPercent > to){
                    clearInterval(this.idInterval);
                    this.idInterval = -1;

                    callback && callback();
                    callback = null;
                    callbackInterval = null;
                }
            }.bind(this), timeStep);
        };

        global.ccui.Text.prototype.setZString = function(key, isUpperCase){
            if(isUpperCase === undefined) isUpperCase = false;
            this.setString(isUpperCase ? languageMgr.getString(key).toUpperCase() : languageMgr.getString(key));
        };

        global.ccui.Button.prototype.setZString = function(key){
            this.setTitleText(languageMgr.getString(key).toUpperCase());
        };
        global.ccui.Button.prototype.setTitleStroke = function(color,size){
            if(_.isString(color)){
                color = cc.color(color);
            }
            this.getTitleRenderer().enableStroke(color,size);
        };
        global.ccui.Button.prototype.setTitleShadow = function(color,xAxis,yAxis,blur){
            if(_.isString(color)){
                color = cc.color(color);
            }
            if(xAxis === undefined){ xAxis = 0}
            if(yAxis === undefined){ yAxis = 1}
            var size = cc.size(xAxis,yAxis);
            if(blur === undefined){ blur = 1}

            this.getTitleRenderer().enableShadow(color,size,blur);
        };
        global.ccui.PageView.prototype.canNextPage = function(){
            return this.getCurPageIndex() < this.getPages().length - 1;
        };

        global.ccui.PageView.prototype.canPrevPage = function(){
            return this.getCurPageIndex() > 0;
        };
    }

    var newObject = function(clazz){
        return new (clazz.bind.apply(clazz, arguments));
    };
}(this));

var newObject = function(clazz){
    return new (clazz.bind.apply(clazz, arguments));
};

var getCombinationsKOfN = function(src, k){
    if(k <= 0 || k > src.length) return [];

    var result = [], combIdx = [];
    var n = src.length;

    function nextComb(combIdx, k, n) {
        if (combIdx.length === 0) {
            for (var i = 0; i < k; ++i) {
                combIdx[i] = i;
            }
            return true;
        }

        i = k - 1; ++combIdx[i];

        while ((i > 0) && (combIdx[i] > n - k + i)) {
            --i; ++combIdx[i];
        }

        if (combIdx[0] > n - k) {
            // No more combinations can be generated
            return false;
        }

        for (i = i + 1; i < k; ++i) {
            combIdx[i] = combIdx[i-1] + 1;
        }

        return true;
    }

    var comb = [];
    while (nextComb(combIdx, k, n)) {
        for(var i = 0; i < combIdx.length; ++i){
            comb[i] = src[combIdx[i]];
        }
        result.push(comb.slice());
    }

    ZLog.debug("getCombinationsKOfN: %d of %d = %d", k, src.length, result.length);
    return result;
};