var request = require('supertest');
var app = require('../app/app');
var test = require('../test');
var gamecontroller = require('../libs/controllers/gamecontroller');
var trackingKey = '000';

exports.setUp = function(callback) {
    test.setUp(function() {
        gamecontroller.addGame('Test')
            .then(function(game) {
                return gamecontroller.addTrackingKey(game.id, trackingKey)
                    .then(function() {
                        callback();
                    }).fail(function(err) {
                        console.log(err.stack);
                    });
            });
    });
};

exports.tearDown = function(callback) {
    test.tearDown(callback);
};

exports.testStart = function(test) {
    test.expect(1);
    var server = request(app)
        .get('/api/c/start/' + trackingKey)
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            console.log('Response arrived ' + res);
            if (err) {
                test.ok(false, err.stack);
            } else {
                test.ok(res.body.token, 'Invalid tracking token');
            }
            server.app.close();
            test.done();
        });
};

exports.testInvalidTrackingKey = function(test) {
    test.expect(1);
    var server = request(app)
        .get('/api/c/start/ñor')
        .expect(400)
        .end(function(err, res) {
            console.log('Response arrived ' + res);
            if (err) {
                test.ok(false, err.stack);
            } else {
                test.ok(true);
            }
            server.app.close();
            test.done();
        });
};

exports.testTrackAndGet = function(test) {
    test.expect(2);
    var traces = [{
        type: 'logic'
    }];
    var server = request(app)
        .get('/api/c/start/' + trackingKey)
        .expect('Content-Type', /json/)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            server.app.close();
            var token = res.body.token;
            var server2 = request(app)
                .post('/api/c/track')
                .set('Authorization', token)
                .send([{
                    type: 'logic'
                }])
                .expect(204)
                .end(function(err, res) {
                    console.log('Response arrived ' + res);
                    if (err) {
                        test.ok(false, err.stack);
                    } else {
                        test.ok(true);
                    }
                    server2.app.close();
                    var server3 = request(app)
                        .get('/api/traces/' + trackingKey)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect(function(res) {
                            console.log(JSON.stringify(res.body));
                            if (traces.length !== res.body.length) {
                                return 'Traces not equal';
                            }
                        }).end(function(err, res) {
                            if (err) {
                                test.ok(false, err.stack);
                            } else {
                                test.ok(true);
                            }
                            server3.app.close();
                            test.done();
                        });

                });
        });
};