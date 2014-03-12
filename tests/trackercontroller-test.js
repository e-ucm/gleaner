var gamecontroller = require('../libs/controllers/gamecontroller');
var trackercontroller = require('../libs/controllers/trackercontroller');
var test = require('../test');
var c = require('../libs/model/constants/database');
var gameplays = require('../libs/model/gameplays');
var players = require('../libs/model/players');
var traces = require('../libs/model/traces');

exports.setUp = function(callback) {
    test.setUp(function() {
        console.log('Adding game');
        gamecontroller.addGame({
            title: 'Test'
        }).then(function(game) {
            console.log('Adding tracking key...');
            return gamecontroller.addTrackingKey(game.id, '000')
                .then(function() {
                    callback();
                });
        }).fail(function(err) {
            console.log(err.stack);
        });
    });
};

exports.tearDown = function(callback) {
    test.tearDown(callback);
};

exports.testStartAnonymous = function(test) {
    var user = '127.0.0.1';
    test.expect(7);
    trackercontroller.start(user, '000', user)
        .then(function(authtoken) {
            console.log('Authtoken ' + authtoken);
            test.ok(authtoken, 'Invalid authtoken');
            var where = {};
            where[c.GAMEPLAYS_TOKEN] = authtoken;
            return gameplays.selectWhere(where)
                .then(function(result) {
                    test.equals(result.rows.length, 1, 'Wrong number of rows');
                    var gameplay = result.rows[0];
                    test.equals(gameplay[c.GAMEPLAYS_TOKEN], authtoken);
                    test.equals(gameplay[c.GAMEPLAYS_IP], user);
                    var playerId = gameplay[c.GAMEPLAYS_PLAYER];
                    var where = {};
                    where[c.ID] = playerId;
                    return players.selectWhere(where)
                        .then(function(result) {
                            test.equals(result.rows.length, 1, 'Wrong number of rows');
                            var player = result.rows[0];
                            console.log('Player created: ' + JSON.stringify(player));
                            test.equals(player[c.PLAYERS_TYPE], c.PLAYERS_TYPE_ANONYMOUS);
                            test.equals(player[c.PLAYERS_NAME], user);
                        });
                });
        }).fail(function(err) {
            test.ok(false, err.stack);
        }).then(function() {
            test.done();
        });
};

exports.testStartCode = function(test) {
    var code = '4444';
    var ip = '127.0.0.1';
    test.expect(7);
    trackercontroller.start(code, '000', ip)
        .then(function(authtoken) {
            console.log('Authtoken ' + authtoken);
            test.ok(authtoken, 'Invalid authtoken');
            var where = {};
            where[c.GAMEPLAYS_TOKEN] = authtoken;
            return gameplays.selectWhere(where)
                .then(function(result) {
                    test.equals(result.rows.length, 1, 'Wrong number of rows');
                    var gameplay = result.rows[0];
                    test.equals(gameplay[c.GAMEPLAYS_TOKEN], authtoken);
                    test.equals(gameplay[c.GAMEPLAYS_IP], ip);
                    var playerId = gameplay[c.GAMEPLAYS_PLAYER];
                    var where = {};
                    where[c.ID] = playerId;
                    return players.selectWhere(where)
                        .then(function(result) {
                            test.equals(result.rows.length, 1, 'Wrong number of rows');
                            var player = result.rows[0];
                            console.log('Player created: ' + JSON.stringify(player));
                            test.equals(player[c.PLAYERS_TYPE], c.PLAYERS_TYPE_CODE);
                            test.equals(player[c.PLAYERS_NAME], code);
                        });
                });
        }).fail(function(err) {
            test.ok(false, err.stack);
        }).then(function() {
            test.done();
        });
};

exports.testTrack = function(test) {
    var trackingKey = '000';
    var code = '4444';
    var ip = '127.0.0.1';
    var tracesData = [{
        type: 'logic',
        event: 'start'
    }, {
        type: 'input',
        action: 'press'
    }];

    test.expect(2 + tracesData.length);
    trackercontroller.start(code, trackingKey, ip)
        .then(function(authtoken) {
            return trackercontroller.track(authtoken, tracesData);
        }).then(function(result) {
            test.ok(result, 'Traces were not added');
            traces.find(trackingKey).then(function(tracesFound) {
                console.log('Traces added: ' + JSON.stringify(tracesFound));
                test.equal(tracesData.length, tracesFound.length);
                for (var i = 0; i < tracesFound.length; i++) {
                    test.ok(tracesFound[i][c.TRACES_GAMEPLAY], 'Invalid gameplay for traces');
                }
            });
        }).fail(function(err) {
            test.ok(false, err.stack);
        }).then(function() {
            test.done();
        });
};