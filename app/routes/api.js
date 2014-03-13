var trackercontroller = require('../../libs/controllers/trackercontroller');
var errors = require('../../libs/model/constants/errors');
var traces = require('../../libs/model/traces');
var users = require('../../libs/model/users');


/** API for tracker **/
exports.tracker = {
    start: function(req, res) {
        // Recover user data
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || 'Unknown';
        var playerName = req.headers.authorization || ip;
        var trackingKey = req.params.trackingKey;

        if (trackingKey) {
            // Start the gameplay
            trackercontroller.start(playerName, trackingKey, ip)
                .then(function(result) {
                    if (result) {
                        res.status(200);
                        res.send({
                            token: result
                        });
                    } else {
                        res.send(400);
                    }
                }).fail(function(err) {
                    console.log('Unexpected error: ' + err.stack);
                    res.send(500);
                });
        } else {
            res.send(400);
        }
    },
    track: function(req, res) {
        var token = req.headers.authorization;
        if (token) {
            trackercontroller.track(token, req.body)
                .then(function(result) {
                    res.send(result ? 204 : 400);
                }).fail(function(err) {
                    switch (err.code) {
                        case errors.ER_INVALID_TRACE_FORMAT:
                            res.send(400);
                            break;
                        case errors.ER_INVALID_TRACK_TOKEN:
                            res.send(401);
                            break;
                        default:
                            console.log('Unexpected error: ' + err.stack);
                            res.send(500);
                            break;
                    }
                });
        } else {
            res.send(400);
        }
    }
};

exports.traces = {
    get: function(req, res) {
        var trackingKey = req.params.trackingKey;
        if (trackingKey) {
            traces.find(trackingKey)
                .then(function(traces) {
                    res.status(200);
                    res.send(traces);
                }).fail(function(err) {
                    console.log('Unexpected error:' + err.stack);
                    res.send(500);
                });
        } else {
            res.send(400);
        }
    }
};

exports.login = function(req, res) {
    var user = req.body.user;
    var password = req.body.password;
    if (user && password) {
        users.login(user, password)
            .then(function(role) {
                req.session.role = role;
                req.session.user = user;
                res.redirect('/');
            }).fail(function(err) {
                switch (err.code) {
                    case errors.ER_INVALID_USERNAME_PASSWORD:
                        res.send(401);
                        break;
                    default:
                        console.log('Unexpected error: ' + err.stack);
                        res.send(500);
                        break;
                }
            });
    } else {
        res.send(401);
    }
};