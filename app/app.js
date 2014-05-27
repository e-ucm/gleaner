/**
 * Module dependencies
 */
var configuration = require('../libs/model/configuration');

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    path = require('path');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: configuration.sessionSalt
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {

}


app.get('/api/c/start/:trackingKey', api.tracker.start);
app.post('/api/c/track', api.tracker.track);

app.get('/login', routes.login);
app.post('/login', api.login);

// Add authentication only if not testing
if (!configuration.test) {
    // Only tracking urls can be accessed without authentication
    app.all('*', function(req, res, next) {
        if (req.session.role) {
            next();
        } else {
            res.redirect('/login');
        }
    });
}

// Traces
app.get('/api/traces/:trackingKey', api.traces.get);

// Games
app.all('/api/games/:id', api.games);
app.get('/api/games/', api.games);
app.post('/api/games/', api.games);

app.all('*', routes.index);