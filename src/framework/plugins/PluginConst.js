/**
 * Created by Tomorow on 6/7/2016.
 */

PluginName = {
    BLUE_PAY: "BluePay",
    FACEBOOK: "Facebook",
    GOOGLE: "Google",
    IAP: "iap",
    PLATFORM_WRAPPER: "PlatformWrapper",
    ZALO: "Zalo"
};

var SMS_CALLBACK = false;
SIM_STATE = {
    UNKNOWN: 0,
    ABSENT: 1,
    PIN_REQUIRED:2,
    PUK_REQUIRED: 3,
    NETWORK_LOCKED: 4,
    READY: 5
};

API_VERSION_AVAILABLE = {
    EMAIL: 1
};