"use strict";
exports.__esModule = true;
var pgp = require('pg-promise')();
var con_obj = {
    host: 'localhost',
    port: 5432,
    database: 'finanzreport',
    user: 'finanzreport',
    password: 'finanzreport',
};
var database = /** @class */ (function () {
    function database() {
        this.db = pgp(con_obj);
    }
    database.prototype.insert = function (value, date, category, medium) {
        this.db.any("INSERT INTO test_data(value, date, category, medium) VALUES (" + value + ", " + date + ", " + category + ", " + medium + ")")["catch"](function (error) {
            console.error(error);
        });
    };
    database.prototype.selectAll = function () {
        this.db.any('SELECT * from test_data')
            .then(function (data) {
            console.log('DATA:', data);
        })["catch"](function (error) {
            console.error(error);
        });
    };
    database.prototype.close = function () {
        this.db.close();
    };
    return database;
}());
exports.database = database;
