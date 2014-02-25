/**
 * Access to MySQL pools database
 */
module.exports = (function() {
    var Q = require('q');
    // Connection pool. To be set up in initialization
    var pool;

    /**
     * Set ups the connections pool
     * @param {String} host     MySQL host
     * @param {String} port     MySQL host
     * @param {String} user     MySQL user
     * @param {String} password MySQL password
     * @param {String} database MySQL database
     */
    var setUpPool = function(host, port, user, password, database) {
        var mysql = require('mysql');
        var deferred = Q.defer();
        pool = mysql.createPool({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        });
        // Make a silly query to ensure that everything is OK
        pool.query('SELECT 1', function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(true);
            }
        });
        return deferred.promise;
    };

    /**
     * Perfroms a query
     * @param  {String} sql    SQL query
     * @param  {Object} values Values for the query
     * @return {Object}        a promise with the query's result
     */
    var query = function(sql, values) {
        var deferred = Q.defer();
        pool.query(sql, values, function(err, rows, fields) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve({
                    rows: rows,
                    fields: fields
                });
            }
        });
        return deferred.promise;
    };

    /**
     * Releases the pool
     */
    var end = function() {
        pool.end();
    };

    return {
        setUp: setUpPool,
        query: query,
        end: end
    };
})();