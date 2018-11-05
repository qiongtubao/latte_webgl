"use strict";
exports.__esModule = true;
var drawWebGL_1 = require("./drawWebGL");
var matrix4_1 = require("./math/matrix4");
exports.Matrix4 = matrix4_1.Matrix4;
var vector4_1 = require("./math/vector4");
exports.Vector4 = vector4_1.Vector4;
var vector3_1 = require("./math/vector3");
exports.Vector3 = vector3_1.Vector3;
var vector1_1 = require("./math/vector1");
exports.Vector1 = vector1_1.Vector1;
function createDrawWebGL(dom) {
    return new drawWebGL_1.DrawWebGL(dom);
}
exports.createDrawWebGL = createDrawWebGL;
