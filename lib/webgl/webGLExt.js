"use strict";
exports.__esModule = true;
var mWebGLExtension = /** @class */ (function () {
    function mWebGLExtension(gl) {
        this.parameter = {};
        this.gl = gl;
    }
    mWebGLExtension.prototype.getParameter = function (name) {
        if (this.ext) {
            this.parameter[name] = this.gl.getParameter(this.ext[name]);
        }
        return this.parameter[name];
    };
    mWebGLExtension.prototype.isOK = function () {
        return this.ext;
    };
    mWebGLExtension.create = function (gl, name) {
        var mExt = new mWebGLExtension(gl);
        var ext = gl.getExtension(name) ||
            gl.getExtension("WEBKIT_" + name) ||
            gl.getExtension("MOZ_" + name);
        mExt.ext = ext;
        return mExt;
    };
    return mWebGLExtension;
}());
exports.mWebGLExtension = mWebGLExtension;
