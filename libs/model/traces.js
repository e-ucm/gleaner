module.exports = (function() {
    var mongodb = require('../db/mongodb');
    var c = require('./constants/database');

    var collection = function(trackingKey) {
        return mongodb.collection(c.TRACES + '_' + trackingKey);
    };

    var add = function(trackingKey, gameplayId, traces) {
        for (var i = 0; i < traces.length; i++) {
            traces[i][c.TRACES_GAMEPLAY] = gameplayId;
        }
        return collection(trackingKey).insert(traces);
    };

    var find = function(trackingKey) {
        return collection(trackingKey).find();
    };

    return {
        add: add,
        find: find
    };
})();