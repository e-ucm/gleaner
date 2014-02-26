var games = require('../libs/model/games');
var trackingkeys = require('../libs/model/trackingkeys');
var test = require('../test');

exports.setUp = function(callback) {
    test.setUp(callback);
};

exports.tearDown = function(callback) {
    test.tearDown(callback);
};


exports.testAddKey = function(test) {
    test.expect(3);
    var id;
    games.add('ñor')
        .then(function(game) {
            id = game.id;
            console.log('Game added.');
            return trackingkeys.add(id, '000');
        }).then(function(trackingKey) {
            console.log('Tracking key added');
            test.equals(trackingKey.game, id);
            test.equals(trackingKey.trackingKey, '000');
            test.ok(trackingKey.id);
        }).fail(function(err) {
            test.ok(false, err.stack);
        }).then(function() {
            test.done();
        });
};

exports.testAddKeyToUnexistingGame = function(test) {
    test.expect(1);
    trackingkeys.add(9000, '000')
        .then(function() {
            test.ok(false, 'Should not be added');
        }).fail(function(err) {
            test.equals(err.code, 'ER_ID_NOT_FOUND');
        }).then(function() {
            test.done();
        });
};

exports.testAddDuplicatedKey = function(test) {
    games.add('ñor')
        .then(function(game) {
            id = game.id;
            console.log('Game added.');
            return trackingkeys.add(id, '000');
        }).then(function(trackingKey) {
            return trackingkeys.add(id, '000');
        }).fail(function(err) {
            test.equals(err.code, 'ER_DUPLICATE_TRACKING_KEY');
        }).then(function() {
            test.done();
        });
};