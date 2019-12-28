/**
 * Created by bachbv on 1/16/2017.
 */

var SceneFactory = cc.Class.extend({

    ctor:function()
    {
        GV.SCENE_FACTORY = this;

        return true;
    },

    /**
     *
     * @param sceneId
     */
    createScreen:function(sceneId) {
        switch(sceneId)
        {
            case GV.SCENE_IDS.LOADING:
                ZLog.debug("-> CREATE SCENE: LOADING");
                return new SceneLoading();
            case GV.SCENE_IDS.LOGIN:
                ZLog.debug("-> CREATE SCENE: LOGIN");
                return new SceneLogin();
            case GV.SCENE_IDS.LOBBY:
                ZLog.debug("-> CREATE SCENE: LOBBY");
                return new SceneLobby();
            case GV.SCENE_IDS.LOBBY_GAME:
                ZLog.debug("-> CREATE SCENE: LOBBY_GAME");
                return new SceneLobbyGame();
            case GV.SCENE_IDS.MAINTAIN:
                ZLog.debug("-> CREATE SCENE: MAINTAIN");
                return new SceneMaintain();

            case GV.SCENE_IDS.GAME:
                ZLog.debug("-> CREATE SCENE: GAME");
                return new SceneGamePlay();
            case GV.SCENE_IDS.SETTING_JOYSTICK:
                ZLog.debug("-> CREATE SCENE: SETTING_JOYSTICK");
                return new SceneSettingTouch();

        }
    },
    createTransition:function(scene, oldScreenId,_currentScreenId)
    {
        //return scene;
         return new cc.TransitionFade(0.3, scene, cc.color(0, 0, 0, 255));
    }
});