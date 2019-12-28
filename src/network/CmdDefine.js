var CMD = {
    //=================================================================
    // login cmd_s 0
    //=================================================================
    HAND_SHAKE  : 0,
    USER_LOGIN  : 1,
    USER_LOG_OUT: 2,
    CONNECT_UDP : 40,
    TEST_UDP    : 41,
    DISCONNECTED: 37,

    // ping
    PING: 50,

    //=================================================================
    // player cmd_s 1000 - 1149
    //=================================================================
    PLAYER_GET_INFO                  : 1100,
    GET_INVENTORY_INFO               : 1101,
    PLAYER_GET_INFO_DETAIL           : 1002,
    PLAYER_CHEAT                     : 1010,
    PLAYER_UPGRADE_VIP               : 1011,
    PLAYER_CLAIM_DAILY_SUPPORTED_GOLD: 1012,
    PLAYER_CLAIM_RATE_APP            : 1013,
    PLAYER_CLAIM_LIKE_PAGE           : 1014,
    PLAYER_UPDATE_URL_AVATAR         : 1015,
    PLAYER_UPDATE_TELCO              : 1016,


    USER_ADD_EXP                     : 1111,
    GET_SERVER_TIME                  : 1990,
    CHEAT_OPTION                     : 1991,
    //=================================================================
    // LoBBY 1200 cmd_s 2000-2999
    //=================================================================
    LOBBY_QUICK_PLAY: 1200,


    //=================================================================
    // GamePlay 3001-3999
    //=================================================================
    PLAYER_JOIN_GAME               : 2002,
    PLAYER_LEAVE_ROOM              : 2003,
    PLAYER_START_GAME              : 2004,
    SHOWDOWN_GAME                  : 2005,
    SNAPSHOT_CLIENT                : 2008,
    SNAPSHOT_SERVER                : 2009,
    CLIENT_PUT_BOOM                : 2010,
    CLIENT_TAKE_ITEM               : 2011,
    PLAYER_BUY_ITEM_DGS            : 2012,
    CHANGE_PHASE                   : 2013,
    PLAYER_SURRENDER               : 2014,
    PLAYER_UPDATE_STATUS           : 2015,
    CONFIRM_REMATCH                : 2016,
    REFUSE_REMATCH                 : 2017,

    TEST_UDP_RESPONSE              : 2100,
    RELOAD_GAME                    : 2101,
    //=================================================================
    // payment 8000
    //=================================================================
    PAYMENT_IN_APP_PURCHASE_ANDROID: 8001,
    PAYMENT_IN_APP_PURCHASE_IOS    : 8002,
    PAYMENT_UPDATE                 : 8008,
    PAYMENT_FIRST_PAY_UPDATE       : 8020,
    PAYMENT_CREATE_TRANS           : 8100,
    PAYMENT_ZMP_SUBMIT_CARD        : 8200,
    PAYMENT_ZMP_REG_SMS            : 8201,
    PAYMENT_ZMP_GET_STATUS         : 8202,
    PAYMENT_SEA_VERIFY_OTP         : 8101,

    //=================================================================
    // cheat 9000
    //=================================================================
    CHEAT_SET_USER_ATTRIBUTE: 9000,
    CHEAT_DISCONNECT        : 9002,
    CHEAT_USER_PAYMENT      : 9100,
    CHEAT_CLIENT_LOG        : 9101,

    //=================================================================
    // system
    //=================================================================
    SYSTEM_MAINTAIN: 9200,
    TEST_TYPE_DATA : 9700
};