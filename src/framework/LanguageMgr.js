/**
 * Created by huyvq2 on 11/9/2015.
 */

var LanguageMgr = cc.Class.extend({

    ctor: function () {
        this.langData = null;
        this.langName = null;
        this._imgPathFormat = 'res/localize/@lang/@name.png';

        this.updateLang();
    },

    updateLang:function(fromIp){
        if(fromIp === undefined)  fromIp = COUNTRY.MYANMAR;

        var defaultLang = fr.UserData.getString(UserDataKey.LANGUAGE, '');
        if(defaultLang.length == 0) {
            switch (fromIp){
                case COUNTRY.INTERNATIONAL:
                    defaultLang = LANGUAGE.ENGLISH;
                    break;
                default:
                    defaultLang = LANGUAGE.ENGLISH;
            }
            fr.UserData.setString(UserDataKey.LANGUAGE, defaultLang);
        }

        this.langName = defaultLang;
        this.prevLanguage = null;

        this.loadLanguage();
    },

    loadLanguage: function () {
        // load text file
        try{
            if (!cc.sys.isNative) {
                var data = cc.loader.getRes(this._getLangPack());
                if (data) {
                    this.langData = JSON.parse(data);
                }else{
                    ZLog.error("load language pack failed!");
                }
            } else {
                data = jsb.fileUtils.getStringFromFile(this._getLangPack());
                if (data) {
                    this.langData = JSON.parse(data);
                }else{
                    ZLog.error("load language pack failed!");
                }
            }
        }
        catch(e){
            ZLog.error("loadLanguage: " + e.message);
        }

        if (this.langData) {
            //if(this.prevLanguage){
            //    resourceMgr.unloadPlist(this._getImgPack(this.prevLanguage));
            //}
            //resourceMgr.loadPlist(this._getImgPack(this.langName));

            var event = new cc.EventCustom(LanguageMgr.langEventName);
            event.setUserData(this.langName);
            cc.eventManager.dispatchEvent(event);
            fr.UserData.setString(UserDataKey.LANGUAGE, this.langName);
        }
    },

    _getImgPack: function (lang) {
        if(lang === undefined) lang = this.langName;
        return "res/localize/" + lang + "/pack_" + lang + ".plist";
    },

    _getLangPack: function (lang) {
        if(lang === undefined) lang = this.langName;
        return "res/localize/" + lang + "/lang_" + lang + ".txt";
    },

    unLoadLanguage: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(this._getImgPack());
    },

    getString: function (key) {
        if(!cc.sys.isNative)
            return this.getStringWithoutTag(this.langData["text"][key] || key);

        return this.langData["text"][key] || key;
    },

    getImgPath: function(imgName){
        if(GV.ENCODE_FILE_NAME){
            imgName = XORCipher.encode(imgName);
        }
        return this._imgPathFormat.replace('@lang', this.langName).replace('@name', imgName);
    },

    getCurrentLanguage: function(){
        return this.langName;
    },

    changeLanguage:function(name){
        if(this.langName == name) return;

        this.prevLanguage = this.langName;
        this.langName = name;
        this.loadLanguage();

        // change localization for current scene
        var currentScene = sceneMgr.getCurrentScene();
        if(currentScene){
            currentScene.updateLocalization();
        }
    },

    getStringWithoutTag: function(inputString) {
        if(inputString.indexOf("<") == -1) return inputString;

        var arr_split_first = inputString.split("<");
        var arr = [];

        for(var i = 0; i < arr_split_first.length; i++) {
            if(arr_split_first[i].indexOf(">") == -1){
                arr.push(arr_split_first[i]);
            }
            else
            {
                var temp = arr_split_first[i].split(">");
                for(var j = 0; j < temp.length; j++)
                    if(temp[j].indexOf("font") == -1
                        && temp[j].indexOf("size") == -1
                        && temp[j].indexOf("color") ==-1){

                        arr.push((temp[j]));
                    }
            }
        }

        return arr.join("");
    }

});

var LANGUAGE = {
    VIETNAMESE:     'vie',
    THAI:           'tha',
    INDO:           'ind',
    MYANMAR:        'mya',
    HINDI:          'hin',
    ENGLISH:        'eng'
};

var COUNTRY = {
    VIETNAM:        'vi',
    THAILAND:       'th',
    ENGLAND:        'en',
    INDO:           'id',
    MALAYSIA:       'my',
    MYANMAR:        'mm',
    INDIA:          'in',
    GOFA:           'gofa',
    INTERNATIONAL:  'international'
};

LanguageMgr.langEventName = "lang_changed";