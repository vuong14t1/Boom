/**
 * Created by quannh on 3/4/2016.
 */

var notificationMgr = {
    _packageUrl: "",

    init: function(){
        this._packageUrl = "https://zingthai-poker.static.g6.zing.vn/web/poker/";
    },

    onStart:function() {
        fr.platformWrapper.cancelAllNotification();
        this.hideNotificationListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: cc.game.EVENT_HIDE,
            callback: function (event) {
                notificationMgr.scheduleNotifications();
            }
        });

        this.showNotificationListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: cc.game.EVENT_SHOW,
            callback: function (event) {
                fr.platformWrapper.cancelAllNotification();
            }
        });

        cc.eventManager.addListener(this.hideNotificationListener, 1);
        cc.eventManager.addListener(this.showNotificationListener, 1);
    },

    handleNotificationExtraData: function(extraDataStr){
        ZLog.debug("HANDLE_EXTRA_DATA | " + extraDataStr);

        if(extraDataStr && extraDataStr.length > 0){
            try{
                var data = JSON.parse(extraDataStr);
                if(data && data.id){
                    ZAccTracker.track(data.id);

                    // reset extra data
                    fr.platformWrapper.setNotificationExtraData("");
                }
            }
            catch(e){
                ZLog.debug("json parse error: " + extraDataStr + ", msg = " + e.message);
            }
        }
    },

    /**
     * schedule notifications to user device
     */
    scheduleNotifications:function() {
        if(servicesMgr.isUsePortal() || languageMgr.langData == null) return;

        //notificationMgr.addNotificationTest();
        notificationMgr.addNotificationAFK();
        notificationMgr.addNotificationFirstPay();

        // run schedule
        fr.platformWrapper.showNotify();
    },

    addNotificationTest: function(){
        // lap lanh \u2728

        //var imageURI = "https://lh6.googleusercontent.com/-55osAWw3x0Q/URquUtcFr5I/AAAAAAAAAbs/rWlj1RUKrYI/s1024/A%252520Photographer.jpg";
        //var summaryText = "This is summary text demo 1, bla ...";
        //notificationMgr.addNotificationInFutureAfter("TEST", {id: TrackingAction.RE_LOGIN}, imageURI, summaryText, 0, 0, 1);
        //
        //imageURI = "https://lh3.googleusercontent.com/-rrFnVC8xQEg/URqufdrLBaI/AAAAAAAAAbs/s69WYy_fl1E/s1024/Chess.jpg";
        //summaryText = "This is summary text demo 2, bla ...";
        //notificationMgr.addNotificationInFutureAfter("TEST_1", {id: TrackingAction.AFK_2H}, imageURI, summaryText, 0, 0, 2);

        //var filePath = cc.path.changeBasename(
        //    res.img_notification_event_purchase_promotion,
        //    //XORCipher.decode(Utility.getFileName(res.img_notification_event_purchase_promotion)),
        //    XORCipher.decode(Utility.getFileName('__b__CU0mGHVcAR5SCUHfUcQcK7pDA2VrUtx8RwMulsHpHip9.png')),
        //    true
        //);

        var summaryText = "This is summary text demo 3, bla ...";
        notificationMgr.addNotificationInFutureAfter(
            'NOTIFICATION_AFK_2H',
            {id: TrackingAction.AFK_2H}, '',
            '', 0, 0, 1);

        //var imageURI = "assets://" + res.bg_first_time_card;
        //var summaryText = "This is summary text demo 3, bla ...";
        //notificationMgr.addNotificationInFutureAfter("TEST_2", {id: TrackingAction.INFORM_GIFT_7_DAYS}, imageURI, summaryText, 0, 0, 3);

        //notificationMgr.addNotificationInFutureAfter("TEST_3", {id: TrackingAction.RE_LOGIN}, "", "", 0, 0, 4);
        //notificationMgr.addNotificationInFutureAfter("TEST_4", {id: TrackingAction.RE_LOGIN}, "", "", 0, 0, 5);
    },

    addNotificationAFK: function(){
        var configNotification = resourceMgr.getConfigNotification(TrackingAction.AFK_2H);
        var lastTime = fr.UserData.getNumber(UserDataKey.NOTIFY_AFK, 0);

        if(configNotification != null && configNotification.isAvailable && Utility.getServerTimeInSeconds() >= lastTime){
            notificationMgr.addNotificationTodayAtTime(
                languageMgr.getString("NOTIFICATION_AFK_2H"),
                {id: TrackingAction.AFK_2H},
                "", "",
                configNotification['hour'], configNotification['minute']
            );
        }
    },

    addNotificationFirstPay: function(){

    },

    /**
     * time in milliseconds
     * @param time
     * @param string
     * @param extraData
     * @param imageURI
     * @param summaryText
     * @param sound
     */
    addNotification:function(time, string, extraData, imageURI, summaryText, sound) {
        ZLog.debug('current language = ' + languageMgr.getCurrentLanguage());
        var notice = {
            contentTitle: languageMgr.getString(string),
            contentText: languageMgr.getString('TOUCH_TO_PLAY_NOW'),
            time: time,
            extraData: JSON.stringify(extraData),
            imageURI: imageURI || "",
            summaryText: summaryText || "",
            sound: sound || "default"
        };

        ZLog.debug("addNotification: %s", JSON.stringify(arguments));
        fr.platformWrapper.addNotify(notice);
    },

    addNotificationTodayAtTime: function(msg, extraData, imageURI, summaryText, hour, minutes){
        this.addNotificationInFutureAt(msg, extraData, imageURI, summaryText, 0, hour, minutes);
    },

    addNotificationInFutureAfter: function(msg, extraData, imageURI, summaryText, days, hour, minutes){
        if(minutes === undefined) minutes = 0;
        if(hour === undefined) hour = 0;

        var someDay = new Date();
        var curTime = someDay.getTime();
        someDay.setTime(curTime + days * 86400000 + hour * 3600000 + minutes * 60000);
        var nextTime = someDay.getTime();

        // if is future
        if(nextTime > curTime){
            notificationMgr.addNotification(nextTime, msg, extraData, imageURI, summaryText);
        }
        else{
            ZLog.debug("not add: %s cur = %d, next = %d", msg, curTime, nextTime);
        }

        someDay = null;
    },

    /**
     *
     * @param msg
     * @param extraData
     * @param imageURI
     * @param summaryText
     * @param days
     * @param hour
     * @param minutes
     */
    addNotificationInFutureAt: function(msg, extraData, imageURI, summaryText, days, hour, minutes){
        if(minutes === undefined) minutes = 0;

        var someDay = new Date();
        var curTime = someDay.getTime();
        someDay.setTime(curTime + days * 86400000);
        someDay.setHours(hour, minutes, 0, 0);
        var nextTime = someDay.getTime();

        // if is future
        if(nextTime > curTime){
            notificationMgr.addNotification(nextTime, msg, extraData, imageURI, summaryText);
        }
        else{
            ZLog.debug("not add: %s cur = %d, next = %d", msg, curTime, nextTime);
        }

        someDay = null;
    },
};
