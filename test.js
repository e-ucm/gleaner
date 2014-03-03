exports.setUp = function(callback) {
    require('./libs/initializer')('tests/test-config.json')
        .then(function() {
            console.log('Installing...');
            return require('./installer/installer').install();
        }).fail(function(err) {
            console.log(err.stack);
        }).then(function() {
            callback();
        });
};

exports.tearDown = function(callback) {
    console.log('Uninstalling...');
    require('./installer/installer').uninstall().then(function() {
        require('./libs/db/mysql').end();
        return require('./libs/db/mongodb').end();
    }).fail(function(err) {
        console.log(err.stack);
    }).then(function() {
        callback();
    });
};