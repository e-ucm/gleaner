module.exports = (function() {
    var Q = require('q');
    var mysql = require('../db/mysql');
    var errors = require('./constants/errors');
    var c = require('./constants/database');
    var salt = require('./configuration').salt;

    /**
     * Adds a user
     * @param {String} username The user name. If it's duplicated, an 'ER_DUPLICATE_USERNAME' is returned
     * @param {String} password An unhashed password. It'll be hashed before added to database
     * @param {String} role     The role for new user
     */
    var add = function(username, password, role) {
        var crypto = require('crypto');
        var hashedPassword = crypto.createHash('md5').update(password +
            salt).digest('hex');

        var columns = [c.USER_NAME, c.USER_PASSWORD, c.USER_ROLE];

        return mysql.query('INSERT INTO ?? ( ?? ) VALUES( ?, ?, ? )', [
            [c.USER_TABLE],
            columns, username, hashedPassword, role
        ]).then(function(result) {
            return {
                id: result.rows.insertId,
                username: username,
                role: role
            };
        }).fail(function(err) {
            switch (err.code) {
                // A user already exists with that user name
                case 'ER_DUP_UNIQUE':
                    throw new Error(errors.ER_DUPLICATE_USERNAME);
                default:
                    console.log('Unexpected error adding user: ' +
                        err.code);
                    throw new Error(errors.ER_UNKNOWN);
            }
        });
    };

    return {
        add: add
    };
})();