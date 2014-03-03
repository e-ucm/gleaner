exports.setUp = function(callback) {
    require('../libs/initializer')('tests/test-config.json').then(function() {
        callback();
    });
};

exports.tearDown = function(callback) {
    console.log('Uninstalling...');
    require('../installer/installer').uninstall().then(function() {
        require('../libs/db/mysql').end();
        return require('../libs/db/mongodb').end();
    }).fail(function(err) {
        console.log(err.stack);
    }).then(function() {
        callback();
    });
};

exports.test = function(test) {
    console.log('Testing installer...');
    test.expect(1);
    require('../installer/installer').install().then(function() {
        test.ok(true);
    }).fail(function(err) {
        test.ok(false, err.stack);
    }).then(function() {
        test.done();
    });
};