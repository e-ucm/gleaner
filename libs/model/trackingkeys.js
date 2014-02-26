module.exports = (function() {
    var util = require('util');
    var c = require('./constants/database');
    var errors = require('./constants/errors');
    var Table = require('./table');
    var games = require('./games');

    function TrackingKeys() {
        Table.call(this, c.TRACKING_KEYS_TABLE, [c.TRACKING_KEYS_GAME, c.TRACKING_KEYS_KEY]);
    }

    util.inherits(TrackingKeys, Table);

    TrackingKeys.prototype.add = function(gameId, key) {
        var that = this;
        return games.get(gameId).then(function() {
            return Table.prototype.add.call(that, [gameId, key]);
        }, function(err) {
            switch (err.code) {
                // Game does not exist
                case errors.ER_ID_NOT_FOUND:
                    throw err;
                default:
                    Table.prototype.errorAdd.call(this, err);
            }
        });
    };

    /** @Override **/
    TrackingKeys.prototype.errorAdd = function(err) {
        switch (err.code) {
            // A user already exists with that user name
            case 'ER_DUP_UNIQUE':
            case 'ER_DUP_ENTRY':
                Table.prototype.throwError(errors.ER_DUPLICATE_TRACKING_KEY);
                break;
            default:
                Table.prototype.errorAdd.call(this, err);
        }
    };

    return new TrackingKeys();
})();