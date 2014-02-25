module.exports = (function() {
    var util = require('util');
    var c = require('./constants/database');
    var Table = require('./table');

    function Games() {
        Table.call(this, c.GAMES_TABLE, [c.GAMES_TITLE]);
    }

    util.inherits(Games, Table);

    /**
     * Adds a game
     * @param {String} title The title of the game
     */
    Games.prototype.add = function(title) {
        return Table.prototype.add.call(this, [title]);
    };

    return new Games();
})();