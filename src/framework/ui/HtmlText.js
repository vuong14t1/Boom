/**
 * Created by VitaminB on 10/8/2017.
 */

/**
 * ex1: <strike strikeSrc=res/img_html_strike.png><font color=#ff00ff>text2</font></strike>
 * ex2: <font style=res/fonts/number_bitmap_10.fnt> $100.000 </font>
 * ex3: <li liSrc=res/img_dot.png scale="0.7">text 3 <img src=res/avatar_1.png /></li>
 *      <li liSrc=res/img_dot2.png scale="0.9">text 4 <img src=res/avatar_2.png /></li>
 * ex4: <custom id=10 width=100 height=100 />
 */
var HtmlText = cc.Node.extend({
    ctor: function(fontName, fontSize, hAlign, vAlign){
        this._super();

        if(fontName === undefined) fontName = res.UTM_AVO_P13;
        if(fontSize === undefined) fontSize = 22;
        if(hAlign === undefined) hAlign = HtmlTextAlign.CENTER;
        if(vAlign === undefined) vAlign = HtmlTextAlign.CENTER;

        this._defaultFontSize = fontSize;
        this._defaultFontName = fontName;
        this._defaultFontColor = cc.color('#ffffff');
        this._textMode = HtmlTextMode.NONE;
        this._originText = null;
        this._hAlign = hAlign;
        this._vAlign = vAlign;
        this._realContentSize = cc.size(0, 0);
        this._targetContentSize = cc.size(1, 0);
        this._numOfLines = 0;

        this._listView = null; // use for HARD_SIZE mode
        this._containerInListView = null;
        this._listElement = [];
        this._listLine = [];
        this._listStrike = [];

        this._formatDirty = false;
        this._context = null;

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
    },

    setDefaultFontSize: function(size){
        if(this._defaultFontSize != size){
            this._defaultFontSize = size;
            this._formatDirty = true;

            return true;
        }

        return false;
    },

    setDefaultFont: function(fontName){
        if(this._defaultFontName != fontName){
            this._defaultFontName = fontName;
            this._formatDirty = true;

            return true;
        }

        return false;
    },

    setDefaultFontColor: function(color){
        if(this._defaultFontColor != color){
            this._defaultFontColor = color;
            this._formatDirty = true;

            return true;
        }

        return false;
    },

    setContext: function(c){
        this._context = c;
    },

    setZString: function(key){
        this.setString(languageMgr.getString(key));
    },

    setString: function(text){
        if(text == null){
            cc.error('HtmlText: text input is null');
            return;
        }

        // replace all \n to <br>
        text = text.replace(/\n/g, '<br>');

        if(this._originText !== text){
            this._originText = text;
            this._formatDirty = true;
        }

        if(this._formatDirty){
            this.reloadFormat();
            return true;
        }

        return false;
    },

    setMode: function(mode, size){
        if(this._textMode != mode){
            this._textMode = mode;
            this.setTargetContentSize(size);
            this._formatDirty = true;

            return true;
        }

        return false;
    },

    getMode: function(){
        return this._textMode;
    },

    /**
     * HtmlTextAlign.CENTER, HtmlTextAlign.LEFT or HtmlTextAlign.RIGHT
     * @param h
     * @returns {boolean}
     */
    setHorizontalAlign: function(h){
        if(this._hAlign != h) {
            this._hAlign = h;
            this._formatDirty = true;

            return true;
        }

        return false;
    },

    /**
     * HtmlTextAlign.CENTER, HtmlTextAlign.TOP or HtmlTextAlign.BOTTOM
     * @param v
     * @returns {boolean}
     */
    setVerticalAlign: function(v){
        if(this._vAlign != v){
            this._vAlign = v;
            this._formatDirty = true;

            return true;
        }

        return false;
    },

    getRealContentSize: function(){
        return this._realContentSize;
    },

    setTargetContentSize: function(size){
        if(this._textMode == HtmlTextMode.WRAP_WIDTH && this._targetContentSize.width != size.width){
            this._targetContentSize = size;
            this._formatDirty = true;

            return true;
        }
        else if(this._textMode == HtmlTextMode.HARD_SIZE){
            this._targetContentSize = size;
            this._formatDirty = true;

            return true;
        }

        return false;
    },

    getTargetContentSize: function(){
        return this._targetContentSize;
    },

    getElementById: function(id){
        for(var i = 0; i < this._listElement.length; ++i){
            var eData = this._listElement[i].getUserData();
            if(eData && eData[__HtmlKey.ATTR] && eData[__HtmlKey.ATTR][__HtmlKey.ID] == id) return this._listElement[i];
        }

        return null;
    },

    reloadFormat: function(){
        if(this._formatDirty){
            this.removeElements(false);
            this._formatDirty = false;

            var jsonData = html2json(this._originText);
            if(jsonData){
                //cc.log(JSON.stringify(jsonData[__HtmlKey.CHILD]));
                var children = this._convert2ElementData(jsonData[__HtmlKey.CHILD]);
                //cc.log(JSON.stringify(children));

                var indexStrike = {from: null, to: null, strikeSrc: null};
                var element = null;
                var needHandleStrike = false;
                for(var i = 0; i < children.length; ++i){
                    var curChild = children[i];
                    if(this._isType(curChild, HtmlTextElementType.TEXT)){
                        // handle <li> tag
                        if(this._handleLi(children, curChild, i)){
                            --i;
                            continue;
                        }

                        element = this._getTextElement(curChild);
                        needHandleStrike = true;
                    }
                    else if(this._isType(curChild, HtmlTextElementType.IMAGE)){
                        // handle <li> tag
                        if(this._handleLi(children, curChild, i)){
                            --i;
                            continue;
                        }

                        element = this._getImageElement(curChild);
                        needHandleStrike = true;
                    }
                    else if(this._isType(curChild, HtmlTextElementType.NEW_LINE)){
                        if(this._handleStrike(children, curChild, i, null, indexStrike)) {
                            --i;
                            continue;
                        }

                        element = this._getNewLine();
                        needHandleStrike = false;
                    }
                    else if(this._isType(curChild, HtmlTextElementType.STRIKE)){
                        element = this._getNewStrike(curChild);
                        needHandleStrike = false;
                    }
                    else if(this._isType(curChild, HtmlTextElementType.CUSTOM)){
                        element = this._getCustomElement(curChild);
                        needHandleStrike = true;
                    }
                    else{
                        needHandleStrike = true;
                        element = null;
                    }

                    if(needHandleStrike && this._handleStrike(children, curChild, i, element, indexStrike)){
                        // something else element that not implement
                        if(element == null) --i;

                        continue;
                    }

                    if(element){
                        this._listElement.push(element);
                        element = null;
                    }
                }

                this._lineUpElements();
                this._align();
                return true;
            }
        }

        return false;
    },

    /**
     *
     * @param data
     * @param tag
     * @returns {boolean}
     * @private
     */
    _hasTag: function(data, tag){
        if(data[__HtmlKey.TAG] == null) return false;

        for(var i = 0; i < data[__HtmlKey.TAG].length; ++i){
            if(data[__HtmlKey.TAG][i] == tag) return true;
        }

        return false;
    },

    /**
     *
     * @param data
     * @param tag
     * @returns {boolean}
     * @private
     */
    _hasOpenTag: function(data, tag){
        if(data[__HtmlKey.OPEN_TAG] == null) return false;

        for(var i = 0; i < data[__HtmlKey.OPEN_TAG].length; ++i){
            if(data[__HtmlKey.OPEN_TAG][i] == tag) return true;
        }

        return false;
    },

    /**
     *
     * @param data
     * @param tag
     * @returns {boolean}
     * @private
     */
    _hasCloseTag: function(data, tag){
        if(data[__HtmlKey.CLOSE_TAG] == null) return false;

        for(var i = 0; i < data[__HtmlKey.CLOSE_TAG].length; ++i){
            if(data[__HtmlKey.CLOSE_TAG][i] == tag) return true;
        }

        return false;
    },

    /**
     *
     * @param data
     * @param tag
     * @returns {boolean}
     * @private
     */
    _removeTag: function(data, tag){
        if(data[__HtmlKey.TAG] == null) return false;

        for(var i = data[__HtmlKey.TAG].length - 1; i > -1; --i){
            if(data[__HtmlKey.TAG][i] == tag){
                data[__HtmlKey.TAG].splice(i, 1);
                return true;
            }
        }

        return false;
    },

    /**
     *
     * @param data
     * @param tag
     * @returns {boolean}
     * @private
     */
    _removeOpenTag: function(data, tag){
        if(data[__HtmlKey.OPEN_TAG] == null) return false;

        for(var i = data[__HtmlKey.OPEN_TAG].length - 1; i > -1; --i){
            if(data[__HtmlKey.OPEN_TAG][i] == tag){
                data[__HtmlKey.OPEN_TAG].splice(i, 1);
                return true;
            }
        }

        return false;
    },

    /**
     *
     * @param data
     * @param tag
     * @returns {boolean}
     * @private
     */
    _removeCloseTag: function(data, tag){
        if(data[__HtmlKey.CLOSE_TAG] == null) return false;

        for(var i = data[__HtmlKey.CLOSE_TAG].length - 1; i > -1; --i){
            if(data[__HtmlKey.CLOSE_TAG][i] == tag){
                data[__HtmlKey.CLOSE_TAG].splice(i, 1);
                return true;
            }
        }

        return false;
    },

    /**
     *
     * @param data
     * @param type
     * @returns {boolean}
     * @private
     */
    _isType: function(data, type){
        if(data == null) return false;

        switch (type){
            case HtmlTextElementType.TEXT:
                return data[__HtmlKey.NODE] == type;

            case HtmlTextElementType.LI:
                return this._hasTag(data, __HtmlKey.LI)
                    && (data[__HtmlKey.NODE] == __HtmlKey.TEXT || this._isType(data, HtmlTextElementType.IMAGE));

            case HtmlTextElementType.STRIKE:
                return this._hasTag(data, __HtmlKey.STRIKE)
                    && data[__HtmlKey.ATTR]
                    && data[__HtmlKey.ATTR][__HtmlKey.FROM]
                    && data[__HtmlKey.ATTR][__HtmlKey.TO];

            case HtmlTextElementType.IMAGE:
                return data[__HtmlKey.TAG]
                    && data[__HtmlKey.TAG][0] == __HtmlKey.IMG;

            case HtmlTextElementType.NEW_LINE:
                return data[__HtmlKey.TAG]
                    && data[__HtmlKey.TAG][0] == __HtmlKey.BR;

            case HtmlTextElementType.CUSTOM:
                return data[__HtmlKey.TAG]
                    && data[__HtmlKey.TAG][0] == __HtmlKey.CUSTOM;

            default:
                return false;
        }
    },

    /**
     *
     * @param target
     * @param src
     * @private
     */
    _copyTagsAndAttr: function(target, src){
        // init tag and attribute for child if not own
        if(!target.hasOwnProperty(__HtmlKey.TAG)) target[__HtmlKey.TAG] = [];
        else if(!(target[__HtmlKey.TAG] instanceof Array)){
            target[__HtmlKey.TAG] = [target[__HtmlKey.TAG]];
        }

        if(!target.hasOwnProperty(__HtmlKey.ATTR)) target[__HtmlKey.ATTR] = {};

        // copy tags and attributes from parent
        target[__HtmlKey.TAG] = target[__HtmlKey.TAG].concat(src[__HtmlKey.TAG]);
        target[__HtmlKey.ATTR] = _.assignWith(target[__HtmlKey.ATTR], src[__HtmlKey.ATTR], function(objValue, srcValue){
            return _.isUndefined(objValue) ? srcValue : objValue;
        });
    },

    /**
     *
     * @param data
     * @returns {Array}
     * @private
     */
    _convert2ElementData: function(data){
        var listElementData = [];

        for(var i = 0; i < data.length; ++i){
            var curElementData = data[i];
            if(curElementData.hasOwnProperty(__HtmlKey.CHILD)){
                // recursive to children
                var children = this._convert2ElementData(curElementData[__HtmlKey.CHILD]);

                for(var j = 0; j < children.length; ++j){
                    this._copyTagsAndAttr(children[j], curElementData);
                }

                var firstChild = _.nth(children, 0);
                if(!firstChild.hasOwnProperty(__HtmlKey.OPEN_TAG)) firstChild[__HtmlKey.OPEN_TAG] = [];
                firstChild[__HtmlKey.OPEN_TAG] = firstChild[__HtmlKey.OPEN_TAG].concat(curElementData[__HtmlKey.TAG]);

                var lastChild = _.nth(children, -1);
                if(!lastChild.hasOwnProperty(__HtmlKey.CLOSE_TAG)) lastChild[__HtmlKey.CLOSE_TAG] = [];
                lastChild[__HtmlKey.CLOSE_TAG] = lastChild[__HtmlKey.CLOSE_TAG].concat(curElementData[__HtmlKey.TAG]);

                listElementData = listElementData.concat(children);
            }
            else{
                if(curElementData.hasOwnProperty(__HtmlKey.TAG) && !(curElementData[__HtmlKey.TAG] instanceof Array)){
                    curElementData[__HtmlKey.TAG] = [curElementData[__HtmlKey.TAG]];
                }

                listElementData.push(curElementData);
            }
        }

        return listElementData;
    },

    /**
     *
     * @returns {*}
     * @private
     */
    _getNewStrike: function(data){
        if(data[__HtmlKey.ATTR] && data[__HtmlKey.ATTR][__HtmlKey.STRIKE_SRC]){
            var eImage = _HtmlTextPool.get(cc.Sprite);
            if(!_.isEqual(data, eImage.getUserData())){
                if(data[__HtmlKey.ATTR][__HtmlKey.STRIKE_SRC].startsWith('#')){
                    eImage.setSpriteFrame(data[__HtmlKey.ATTR][__HtmlKey.STRIKE_SRC].replace('#', ''));
                }
                else{
                    eImage.setTexture(data[__HtmlKey.ATTR][__HtmlKey.STRIKE_SRC]);
                }

                eImage.setUserData(data);
            }
            eImage.setLocalZOrder(1);
            eImage.y = -2;
            eImage.retain();

            return eImage;
        }

        cc.error('HtmlText - strike src attribute not found: &lt;strike strikeSrc=your_strike.png&gt;');
        return null;
    },

    /**
     *
     * @returns {*}
     * @private
     */
    _getNewLine: function(){
        var line = _HtmlTextPool.get(_HtmlLine);
        line.retain();

        return line;
    },

    /**
     *
     * @param data
     * @returns {*}
     * @private
     */
    _getTextElement: function(data){
        if(data[__HtmlKey.ATTR] && data[__HtmlKey.ATTR][__HtmlKey.STYLE] && data[__HtmlKey.ATTR][__HtmlKey.STYLE].endsWith('.fnt')){
            var eText = _HtmlTextPool.get(cc.LabelBMFont);

            if(!_.isEqual(data, eText.getUserData())){
                eText.setString(data[__HtmlKey.TEXT]);
                eText.setFntFile(data[__HtmlKey.ATTR][__HtmlKey.STYLE]);
            }

            data[__HtmlKey.ATTR][__HtmlKey.SCALE] && eText.setScale(parseFloat(data[__HtmlKey.ATTR][__HtmlKey.SCALE]));
        }
        else{
            eText = _HtmlTextPool.get(ccui.Text);
            if(!_.isEqual(data, eText.getUserData())){
                var fontName = data[__HtmlKey.ATTR] && data[__HtmlKey.ATTR][__HtmlKey.STYLE]
                    ? data[__HtmlKey.ATTR][__HtmlKey.STYLE] :
                    this._defaultFontName;
                var fontSize = data[__HtmlKey.ATTR] && data[__HtmlKey.ATTR][__HtmlKey.SIZE]
                    ? data[__HtmlKey.ATTR][__HtmlKey.SIZE] :
                    this._defaultFontSize;
                var outlineData = data[__HtmlKey.ATTR] && data[__HtmlKey.ATTR][__HtmlKey.OUTLINE]
                    ? data[__HtmlKey.ATTR][__HtmlKey.OUTLINE].split(',')
                    : null;
                var shadowData = data[__HtmlKey.ATTR] && data[__HtmlKey.ATTR][__HtmlKey.SHADOW]
                    ? data[__HtmlKey.ATTR][__HtmlKey.SHADOW].split(',')
                    : null;

                eText.setString(data[__HtmlKey.TEXT].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
                eText.setFontName(fontName);
                eText.setFontSize(fontSize);

                // disable effect of this text, 'cause html use pool object
                eText.disableEffect();
                if(outlineData){
                    if(outlineData.length >= 2){
                        eText.enableOutline(cc.color(outlineData[0]), parseInt(outlineData[1]));
                    }
                    else{
                        cc.error('HtmlText - outline attribute not enough params, requires 2 params: outline color and size');
                    }
                }

                if(shadowData){
                    if(shadowData.length >= 3){
                        eText.enableShadow(cc.color(shadowData[0]), cc.size(parseInt(shadowData[1]), parseInt(shadowData[2])));
                    }
                    else{
                        cc.error('HtmlText - shadow attribute not enough params, requires 3 params: shadow color, offset and blurRadius');
                    }
                }
            }
        }
        if(data[__HtmlKey.ATTR] && data[__HtmlKey.ATTR][__HtmlKey.COLOR]){
            eText.setColor(cc.color(data[__HtmlKey.ATTR][__HtmlKey.COLOR]));
        }
        else{
            eText.setColor(this._defaultFontColor);
        }

        eText.setUserData(data);
        eText.retain();
        return eText;
    },

    /**
     *
     * @param data
     * @returns {*}
     * @private
     */
    _getImageElement: function(data){
        if(data[__HtmlKey.ATTR][__HtmlKey.SRC].startsWith('@')){ // &lt;image&gt; -> <image>
            cc.error('HtmlText - src of &lt;image&gt; tag may be incorrect: ' + data[__HtmlKey.ATTR][__HtmlKey.SRC]);
        }

        if(!data[__HtmlKey.ATTR][__HtmlKey.SRC].endsWith('.png')){
            cc.error('HtmlText - src of &lt;image&gt; tag may be incorrect: ' + data[__HtmlKey.ATTR][__HtmlKey.SRC]);
        }

        var eImage = _HtmlTextPool.get(cc.Sprite);
        if(!_.isEqual(data, eImage.getUserData())){
            if(data[__HtmlKey.ATTR][__HtmlKey.SRC].startsWith('#')){
                eImage.setSpriteFrame(data[__HtmlKey.ATTR][__HtmlKey.SRC].replace('#', ''));
            }
            else{
                eImage.setTexture(data[__HtmlKey.ATTR][__HtmlKey.SRC]);
            }
            data[__HtmlKey.ATTR][__HtmlKey.SCALE] && eImage.setScale(parseFloat(data[__HtmlKey.ATTR][__HtmlKey.SCALE]));
            data[__HtmlKey.ATTR][__HtmlKey.ROTATION] && eImage.setRotation(parseInt(data[__HtmlKey.ATTR][__HtmlKey.ROTATION]));
            data[__HtmlKey.ATTR][__HtmlKey.OPACITY] && eImage.setOpacity(parseInt(data[__HtmlKey.ATTR][__HtmlKey.OPACITY]));

            eImage.setUserData(data);
        }

        eImage.retain();
        return eImage;
    },

    /**
     *
     * @private
     */
    _getCustomElement: function(data){
        var eNode = new cc.Node();
        if(data[__HtmlKey.ATTR]){
            if(data[__HtmlKey.ATTR][__HtmlKey.WIDTH]) eNode.width = data[__HtmlKey.ATTR][__HtmlKey.WIDTH];
            if(data[__HtmlKey.ATTR][__HtmlKey.HEIGHT]) eNode.height = data[__HtmlKey.ATTR][__HtmlKey.HEIGHT];
        }

        eNode.setCascadeOpacityEnabled(true);
        eNode.setCascadeColorEnabled(true);
        eNode.setUserData(data);
        return eNode;
    },

    /**
     *
     * @param children
     * @param index
     * @param indexStrike
     * @returns {boolean}
     * @private
     */
    _addStrike: function(children, index, indexStrike){
        if(indexStrike.to && indexStrike.from){
            _.insertArray(children, index, {
                tag: [__HtmlKey.STRIKE],
                attr: {
                    from: indexStrike[__HtmlKey.FROM],
                    to: indexStrike[__HtmlKey.TO],
                    strikeSrc: indexStrike[__HtmlKey.STRIKE_SRC]
            }
            });

            return true;
        }

        return false;
    },

    /**
     *
     * @param dataList
     * @param index
     * @private
     */
    _addNewLi: function(dataList, index){
        var nextIndex = index;
        var data = dataList[index];

        // remove tag li
        this._removeTag(data, __HtmlKey.LI);
        this._removeOpenTag(data, __HtmlKey.LI);

        data[__HtmlKey.TEXT] = ' ' + data[__HtmlKey.TEXT];

        _.insertArray(dataList, nextIndex++, {
            tag: [__HtmlKey.BR]
        });

        var startWithAt = data[__HtmlKey.ATTR][__HtmlKey.LI_SRC].startsWith('@');
        if(startWithAt){ // &lt;li&gt; -> <li>
            cc.error('HtmlText - src of &lt;li&gt; tag may be incorrect: ' + data[__HtmlKey.ATTR][__HtmlKey.LI_SRC]);
        }

        if(!data[__HtmlKey.ATTR][__HtmlKey.LI_SRC].endsWith('.png')){
            cc.error('HtmlText - src of &lt;li&gt; tag may be incorrect: ' + data[__HtmlKey.ATTR][__HtmlKey.LI_SRC]);
        }

        if(data[__HtmlKey.ATTR][__HtmlKey.LI_SRC] != null && !startWithAt){
            _.insertArray(dataList, nextIndex++, {
                tag: [__HtmlKey.IMG],
                attr: {
                    src: data[__HtmlKey.ATTR][__HtmlKey.LI_SRC],
                    scale: data[__HtmlKey.ATTR][__HtmlKey.SCALE],
                    opacity: data[__HtmlKey.ATTR][__HtmlKey.OPACITY],
                    rotation: data[__HtmlKey.ATTR][__HtmlKey.ROTATION]
                }
            });
        }
        else{
            data[__HtmlKey.TEXT] = ' -' + data[__HtmlKey.TEXT];
        }

        return nextIndex;
    },

    /**
     *
     * @param dataList
     * @param index
     * @private
     */
    _addEndLi: function(dataList, index){
        var data = dataList[index];

        // remove tag li
        this._removeTag(data, __HtmlKey.LI);
        this._removeCloseTag(data, __HtmlKey.LI);

        _.insertArray(dataList, index + 1, {
            tag: [__HtmlKey.BR]
        });
    },

    /**
     *
     * @param children
     * @param curChild
     * @param i
     * @param element
     * @param indexStrike
     * @returns {boolean}
     * @private
     */
    _handleStrike: function(children, curChild, i, element, indexStrike){
        var success = false;
        if(curChild[__HtmlKey.ATTR]) indexStrike[__HtmlKey.STRIKE_SRC] = curChild[__HtmlKey.ATTR][__HtmlKey.STRIKE_SRC];

        if(element == null){
            success = this._addStrike(children, i, indexStrike);
            indexStrike.from = null;
            indexStrike.to = null;
        }
        else if(this._hasTag(curChild, __HtmlKey.STRIKE)){
            indexStrike.to = element;
            if(indexStrike.from == null) indexStrike.from = element;

            if(this._hasCloseTag(curChild, __HtmlKey.STRIKE)){
                if(element){
                    this._listElement.push(element);
                    element = null;
                }

                success = this._addStrike(children, i + 1, indexStrike);
                indexStrike.from = null;
                indexStrike.to = null;
            }
        }

        return success;
    },

    /**
     *
     * @param children
     * @param curChild
     * @param i
     * @returns {boolean}
     * @private
     */
    _handleLi: function(children, curChild, i){
        var success = false;
        if(this._isType(curChild, HtmlTextElementType.LI)){
            var isOpenLi = false;
            var nextIndex = i;
            if(this._hasOpenTag(curChild, __HtmlKey.LI)){
                isOpenLi = true;
                nextIndex = this._addNewLi(children, i);
            }

            var isCloseLi = false;
            if(this._hasCloseTag(curChild, __HtmlKey.LI)){
                isCloseLi = true;
                this._addEndLi(children, nextIndex);
            }

            if(isOpenLi || isCloseLi){
                success = true;
            }
        }

        return success;
    },

    /**
     *
     * @param fromIndex
     * @private
     */
    _findNextStrikeFrom: function(fromIndex){
        for(var i = fromIndex; i < this._listElement.length; ++i){
            var eData = this._listElement[i].getUserData();
            if(eData && this._isType(eData, HtmlTextElementType.STRIKE)){
                return this._listElement[i];
            }
        }

        return null;
    },

    /**
     *
     * @param fromIndex
     * @param arrElementType
     * @returns {*}
     * @private
     */
    _findNextElement: function(fromIndex, arrElementType){
        for(var i = fromIndex; i < this._listElement.length; ++i){
            var eData = this._listElement[i].getUserData();
            for(var j = 0; j < arrElementType.length; ++j){
                if(eData && this._isType(eData, arrElementType[j])){
                    return this._listElement[i];
                }
            }
        }

        return null;
    },

    /**
     *
     * @param line
     * @param curElement
     * @param index
     * @returns {boolean}
     * @private
     */
    _downTheLineWithStrike: function(line, curElement, index){
        if(this._isType(this._listElement[index + 1].getUserData(), HtmlTextElementType.STRIKE)) return false;

        var nextStrike = this._findNextStrikeFrom(index);
        if(nextStrike){
            var strikeData = nextStrike.getUserData();
            var newDataStrike = _.cloneDeep(strikeData);

            newDataStrike[__HtmlKey.ATTR].from = this._listElement[this._listElement.indexOf(strikeData[__HtmlKey.ATTR].from)];
            newDataStrike[__HtmlKey.ATTR].to = curElement;

            var nextElement = this._findNextElement(index + 1, [HtmlTextElementType.TEXT, HtmlTextElementType.IMAGE]);
            strikeData[__HtmlKey.ATTR].from = nextElement;
            strikeData[__HtmlKey.ATTR].to = this._listElement.indexOf(strikeData[__HtmlKey.ATTR].to) > this._listElement.indexOf(nextElement)
                ? this._listElement[this._listElement.indexOf(strikeData[__HtmlKey.ATTR].to)]
                : this._listElement[this._listElement.indexOf(nextElement)];

            var newStrike = this._getNewStrike(newDataStrike);
            var eFrom = newDataStrike[__HtmlKey.ATTR].from;
            var eTo = newDataStrike[__HtmlKey.ATTR].to;
            var strikeWidth = ((eTo.width + eFrom.width) >> 1) + eTo.x - eFrom.x;
            newStrike.setScaleX(strikeWidth / newStrike.width);
            newStrike.x = eFrom.x + ((strikeWidth - eFrom.width) >> 1);
            line.addChild(newStrike);

            _.insertArray(this._listElement, index + 1, newStrike);
            return true;
        }
        else{
            cc.error('HtmlText - next strike element is null');
            return false;
        }
    },

    /**
     *
     * @private
     */
    _lineUpElements: function(){
        var nextPos = cc.p(0, 0);
        var locSize = cc.size(0, 0);

        if(this._textMode == HtmlTextMode.NONE){
            var lineSize = cc.size(0, 0);

            // init first line
            this._numOfLines = 1;
            var curLine = this._getNewLine();
            this.addChild(curLine);
            this._listLine.push(curLine);

            for(var i = 0; i < this._listElement.length; ++i){
                var curElement = this._listElement[i];
                if(curElement instanceof _HtmlLine){
                    curLine.setLineSize(lineSize);
                    // update current content size
                    locSize.width = Math.max(locSize.width, lineSize.width);
                    locSize.height += lineSize.height;

                    if(curElement == curLine){
                        cc.log(1);
                    }
                    ++this._numOfLines;
                    curLine = curElement;
                    this.addChild(curLine);
                    this._listLine.push(curLine);

                    nextPos.x = 0;
                    lineSize = cc.size(0, 0);
                    continue;
                }
                else{
                    // push to list line
                    curLine.addChild(curElement);
                }

                var eData = curElement.getUserData();
                if(this._isType(eData, HtmlTextElementType.STRIKE)){
                    var eFrom = eData[__HtmlKey.ATTR][__HtmlKey.FROM];
                    var eTo = eData[__HtmlKey.ATTR][__HtmlKey.TO];

                    var strikeWidth = ((eTo.width + eFrom.width) >> 1) + eTo.x - eFrom.x;
                    curElement.setScaleX(strikeWidth / curElement.width);
                    curElement.x = eFrom.x + ((strikeWidth - eFrom.width) >> 1);
                }
                else{
                    var elementSize = cc.size(curElement.width * curElement.getScaleX(), curElement.height * curElement.getScaleY());
                    curElement.setPosition(nextPos.x + (elementSize.width >> 1), 0);

                    nextPos.x += elementSize.width;
                    lineSize.width += elementSize.width;
                    lineSize.height = Math.max(lineSize.height, elementSize.height);
                }
            }

            curLine.setLineSize(lineSize);
            // update current content size
            locSize.width = Math.max(locSize.width, lineSize.width);
            locSize.height += lineSize.height;
        }
        else if(this._textMode == HtmlTextMode.WRAP_WIDTH || this._textMode == HtmlTextMode.HARD_SIZE){
            lineSize = cc.size(0, 0);
            var posXInLine = 0;

            // init first line
            curLine = this._getNewLine();
            this._listLine.push(curLine);
            this._numOfLines = 1;

            var _doNewLine = function(){
                this._listLine.push(curLine);
                ++this._numOfLines;

                // reset posX in line
                posXInLine = 0;

                // reset line size
                lineSize = cc.size(0, 0);
            }.bind(this);

            // add to line
            for(i = 0; i < this._listElement.length; ++i){
                curElement = this._listElement[i];
                if(curElement instanceof _HtmlLine){
                    curLine.setLineSize(lineSize);
                    curLine = curElement;

                    // update current content size
                    locSize.width = Math.max(locSize.width, lineSize.width);
                    locSize.height += lineSize.height;

                    _doNewLine();
                    continue;
                }
                else{
                    // push to list line
                    curLine.addChild(curElement);
                }

                // set position in the line
                elementSize = cc.size(curElement.width * curElement.getScaleX(), curElement.height * curElement.getScaleY());
                curElement.setPosition(posXInLine + (elementSize.width >> 1), 0);

                // check new line
                var newLine = this._targetContentSize.width <= (lineSize.width + elementSize.width);
                var endText = i == (this._listElement.length -1);

                eData = curElement.getUserData();
                if(newLine){
                    // is text and has more than 2 words
                    if(this._isType(eData, HtmlTextElementType.TEXT) && eData[__HtmlKey.TEXT].trim().split(' ').length > 2){
                        // split text to shorter text
                        var splitArr = eData[__HtmlKey.TEXT].split(' ');

                        // find sub string that width >= targetSize.width
                        var subString = '';
                        var prevWidth = 0;
                        for(var k = 0; k < splitArr.length; ++k){
                            curElement.setString(subString + splitArr[k] + ' ');

                            if(this._targetContentSize.width <= (lineSize.width + curElement.width)) {
                                var prevOffset = Math.abs(this._targetContentSize.width - prevWidth);
                                var nextOffset = Math.abs(this._targetContentSize.width - (lineSize.width + curElement.width));

                                if(prevWidth == 0 || nextOffset <= prevOffset) subString = curElement.getString();

                                break;
                            }
                            subString = curElement.getString();
                            prevWidth = curElement.width;
                        }

                        if(subString.length < eData[__HtmlKey.TEXT].length){
                            // clone sub string data
                            var newData = _.cloneDeep(eData);
                            eData[__HtmlKey.TEXT] = subString;
                            newData[__HtmlKey.TEXT] = newData[__HtmlKey.TEXT].replace(eData[__HtmlKey.TEXT], '');

                            // update string value, position, size for current element
                            curElement.setString(eData[__HtmlKey.TEXT]);
                            elementSize = cc.size(curElement.width * curElement.getScaleX(), curElement.height * curElement.getScaleY());
                            curElement.setPosition(posXInLine + (elementSize.width >> 1), 0);

                            if(newData[__HtmlKey.TEXT].length > 0){
                                // create new element with new data
                                var newElement = this._getTextElement(newData);

                                // insert new element behind current item
                                _.insertArray(this._listElement, i + 1, newElement);
                            }
                        }
                        else{
                            // restore to origin text
                            curElement.setString(eData[__HtmlKey.TEXT]);
                        }
                    }

                    // down the line with strike
                    if(this._hasTag(eData, __HtmlKey.STRIKE)){
                        // behind is strike element
                        if(this._isType(this._listElement[i + 1].getUserData(), HtmlTextElementType.STRIKE)){
                            var nextElement = this._listElement[i + 1];
                            var nextStrikeData = nextElement.getUserData();

                            eFrom = nextStrikeData[__HtmlKey.ATTR][__HtmlKey.FROM];
                            eTo = nextStrikeData[__HtmlKey.ATTR][__HtmlKey.TO];

                            // update position and add to current line
                            strikeWidth = ((eTo.width + eFrom.width) >> 1) + eTo.x - eFrom.x;
                            nextElement.setScaleX(strikeWidth / nextElement.width);
                            nextElement.x = eFrom.x + ((strikeWidth - eFrom.width) >> 1);
                            curLine.addChild(nextElement);

                            // warning: increase i here
                            ++i;
                        }
                        else if(this._downTheLineWithStrike(curLine, curElement, i)){
                            // warning: increase i here
                            ++i;
                        }
                    }
                }

                if(this._isType(eData, HtmlTextElementType.STRIKE)){
                    eFrom = eData[__HtmlKey.ATTR][__HtmlKey.FROM];
                    eTo = eData[__HtmlKey.ATTR][__HtmlKey.TO];

                    strikeWidth = ((eTo.width + eFrom.width) >> 1) + eTo.x - eFrom.x;
                    if(curElement.width == 0) continue;

                    curElement.setScaleX(strikeWidth / curElement.width);
                    curElement.x = eFrom.x + ((strikeWidth - eFrom.width) >> 1);

                    elementSize = cc.size(0, 0);
                }
                else{
                    // update line size
                    lineSize.height = Math.max(lineSize.height, elementSize.height);
                    lineSize.width += elementSize.width;
                }

                if(newLine || endText){
                    curLine.setLineSize(lineSize);

                    // update current content size
                    locSize.width = Math.max(locSize.width, lineSize.width);
                    locSize.height += lineSize.height;
                }
                if(newLine){
                    curLine = this._getNewLine();
                    _doNewLine();
                }
                else{
                    posXInLine += elementSize.width;
                }
            }

            // if realSize > targetSize,
            // then add this to a list view with viewSize = targetSize
            var container = this._textMode == HtmlTextMode.WRAP_WIDTH || (this._targetContentSize.height >= locSize.height)
                ? this
                : new cc.Node(); // HARD_SIZE

            for(i = 0; i < this._listLine.length; ++i){
                container.addChild(this._listLine[i]);
            }

            // add to list view if need
            if(this != container){
                this._containerInListView = container;
                container.setCascadeColorEnabled(true);
                container.setCascadeOpacityEnabled(true);

                // init list view
                var viewSize = cc.size(locSize.width, this._targetContentSize.height);
                this._listView = new ccui.ListView();
                this._listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
                this._listView.setContentSize(viewSize);
                this._listView.setInnerContainerSize(viewSize);
                this._listView.setGravity(ccui.ListView.GRAVITY_LEFT);
                this._listView.setBounceEnabled(true);

                // init layout
                var layout = new ccui.Layout();
                layout.setContentSize(locSize);
                layout.addChild(container);
                layout.setCascadeColorEnabled(true);
                layout.setCascadeOpacityEnabled(true);

                container.setPosition(locSize.width >> 1, locSize.height >> 1);
                this._listView.pushBackCustomItem(layout);
                this.addChild(this._listView);
            }
        }
        else{
            cc.error('implement more align mode for: ' + this._textMode);
        }

        this._realContentSize = locSize;
    },

    /**
     *
     * @private
     */
    _align: function(){
        var listViewPos = cc.p(0, 0);
        if(this._vAlign == HtmlTextAlign.TOP){
            var startPos = cc.p(0, 0);
            listViewPos.y = -this._targetContentSize.height;
        }
        else if(this._vAlign == HtmlTextAlign.BOTTOM){
            startPos = cc.p(0, this._realContentSize.height);
            listViewPos.y = 0;
        }
        else{ // CENTER
            startPos = cc.p(0, this._realContentSize.height >> 1);
            listViewPos.y = -this._targetContentSize.height >> 1;
        }

        if(this._hAlign == HtmlTextAlign.LEFT){
            var _getXWrapMode = function(width){
                return 0;
            };
            var _getXHardMode = function(width, contentWidth){
                return -contentWidth >> 1;
            };
        }
        else if(this._hAlign == HtmlTextAlign.RIGHT){
            _getXWrapMode = function(width){
                return -width;
            };
            _getXHardMode = function(width, contentWidth){
                return (contentWidth >> 1) - width;
            };
        }
        else{ // CENTER
            _getXWrapMode = function(width){
                return -width >> 1;
            };
            _getXHardMode = function(width){
                return -width >> 1;
            };
        }

        // list view has anchor point = (0, 0)
        if(this._textMode == HtmlTextMode.HARD_SIZE && this._listView){
            this._listView.setPosition(_getXWrapMode(this._realContentSize.width), listViewPos.y);

            startPos.y = this._realContentSize.height >> 1;
            for(var i = 0; i < this._listLine.length; ++i){
                this._listLine[i].setPosition(_getXHardMode(this._listLine[i].getLineSize().width, this._realContentSize.width), startPos.y - (this._listLine[i].getLineSize().height >> 1));
                startPos.y -= this._listLine[i].getLineSize().height;
            }
        }
        else{
            for(i = 0; i < this._listLine.length; ++i){
                this._listLine[i].setPosition(_getXWrapMode(this._listLine[i].getLineSize().width), startPos.y - (this._listLine[i].getLineSize().height >> 1));
                startPos.y -= this._listLine[i].getLineSize().height;
            }
        }
    },

    /**
     *
     * @param cleanUp
     */
    removeElements: function(cleanUp){
        this._formatDirty = true;
        this._numOfLines = 0;

        for(var i = 0; i < this._listElement.length; ++i){
            if(this._listElement[i] instanceof _HtmlLine) continue;

            var eData = this._listElement[i].getUserData();
            if(eData && this._isType(eData, HtmlTextElementType.CUSTOM)){
                this._listElement[i].removeAllChildren();
                this._listElement[i].removeFromParent(true);
            }
            else{
                if(cleanUp) this._listElement[i].release();
                else _HtmlTextPool.push(this._listElement[i]);

                this._listElement[i].removeFromParent(cleanUp);
            }
        }

        for(i = 0; i < this._listLine.length; ++i){
            if(cleanUp) this._listLine[i].release();
            else _HtmlTextPool.push(this._listLine[i]);

            this._listLine[i].removeFromParent(cleanUp);
        }
        this._listElement.splice(0);
        this._listLine.splice(0);

        this._containerInListView && this._containerInListView.removeFromParent(true);
        this._containerInListView = null;

        this._listView && this._listView.removeFromParent(true);
        this._listView = null;
    },

    cleanUp: function(){
        this.removeElements(true);
    }
});

var _HtmlLine = cc.Node.extend({
    ctor: function(){
        this._super();
        this._lineSize = cc.size(0, 0);

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
    },

    setLineSize: function(size){
        this._lineSize = size;
    },

    getLineSize: function(){
        return this._lineSize;
    },

    reuse: function(){
        this._lineSize = cc.size(0, 0);
    }
});
_HtmlTextPool = new PoolObject();
_HtmlTextPool.setMaxInstance && _HtmlTextPool.setMaxInstance(10);

HtmlTextAlign = {
    CENTER: 1,
    LEFT:   2,
    RIGHT:  3,
    TOP:    4,
    BOTTOM: 5
};

HtmlTextMode = {
    NONE:           0,
    WRAP_WIDTH:     1,
    HARD_SIZE:      2
};

HtmlTextElementType = {
    TEXT:       'text',
    IMAGE:      'image',
    NEW_LINE:   'br',
    STRIKE:     'strike',
    LI:         'li',
    CUSTOM:     'custom'
};

__HtmlKey = {
    ID:         'id',
    TAG:        'tag',
    OPEN_TAG:   'o_tag',
    CLOSE_TAG:  'c_tag',
    IMG:        'img',
    STRIKE:     'strike',
    BR:         'br',
    UL:         'ul',
    OL:         'ol',
    LI:         'li',
    CHILD:      'child',
    ATTR:       'attr',
    SRC:        'src',
    LI_SRC:     'liSrc',
    STRIKE_SRC: 'strikeSrc',
    SIZE:       'size',
    SCALE:      'scale',
    STYLE:      'style',
    TEXT:       'text',
    COLOR:      'color',
    ROTATION:   'rotation',
    OPACITY:    'opacity',
    OUTLINE:    'outline',
    SHADOW:     'shadow',
    FROM:       'from',
    TO:         'to',
    WIDTH:      'width',
    HEIGHT:     'height',
    CUSTOM:     'custom',
    NODE:       'node'
};