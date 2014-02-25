module.exports.install = function(user, password) {
    // Create MySQL tables
    return require('./create-mysql-tables').install()
        .then(function() {
            // Create admin user
            var users = require('../libs/model/users');
            var c = require('../libs/model/constants/database');
            return users.add(user, password, c.USERS_ROLE_ADMIN);
        });
};

module.exports.uninstall = function() {
    // Drop MySQL tables
    return require('./create-mysql-tables').uninstall();
};