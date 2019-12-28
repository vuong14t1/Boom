/**
 * Created by bachbv on 1/10/2017.
 */

var Utility = Utility || {};
Utility.units = [
    {prefix: 'G', l: 12, div: 1000000000000},
    {prefix: 'B', l: 9, div: 1000000000},
    {prefix: 'M', l: 6, div: 1000000},
    {prefix: 'K', l: 4, div: 1000},
    {prefix: '', l: 3, div: 1}
];

Utility.getReflectionSymmetryX = function(vector){
    var nor = cc.pNormalize(vector);

    return cc.pMult(cc.p(nor.x, -nor.y), cc.pLength(vector));
},

Utility.getReflectionSymmetryY = function(vector){
    var nor = cc.pNormalize(vector);

    return cc.pMult(cc.p(-nor.x, nor.y), cc.pLength(vector));
},

Utility.intersectLineLine = function(a1, a2, b1, b2) {
    var result;

    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    //ZLog.debug("intersectLineLine: " + ua_t + " - " + ub_t + " - " + u_b);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;
        //console.log(ua + " - " + ub);

        //if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            result = {status: "Intersection", points: []};
            result.points.push(
                cc.p(
                    a1.x + ua * (a2.x - a1.x),
                    a1.y + ua * (a2.y - a1.y)
                )
            );
        //} else {
        //    result = new Intersection("No Intersection");
        //}
    } else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = {status: "Coincident", points: []};
        } else {
            result = {status: "Parallel", points: []};
        }
    }

    return result;
};

Utility.isScreenRatio = function(ratio){
    return (GV.VISIBALE_SIZE.width / GV.VISIBALE_SIZE.height) <= ratio;
};

Utility.checkCountryAvailable = function(strListCountry){
    if(_.isString(strListCountry)){
        if(strListCountry == '*') return true;
        var arrCountry = strListCountry.split(';');
        var curCountry = servicesMgr.getCountry();
        for(var i = 0; i < arrCountry.length; ++i){
            if(arrCountry[i] == curCountry) return true;
        }
    }

    return false;
};

Utility.getScreenRatio = function(){
    return GV.VISIBALE_SIZE.width / GV.VISIBALE_SIZE.height;
};

Utility.getCmdKey = function(cmd){
    for(var key in CMD){
        if(cmd === CMD[key]){
            return key;
        }
    }
};

Utility.convertPosition = function(pos, srcParent, dstParent){
    return dstParent.convertToNodeSpace(srcParent.convertToWorldSpace(pos));
};

Utility.switchParent = function(node, targetParent){
    if(node == null || targetParent == null) return;
    node.retain();
    node.setPosition(Utility.convertPosition(node.getPosition(), node.getParent(), targetParent));
    node.removeFromParent(false);
    targetParent.addChild(node);
    node.release();
};

Utility.attachLabelInButton = function(btn){
    if(btn && btn instanceof ccui.Button){
        // re-add child
        var children = btn.getChildren();

        if (cc.sys.isNative) {
            for (var i = 0; i < children.length; ++i) {
                if(children[i] instanceof ccui.Text || children[i] instanceof ccui.TextBMFont){
                    children[i].setPosition(Utility.convertPosition(children[i].getPosition(), btn, btn.getTitleRenderer()));
                    children[i].retain();
                    children[i].removeFromParent(false);
                    btn.getTitleRenderer().addChild(children[i]);
                    children[i].release();
                }
            }
        }
        else {
            var temp = [];
            var numChild = children.length;
            for (i = 0; i < numChild; i++) {
                if(children[0] instanceof ccui.Text){
                    temp.push(children[0]);
                    children[0].setPosition(Utility.convertPosition(children[0].getPosition(), btn, btn.getTitleRenderer()));
                    children[0].removeFromParent(false);
                    btn.getTitleRenderer().addChild(temp[i]);
                }
            }

            temp = null;
        }
    }
};

/**
 * modified anchor point and position to center
 * @param {cc.Node} node
 */
Utility.modifiedNodeToCenter = function(node, contentSize){
    if(node == null){
        return;
    }

    if(contentSize === undefined){
        contentSize = GV.VISIBALE_SIZE;
    }

    // 1. change anchor point
    node.setAnchorPoint(0.5, 0.5);
    // 2. change content size
    node.setContentSize(contentSize.width, contentSize.height);
    // 3. change position to center scene
    node.setPosition(GV.VISIBALE_SIZE.width / 2, GV.VISIBALE_SIZE.height / 2);
};

/**
 * get current time in milliseconds
 */
Utility.getClientTimeInMilliseconds = function(){
    return (new Date()).getTime();

};
Utility.getClientTime = function(){
    return (new Date()).getTime();
};

Utility.getClientTimeInSeconds = function(){
    return Math.round(Utility.getClientTime() / 1000);
};

Utility.setCurrentServerTime = function(time,clientTime){
    if(clientTime === undefined){
        clientTime = Utility.getClientTime();
    }
    if(Utility.getServerTime.offsetClientVsServer == 0){
        Utility.getServerTime.offsetClientVsServer = clientTime - time;
    }else{
        var offset = clientTime - time;
        Utility.getServerTime.offsetClientVsServer = Math.floor((Utility.getServerTime.offsetClientVsServer * 9 + offset) / 10);
    }
    //Utility.getServerTime.offsetClientVsServer =  clientTime - time;
    ZLog.error("offsetServerTime %d c: %s=> C: %d -> S: %d =: %d",time,clientTime,Utility.getClientTime(),Utility.getServerTime(),Utility.getServerTime.offsetClientVsServer);
    //Utility.getServerTime.offsetClientVsServer = Math.round((new Date()).getTime() / 1000) - time;
};

/**
 * get current time in seconds
 * @return timeServer {number}
 */
Utility.getServerTime = function(){
    if(Utility.getServerTime.offsetClientVsServer === undefined){
        Utility.getServerTime.offsetClientVsServer = 0;
    }

    return ((new Date()).getTime()- Utility.getServerTime.offsetClientVsServer);
};

/**
 * get current time in seconds
 */
Utility.getServerTimeInSeconds = function(){
    return Math.round(Utility.getServerTime() / 1000);
};

Utility.pointInScreen = function(point){
    return (0 <= point.x && point.x <= GV.VISIBALE_SIZE.width
            && 0 <= point.y && point.y <= GV.VISIBALE_SIZE.height);
};

/**
 *
 * @param {int} layerId
 * @return {String} layerName
 */
Utility.getLayerName = function(layerId){
    for(var i in GV.LAYERS){
        if(GV.LAYERS[i] == layerId){
            return i;
        }
    }

    ZLog.error("----> NOT FOUND layer id (%d)", layerId);
    return "";
};

Utility.formatTime = function(time,format){
    return Utility.formatTimeInSecond(parseInt(time/1000),format);
};
Utility.formatTimeInSecond = function(time,format){
    var remainTime = time;
    var zeroPad = function(nNum, nPad) {
        if(nNum == 0) return ''.slice(1);
        return ('' + (Math.pow(10, nPad) + parseInt(nNum))).slice(1);
    };

    var nDay = Math.floor(remainTime / 86400);
    remainTime -= nDay * 86400;
    var nHour = Math.floor(remainTime / 3600);
    remainTime -= nHour * 3600;
    var nMinute = Math.floor(remainTime / 60);
    remainTime -= nMinute * 60;
    var nSecond = Math.floor(remainTime);
    ZLog.error(nDay +" " + nHour +" " + nMinute +" " + nSecond);
    return format.replace(/%[a-z]/gi, function(sMatch) {
        return {
                '%D': zeroPad(nDay, 2),
                '%H': zeroPad(nHour, 2),
                '%M': zeroPad(nMinute, 2),
                '%S': zeroPad(nSecond, 2)
            }[sMatch] || sMatch;
    });
};
/**
 * convert time (in second) to String
 * default: format = HH_MM_SS
 * @param time
 * @param outputFormat
 * @param hideZero
 * @param useDoubleZero
 * @param maxNumOfUnits
 * @param isExplicit
 */
Utility.timeToString = function(time, outputFormat, hideZero, useDoubleZero, maxNumOfUnits, isExplicit, isHidePrefixTime){
    time = Math.max(time, 0);

    if(hideZero === undefined || hideZero === null){
        hideZero = true;
    }

    if(useDoubleZero === undefined || useDoubleZero === null){
        useDoubleZero = true;
    }

    if(outputFormat === undefined || outputFormat === null){
        outputFormat = GV.TIME_FORMAT.DD_HH_MM_SS;
    }

    if(maxNumOfUnits === undefined || maxNumOfUnits === null){
        maxNumOfUnits = 4;
    }

    if(isExplicit === undefined || isExplicit === null){
        isExplicit = false;
    }
    if(isHidePrefixTime === undefined || isHidePrefixTime === null){
        isHidePrefixTime = false;
    }

    var numOfUnits = 0;
    var remainTime = time;
    var ddStr, hhStr, mmStr, ssStr;
    var dd = ddStr = Math.floor(remainTime / 86400);
    remainTime -= dd * 86400;
    var hh = hhStr = Math.floor(remainTime / 3600);
    remainTime -= hh * 3600;
    var mm = mmStr = Math.floor(remainTime / 60);
    remainTime -= mm * 60;
    var ss = ssStr = Math.floor(remainTime);
    if(dd > 0 && outputFormat.indexOf("DD") == -1){
        hh += 24 * dd;
        hhStr = hh;
    }

    //var timeString = "";
    if(useDoubleZero){
        if(dd < 10) ddStr = "0" + dd;
        if(hh < 10) hhStr = "0" + hh;
        if(mm < 10) mmStr = "0" + mm;
        if(ss < 10) ssStr = "0" + ss;
    }

    if(hideZero){
        if(dd == 0) {
            outputFormat = outputFormat.replace("DD", "");
            outputFormat = outputFormat.replace("@d", "");
        }

        if(hh == 0) {
            outputFormat = outputFormat.replace("HH", "");
            outputFormat = outputFormat.replace("@h", "");
        }

        if(mm == 0) {
            outputFormat = outputFormat.replace("MM", "");
            outputFormat = outputFormat.replace("@m", "");
        }

        if(ss == 0) {
            outputFormat = outputFormat.replace("SS", "");
            outputFormat = outputFormat.replace("@s", "");
        }
    }
    if(dd > 0 || !hideZero){
        outputFormat = outputFormat.replace("DD", ddStr);
        ++numOfUnits;
    }

    if((hh > 0 || !hideZero) && numOfUnits < maxNumOfUnits){
        outputFormat = outputFormat.replace("HH", hhStr);
        ++numOfUnits;
    }
    else{
        outputFormat = outputFormat.replace("HH", "");
        outputFormat = outputFormat.replace("@h", "");
    }

    if((mm > 0 || !hideZero) && numOfUnits < maxNumOfUnits){
        outputFormat = outputFormat.replace("MM", mmStr);
        ++numOfUnits;
    }
    else{
        outputFormat = outputFormat.replace("MM", "");
        outputFormat = outputFormat.replace("@m", "");
    }
    if((ss > 0 || !hideZero) && numOfUnits < maxNumOfUnits){
        outputFormat = outputFormat.replace("SS", ssStr);
        ++numOfUnits;
    }
    else{
        outputFormat = outputFormat.replace("SS", "");
        outputFormat = outputFormat.replace("@s", "");
    }

    if(isHidePrefixTime){
        outputFormat = outputFormat
            .replace("@h", ':')
            .replace("@m", ':')
            .replace("@s", '');
    }

    if(isExplicit){
        outputFormat = outputFormat
            .replace("@d", ' ' + languageMgr.getString("DAYS"))
            .replace("@h", ' ' + languageMgr.getString("HOURS"))
            .replace("@m", ' ' + languageMgr.getString("MINUTES"))
            .replace("@s", ' ' + languageMgr.getString("SECONDS"));
    }

    outputFormat = outputFormat.replace(/@/g, ""); // replace all @

    //ZLog.debug("timeString = %s", outputFormat);
    return outputFormat;
};

/**
 * convert date (in second) to String
 *
 * default: format = DD_MM_YY (31/12/2015)
 *          separator = / (only short mode)
 * @param time
 * @param format
 * @param hideZero
 */
Utility.dateToString = function(time, format, hideZero){
    if(format === undefined){
        format = GV.DATE_FORMAT.DD_MM_YY;
    }

    if(hideZero === undefined){
        hideZero =  true;
    }

    var date = new Date();
    var timezone = date.getTimezoneOffset() * 60;
    date.setTime((time - timezone) * 1000);
    var dd = date.getUTCDate();
    var mm = date.getUTCMonth() + 1;
    var yy = date.getUTCFullYear();
    var hh = date.getUTCHours();
    var m_m = date.getUTCMinutes();
    var ss = date.getUTCSeconds();

    format = format.replace("YY", yy)
                    .replace("MM", (mm < 10 ? ("0" + mm) : mm))
                    .replace("DD", (dd < 10 ? ("0" + dd) : dd))
                    .replace("HH", (hh < 10 ? ("0" + hh) : hh))
                    .replace("M_M", (m_m < 10 ? ("0" + m_m) : m_m))
                    .replace("SS", (ss < 10 ? ("0" + ss) : ss));

    return format;
};

/**
 *
 * @param number
 * @param length
 * @returns {*}
 * @private
 */
Utility.__fillNumberWithZero = function(number){
    if(number < 10){
        return "00" + number;
    }
    else if(number < 100){
        return "0" + number;
    }
    else{
        return number;
    }
};

/**
 * pathToFile/abc.json --> abc
 * @param {String} url (full path to file)
 * @returns {String} fileName
 */
Utility.getFileName = function(url){
    if(!url) return "";
    var arr = url.match(/([^\/]+)\.[^\/]+$/);
    if(arr && arr[1])
        return arr[1];
    else
        return "";
};

/**
 *
 * @param money
 * @param unit
 * @param separator
 * @returns {*}
 */
Utility.formatMoney = function(money, unit, separator){
    if(unit === undefined) unit = "$";

    return unit + Utility.formatAlignNumber(money, separator);
};

/**
 *
 * @param money
 * @param unit
 * @param separator
 * @returns {*}
 */
Utility.formatMoneyFull = function(money, unit, separator){
    if(unit === undefined) unit = "$";

    return unit + Utility.formatAlignNumber(money, separator, true);
};

/**
 *
 * @param number
 * @param separator
 * @param isFull
 * @returns {*}
 */
Utility.formatAlignNumber = function(number, separator, isFull){
    if(number === undefined) return "0";

    number -= -0.1; //magic
    if(separator === undefined){
        separator = ",";
    }

    if(isFull === undefined){
        isFull = false;
    }

    var isNegative = number < 0;
    number = Math.abs(Math.round(number));
    var numString = number.toString();

    if(isFull){
        var curIndex = numString.length - 3;

        while(curIndex > 0){
            numString = numString.insertAt(curIndex, separator);
            curIndex -= 3;
        }
    }
    else{
        var units = Utility.units;
        for(var i = 0, length = units.length; i < length; ++i){
            if(numString.length > units[i].l){
                var tmpNumArr = (number / units[i].div).toString().split('.');
                var fixedLength = tmpNumArr[0].length > 2 ? 1 : 2;

                // insert separator
                if(tmpNumArr[0].length > 3){
                    curIndex = numString.length - 3;

                    while(curIndex > 0){
                        tmpNumArr[0] = tmpNumArr[0].insertAt(curIndex, separator);
                        curIndex -= 3;
                    }
                }

                numString = tmpNumArr[0];
                // append fixed
                if(tmpNumArr.length > 1){
                    numString += '.' + tmpNumArr[1].substr(0, fixedLength);
                }
                numString += units[i].prefix;
                break;
            }
        }
    }

    if(isNegative){
        numString = "-" + numString;
    }

    //ZLog.debug("num String = %s", numString);
    return numString;
};

/**
 *
 * @param spriteOrName
 * @param size
 * @param maskSpriteOrName
 * @returns {*}
 */
Utility.makeCircleAvatar = function(spriteOrName, size, maskSpriteOrName){
    if(maskSpriteOrName === undefined) maskSpriteOrName = res.avatar_mask;

    if(maskSpriteOrName instanceof cc.Sprite){
        var nodeMask = maskSpriteOrName;
    }
    else{ // is String
        nodeMask = new cc.Sprite(maskSpriteOrName);
    }

    if(spriteOrName instanceof cc.Sprite){
        var sprite = spriteOrName;
    }
    else{ // is String
        sprite = new cc.Sprite(spriteOrName);
    }

    if(size === undefined){
        size = sprite.getContentSize();
    }
    else{
        sprite.setScaleX(size.width / sprite.getContentSize().width);
        sprite.setScaleY(size.height / sprite.getContentSize().height);
    }

    var clipNode = new cc.ClippingNode();
    sprite.setName("sprite");
    clipNode.addChild(sprite);
    clipNode.setAlphaThreshold(0.05);
    clipNode.setInverted(false);

    nodeMask.setScaleX(size.width / nodeMask.getContentSize().width);
    nodeMask.setScaleY(size.height / nodeMask.getContentSize().height);
    clipNode.setStencil(nodeMask);
    clipNode.setContentSize(size);

    return clipNode;
};

/**
 *
 */
Utility.captureScreen = function(){
    // ignore spam this func on 5s
    if(Utility.captureScreen.isRunnning === undefined){
        Utility.captureScreen.isRunnning = false;
    }
    if(Utility.captureScreen.isRunnning) return;
    Utility.captureScreen.isRunnning = true;

    // schedule to reset flag
    var ignoreTime = 5000;
    setTimeout(function(){
        Utility.captureScreen.isRunnning = false;
    }, ignoreTime);

    // output name
    var fileName = "screenshot_" + GV.GAME + ".png";
    var absolutePath = jsb.fileUtils.getWritablePath() + fileName;

    // check file exist and remove it
    if(jsb.fileUtils.isFileExist(absolutePath)){
        jsb.fileUtils.removeFile(absolutePath);
    }

    // create a render texture of current scene
    var renderTexture = new cc.RenderTexture(cc.winSize.width, cc.winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
    renderTexture.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    renderTexture.begin();
    sceneMgr.getRunningScene().visit();
    renderTexture.end();

    // save to file and return a abs path
    var success = renderTexture.saveToFile(fileName, cc.IMAGE_FORMAT_PNG);
    if(success){
        ZLog.debug("captureScreen: saved to " + absolutePath);
        return absolutePath;
    }
    else{
        return "";
    }
}

/**
 * remove all textures by keys
 */
Utility.removeTexturesCacheByKeys = function (fileList) {
    for(var i = 0; i < fileList.length; ++i){
        cc.textureCache.removeTextureForKey(fileList[i]);
    }
};

Utility.writeToFile = function(contentString, fileName){
    var writePathAble = jsb.fileUtils.getWritablePath() + fileName;

    if(jsb.fileUtils.writeStringToFile(contentString , writePathAble)){
        PlatformUtils.makeToast("saved " + writePathAble);
    }
    else{
        PlatformUtils.makeToast("cannot save");
    }
};

Utility.displayName = function(name, maxLength){
    if(name == undefined) return "";
    name = name.replace(/\n/gi, " ");
    if(maxLength === undefined) maxLength = 10;
    name = name.trim();

    if(name.length > maxLength){
        var newName = name.substr(0, maxLength);
        newName += "...";
    }
    else{
        newName = name;
    }

    return newName;
};
Utility.displayNameWidthSize = function(name, maxWidth, obj){
    if(name == undefined) return "";
    if(obj == undefined || obj == null || maxWidth == -1) {
        return name;
    }
    var scaleX = obj.getScaleX();
    var width = obj.width;

    var maxLength = 10;
    name = name.replace(/\n/gi, " ");
    if(maxLength === undefined) maxLength = 10;
    name = name.trim();


    if(name.length > maxLength){
        var newName = name.substr(0, maxLength);
        newName += "...";
    }
    else{
        newName = name;
    }

    return newName;
};
Utility.exitGame = function(){
    Audio.cleanUp();
    Pool.drainAllPools();
    Popups.cleanUp();
    gameLoop.cleanUp();
    Notifications.cleanUp();
    GameLoop.cleanUp();
    resourceMgr.cleanUp();
    moduleMgr.cleanUp();
};