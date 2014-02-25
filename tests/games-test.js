var games = require('../libs/model/games');
var test = require('../test');

exports.setUp = function(callback) {
    test.setUp(callback);
};

exports.tearDown = function(callback) {
    test.tearDown(callback);
};


exports.testAddRemove = function(test) {
    test.expect(3);
    var id;
    games.add('ñor')
        .then(function(game) {
            test.equals(game.title, 'ñor');
            test.ok(game.id);
            id = game.id;
            return games.remove(id);
        }).then(function(result) {
            test.ok(result, 'Game not correctly removed.');
        }).fail(function(err) {
            test.ok(false, err.stack);
        }).then(function() {
            test.done();
        });
};