"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var database_js_1 = require("./database.js");
var sqlite3 = require('sqlite3').verbose();
var mkdirp = require('mkdirp');
var database = /** @class */ (function (_super) {
    __extends(database, _super);
    function database() {
        var _this = _super.call(this) || this;
        mkdirp('./db', function (error) {
            if (error)
                console.error(error);
        });
        _this.db = new sqlite3.Database('./db/test.db');
        if (!_this.checkDB()) {
            _this.initialize();
        }
        return _this;
    }
    database.prototype.checkDB = function () {
        return this.db.all('SELECT name FROM sqlite_master WHERE type="table";', function (error, rows) {
            if (error) {
                console.error(error);
                return false;
            }
            else {
                var user = false;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].name === 'user') {
                        user = true;
                    }
                }
                if (user)
                    return true;
                return false;
            }
        });
    };
    database.prototype.initialize = function () {
        this.db.run('CREATE TABLE user (name TEXT password TEXT);', runCallback);
        console.log("Database initialized!");
    };
    database.prototype.insert = function (columns, values, table) {
        return this.db.run('INSERT INTO ? (?) VALUES (?);', table, columns, values, runCallback);
    };
    ;
    database.prototype.selectAll = function () {
        this.db.run('SELECT * from test');
    };
    return database;
}(database_js_1.databaseTemplate));
exports.database = database;
function runCallback(error) {
    if (error) {
        console.error(error);
        return false;
    }
    else {
        return true;
    }
}
function getCallback(error, row) {
    if (error)
        console.error(error);
    else
        console.log(row);
}
function allCallback(error, rows) {
    if (error)
        console.error(error);
    else
        console.log(rows);
}
var db = new database();
