/**
 * Created by bachbv on 1/9/2017.
 */

var GV = GV || {};

GV.GAME    = "SecretBom";
GV.CONTACT = {
    toEmail     : "support@zingplay.com",
    subject     : "[" + GV.GAME.toUpperCase() + " ZingPlay] Feedback",
    body        : "load from localize",
    chooserTitle: "[Feedback for ျမန္မာ ပိုကာ ZingPlay]",
    isHtmlText  : false
};

BUILD_MODE = {
    DEV    : "dev",
    PRIVATE: "private",
    LIVE   : "live"
};

MAX_DESIGN_SIZE = cc.size(640, 1280);

//==============================================
// modify when build
//==============================================
GV.MODE             = BUILD_MODE.DEV;
GV.VERSION_FULL     = "";
GV.VERSION          = "1p";
GV.ENCODE_FILE_NAME = false;
//==============================================

GV.VISIBALE_SIZE = null;
GV.RES_JSON_LIST = "res/jsons/jsonList.json";
GV.TIME_LOOP     = 0.3;
GV.FRAME_RATE    = null;

//==============================================
// MANAGERS
//==============================================
/**@type {ModuleMgr}*/
var moduleMgr    = null;
/**@type {ResourcesMgr}*/
var resourceMgr  = null;
/**@type {LanguageMgr}*/
var languageMgr  = null;
/**@type {SceneMgr}*/
var sceneMgr     = null;
var effectMgr    = null;
var connector    = null;
var connectorUdp = null;
/**@type {ServicesMgr}*/
var servicesMgr  = null;
/**@type {PoolObject}*/
var poolObject   = null;
//==============================================
// SCENE IDS
//==============================================
GV.SCENE_IDS = {
    LOADING   : 0,
    LOGIN     : 1,
    LOBBY     : 2,
    LOBBY_GAME: 3,
    MAINTAIN  : 6,
    GAME      : 7,
    SETTING_JOYSTICK : 9
};

//==============================================
// LAYERS
//==============================================
GV.MAX_LAYERS = 8;
GV.LAYERS     = {
    BG        : 0,
    GAME      : 1,
    EFFECT    : 2,
    MOVE      : 3,  // special layer, this includes : layer BG, GAME, EFFECT
    GUI       : 4,
    GUI_EFFECT: 5,
    LOADING   : 6,
    CURSOR    : 7
};

GV.TIME_FORMAT = {
    DD_HH      : "DD@dHH@h",             // ex: 2d12h
    DD_HH_MM   : "DD@dHH@hMM@m",         // ex: 2d12h30m
    DD_HH_MM_SS: "DD@dHH@hMM@mSS@s",     // ex: 2d12h30m16s

    HH_MM   : "HH@hMM@m",             // ex: 12h30m
    HH_MM_SS: "HH@hMM@mSS@s",         // ex: 12h30m16s
    MM_SS   : "MM@:SS@(s)"              // ex: 12m30s
};

GV.DATE_FORMAT = {
    DD_MM   : "DD/MM",                // ex: 31/12
    DD_MM_YY: "DD/MM/YY",             // ex: 31/12/2015
    HH_MM   : "HH:M_M"                // ex: 9:05
};

CONNECTION_STATUS = {
    NO_NETWORK: 0,
    THREE_G   : 1,
    WIFI      : 2
};

var latinRegEx        = /^(?:[A-Za-z0-9_]+)$/;
var usernameRegEx     = /^(?:[A-Za-z0-9_.@]{6,32})$/;
var passwordRegEx     = /^(?:[A-Za-z0-9~!@#$%^&*()_+`\-=\[\]{};':"\\|,.<>\/?]{6,35})$/;
var passwordRoomRegEx = /^(?:[A-Za-z0-9~!@#$%^&*()_+`\-=\[\]{};':"\\|,.<>\/?]{0,8})$/;
var emailRegEx        = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var timeStay          = 0;
var timeLeave         = 0;
var isNeedReloadData  = false;