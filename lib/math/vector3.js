"use strict";
exports.__esModule = true;
var Vector3 = /** @class */ (function () {
    function Vector3(data) {
        if (data === void 0) { data = [0, 0, 0]; }
        this.data = new Float32Array(data);
    }
    Vector3.prototype.normalize = function () {
        var v = this.data;
        var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
        if (g) {
            if (g == 1)
                return this;
        }
        else {
            v[0] = 0;
            v[1] = 0;
            v[2] = 0;
            return this;
        }
        g = 1 / g;
        v[0] = c * g;
        v[1] = d * g;
        v[2] = e * g;
        return this;
    };
    Vector3.prototype.getMethod = function () {
        return "uniform3f";
    };
    Vector3.prototype.getData = function () {
        return [this.data[0], this.data[1], this.data[2]];
    };
    Vector3.byteSize = 3;
    return Vector3;
}());
exports.Vector3 = Vector3;
