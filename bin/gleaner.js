// Initialize
var initialize = require('../libs/initializer')('config.json');

initialize.then(function() {
    // Start server after initialize
    var app = require('../app/app'),
        http = require('http');
    console.log('Initialized.');
    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
}).fail(function(err) {
    console.log('Impossible to initialize: ' + err.stack);
});