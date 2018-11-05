"use strict";
exports.__esModule = true;
var mWebGLTexture = /** @class */ (function () {
    function mWebGLTexture(gl) {
        this.gl = gl;
    }
    mWebGLTexture.prototype.resetTexture = function () {
        this.texture = this.gl.createTexture();
    };
    mWebGLTexture.prototype.set = function (webglObject, image, config) {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        // this.gl.uniform1i(, 0);
    };
    mWebGLTexture.prototype.set2 = function (webglObject, image) {
        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    };
    mWebGLTexture.prototype.bind = function (index) {
        this.gl.activeTexture(this.gl["TEXTURE" + index]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    };
    mWebGLTexture.create = function (gl) {
        var texture = new mWebGLTexture(gl);
        texture.resetTexture();
        return texture;
    };
    return mWebGLTexture;
}());
exports.mWebGLTexture = mWebGLTexture;
