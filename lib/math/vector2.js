"use strict";
exports.__esModule = true;
var Vector2 = /** @class */ (function () {
    function Vector2(data) {
        if (data === void 0) { data = [0, 0]; }
        this.data = new Float32Array(data);
    }
    Vector2.prototype.getMethod = function () {
        return "uniform2f";
    };
    Vector2.prototype.getData = function () {
        return this.data;
    };
    Vector2.byteSize = 2;
    return Vector2;
}());
exports.Vector2 = Vector2;
