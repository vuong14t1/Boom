/**
 * Created by Tomorow on 4/22/2017.
 */

UI_PREFIX = {
    BUTTON:         "btn",
    CHECKBOX:       "cb",
    CONTROL_SWITCH: "cs",
    RICH_TEXT:      "rt",
    WEB_VIEW:       "wv",
    TABLE_VIEW:     "tv",
    EDIT_BOX:       "eb",
    HTML_TEXT:      "html"
};

UI_PARAMS_REQUIRE = {
    CONTROL_SWITCH: 6
};
var UIUtils = {
    _controlSwitchDefault: ["bg_switch", "bg_switch_on", "bg_switch_off", "icon_switch", "UTM_SWISS_721_BLACK_CONDENSED", 25],
    _htmlTextDefault: ['UTM_AVO_P13', 14, 'NONE', 200, 0],

    isButton: function(name){
        return _.isString(name) && name.startsWith(UI_PREFIX.BUTTON);
    },

    isCheckbox: function(name){
        return _.isString(name) && name.startsWith(UI_PREFIX.CHECKBOX);
    },

    isControlSwitch: function(name){
        return _.isString(name) && name.startsWith(UI_PREFIX.CONTROL_SWITCH);
    },

    isEditBox: function(name){
        return _.isString(name) && name.startsWith(UI_PREFIX.EDIT_BOX);
    },

    isWebView: function(name){
        return _.isString(name) && name.startsWith(UI_PREFIX.WEB_VIEW);
    },

    isRickText: function(name){
        return _.isString(name) && name.startsWith(UI_PREFIX.RICH_TEXT);
    },

    isTableView: function(name){
        return _.isString(name) && name.startsWith(UI_PREFIX.TABLE_VIEW);
    },

    isHtmlText: function(name){
        return _.isString(name) && name.startsWith(UI_PREFIX.HTML_TEXT);
    },

    toControlSwitch: function(node){
        if(node.customData == null) {
            node.customData = "";
        }

        var arrData = node.customData.split("|");
        arrData.pop();
        if(arrData.length < UI_PARAMS_REQUIRE.CONTROL_SWITCH){
            if(arrData.length > 0){
                ZLog.error("toControlSwitch require " + UI_PARAMS_REQUIRE.CONTROL_SWITCH + " params for " + node.getName());
            }

            for(var i = arrData.length; i < UI_PARAMS_REQUIRE.CONTROL_SWITCH; ++i){
                arrData.push(this._controlSwitchDefault[i]);
            }
        }

        var mSwitch = new cc.ControlSwitch(
            new cc.Sprite(res[arrData[0]]),
            new cc.Sprite(res[arrData[1]]),
            new cc.Sprite(res[arrData[2]]),
            new cc.Sprite(res[arrData[3]]),
            new ccui.Text("", res[arrData[4]], res[arrData[5]]),
            new ccui.Text("", res[arrData[4]], res[arrData[5]])
        );
        mSwitch.setAnchorPoint(node.getAnchorPoint());
        mSwitch.setPosition(node.getPosition());

        return mSwitch;
    },

    toHtmlText: function(node){
        if(node.customData == null) {
            node.customData = "";
        }

        // merge config html text
        var arrData = node.customData.split("|");
        for(var i = 0; i < this._htmlTextDefault.length; ++i){
            if(i < arrData.length) continue;
            arrData[i] = this._htmlTextDefault[i];
        }

        var htmlText = new HtmlText(res[arrData[0]], parseInt(arrData[1]));
        htmlText.setMode(HtmlTextMode[arrData[2]], cc.size(parseFloat(arrData[3]), parseFloat(arrData[4])));
        var anchorPoint = node.getAnchorPoint();
        if(anchorPoint.x <= 0) htmlText.setHorizontalAlign(HtmlTextAlign.LEFT);
        else if(anchorPoint.x < 1) htmlText.setHorizontalAlign(HtmlTextAlign.CENTER);
        else htmlText.setHorizontalAlign(HtmlTextAlign.RIGHT);

        if(anchorPoint.y <= 0) htmlText.setVerticalAlign(HtmlTextAlign.BOTTOM);
        else if(anchorPoint.y < 1) htmlText.setVerticalAlign(HtmlTextAlign.CENTER);
        else htmlText.setVerticalAlign(HtmlTextAlign.TOP);

        return htmlText;
    },

    toEditBox: function(node){
        node.isPassword = false;
        node._placeHolder = languageMgr.getString('ENTER_SOMETHING');
        node._placeHolderColor = cc.color('#646464');
        node._realColor = cc.color('#ffffff');
        node._realString = '';
        node._inputMode = cc.EDITBOX_INPUT_MODE_SINGLELINE;
        node._inputFlag = cc.EDITBOX_INPUT_FLAG_SENSITIVE;
        node._maxLength = 50;

        // implement ccui.Text to textField
        node.setPlaceHolderColor = function(color){
            node._placeHolderColor = color;
        };

        node.getPlaceHolderColor = function(){
            return node._placeHolderColor;
        };

        node.setPlaceHolder = function(text){
            node._placeHolder = text;
            node.setColor(node.getPlaceHolderColor());
            node.setString(text);
        };

        node.getPlaceHolder = function(){
            return node._placeHolder;
        };

        node.setRealColor = function(color){
            node._realColor = color;
        };

        node.getRealColor = function(){
            return node._realColor;
        };

        node.setRealString = function(text){
            node._realString = text;
            if(text.length == 0){
                node.setPlaceHolder(node.getPlaceHolder());
            }
            else{
                node.setColor(node.getRealColor());
                node.setString(node.isPassword ? _.repeat('*', text.length) : text);
            }
        };

        node.getRealString = function(){
            return node._realString;
        };

        node.setInputMode = function(mode){
            node._inputMode = mode;
        };

        node.getInputMode = function(){
            return node._inputMode;
        };

        node.setInputFlag = function(flag){
            node._inputFlag = flag;
        };

        node.getInputFlag = function(){
            return node._inputFlag;
        };

        node.setMaxLength = function(length){
            node._maxLength = length;
        };

        node.getMaxLength = function(){
            return node._maxLength;
        };

        node.cleanUpField = function(){
            node._realString = '';
            node.setPlaceHolder(node._placeHolder);
        };
    },

    toWebView: function(layer){

    },

    toRickText: function(layer){

    },

    toTableView: function(layer){

    },
}