/**
 * Created by Cantaloupe on 4/24/2016.
 */

RichTextColor = {
    RED: "RED",
    GREEN: "GREEN",
    BLUE: "BLUE",
    BLACK: "BLACK",
    WHITE: "WHITE",
    YELLOW: "YELLOW"
};

RichTextAlignment = {
    LEFT: 0,
    RIGHT: 1,
    CENTER:2,
    JUSTIFIED:3,
    TOP:4,
    MIDDLE:5,
    BOTTOM:6
};

var CustomRichText = cc.Layer.extend({
    ctor:function(size) {
        this._super();

        this._curId = 0;

        this._font = "";
        this._size = 20;
        this._color = cc.color.WHITE;

        this._richText = new ccui.RichText();
        this.addChild(this._richText);

        if (size) {
            this.setTextContentSize(size);
        }
        else {
            this.setTextContentSize(cc.size(500, 200));
        }

        this.setCascadeOpacityEnabled(true);
        this._richText.ignoreContentAdaptWithSize(false);

        if(!cc.sys.isNative) {
            this._richText.setLineBreakOnSpace(true);
        }
    },

    getTextContentSize:function() {
        return this._richText.getContentSize();
    },

    getFontName: function(){
        return this._font;
    },

    getFontSize: function(){
        return this._size;
    },

    setTextContentSize:function(size) {
        this._richText.setContentSize(size);
    },

    setDefaultFont:function(font) {
        this._font = font;
    },

    setDefaultSize:function(size) {
        this._size = size;
    },

    setDefaultColor:function(color) {
        this._color = color;
    },

    setDefaultAlignHorizontal:function(val) {
        if(cc.sys.isNative) {
            this._richText.setAlignmentHorizontal(val);
        } else {
            if(val == RichTextAlignment.RIGHT) val = cc.TEXT_ALIGNMENT_RIGHT;
            else if(val == RichTextAlignment.CENTER) val = cc.TEXT_ALIGNMENT_CENTER;
            else if(val == RichTextAlignment.LEFT) val = cc.TEXT_ALIGNMENT_LEFT;
            this._richText.setTextHorizontalAlignment(val);
        }
    },

    setDefaultAlignVertical:function(val) {
        if(cc.sys.isNative) {
            this._richText.setAlignmentVertical(val);
        } else {
            if(val == RichTextAlignment.BOTTOM) val = cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM;
            else if(val == RichTextAlignment.MIDDLE) val = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
            else if(val == RichTextAlignment.TOP) val = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
            this._richText.setTextVerticalAlignment(val);
        }
    },

    appendText:function(text, font, size, color, opacity) {
        if(!text) return;
        //ZLog.debug("append text \"%s\" @CustomRichText",text);
        var el = new ccui.RichElementText(
            this.getAutoId(),
            (color) ? cc.color(color) : this._color,
            (opacity) ? opacity : 255,
            text,
            (font) ? font : this._font,
            (size) ? parseInt(size) : this._size
        );
        this._richText.pushBackElement(el);
        this._richText.formatText();
    },

    clearText:function() {
        for (var i = 0; i < this._curId; ++i) {
            this._richText.removeElement(0);
        }
        this._curId = 0;
    },

    getAutoId:function() {
        return ++this._curId;
    },

    setString:function(text) {
        this.clearText();

        var splitArr = [];

        var tmpStr = text;
        while (true) {
            var index1 = tmpStr.indexOf("<");
            if (index1 == 0) {
                index1 = tmpStr.indexOf("<", 1);
            }
            if (index1 < 0) {
                splitArr.push(tmpStr);
                break;
            }

            splitArr.push(tmpStr.substr(0, index1));
            tmpStr = tmpStr.substr(index1);
        }

        var tmp1 = [];
        for (var i = 0; i < splitArr.length; ++i) {
            var tmpIdx = splitArr[i].indexOf(">");
            if (tmpIdx < 0) {
                tmp1.push(splitArr[i]);
                continue;
            }
            tmp1.push(splitArr[i].substr(0, tmpIdx + 1));
            if (tmpIdx + 1 < splitArr[i].length) {
                tmp1.push(splitArr[i].substr(tmpIdx + 1));
            }
        }

        var isCreateNewElement = false;
        var obj;
        var numTag = 0;
        for (var i = 0; i < tmp1.length; ++i) {
            if (isCreateNewElement == false) {
                numTag = 0;
                obj = {};
                isCreateNewElement = true;
            }

            if (tmp1[i].indexOf("</") < 0 && tmp1[i].indexOf("<") < 0) {
                obj.text = tmp1[i];
                if (numTag == 0) {
                    // begin or end of text -> use default format
                    this.appendText(obj.text);
                    isCreateNewElement = false;
                }
                continue;
            }
            if (tmp1[i].indexOf("</") < 0 && tmp1[i].indexOf("<") >= 0) {
                // have override format
                numTag++;
                var oneTag = tmp1[i];
                obj[oneTag.substr(1, oneTag.indexOf(" ") - 1)] = oneTag.substr(oneTag.lastIndexOf(" ") + 1, oneTag.indexOf(">") - oneTag.lastIndexOf(" ") - 1);
                continue;
            }
            if (tmp1[i].indexOf("</") >= 0) {
                // end of format
                numTag--;
                if (numTag <= 0) {
                    //ZLog.debug(JSON.stringify(obj));
                    this.appendText(obj["text"], obj["font"], obj["size"], obj["color"], obj["opacity"]);
                    isCreateNewElement = false;
                }
            }
        }
    }
});

/**
 * ex: CustomRichText.create("", cc.size(450, 10), res.UTM_AVO_P13_BOLD, 30, cc.color('#ffffff'), RichTextAlignment.CENTER, RichTextAlignment.MIDDLE);
 * @param text
 * @param size
 * @param defFont
 * @param defSize
 * @param defColor
 * @param defAlignHorizontal
 * @param defAlignVertical
 * @returns {*}
 */
CustomRichText.create = function(text, size, defFont, defSize, defColor, defAlignHorizontal, defAlignVertical) {
    defAlignHorizontal = defAlignHorizontal !== undefined ? defAlignHorizontal : RichTextAlignment.CENTER;
    defAlignVertical = defAlignVertical !== undefined ? defAlignVertical : RichTextAlignment.MIDDLE;
    text = text !== undefined ? text : "";
    defSize = defSize !== undefined ? defSize : 20;
    defColor = defColor !== undefined ? defColor : cc.color.WHITE;
    defFont = defFont!== undefined ? defFont : res.UTM_AVO_P13_BOLD;
    size = size !== undefined ? size : cc.size(500, 200);

    if(cc.sys.isNative){
        var label = new CustomRichText(size);
        label.setDefaultFont(defFont);
        label.setDefaultColor(defColor);
        label.setDefaultSize(defSize);
        label.setDefaultAlignHorizontal(defAlignHorizontal);
        label.setDefaultAlignVertical(defAlignVertical);
        label.setString(text);
    }
    else{
        text = GameUtils.getPerfectText(text, defFont, defSize, size.width, cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label = new ccui.Text(text, defFont, defSize);
        label.setTextAreaSize(size);

        switch (defAlignHorizontal){
            case RichTextAlignment.CENTER:
                label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                break;
            case RichTextAlignment.LEFT:
                label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                break;
            case RichTextAlignment.RIGHT:
                label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
                break;
        }

        switch (defAlignVertical){
            case RichTextAlignment.MIDDLE:
                label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                break;
            case RichTextAlignment.TOP:
                label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
                break;
            case RichTextAlignment.BOTTOM:
                label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
                break;
        }
    }

    return label;
};

CustomRichText.prototype.setZString = function(key, isUpperCase){
    this.setString(isUpperCase ? languageMgr.getString(key).toUpperCase() : languageMgr.getString(key));
};