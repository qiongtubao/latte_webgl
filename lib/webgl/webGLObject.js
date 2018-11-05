"use strict";
exports.__esModule = true;
var matrix4_1 = require("../math/matrix4");
var vector4_1 = require("../math/vector4");
var vector1_1 = require("../math/vector1");
var vector2_1 = require("../math/vector2");
var vector3_1 = require("../math/vector3");
var Type;
(function (Type) {
    Type["AttribLocation"] = "AttribLocation";
    Type["UniformLocation"] = "UniformLocation";
})(Type = exports.Type || (exports.Type = {}));
var WebGLObject = /** @class */ (function () {
    function WebGLObject(gl, name, type) {
        this.gl = gl;
        this.attributeName = name;
        this.type = type;
    }
    WebGLObject.prototype.set = function (value) {
        if (this["class"] == null) {
            switch (value.constructor) {
                case Array:
                    this.byteSize = value.length;
                    this.gl["uniform" + value.length + "f"].apply(this.gl, ([this.index]).concat(value));
                    break;
                case Number:
                    this.gl.uniform1i(this.index, value);
                    break;
                default:
                    if (value.getMethod) {
                        this.gl[value.getMethod()].apply(this.gl, ([this.index]).concat(value.getData()));
                    }
            }
        }
        else if (this["class"] != undefined) {
            var v = new this["class"](value);
            this.gl[v.getMethod()].apply(this.gl, ([this.index]).concat(v.getData()));
        }
        else {
            throw new Error('type mismatch');
        }
    };
    WebGLObject.create = function (gl, attributeName, type, className) {
        var webglObject = new WebGLObject(gl, attributeName, type);
        switch (className) {
            case "vec1i":
                webglObject.byteSize = vector1_1.Vector1.byteSize;
                webglObject["class"] = vector1_1.Vector1;
                break;
            case "vec2":
                webglObject.byteSize = vector2_1.Vector2.byteSize;
                webglObject["class"] = vector2_1.Vector2;
                break;
            case "vec3":
                webglObject.byteSize = vector3_1.Vector3.byteSize;
                webglObject["class"] = vector3_1.Vector3;
                break;
            case "vec4":
                webglObject.byteSize = vector4_1.Vector4.byteSize;
                webglObject["class"] = vector4_1.Vector4;
                break;
            case "matrix4":
                webglObject["class"] = matrix4_1.Matrix4;
                break;
        }
        return webglObject;
    };
    return WebGLObject;
}());
exports.WebGLObject = WebGLObject;
