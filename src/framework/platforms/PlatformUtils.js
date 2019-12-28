/**
 * Created by bachbv on 3/26/2017.
 */

var PlatformUtils = {
    ignoreKeyBack: false,
    _deviceInfo: null,

    isAndroid: function() {
        return cc.sys.os === cc.sys.OS_ANDROID;
    },

    isIOs: function() {
        return cc.sys.os === cc.sys.OS_IOS;
    },

    isWinPhone: function() {
        return cc.sys.os === cc.sys.OS_WP8 || cc.sys.os === cc.sys.OS_WINRT;
    },

    isDesktop: function() {
        return cc.sys.os === cc.sys.OS_WINDOWS || cc.sys.os === cc.sys.OS_LINUX || cc.sys.os === cc.sys.OS_OSX;
    },

    isMobile: function(){
        return cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_WP8 || cc.sys.os === cc.sys.OS_WINRT;
    },

    loadJsDone: function(){
        if(this.isAndroid()){
            jsb.reflection.callStaticMethod(JNI_Type._classJavascriptJavaBridge, "loadJsDone", JNIFSignature._V_V);
        }
    },

    makeToast: function(msg){
        Notifications.show(msg);
    },
};

var JNIFSignature = {
    _V_V: "()V",
    _V_I: "()I",
    _V_String: "()Ljava/lang/String;",
    _String_V: "(Ljava/lang/String;)V",
    _2String_I: "(Ljava/lang/String;Ljava/lang/String;)I",
    _2String_V: "(Ljava/lang/String;Ljava/lang/String;)V",
    _3String_V: "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
    _4String_V: "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
};

var JNI_Type = {
    _classFrameworkActivity: "com/gsn/baseframework/FrameworkActivity",
    _classJavascriptJavaBridge: "com/gsn/baseframework/JavascriptJavaBridge",
    _classPlatform: "org/cocos2dx/plugin/Platform",
    _classGSNTracker: "com/gsn/tracker/GSNTracker",
    _classGoogleIAPUtil: "com/gsn/inappbilling/util/GoogleIAPUtil",
    _String: "Ljava/lang/String;",
    _int: "I",
    _float: "F",
    _boolean: "Z",
    _void: "V"
};

var iOsNI_Type = {
    _classNative: "NativeOcClass"
};
