module.exports = (function() {
    var Q = require('q');
    // mongo db
    var db;

    var setUp = function(mongoHost, mongoPort, mongoDB) {
        var deferred = Q.defer();
        var MongoClient = require('mongodb').MongoClient;

        // Connect to the db
        MongoClient.connect("mongodb://localhost:27017/exampleDb", function(
            err, database) {
            if (err) {
                deferred.reject(err);
            } else {
                db = database;
                deferred.resolve(true);
            }
        });
        return deferred.promise;
    };

    var end = function() {
        var deferred = Q.defer();
        db.close(function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(true);
            }
        });
        return deferred.promise;
    };

    var dropDatabase = function() {
        if (db) {
            var deferred = Q.defer();
            db.dropDatabase(function(err, done) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(done);
                }
            });
            return deferred.promise;
        } else {
            return Q.fcall(function() {
                return true;
            });
        }
    }

    var collection = function(name) {
        return new Collection(name);
    };

    /**
     * Wrapper for mongodb collections
     */
    var Collection = function(name) {
        this.name = name;
        this.collection = db.collection(name);
    };

    Collection.prototype.insert = function(documents) {
        var deferred = Q.defer();
        this.collection.insert(documents, {
            safe: true
        }, function(err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    };

    Collection.prototype.remove = function(documents) {
        var deferred = Q.defer();
        var that = this;
        this.collection.remove(documents, function(err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    };

    Collection.prototype.findOne = function(query, projection) {
        var deferred = Q.defer();
        this.collection.findOne(query, projection || {}, function(err,
            document) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(document);
            }
        });
        return deferred.promise;
    };

    Collection.prototype.find = function(query, options) {
        var deferred = Q.defer();
        var cursor = this.collection.find(query || {});
        options = options || {};
        cursor = options.sort ? cursor.sort(options.sort) : cursor;
        cursor = options.limit ? cursor.limit(options.limit) : cursor;
        cursor = options.skip ? cursor.skip(options.skip) : cursor;
        cursor.toArray(function(err, results) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        });
        return deferred.promise;
    };


    Collection.prototype.update = function(query, set) {
        var deferred = Q.defer();
        this.collection.update(query, set, function(err, result) {
            if (err) {
                console.log(err);
                deferred.reject(err);
            } else {
                console.log('Updated ' + result);
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    };

    Collection.prototype.drop = function() {
        var deferred = Q.defer();
        var that = this;
        this.collection.drop(function(err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                console.log(that.name + ' dropped');
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    };

    Collection.prototype.count = function(query) {
        var deferred = Q.defer();
        var that = this;
        this.collection.count(query || {}, function(err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    };

    return {
        setUp: setUp,
        end: end,
        collection: collection,
        dropDatabase: dropDatabase
    };
})();