/**
 * Created by Tomorow on 4/18/2017.
 */
var DAY_OLD_CAN_SHOW_FIRST_PAY = 0.25;
var DELAY_SHOW_FIRST_PAY = 28800; // 8h
var GUI_STORE_DIRTY = false;
var MIN_LEVEL_TO_OPEN_CODA = 5;
var FREE_TIME_TO_ENABLE_TELCO = 1;

ChannelStore = {
    IAP_IOS:        0,
    IAP_Android:    1,
    CASH_CARD:      2,
    SMS:            3,
    DCB:            4,
    SHOP:           5
};

var IAP_PURCHASE_DELAY = 1000;

PS_ERROR = {
    COUNTRY_NOT_FOUND:          -1,
    OPERATOR_NOT_FOUND:         -2,
    PAYMENT_TYPE_NOT_FOUND:     -3,
    PARAM_INVALID:              -4
};

PAYMENT_ITEMS = {
    GOLD:               1,
    XU:                 2,
    SAFE_BOX:           3
};

PAYMENT_ITEMS_NAME = {
    GOLD:           "GOLD",
    XU:             "XU",
    SAFE_BOX:       "SAFE_BOX",
    VPOINT:         "VPOINT",
    EXP:            "EXP",
    UP_VIP:         "UP_VIP"
};

PAYMENT_CHANNELS = {
    SMS:                    0,

    CARD:                   1,
    ZING_CARD:              2,
    PRE_PAID_CARD:          3,

    E_WALLET:               4,
    IAP:                    5,

    UNKNOWN:                6
};

PAYMENT_SYSTEM = {
    EMPTY:          "empty",
    ZALO:           "zalo",
    BLUE_PAY:       "bluepay",
    MOL:            "mol",
    IAP:            "iap",
    ZMPAY:          "zmp",
    CODA:           "coda",
    _2C2P:          "2c2p",
    IPAYY:          "ipayy"
};

TELCO_CHANNELS = {
    // vietnam
    ZING:           "zing",
    VIETTEL:        "viettel",
    VINA_PHONE:     "vina",
    MOBI_PHONE:     "mobi",

    // thailand
    DTAC_HAPPY:     "dtac",
    TRUE:           "true",
    AIS:            "ais",
    MOL_POINTS:     "mol",

    // indo
    TELKOMSEL:      "telkomsel",
    INDOSAT:        "indosat",
    XL:             "xl",
    HUTCHISON:      "hutchison",

    // malaysia
    MAXIS:          "maxis",
    DIGI:           "digi",
    CELCOM:         "celcom",
    U_MOBILE:       "umobile",

    // myanmar
    TELENOR:        "telenor",
    OOREDOO:        "ooredoo",
    EASY_POINTS:    "easy_points",
    MPT:            "mpt",

    // india
    IDEA:           'idea',
    AIRCEL:         'aircel',
    RELIANCE:       'reliance',
    VODAFONE:       'vodafone',
    AIRTEL:         'airtel',
    BSNL:           'bsnl',
    TATA:           'tata'
};

CURRENCY = {
    VND:            "VND",  // vietnam dong
    IDR:            "IDR",  // indonesian rupiah
    THB:            "THB",  // thai baht
    MYR:            "MYR",  // malaysia ringgit
    MMK:            "MMK",  // myanmar kyat
    INR:            "INR",  // indian rupee
    USD:            "USD"   // dollars
};

var PAY_ZING_URL = "https://pay.play.zing.vn/login/poker";
var Z_ORDER = Z_ORDER || {};
Z_ORDER.PAYMENT_GUI = 100;

CARD_REG = {
    //=======================================================
    // vietnam
    //=======================================================
    viettel:{
        SERIAL:     /^([0-9]{11})$/,
        PIN_CODE:   /^([0-9]{13})$/
    },

    vina:{
        SERIAL:     /^([A-Za-z0-9]{14})$/,
        PIN_CODE:   /^([0-9]{14})$/
    },

    mobi:{
        SERIAL:     /^([0-9]{15})$/,
        PIN_CODE:   /^([0-9]{12})$/
    },

    //=======================================================
    // thailand
    //=======================================================
    dtac:{
        SERIAL:     /^([0-9]{10})$/,
        PIN_CODE:    /^([0-9]{6})$/
    },

    true:{
        SERIAL:     /^([0-9]{14})$/,
        PIN_CODE:   /^([0-9]{14})$/
    },

    ais:{
        SERIAL:     /^([0-9]{16})$/,
        PIN_CODE:   /^([0-9]{16})$/
    },

    mol:{
        SERIAL:     /^([0-9]{10})$/,
        PIN_CODE:   /^([0-9]{14})$/
    },

    //=======================================================
    // indo
    //=======================================================

    //=======================================================
    // malaysia
    //=======================================================

    //=======================================================
    // malaysia
    //=======================================================
    easy_points:{
        SERIAL:     /^([0-9]{18})$/,
        PIN_CODE:   /^([0-9]{18})$/
    }
};