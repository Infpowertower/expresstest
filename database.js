"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
