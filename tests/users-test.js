var users = require('../libs/model/users');
var test = require('../test');

exports.setUp = function(callback) {
    test.setUp(callback);
};

exports.tearDown = function(callback) {
    test.tearDown(callback);
};


exports.testAddLoginRemove = function(test) {
    test.expect(5);
    var id;
    users.add('ñor', 'ñor', 'admin')
        .then(function(user) {
            test.equals(user.name, 'ñor');
            test.ok(user.id);
            test.equals(user.role, 'admin');
            id = user.id;
            return users.login('ñor', 'ñor');
        }).then(function(role) {
            test.equals(role, 'admin');
            return users.remove(id);
        }).then(function(result) {
            test.ok(result, 'User not correctly removed.');
        }).fail(function(err) {
            test.ok(false, err.stack);
        }).then(function() {
            test.done();
        });
};