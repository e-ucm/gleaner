var Q = require('q');
var mysql = require('../db/mysql');
var errors = require('./constants/errors');
var c = require('./constants/database');

module.exports = Table;

function Table(name, columns) {
    this.name = name;
    this.columns = columns;
    this.insert = buildInsert(columns.length);
}

Table.prototype.add = function(values) {
    var that = this;
    var queryValues = [this.columns];
    values.forEach(function(value) {
        queryValues.push(value);
    });

    return mysql.query('INSERT INTO ' + this.name + '( ?? ) VALUES (' + this.insert +
        ')', queryValues)
        .then(function(result) {
            var objectInserted = {};
            objectInserted[c.ID] = result.rows.insertId;
            var i = 0;
            that.columns.forEach(function(column) {
                that.filterAdd(objectInserted, column, values[i++]);
            });
            return objectInserted;
        }).fail(function(err) {
            return that.errorAdd(err);
        });
};

Table.prototype.filterAdd = function(objectInserted, column, value) {
    objectInserted[column] = value;
};

Table.prototype.errorAdd = function(err) {
    console.log('Unexpected error adding user: ' +
        err.code);
    throwError(errors.ER_UNKNOWN);
};

Table.prototype.remove = function(id) {
    return mysql.query('DELETE FROM ' + this.name + ' WHERE ' + c.ID +
        '=?', id).then(function() {
        return true;
    }).fail(function(err) {
        console.log('Unexpected error loging user: ' + err.code);
        throwError(errors.ER_UNKNOWN);
    });
};



var throwError = function(code) {
    var error = new Error();
    error.code = code;
    throw error;
};

Table.prototype.throwError = throwError;

function buildInsert(count) {
    if (count === 0) {
        return '';
    }
    var result = '?';
    for (var i = 1; i < count; i++) {
        result += ', ?';
    }
    return result;
}