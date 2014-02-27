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

Table.prototype.get = function(id) {
    var that = this;
    return mysql.query('SELECT * FROM ' + this.name + ' WHERE ' + c.ID + '=?', [
        id
    ]).then(function(result) {
        if (result.rows.length === 0) {
            throwError(errors.ER_ID_NOT_FOUND);
        } else {
            return that.filterGet(result.rows[0]);
        }
    });
};

Table.prototype.selectWhere = function(where) {
    var w = buildWhere(where);
    return mysql.query('SELECT * FROM ' + this.name + ' WHERE ' + w.whereClause,
        w.values);
};

Table.prototype.removeWhere = function(where) {
    var w = buildWhere(where);
    return mysql.query('DELETE FROM ' + this.name + ' WHERE ' + w.whereClause,
        w.values).then(function() {
        return true;
    }).fail(throwUnknownError);
};

Table.prototype.filterGet = function(object) {
    return object;
};

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
    console.log('Unexpected error adding to ' + this.name + ': ' +
        err.code + ':' + err.message);
    throwError(errors.ER_UNKNOWN);
};

Table.prototype.remove = function(id) {
    return mysql.query('DELETE FROM ' + this.name + ' WHERE ' + c.ID +
        '=?', id).then(function() {
        return true;
    }).fail(throwUnknownError);
};

var throwUnknownError = function(err) {
    console.log('Unexpected error ' + err.code + ': ' + err.message);
    throwError(errors.ER_UNKNOWN);
};

var throwError = function(code) {
    var error = new Error(code);
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

function buildWhere(where) {
    var whereClause = '';
    var values = [];
    for (var key in where) {
        whereClause += (values.length === 0 ? '' : ' AND ') + key + '= ? ';
        values.push(where[key]);
    }
    return {
        whereClause: whereClause,
        values: values
    };
}