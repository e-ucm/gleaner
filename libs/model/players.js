module.exports = (function() {
    var util = require('util');
    var c = require('./constants/database');
    var Table = require('./table');

    function Players() {
        Table.call(this, c.PLAYERS_TABLE, [c.PLAYERS_NAME, c.PLAYERS_TYPE]);
    }

    util.inherits(Players, Table);

    /**
     * Adds a player
     * @param {String} name Name of the player
     * @param {String} type Type of player
     */
    Players.prototype.add = function(name, type) {
        return Table.prototype.add.call(this, [name, type]);
    };

    return new Players();
})();