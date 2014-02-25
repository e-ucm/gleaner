module.exports = function(configurationFile) {
    // Load configuration
    var configuration = require('./model/configuration');
    configuration.load(configurationFile);

    // Set up MySQL
    var mysql = require('./db/mysql');
    return mysql.setUp(configuration.mysqlHost, configuration.mysqlPort,
        configuration.mysqlUser, configuration.mysqlPassword, configuration.mysqlDatabase
    );
};