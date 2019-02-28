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
var pgp = require('pg-promise')();
var database_js_1 = require("./database.js");
var con_obj = {
    host: 'localhost',
    port: 5432,
    database: 'finanzreport',
    user: 'finanzreport',
    password: 'finanzreport',
};
var Database = /** @class */ (function (_super) {
    __extends(Database, _super);
    function Database() {
        var _this = _super.call(this) || this;
        _this.db = pgp(con_obj);
        return _this;
    }
    Database.prototype.insert = function (value, date, category, medium) {
        this.db.any("INSERT INTO test_data(value, date, category, medium) VALUES ('" + value + "', '" + date + "', '" + category + "', '" + medium + "')")
            .catch(function (error) {
            console.error(error);
        });
    };
    Database.prototype.selectAll = function () {
        this.db.any('SELECT * from test_data')
            .then(function (data) {
            console.log('DATA:', data);
        })
            .catch(function (error) {
            console.error(error);
        });
    };
    Database.prototype.close = function () {
        this.db.close();
    };
    return Database;
}(database_js_1.databaseTemplate));
exports.Database = Database;
var db = new Database();
//db.insert(13, "2019-02-01", "testing", "bank");
db.selectAll();
