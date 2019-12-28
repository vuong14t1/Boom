/**
 * Created by BachBV on 8/25/2018.
 */

var SpineFactory = {

    create: function(key){
        var path = 'res/spines/' + key;
        return new sp.SkeletonAnimation(path + '/skeleton.json', path + '/texture.atlas');
    }
};