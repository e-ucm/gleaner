module.exports = (function() {
    var util = require('util');
    var c = require('./constants/database');
    var Table = require('./table');

    function Gameplays() {
        Table.call(this, c.GAMEPLAYS_TABLE, [c.GAMEPLAYS_PLAYER, c.GAMEPLAYS_TRACKING_KEY,
            c.GAMEPLAYS_TOKEN, c.GAMEPLAYS_IP, c.GAMEPLAYS_START, c.GAMEPLAYS_LAST_UPDATE
        ]);
    }

    util.inherits(Gameplays, Table);

    var now = function() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    };

    /**
     * Adds a game
     * @param {string} title The title of the game
     */
    Gameplays.prototype.add = function(player, trackingkey, token, ip) {
        var nowDate = now();
        return Table.prototype.add.call(this, [player, trackingkey, token,
            ip, nowDate, nowDate
        ]);
    };

    Gameplays.prototype.filterAdd = function(objectInserted, column, value) {
        switch (column) {
            case c.GAMEPLAYS_START:
            case c.GAMEPLAYS_LAST_UPDATE:
                objectInserted[column] = new Date(value);
                break;
            default:
                Table.prototype.filterAdd.call(this, objectInserted, column,
                    value);
        }
    };

    /**
     * Updates the last update of a gameplay
     * @param  {number} gameplay id of the gamepaly
     * @return {boolean} if the update was performed
     */
    Gameplays.prototype.update = function(gameplay) {
        var set = {};
        set[c.GAMEPLAYS_LAST_UPDATE] = now();

        var where = {};
        where[c.ID] = gameplay;
        return this.updateWhere(set, where);
    };

    return new Gameplays();
})();