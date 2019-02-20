"use strict";
exports.__esModule = true;
var databaseTemplate = /** @class */ (function () {
    function databaseTemplate() {
    }
    ;
    databaseTemplate.prototype.close = function () {
        this.db.close();
    };
    ;
    return databaseTemplate;
}());
exports.databaseTemplate = databaseTemplate;
