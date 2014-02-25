var c = require('../libs/model/constants/database');
var mysql = require('../libs/db/mysql');

module.exports.install = function() {

    // Create users table
    var sql = 'CREATE TABLE IF NOT EXISTS ' + c.USER_TABLE + ' (' + c.ID +
        ' INT PRIMARY KEY AUTO_INCREMENT, ' + c.USER_NAME +
        ' VARCHAR(255) UNIQUE, ' + c.USER_PASSWORD + ' VARCHAR(32) NOT NULL, ' +
        c.USER_ROLE + ' VARCHAR(32) NOT NULL )';

    return mysql.query(sql);
};

module.exports.uninstall = function() {
    var sql = 'DROP TABLE ' + c.USER_TABLE;
    return mysql.query(sql);
};