var gameplays = require('../libs/model/gameplays');
var test = require('../test');

exports.setUp = function(callback) {
    test.setUp(callback);
};

exports.tearDown = function(callback) {
    test.tearDown(callback);
};

exports.testAddUpdate = function(test) {
    var id;
    var date;
    test.expect(7);
    gameplays.add(0, '000', 'localhost', 'sf=')
        .then(function(gameplay) {
            test.ok(gameplay.id);
            id = gameplay.id;
            test.equals(gameplay.player, 0);
            test.equals(gameplay.trackingKey, '000');
            test.equals(gameplay.token, 'sf=');
            test.equals(gameplay.ip, 'localhost');
            date = gameplay.start;
            test.equals(gameplay.start.getTime(), gameplay.lastUpdate.getTime());
            console.log('Waiting 1 second...');
            setTimeout(function() {
                console.log('Updating');
                gameplays.update(id).then(function() {
                    return gameplays.get(id);
                }).then(function(gameplay) {
                    var newDate = gameplay.lastUpdate;
                    test.ok(gameplay.start.getTime() < gameplay.lastUpdate
                        .getTime(),
                        'Update did not work ' + date +
                        ' not less than ' + newDate);
                }).fail(function(err) {
                    test.ok(false, err.stack);
                }).then(function() {
                    test.done();
                });
            }, 1000);
        });
};