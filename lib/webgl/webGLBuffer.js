"use strict";
exports.__esModule = true;
var latte_lib = require("latte_lib");
var mWebGLBuffer = /** @class */ (function () {
    function mWebGLBuffer(gl, type, drawType) {
        this.gl = gl;
        this.type = type;
        this.drawType = drawType;
    }
    mWebGLBuffer.prototype.resetBuffer = function () {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
        }
        this.buffer = this.gl.createBuffer();
    };
    mWebGLBuffer.prototype.bind = function (o, stride, offset) {
        if (stride === void 0) { stride = 0; }
        if (offset === void 0) { offset = 0; }
        // this.gl.bindBuffer(this.type, this.buffer);
        this.gl.enableVertexAttribArray(o.index);
        this.gl.vertexAttribPointer(o.index, o.byteSize, this.gl.FLOAT, false, stride, offset);
        return this;
    };
    mWebGLBuffer.prototype.set = function (data) {
        var array;
        if (latte_lib.utils.isArray(data)) {
            if (this.type == this.gl.ELEMENT_ARRAY_BUFFER) {
                array = new Int16Array(data);
            }
            else {
                array = new Float32Array(data);
            }
        }
        else {
            array = data;
        }
        this.gl.bindBuffer(this.type, this.buffer);
        this.gl.bufferData(this.type, array, this.drawType);
    };
    mWebGLBuffer.create = function (gl, type, drawType) {
        var webglBuffer = new mWebGLBuffer(gl, type, drawType);
        webglBuffer.resetBuffer();
        return webglBuffer;
    };
    return mWebGLBuffer;
}());
exports.mWebGLBuffer = mWebGLBuffer;
