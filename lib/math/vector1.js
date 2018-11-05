"use strict";
exports.__esModule = true;
var Vector1 = /** @class */ (function () {
    function Vector1(data) {
        this.data = data;
    }
    Vector1.prototype.getMethod = function () {
        return parseInt(this.data + "") === this.data ? "uniform1i" : "uniform1f";
    };
    Vector1.prototype.getData = function () {
        return [this.data];
    };
    Vector1.byteSize = 1;
    return Vector1;
}());
exports.Vector1 = Vector1;
