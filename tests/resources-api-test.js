var request = require('supertest');
var test = require('../test');
var Q = require('q');
var app;

var gamecontroller = require('../libs/controllers/gamecontroller');
var trackingKey = '000';

var gameId;

exports.setUp = function(callback) {
    test.setUp(function() {
        app = require('../app/app');
        gamecontroller.addGame('Test')
            .then(function(game) {
                gameId = game.id;
                callback();
            }).fail(function(err) {
                console.log(err.stack);
                callback();
            });
    });
};

exports.tearDown = function(callback) {
    test.tearDown(callback);
};

exports.testGetGames = function(test) {
    test.expect(1);
    server('/api/games/', 'get', null, test, function(err, res) {
        console.log('Response received ' + res);
        var games = res.body;
        test.ok(games.length, 'Games should be a list');
    });
};

exports.testGetGame = function(test) {
    test.expect(2);
    gamecontroller.addGame({
        title: 'The Game'
    }).then(function(game) {
        var id = game.id;
        return gamecontroller.addTrackingKey(id, '000').then(function() {
            server('/api/games/' + id, 'get', null, test, function(err,
                res) {
                test.ok(res.body.id, 'Game should have an id');
                test.strictEqual(res.body.id, id);
            });
        });
    });
};


exports.testDeleteGame = function(test) {
    test.expect(1);
    gamecontroller.addGame({
        title: 'The Game'
    }).then(function(game) {
        var id = game.id;
        server('/api/games/' + id, 'del', null, test,
            function(err, res) {
                console.log('Game deleted');
                test.strictEqual(res.status, 200);
            });
    });
};

exports.testPostGame = function(test) {
    test.expect(3);
    server('/api/games/', 'post', {
        title: 'The Game'
    }, test, function(err, res) {
        if (err) {
            test.ok(false, err);
            test.done();
        }
        test.ok(res.body);
        test.ok(res.body.id);
        test.strictEqual(res.body.title, 'The Game');
    });
};

exports.testUpdateGame = function(test) {
    test.expect(1);
    gamecontroller.addGame({
        title: 'The Game'
    }).then(function(game) {
        var id = game.id;
        server('/api/games/' + id, 'put', {
                title: 'Other'
            }, test,
            function(err, res) {
                return gamecontroller.getGame(id).then(function(game) {
                    test.strictEqual(game.title, 'Other');
                });
            });
    });
};

var server = function(url, method, content, test, callback) {
    var server = request(app)[method](url)
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(200);

    if (content) {
        server = server.send(content);
    }
    server.end(function(err, res) {
        return Q.fcall(function() {
            return callback(err, res);
        }).then(function() {
            server.app.close();
            test.done();
        });
    });
    return server;
};