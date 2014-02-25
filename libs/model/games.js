module.exports = (function() {
    var c = require('./constants/database');
    var errors = require('./constants/errors');
    var mysql = require('../db/mysql');


    /**
     * Adds a game
     * @param {String} title The title of the game
     */
    var add = function(title) {
        return mysql.query('INSERT INTO ' + c.GAMES_TABLE + '(' + c.GAMES_TITLE +
            ') VALUES(?)', [title])
            .then(function(result) {
                return {
                    id: result.rows.insertId,
                    title: title
                };
            }).fail(function(err) {
                console.log('Unexpected error adding user: ' +
                    err.code);
                throw new Error(errors.ER_UNKNOWN);
            });
    };

    /**
     * Removes the user
     * @param  {number} id The user id
     */
    var remove = function(id) {
        return mysql.query('DELETE FROM ' + c.GAMES_TABLE + ' WHERE ' + c.ID +
            '=?', id).then(function() {
            return true;
        }).fail(function(err) {
            console.log('Unexpected error loging user: ' + err.code);
            throw new Error(errors.ER_UNKNOWN);
        });
    };

    return {
        add: add,
        remove: remove
    };
})();