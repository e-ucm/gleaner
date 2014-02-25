// Gleaner installer

if (process.argv.length != 4) {
    console.log('You must pass the admin user and password as parameters');
} else {
    var user = process.argv[2];
    var password = process.argv[3];
    var Q = require('q');

    var initialize = require('../libs/initializer')('config.json');
    var uninstall = require('../installer/installer').uninstall();
    var install = require('../installer/installer').install(user, password);

    Q.all([initialize, uninstall, install])
        .then(function() {
            console.log('Success!');
        }).fail(function(err) {
            console.log('Something went wrong!', err.stack);
        }).then(function() {
            require('../libs/db/mysql').end();
        });
}