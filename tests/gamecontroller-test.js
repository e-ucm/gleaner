var trackingKeys = require('../libs/model/trackingkeys');
var gameController = require('../libs/controllers/gamecontroller');
var test = require('../test');

exports.setUp = function(callback) {
    test.setUp(callback);
};

exports.tearDown = function(callback) {
    test.tearDown(callback);
};

exports.testAddGame = function(test) {
    test.expect(6);
    var id;
    gameController.addGame({
        title: 'TestGame'
    }).then(function(game) {
        id = game.id;
        return gameController.addTrackingKey(id, '000');
    }).then(function(trackingKey) {
        test.equals(trackingKey.game, id);
        test.equals(trackingKey.trackingKey, '000');
        return gameController.getGame(id);
    }).then(function(game) {
        test.equals(game.id, id);
        test.equals(game.title, 'TestGame');
        test.equals(game.trackingKeys.length, 1);
        test.equals(game.trackingKeys[0], '000');
    }).fail(function(err) {
        test.ok(false, err.message);
    }).then(function() {
        test.done();
    });
};

exports.testRemoveGame = function(test) {
    test.expect(2);
    var id;
    var trackingKeyId;
    gameController.addGame({
        title: 'TestGame'
    }).then(function(game) {
        id = game.id;
        return gameController.addTrackingKey(id, '000');
    }).then(function(trackingKey) {
        trackingKeyId = trackingKey.id;
        return gameController.getGame(id);
    }).then(function(game) {
        return gameController.removeGame(id).then(function(result) {
            test.ok(result);
            return trackingKeys.get(trackingKeyId).fail(function(err) {
                test.equals(err.code, 'ER_ID_NOT_FOUND');
            });
        });
    }).fail(function(err) {
        test.ok(false, err.message);
    }).then(function() {
        test.done();
    });
};

exports.testAddKeyToUnexistingGame = function(test) {
    test.expect(1);
    gameController.addTrackingKey(9000, '000')
        .then(function() {
            test.ok(false, 'Should not be added');
        }).fail(function(err) {
            test.equals(err.code, 'ER_ID_NOT_FOUND', err.message);
        }).then(function() {
            test.done();
        });
};

exports.testGet = function(test) {
    test.expect(1);
    gameController.addGame({}).then(function(game) {
        console.log('Game added ' + JSON.stringify(game));
        return gameController.get()
            .then(function(games) {
                test.ok(games.length);
            }).fail(function(err) {
                test.ok(false, err.stack);
            }).then(function() {
                test.done();
            });
    });
};