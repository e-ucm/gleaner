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

    // Create tracking keys table
    var trackingKeysSql = 'CREATE TABLE IF NOT EXISTS ' + c.TRACKING_KEYS_TABLE +
        '(' + c.ID + ' INT PRIMARY KEY AUTO_INCREMENT, ' + c.TRACKING_KEYS_GAME +
        ' INT, ' + c.TRACKING_KEYS_KEY + ' VARCHAR(255) UNIQUE )';

    promises.push(mysql.query(trackingKeysSql));

    // Create players table
    var playersSql = 'CREATE TABLE IF NOT EXISTS ' + c.PLAYERS_TABLE + '(' + c.ID +
        ' INT PRIMARY KEY AUTO_INCREMENT, ' + c.PLAYERS_NAME +
        ' VARCHAR(255) UNIQUE, ' + c.PLAYERS_TYPE + ' VARCHAR(16) )';

    promises.push(mysql.query(playersSql));

    // Create gameplays table
    var gameplaysSql = 'CREATE TABLE IF NOT EXISTS ' + c.GAMEPLAYS_TABLE + '(' +
        c.ID + ' INT PRIMARY KEY AUTO_INCREMENT, ' + c.GAMEPLAYS_PLAYER +
        ' INT, ' + c.GAMEPLAYS_TRACKING_KEY +
        ' VARCHAR(255) UNIQUE, ' + c.GAMEPLAYS_TOKEN + ' VARCHAR(255) UNIQUE, ' +
        c.GAMEPLAYS_IP + ' VARCHAR(64), ' + c.GAMEPLAYS_START + ' DATETIME, ' +
        c.GAMEPLAYS_LAST_UPDATE + ' DATETIME)';

    promises.push(mysql.query(gameplaysSql));

    return Q.all(promises);
};

module.exports.uninstall = function() {
    var promises = [];

    promises.push(mysql.query('DROP TABLE ' + c.USERS_TABLE));
    promises.push(mysql.query('DROP TABLE ' + c.GAMES_TABLE));
    promises.push(mysql.query('DROP TABLE ' + c.TRACKING_KEYS_TABLE));
    promises.push(mysql.query('DROP TABLE ' + c.PLAYERS_TABLE));
    promises.push(mysql.query('DROP TABLE ' + c.GAMEPLAYS_TABLE));

    return Q.all(promises);
};