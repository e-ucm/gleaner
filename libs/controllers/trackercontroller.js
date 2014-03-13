module.exports = (function() {
    var trackingkeys = require('../model/trackingkeys');
    var players = require('../model/players');
    var gameplays = require('../model/gameplays');
    var traces = require('../model/traces');
    var c = require('../model/constants/database');
    var errors = require('../model/constants/errors');
    var salt = require('../model/configuration').salt;
    var crypto = require('crypto');

    var generateToken = function(trackingKey, playerName) {
        return crypto.createHash('md5')
            .update(Math.random() + trackingKey + playerName + new Date() + salt)
            .digest('hex');
    };

    /** Starts a gameplay; @return the authorization token to add traces to the gameplay **/
    var start = function(playerName, trackingKey, ip) {
        var where = {};
        where[c.TRACKING_KEYS_KEY] = trackingKey;
        return trackingkeys.selectWhere(where)
            .then(function(result) {
                if (result.rows.length !== 1) {
                    return false;
                }
                var where = {};
                where[c.PLAYERS_NAME] = playerName;
                var token = generateToken(trackingKey, playerName);
                return players.selectWhere(where).then(function(result) {
                    if (result.rows.length === 1) {
                        return gameplays.add(result.rows[0][c.ID], trackingKey, ip, token);
                    } else {
                        var type = playerName === ip ? c.PLAYERS_TYPE_ANONYMOUS : c.PLAYERS_TYPE_CODE;
                        return players.add(playerName, type).then(function(player) {
                            return gameplays.add(player[c.ID], trackingKey, ip, token);
                        });
                    }
                });
            }).then(function(gameplay) {
                return gameplay[c.GAMEPLAYS_TOKEN];
            }).fail(function(err) {
                console.log('Unexpected error starting a gamplay: ' + err.stack);
                return false;
            });
    };

    /** Add traces to the database; @return if the traces were added **/
    var track = function(authToken, tracesData) {
        // Assure is a valid auth token
        var where = {};
        where[c.GAMEPLAYS_TOKEN] = authToken;
        return gameplays.selectWhere(where).then(function(result) {
            if (result.rows.length !== 1) {
                errors.throwError(errors.ER_INVALID_TRACK_TOKEN);
            } else {
                // Update the game play
                var gameplay = result.rows[0];
                return gameplays.update(gameplay[c.ID])
                    .then(function() {
                        // Add traces
                        return traces.add(gameplay[c.GAMEPLAYS_TRACKING_KEY], gameplay[c.ID], tracesData);
                    });
            }
        });
    };

    return {
        start: start,
        track: track
    }

})();