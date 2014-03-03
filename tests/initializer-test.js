var mysql = require('../libs/db/mysql');
var mongodb = require('../libs/db/mongodb');

exports.test = function(test) {
    console.log('Testing initializer...');
    test.expect(1);
    require('../libs/initializer')('tests/test-config.json')
        .then(function(result) {
            test.ok(result, 'Impossible to initialize.');
        }).fail(function(err) {
            test.ok(false, err.stack);
        }).then(function() {
            mysql.end();
            return mongodb.end();
        }).then(function() {
            test.done();
        });
};