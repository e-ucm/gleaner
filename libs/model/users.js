module.exports = (function() {
    var Q = require('q');
    var crypto = require('crypto');
    var mysql = require('../db/mysql');
    var errors = require('./constants/errors');
    var c = require('./constants/database');
    var salt = require('./configuration').salt;

    var hash = function(password) {
        return crypto.createHash('md5').update(password + salt).digest(
            'hex');
    };

    /**
     * Adds a user
     * @param {String} username The user name. If it's duplicated, an 'ER_DUPLICATE_USERNAME' is returned
     * @param {String} password An unhashed password. It'll be hashed before added to database
     * @param {String} role     The role for new user
     */
    var add = function(username, password, role) {
        var hashedPassword = hash(password);
        var columns = [c.USER_NAME, c.USER_PASSWORD, c.USER_ROLE];

        return mysql.query('INSERT INTO ?? ( ?? ) VALUES( ?, ?, ? )', [
            [c.USER_TABLE],
            columns, username, hashedPassword, role
        ]).then(function(result) {
            return {
                id: result.rows.insertId,
                name: username,
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

    /**
     * Removes the user
     * @param  {number} id The user id
     */
    var remove = function(id) {
        return mysql.query('DELETE FROM ' + c.USER_TABLE + ' WHERE ' + c.ID +
            '=?', id).then(function() {
            return true;
        }).fail(function(err) {
            console.log('Unexpected error loging user: ' + err.code);
            throw new Error(errors.ER_UNKNOWN);
        });
    };

    /**
     * Checks if it is a valid user. Throws an 'ER_INVALID_USERNAME_PASSWORD' if it's not
     * @param  {String} username User name
     * @param  {String} password Password
     * @return {Object}          a string with the user role
     */
    var login = function(username, password) {
        var hashedPassword = hash(password);
        return mysql.query('SELECT ' + c.USER_ROLE + ' FROM ' + c.USER_TABLE +
            ' WHERE ' + c.USER_NAME + '= ? AND ' + c.USER_PASSWORD + '= ?', [
                username, hashedPassword
            ])
            .then(function(result) {
                if (result.rows.length == 1) {
                    return result.rows[0][c.USER_ROLE];
                } else {
                    throw new Error(errors.ER_INVALID_USERNAME_PASSWORD);
                }
            }).fail(function(err) {
                console.log('Unexpected error loging user: ' + err.code);
                throw new Error(errors.ER_UNKNOWN);
            });
    };

    return {
        add: add,
        login: login,
        remove: remove
    };
})();