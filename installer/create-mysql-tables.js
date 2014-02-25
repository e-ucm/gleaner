var c = require('../libs/model/constants/database');
var mysql = require('../libs/db/mysql');
var Q = require('q');

module.exports.install = function() {

    var promises = [];
    // Create users table
    var usersSql = 'CREATE TABLE IF NOT EXISTS ' + c.USERS_TABLE + ' (' + c.ID +
        ' INT PRIMARY KEY AUTO_INCREMENT, ' + c.USERS_NAME +
        ' VARCHAR(255) UNIQUE, ' + c.USERS_PASSWORD + ' VARCHAR(32) NOT NULL, ' +
        c.USERS_ROLE + ' VARCHAR(32) NOT NULL )';

    promises.push(mysql.query(usersSql));

    // Create games table
    var gamesSql = 'CREATE TABLE IF NOT EXISTS ' + c.GAMES_TABLE + '(' + c.ID +
        ' INT PRIMARY KEY AUTO_INCREMENT, ' + c.GAMES_TITLE + ' VARCHAR(255))';

    promises.push(mysql.query(gamesSql));

    return Q.all(promises);
};

module.exports.uninstall = function() {
    var promises = [];

    promises.push(mysql.query('DROP TABLE ' + c.USERS_TABLE));
    promises.push(mysql.query('DROP TABLE ' + c.GAMES_TABLE));

    return Q.all(promises);
};