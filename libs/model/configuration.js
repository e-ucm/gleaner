/**
 * Object containg configuration properties
 */
function Configuration() {

}

/**
 * Loads the configuration in the given path
 * @param  {String} path path to a JSON configuration file
 */
Configuration.prototype.load = function(path) {
    var fs = require('fs');
    if (fs.existsSync(path)) {
        var data = fs.readFileSync(path);
        var conf = JSON.parse(data);
        for (var key in conf) {
            this[key] = conf[key];
        }
    } else {
        console.log(path + ' configuration file not found.');
    }
};

module.exports = new Configuration();