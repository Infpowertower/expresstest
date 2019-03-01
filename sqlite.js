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
Object.defineProperty(exports, "__esModule", { value: true });
var database_js_1 = require("./database.js");
var sqlite3 = require('sqlite3').verbose();
var mkdirp = require("mkdirp");
var Database = /** @class */ (function (_super) {
    __extends(Database, _super);
    function Database() {
        var _this = _super.call(this) || this;
        mkdirp('./db', function (error) {
            if (error)
                console.error(error);
        });
        _this.db = new sqlite3.Database('./db/test.db');
        if (!_this.checkDB().catch(function (error) { return console.error(error); })) {
            _this.initialize();
        }
        return _this;
    }
    Database.prototype.checkDB = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.all('SELECT name FROM sqlite_master WHERE type="table";', function (error, rows) {
                if (error) {
                    reject(error);
                }
                else {
                    var user = false;
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].name === 'user') {
                            user = true;
                        }
                    }
                    if (user)
                        resolve(true);
                    resolve(false);
                }
            });
        });
    };
    Database.prototype.showTables = function (verbose) {
        var _this = this;
        if (verbose === void 0) { verbose = false; }
        return new Promise(function (resolve, reject) {
            var select;
            if (verbose)
                select = '*';
            else
                select = 'name';
            _this.db.all("SELECT " + select + " FROM sqlite_master WHERE type=\"table\";", function (error, rows) {
                if (error)
                    reject(error);
                else {
                    resolve(rows);
                }
            });
        });
    };
    Database.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.run('CREATE TABLE user (name TEXT, password TEXT);', function (error) {
                if (error)
                    reject(error);
                else {
                    console.log("Database initialized!");
                    resolve();
                }
            });
        });
    };
    Database.prototype.insert = function (table, columns, values) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.serialize(function () {
                var columnStr = columns.toString();
                var placeholder = columns.map(function (_column) { return '?'; }).join(',');
                var statement = _this.db.prepare("INSERT INTO " + table + " (" + columnStr + ") VALUES (" + placeholder + ")");
                for (var i = 0; i < values.length; i++) {
                    statement.run(values[i]);
                }
                try {
                    statement.finalize();
                    resolve();
                }
                catch (error) {
                    console.error(error);
                    reject(error);
                }
            });
        });
    };
    ;
    Database.prototype.get = function (table, column, condition) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.get("SELECT " + column + " FROM " + table + " WHERE " + condition, function (error, row) {
                if (error)
                    reject(error);
                else {
                    resolve(row);
                }
                ;
            });
        });
    };
    Database.prototype.delete = function () {
    };
    Database.prototype.selectAll = function (table) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.all("SELECT * FROM " + table + ";", function (error, rows) {
                if (error)
                    reject(error);
                else
                    resolve(rows);
            });
        });
    };
    Database.prototype.dropTable = function (table) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.run("DROP TABLE " + table + ";", function (error) {
                if (error)
                    reject(error);
                else {
                    console.log("Table " + table + " dropped.");
                    resolve();
                }
            });
        });
    };
    return Database;
}(database_js_1.databaseTemplate));
exports.Database = Database;
function test() {
    var db = new Database();
    //db.selectAll('user').then((output) => console.log(output))
    db.dropTable('user')
        .then(function () { return db.initialize(); })
        .then(function () {
        db.close();
    })
        .catch(function (error) {
        console.error(error);
        db.initialize().catch(function (error) { return console.error(error); });
    });
}
//test();
