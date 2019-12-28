/**
 * Created by KienVN on 10/19/2015.
 */
var UserDataKey = {
    KEY_ENCRYPT:                            "poKer_sEa_2234",
    PASSWORD:                               "password_",
    USER_ID:                                "user_id_",
    OPEN_ID:                                "open_id_",
    USER_NAME:                              "user_name_",
    SESSION_KEY:                            "session_key_",
    SESSION_TOKEN:                          "session_token_",
    ACCESS_TOKEN:                           "access_token_",
    OAUTHEN_CODE:                           "oauth_code_",
    LOGIN_METHOD:                           "login_method_",
    NATIONAL:                               "national_",
    LANGUAGE:                               "key_user_lang",
    RETRIEVE_DATA:                          "retrieve_data_",
    RATED_APP:                              "rated_app_",
    LIKED_PAGE:                             "liked_page_",
    SPINNER_INDEX:                          "spinner_index_",
    INVITING_TOUR:                          "inviting_tour_",
    REJECT_INVITING_TOUR:                   "reject_inviting_tour_",
    EXCLUSIVE_DEAL:                         "exclusive_deal_",
    INVITED_FRIENDS:                        "invited_friends_",
    VISIT_FACEBOOK:                         "visit_facebook_",
    INSTALL_DATE:                           "install_date_",
    HOT_WEB_PAYMENT:                        "hot_web_payment_",
    MAIL_MARKED_AS_READ:                    "mail_marked_as_read_",
    MY_OPERATOR_TMP:                        "my_operator_tmp_",
    MY_OPERATOR:                            "my_operator",
    POP_UP_FIRST_TIME_SMS:                  "first_sms_",
    POP_UP_FIRST_TIME_CARD:                 "first_cash_card_",
    POP_UP_FIRST_TIME_IAP:                  "first_iap_",
    POP_UP_NEW_EVENT:                       "new_event_",
    RATE_APP_TIME:                          "rate_app_",
    LIKE_PAGE_TIME:                         "like_fanpage_",
    SHOW_PORTAL_TIME:                       "show_portal_",
    NOTIFY_RELOGIN:                         "notify_relogin_",
    NOTIFY_AFK:                             "notify_afk_",
    NOTIFY_FIRST_IAP:                       "notify_first_iap_",
    NOTIFY_FIRST_SMS:                       "notify_first_sms_",
    NOTIFY_FIRST_CASH_CARD:                 "notify_first_cash_card_",
    NOTIFY_INVITE_FRIEND:                   "notify_invite_friends_",
    MUTING_SOUND:                           "muting_sound_",
    MUTING_MUSIC:                           "muting_music_",
    MUTE:                                   "muting_audio_",
    SHOW_HOT_NEWS:                          "show_hot_news_",
    GET_DAILY_MISSIONS_INFO:                "get_daily_missions_info_",
    BROADCAST_POOL:                         "broadcast_pool",
    VIBRATION:                              "vibration",
    MTT_RANKING_UPDATE:                     "mtt_ranking_update",
    PHONE_NUMBER:                           "phone_number",
    QUICK_PLAY_CONFIRM:                     "quick_play_confirm",
    QUICK_PLAY_GAME_MODE:                   "quick_play_game_mode_",
    QUICK_PLAY_PLAYERS_MODE:                "quick_play_players_mode_",
    UPDATED_OUT_GAME_INFO:                  "updated_out_game_info",
    TRANS_OTP_DATA:                         "trans_otp_data",
    TRACKING_OPEN_PAYMENT_GUI:              "tracking_open_payment_gui",
    MY_HOLD_CARD_DATA:                      "my_hold_card_data",
    INFORM_NEAR_EXPIRED_VIP:                "inform_near_expired_vip",
    TIP_GROUP_BUTTON:                       "tip_group_button",
    MAINTAIN_SYSTEM:                        "maintain_system",
    TUTORIAL:                               "tutorial",
    TUTORIAL_QUEST:                         "tutorial_q"
};
fr.UserData = {
    cached:[],

    init: function(){
        var packageName = fr.platformWrapper.getPackageName();
        for(var key in UserDataKey){
            UserDataKey[key] += packageName;
        }
    },

    getString: function (key, defaultValue) {
        var val = PlatformUtils.isDesktop()?this.cached[key]:cc.sys.localStorage.getItem(key);
        if(_.isNull(val) || _.isNaN(val)||_.isUndefined(val))
            return defaultValue;
        else{
            return val;
        }
    },

    setString:function(key, value) {
        if(PlatformUtils.isDesktop()) {
            this.cached[key] = value;
        }else{
            cc.sys.localStorage.setItem(key, value);
        }
        //cc.sys.localStorage.setItem(key, value);
    },

    getNumber:function(key, defaultValue) {
        var val = PlatformUtils.isDesktop()?this.cached[key]:cc.sys.localStorage.getItem(key);
        //var val = cc.sys.localStorage.getItem(key);
        if(_.isNull(val) || _.isNaN(val)||_.isUndefined(val))
            return defaultValue;
        else
            return Number(val);
    },

    setNumber:function(key, value) {
        if(PlatformUtils.isDesktop()) {
            this.cached[key] = value;
        }else{
            cc.sys.localStorage.setItem(key, value);
        }
        //cc.sys.localStorage.setItem(key, value);
    },

    getBoolean:function(key, defaultValue) {
        var val = PlatformUtils.isDesktop()?this.cached[key]:cc.sys.localStorage.getItem(key);
        //var val = cc.sys.localStorage.getItem(key);
        if(_.isNull(val)||
            _.isNaN(val)||
            _.isEmpty(val)||
            _.isUndefined(val))
            return defaultValue;
        else{
            return val == 1;
        }

    },

    setBoolean:function(key, value) {
        var numVal = value ? 1 : 0;
        if(PlatformUtils.isDesktop()) {
            this.cached[key] = numVal;
        }else{
            cc.sys.localStorage.setItem(key, numVal);
        }
        //cc.sys.localStorage.setItem(key, numVal);
    },

    setStringCrypt:function(key, value) {
        try{
            var val = CryptoJS.AES.encrypt(value, UserDataKey.KEY_ENCRYPT);
            if(PlatformUtils.isDesktop()) {
                this.cached[key] = val.toString();
            }else{
                cc.sys.localStorage.setItem(key, val.toString());
            }
            //cc.sys.localStorage.setItem(key, val.toString());
        }
        catch(err){
        }
    },

    getStringCrypt:function(key, defaultValue){
        var val = PlatformUtils.isDesktop()?this.cached[key]:cc.sys.localStorage.getItem(key);
        //var val = cc.sys.localStorage.getItem(key);
        if( _.isNull(val)|| _.isNaN(val) || _.isUndefined(val))
            return defaultValue;
        else{
            return CryptoJS.AES.decrypt(val, UserDataKey.KEY_ENCRYPT).toString(CryptoJS.enc.Utf8);
        }
    }
};

//fr.UserData = {
//
//    init: function(){
//        var packageName = fr.platformWrapper.getPackageName();
//        for(var key in UserDataKey){
//            UserDataKey[key] += packageName;
//        }
//    },
//
//    getString: function (key, defaultValue) {
//        var val = cc.sys.localStorage.getItem(key);
//        if(_.isNull(val) || _.isNaN(val))
//            return defaultValue;
//        else{
//            return val;
//        }
//    },
//
//    setString:function(key, value) {
//        cc.sys.localStorage.setItem(key, value);
//    },
//
//    getNumber:function(key, defaultValue) {
//        var val = cc.sys.localStorage.getItem(key);
//        if(_.isNull(val) || _.isNaN(val))
//            return defaultValue;
//        else
//            return Number(val);
//    },
//
//    setNumber:function(key, value) {
//        cc.sys.localStorage.setItem(key, value);
//    },
//
//    getBoolean:function(key, defaultValue) {
//        var val = cc.sys.localStorage.getItem(key);
//        if(_.isNull(val)||
//            _.isNaN(val)||
//            _.isEmpty(val))
//            return defaultValue;
//        else{
//            return val == 1;
//        }
//
//    },
//
//    setBoolean:function(key, value) {
//        var numVal = value ? 1 : 0;
//        cc.sys.localStorage.setItem(key, numVal);
//    },
//
//    setStringCrypt:function(key, value) {
//        try{
//            var val = CryptoJS.AES.encrypt(value, UserDataKey.KEY_ENCRYPT);
//            cc.sys.localStorage.setItem(key, val.toString());
//        }
//        catch(err){
//        }
//    },
//
//    getStringCrypt:function(key, defaultValue){
//        var val = cc.sys.localStorage.getItem(key);
//        if(_.isNull(val)|| _.isNaN(val))
//            return defaultValue;
//        else{
//            return CryptoJS.AES.decrypt(val, UserDataKey.KEY_ENCRYPT).toString(CryptoJS.enc.Utf8);
//        }
//    }
//};
