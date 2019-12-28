/**
 * Created by Tomorow on 4/26/2017.
 */

var Cheat = {
    isEnable          : true,
    isEnableCountry   : true,
    isEnableOperator  : true,
    isEnablePayment   : true,
    isEnableConfirmSMS: false,
    isEnableVipLevel  : false,

    country   : COUNTRY.MYANMAR,
    operator  : "25402",
    payments  : [PAYMENT_SYSTEM._2C2P, PAYMENT_SYSTEM.CODA, PAYMENT_SYSTEM.MOL, PAYMENT_SYSTEM.IAP],
    confirmSMS: true,
    vipLevel  : 2,

    fakeData  : false,
    prediction: true,
    rttTime   : 200,
    jitter    : 100,
    missRate  : 0.4,
    autoPlay  : false,
    showDebugUI :false
};