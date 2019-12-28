/**
 * Created by bachbv on 1/21/2017.
 */

var ERROR_CODE = ERROR_CODE || {};

ERROR_CODE = {
    SUCCESS:                                    0,
    FAIL:                                       1,
    PARAM_INVALID:                              2,
    MAINTAIN_SYSTEM:                            3,
    SESSION_KEY_INVALID:                        4,
    SESSION_EXPIRED:                            5,

    PASSWORD_TOO_LONG:                          17,
    WRONG_PASSWORD:                             18,
    UNFIT_TO_JOIN:                              19,
    ROOM_NOT_EXIST:                             20,
    NOT_ENOUGH_MIN_BUY_IN:                      21,
    OUT_BUY_IN_RANGE:                           22,
    GAME_STRUCTURE_INVALID:                     23,
    ALREADY_IN_GAME:                            24,
    ENTERING_GAME:                              25,
    GAME_STRUCTURE_OUT_ZONE:                    26,
    FRIEND_EXISTED:                             28,
    FRIEND_LIST_IS_FULL:                        29,
    ROOM_FULL:                                  30,
    TOO_MUCH_GOLD_TO_RECEIVE_SUPPORT:           31,
    REACH_MAX_DAILY_SUPPORT_TIME:               32,

    NOT_ENOUGH_NUMBER_INVITED_FRIENDS:          32,
    NOT_ENOUGH_TOTAL_GROSS:                     32,
    OVER_MAX_FRIEND_INVITATION_PER_DAY:         32,
    GAME_NOT_EXIST:                             33,
    GIFT_CODE_INVALID:                          43,
    GIFT_CODE_EXPIRED:                          44,
    GIFT_CODE_IS_USED:                          45,
    USER_USED_CODE_IN_EVENT:                    46,
    GIFT_CODE_SYSTEM_MAINTAINING:               47,

    PLAYER_ACTION_INVALID:                      50,
    PLAYER_ACTION_FAIL:                         51,
    PLAYER_ACTION_IN_COOL_DOWN_TIME:            52,

    PAYMENT_TRANSACTION_IS_NOT_VERIFIED:        60,
    PAYMENT_TRANSACTION_DUPLICATED:             61,
    PAYMENT_TRANSACTION_SANDBOX_TO_PRODUCTION:  62,
    PAYMENT_TRANSACTION_PRODUCTION_TO_SANDBOX:  63,
    PAYMENT_PRODUCT_ID_INVALID:                 64,
    PAYMENT_CAN_NOT_UPDATE_TO_BILLING:          65,

    NOT_ENOUGH_XU:                              100,
    NOT_ENOUGH_GOLD:                            101
};

var ZINGME_ERROR = {
    SUCCESS:                                    0,
    ACCOUNT_INVALID:                            1,
    ERROR_WHEN_PROCESSING_2:                    2,
    USERNAME_DOES_NOT_EXISTED:                  3,
    WRONG_PASSWORD:                             4,
    ACCOUNT_LOCKED:                             5,
    ERROR_WHEN_PROCESSING_6:                    6,
    ERROR_WHEN_PROCESSING_7:                    7,
    ERROR_WHEN_PROCESSING_8:                    8,
    ERROR_WHEN_PROCESSING_9:                    9,
    ERROR_WHEN_PROCESSING_10:                   10,
    ERROR_WHEN_PROCESSING_11:                   11,
};

var ZACC_ERROR = {
    SUCCESS:                                    3,
    FATAL_ERROR:                                -1,
    REQUEST_BODY_INVALID:                       -2,
    WRONG_PASSWORD:                             6,
    USERNAME_INVALID:                           10,
    PASSWORD_INVALID:                           11,
    USERNAME_ALREADY_EXISTED:                   12,
    USERNAME_DOES_NOT_EXISTED:                  13,
    SESSION_VALID:                              14,
    SESSION_INVALID:                            15,
    ZPID_DOES_NOT_EXIST:                        16,
    DEVICE_ID_INVALID:                          17,
    PARTNER_ID_INVALID:                         18,
    USERNAME_PASSWORD_NOT_MATCH:                30,

    PARSE_JSON_FAIL:                            1001,
    FAIL:                                       1002
};

var RETRIEVE_CODE = {
    INTERNAL_ERROR:                             -2,
    PARAM_INVALID:                              -1,
    HAS_SEA_DATA:                               1,
    HAS_TEXAS_DATA:                             2,
    NO_TEXAS_DATA:                              3
};

var TRANS_ERROR_CODE = {
    SUCCESS:                                    1,
    CREATE_TRANSACTION_FAIL:                    -1,
    WRONG_PAYMENT_METHOD:                       -2,
    CARD_INFO_INVALID:                          -10,
    PARTNER_MAINTAIN:                           -13,
    WRONG_HASH:                                 -100
};

var ZING_CARD_CODE = {
    SUCCESS:                                    1,
    FAIL:                                       -1,
    IN_PROCESSING:                              2
};

var Z_PORTAL_ERROR = {
    SUCCESS:                                    0,
    USER_CANCEL:                                3,
    PARSE_JSON_FAIL:                            1001,
    FAIL:                                       1002,
    USER_INFO_NOT_FOUND:                        110
};
