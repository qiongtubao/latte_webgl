"use strict";
exports.__esModule = true;
var Vector4 = /** @class */ (function () {
    function Vector4(data) {
        if (data === void 0) { data = [0, 0, 0, 0]; }
        this.data = new Float32Array(data);
    }
    Vector4.prototype.getMethod = function () {
        return "uniform4f";
    };
    Vector4.prototype.getData = function () {
        return [this.data[0], this.data[1], this.data[2], this.data[3]];
    };
    Vector4.byteSize = 4;
    return Vector4;
}());
exports.Vector4 = Vector4;
