module.exports = (function() {
    var errors = require('../model/constants/errors');
    var games = require('../model/games');
    var trackingkeys = require('../model/trackingkeys');
    var c = require('../model/constants/database');

    var throwUnknownError = function(err) {
        console.log('Unexpected error ' + err.code + ': ' + err.message);
        throwError(errors.ER_UNKNOWN);
    };

    var handleIdNotFount = function(err) {
        switch (err.code) {
            // Game does not exist
            case errors.ER_ID_NOT_FOUND:
                throw err;
            default:
                throwUnknownError(err);
        }
    };

    var addGame = function(game) {
        var title = game.title || 'Untitled';
        return games.add(title);
    };

    var addTrackingKey = function(gameId, key) {
        return games.get(gameId).then(
            function() {
                return trackingkeys.add(gameId, key);
            }, handleIdNotFount);
    };

    var getGame = function(gameId) {
        return games.get(gameId).then(function(game) {
            game.trackingKeys = [];
            var where = {};
            where[c.TRACKING_KEYS_GAME] = game.id;
            return trackingkeys.selectWhere(where)
                .then(function(result) {
                    for (var i = 0; i < result.rows.length; i++) {
                        game.trackingKeys.push(result.rows[i][c.TRACKING_KEYS_KEY]);
                    }
                    return game;
                });
        }, handleIdNotFount);
    };

    var removeGame = function(gameId) {
        var where = {};
        where[c.TRACKING_KEYS_GAME] = gameId;
        return trackingkeys.removeWhere(where).then(function() {
            return games.remove(gameId);
        });
    };

    return {
        getGame: getGame,
        addGame: addGame,
        addTrackingKey: addTrackingKey,
        removeGame: removeGame
    };
})();