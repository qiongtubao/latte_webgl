"use strict";
exports.__esModule = true;
var loader_1 = require("./loader");
var param_1 = require("./param");
var DrawWebGL = /** @class */ (function () {
    function DrawWebGL(dom, loader) {
        if (loader === void 0) { loader = loader_1.defaultLoader; }
        this.params = {};
        this.gl = DrawWebGL.createGLContext(dom);
        this.loader = loader;
    }
    DrawWebGL.prototype.loadFile = function (file, callback) {
        this.loader.loadFile(file, callback);
    };
    DrawWebGL.prototype.loadImage = function (file, callback) {
        this.loader.loadImage(file, callback);
    };
    DrawWebGL.prototype.draw = function (name, data) {
        var param = this.params[name];
        this.gl.useProgram(param.shaderProgram);
        this.gl.drawArrays(this.gl.POINTS, 0, 1);
    };
    DrawWebGL.prototype.createParam = function (name, vertex, fragment) {
        var vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertex);
        var fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragment);
        if (vertexShader && fragmentShader) {
            var shaderProgram = this.gl.createProgram();
            this.gl.attachShader(shaderProgram, vertexShader);
            this.gl.attachShader(shaderProgram, fragmentShader);
            this.gl.linkProgram(shaderProgram);
            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                var log = this.gl.getProgramInfoLog(shaderProgram);
                console.error('createParam error ', log);
                vertexShader && this.gl.deleteShader(vertexShader);
                fragmentShader && this.gl.deleteShader(fragmentShader);
                shaderProgram && this.gl.deleteProgram(shaderProgram);
                return false;
            }
            this.params[name] = new param_1.Param(this.gl, vertexShader, fragmentShader, shaderProgram);
            return this.params[name];
        }
        else {
            vertexShader && this.gl.deleteShader(vertexShader);
            fragmentShader && this.gl.deleteShader(fragmentShader);
        }
        return null;
    };
    DrawWebGL.prototype.createShader = function (type, shareSource) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, shareSource);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    DrawWebGL.prototype.useProgram = function (name) {
        if (!this.params[name]) {
            console.error("not find the param");
            return;
        }
        this.gl.useProgram(this.params[name].shaderProgram);
    };
    DrawWebGL.prototype.clean = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.disable(this.gl.SCISSOR_TEST);
        this.gl.disable(this.gl.STENCIL_TEST);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.frontFace(this.gl.CW);
        this.gl.enable(this.gl.BLEND);
        this.gl.colorMask(true, true, true, true);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    };
    DrawWebGL.createGLContext = function (canvas) {
        var names = ["webgl", "experimental-webgl"];
        var context = null;
        for (var i = 0; i < names.length; i++) {
            try {
                context = canvas.getContext(names[i]);
            }
            catch (err) {
                break;
            }
        }
        if (context) {
            context.viewportWidth = canvas.width;
            context.viewportHeight = canvas.height;
        }
        else {
            alert("Failed to create webGL context!");
        }
        return context;
    };
    return DrawWebGL;
}());
exports.DrawWebGL = DrawWebGL;
