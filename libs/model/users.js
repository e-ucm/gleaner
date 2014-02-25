module.exports = (function() {
    var util = require('util');
    var crypto = require('crypto');
    var salt = require('./configuration').salt;
    var Table = require('./table');
    var c = require('./constants/database');
    var mysql = require('../db/mysql');
    var errors = require('./constants/errors');


    var hash = function(password) {
        return crypto.createHash('md5').update(password + salt).digest(
            'hex');
    };

    function Users() {
        Table.call(this, c.USERS_TABLE, [c.USERS_NAME, c.USERS_PASSWORD, c.USERS_ROLE]);
    }

    util.inherits(Users, Table);

    /**
     * Adds a user
     * @param {String} username The user name. If it's duplicated, an 'ER_DUPLICATE_USERNAME' is returned
     * @param {String} password An unhashed password. It'll be hashed before added to database
     * @param {String} role     The role for new user
     */
    Users.prototype.add = function(username, password, role) {
        var hashedPassword = hash(password);
        return Table.prototype.add.call(this, [username, hashedPassword,
            role
        ]);
    };

    /** @Override **/
    Users.prototype.errorAdd = function(err) {
        switch (err.code) {
            // A user already exists with that user name
            case 'ER_DUP_UNIQUE':
            case 'ER_DUP_ENTRY':
                Table.prototype.throwError(errors.ER_DUPLICATE_USERNAME);
                break;
            default:
                Table.prototype.errorAdd.call(this, err);
        }
    };

    /**
     * Checks if it is a valid user. Throws an 'ER_INVALID_USERNAME_PASSWORD' if it's not
     * @param  {String} username User name
     * @param  {String} password Password
     * @return {Object}          a string with the user role
     */
    Users.prototype.login = function(username, password) {
        var hashedPassword = hash(password);
        return mysql.query('SELECT ' + c.USERS_ROLE + ' FROM ' + c.USERS_TABLE +
            ' WHERE ' + c.USERS_NAME + '= ? AND ' + c.USERS_PASSWORD +
            '= ?', [
                username, hashedPassword
            ])
            .then(function(result) {
                if (result.rows.length == 1) {
                    return result.rows[0][c.USERS_ROLE];
                } else {
                    Table.prototype.throwError(errors.ER_INVALID_USERNAME_PASSWORD);
                }
            }, function(err) {
                console.log('Unexpected error loging user: ' + err.code);
                Table.prototype.throwError(errors.ER_UNKNOWN);
            });
    };

    return new Users();
})();