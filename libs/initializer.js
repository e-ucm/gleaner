module.exports = function(configurationFile) {
    // Load configuration
    var configuration = require('./model/configuration');
    configuration.load(configurationFile);

    // Set up MySQL
    var mysql = require('./db/mysql');
    var mongodb = require('./db/mongodb');
    return mysql.setUp(configuration.mysqlHost, configuration.mysqlPort,
        configuration.mysqlUser, configuration.mysqlPassword, configuration.mysqlDatabase
    ).then(function() {
        return mongodb.setUp(configuration.mongoHost, configuration.mongoPort,
            configuration.monogDatabase);
    });
};