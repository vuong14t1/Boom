/**
 * Created by eXtraKute on 3/7/2016.
 */

var WebDataObject = cc.Class.extend({

    ctor: function(){
        this.update = 0;                // 0: khong update, 1: force update
        this.message = "";
        this.ipServer = null;           // IP server game
        this.canRateGame = 0;           // co the rate app tren store
        this.canLikePage = 0;           // co the like fan page facebook
        this.hasTournament = null;      // co the choi tournament
        this.portServer = null;
        this.location = null;
        this.canRegister = 1;
        this.confirmSMS = 0;
        this.linkStore = "";
        this.isReview = 1;

        this.login = [
            //SocialName.Facebook,
            //SocialName.Google,
            SocialName.ZAcc
        ];

        this.payment = [
            PAYMENT_SYSTEM.MOL,
            PAYMENT_SYSTEM.CODA,
            PAYMENT_SYSTEM._2C2P
        ];

        this.maintain = 0;              // 0: choi binh thuong, 1: server dang bao tri, hien thi GUI bao tri
        this.maintainMessage = "";
        this.supportUrl = "";           // Link trang support
        this.forumUrl = "";             // Linh fanpage
        this.urlnews = "";              // Link thong tin su kien moi
        this.source = "";               // nguon quang cao
        this.debug = 0;                 // show log
    },
});