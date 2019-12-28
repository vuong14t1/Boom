/**
 * Created by bachbv on 1/30/2017.
 */

var Audio = {

    init: function(){
        this._soundIdList = {};
        this._mute = fr.UserData.getBoolean(UserDataKey.MUTE, false);
        this._curMusic = null;
        this._voidId = -1;
        this._voicePathFormat = 'res/audio/@lang/@name';
        this._decrementId = -1;

        this.setMaxEffectsInstance(20);
        cc.audioEngine.setEffectsVolume(1);
        cc.audioEngine.setMusicVolume(1);
    },

    isMuting: function(){
        return this._mute;
    },

    setMute: function(b){
        if(this._mute == b) return;
        this._mute = b;
        fr.UserData.setBoolean(UserDataKey.MUTE, b);

        if(b){
            this.stopMusic();
        }
        else{
            if(this._curMusic && this._curMusic.length > 0){
                this.playMusic(this._curMusic);
            }
        }
    },

    playMusic: function (url, loop) {
        if(this.isMuting()) return;

        clearInterval(this._decrementId);
        cc.audioEngine.setMusicVolume(1);

        if(this.isMusicPlaying() && this._curMusic == url) return;
        this._curMusic = url;

        //ZLog.debug("play background music");
        loop = loop || true;
        cc.audioEngine.playMusic(url, loop);
    },

    stopMusic: function() {
        //ZLog.debug("stop background music");
        clearInterval(this._decrementId);
        cc.audioEngine.stopMusic();
    },

    pauseMusic: function () {
        //ZLog.debug("pause background music");
        clearInterval(this._decrementId);
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function () {
        //ZLog.debug("resume background music");
        clearInterval(this._decrementId);
        cc.audioEngine.resumeMusic();
    },

    rewindMusic: function () {
        //ZLog.debug("rewind background music");
        clearInterval(this._decrementId);
        cc.audioEngine.rewindMusic();
    },

    // is background music playing
    isMusicPlaying: function () {
        return cc.audioEngine.isMusicPlaying();
    },

    playEffect: function (url, loop) {
        if(this.isMuting()) return;
        //ZLog.debug("~~~~~~~~~playEffect: ",url);
        //ZLog.debug("play effect");
        loop = loop || false;
        //ZLog.debug("--> play effect: %s", url);
        var soundId = cc.audioEngine.playEffect(url, loop);
        if(this._soundIdList[url] != soundId){
            this._soundIdList[url] = soundId;
        }

        return soundId;
    },

    playVoice: function(name){
        if(this.isMuting()) return;

        // hard code, only play MM voice
        var url = this._voicePathFormat.replace('@lang', LANGUAGE.MYANMAR).replace('@name', name);

        // only play one voice at the moment
        cc.audioEngine.stopEffect(this._voidId);
        this._voidId = this.playEffect(url);
    },

    decrementMusicToOff: function(){
        if(PlatformUtils.isDesktop()){
            Audio.pauseMusic();
            return;
        }

        this._decrementId = setInterval(function(){
            this.subMusicVolume();

            if(cc.audioEngine.getMusicVolume() <= 0){
                Audio.pauseMusic();
            }

        }.bind(this), 300)
    },

    stopEffect: function (baseName) {
        //ZLog.debug("stop effect", baseName);
        if(this._soundIdList[baseName]){
            cc.audioEngine.stopEffect(this._soundIdList[baseName]);
        }
    },

    addMusicVolume: function () {
        //ZLog.debug("add background music volume");
        cc.audioEngine.setMusicVolume(cc.audioEngine.getMusicVolume() + 0.1);
    },

    subMusicVolume: function () {
        //ZLog.debug("sub backgroud music volume");
        cc.audioEngine.setMusicVolume(cc.audioEngine.getMusicVolume() - 0.1);
    },

    addEffectsVolume: function () {
        //ZLog.debug("add effects volume");
        cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() + 0.1);
    },

    subEffectsVolume: function () {
        //ZLog.debug("sub effects volume");
        cc.audioEngine.setEffectsVolume(cc.audioEngine.getEffectsVolume() - 0.1);
    },

    pauseEffect: function (baseName) {
        //ZLog.debug("pause effect");
        if(this._soundIdList[baseName]){
            cc.audioEngine.pauseEffect(this._soundIdList[baseName]);
        }
    },

    setMusicVolumeEqualsHalfEffectVolume:function(){
        cc.audioEngine.setMusicVolume(cc.audioEngine.getEffectsVolume()/2);
    },
    setMusicVolumeEqualsEffectVolume:function(){
        cc.audioEngine.setMusicVolume(cc.audioEngine.getEffectsVolume());
    },

    resumeEffect: function (baseName) {
        //ZLog.debug("resume effect");
        if(this._soundIdList[baseName]){
            cc.audioEngine.resumeEffect(this._soundIdList[baseName]);
        }
    },

    pauseAllEffects: function () {
        //ZLog.debug("pause all effects");
        cc.audioEngine.pauseAllEffects();
    },

    resumeAllEffects: function () {
        //ZLog.debug("resume all effects");
        cc.audioEngine.resumeAllEffects();
    },

    stopAllEffects: function () {
        //ZLog.debug("stop all effects");
        cc.audioEngine.stopAllEffects();
    },

    setMaxEffectsInstance: function(num){
        cc.audioEngine._maxAudioInstance = num;
    },

    cleanUp: function(){
        this.stopAllEffects();
        this.stopMusic();

        for(var baseName in this._soundIdList){
            delete this._soundIdList[baseName];
        }
        this._soundIdList = null;
    },
};
