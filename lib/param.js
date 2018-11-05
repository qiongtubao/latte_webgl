"use strict";
exports.__esModule = true;
var webGLObject_1 = require("./webgl/webGLObject");
var webGLBuffer_1 = require("./webgl/webGLBuffer");
var webGLTexture_1 = require("./webgl/webGLTexture");
var webGLExt_1 = require("./webgl/webGLExt");
var Param = /** @class */ (function () {
    function Param(gl, vertexShader, fragmentShader, shaderProgram) {
        this.attributes = {};
        this.buffers = {};
        this.textures = {};
        this.extensions = {};
        this.gl = gl;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.shaderProgram = shaderProgram;
    }
    Param.prototype.getAttribLocation = function (name, type) {
        if (this.attributes[name] == null) {
            this.attributes[name] = webGLObject_1.WebGLObject.create(this.gl, name, webGLObject_1.Type.AttribLocation, type);
            this.attributes[name].index = this.gl.getAttribLocation(this.shaderProgram, name);
            //this.attributes[name] = this.gl.getAttribLocation(this.shaderProgram, name);
        }
        if (this.attributes[name].type != webGLObject_1.Type.AttribLocation) {
            throw new Error("type error");
        }
        return this.attributes[name];
    };
    Param.prototype.getUniformLocation = function (name, type) {
        if (this.attributes[name] == null) {
            this.attributes[name] = webGLObject_1.WebGLObject.create(this.gl, name, webGLObject_1.Type.UniformLocation, type);
            this.attributes[name].index = this.gl.getUniformLocation(this.shaderProgram, name);
        }
        if (this.attributes[name].type != webGLObject_1.Type.UniformLocation) {
            throw new Error("type error");
        }
        return this.attributes[name];
    };
    // getBuffer(name) {
    //     if(!this.buffers[name]) {
    //         let buffer = this.gl.createBuffer();
    //         if(!buffer) {
    //             throw new Error("create buffer error");
    //         }
    //         this.buffers[name] = buffer;
    //     }
    //     return this.buffers[name];
    // }
    Param.prototype.getElementArrayBuffer = function (name, drawType) {
        if (drawType === void 0) { drawType = this.gl.DYNAMIC_DRAW; }
        return this.getBuffer(name, this.gl.ELEMENT_ARRAY_BUFFER, drawType);
    };
    Param.prototype.getArrayBuffer = function (name, drawType) {
        if (drawType === void 0) { drawType = this.gl.DYNAMIC_DRAW; }
        return this.getBuffer(name, this.gl.ARRAY_BUFFER, drawType);
    };
    Param.prototype.getBuffer = function (name, arrayType, drawType) {
        if (drawType === void 0) { drawType = this.gl.DYNAMIC_DRAW; }
        if (!this.buffers[name]) {
            var buffer = webGLBuffer_1.mWebGLBuffer.create(this.gl, arrayType, drawType);
            if (!buffer) {
                throw new Error("create buffer error");
            }
            this.buffers[name] = buffer;
        }
        // this.buffers[name].set(bufferData);
        return this.buffers[name];
    };
    Param.prototype.bindBuffer = function (name, attribute, stride, offset) {
        if (offset === void 0) { offset = 0; }
        this.buffers[name].bind(this.attributes[attribute], stride, offset);
    };
    // bindBuffer(attrName: string, size: number, stride: number, offset: number = 0) {
    //     //size是不是可以从本身数据类型里获得
    //     // this.gl.vertexAttribPointer(this.attributes[attrName], size, this.gl.FLOAT, false, stride, offset);
    //     // this.gl.enableVertexAttribArray(this.attributes[attrName]);
    // }
    Param.prototype.set = function (name, value) {
        if (this.attributes[name] == null) {
            throw new Error("not attribute:" + name);
        }
        //this.gl["uniform" + value.length + "f"].apply(this.gl, ([this.attributes[name]]).concat(value));
        this.attributes[name].set(value);
    };
    Param.prototype.createTexture = function (name, index) {
        if (!this.textures[name]) {
            var texture = webGLTexture_1.mWebGLTexture.create(this.gl);
            if (!texture) {
                return null;
            }
            this.textures[name] = texture;
        }
        return this.textures[name];
    };
    Param.prototype.bindTexture = function (name, index) {
        if (!this.textures[name]) {
            console.error('not find texture');
            return;
        }
        this.textures[name].bind(index);
    };
    // setMatrix(name: string, value: any) {
    //     if (this.attributes[name] == null) {
    //         throw new Error("not attribute:" + name);
    //     }
    //     if (latte_lib.utils.isArray(value)) {
    //         value = new Float32Array(value);
    //     } else if (value.constructor == Matrix4) {
    //         value = value.data;
    //     }
    //     let length = value.length;
    //     if (length != 4 && length != 9 && length != 16) {
    //         throw new Error("data error");
    //     }
    //     let size = Math.sqrt(length);
    //     this.gl["uniformMatrix" + size + "fv"](this.attributes[name], false, value);
    // }
    Param.prototype.getExtension = function (name) {
        if (!this.extensions[name]) {
            var ext = webGLExt_1.mWebGLExtension.create(this.gl, name);
            this.extensions[name] = ext;
        }
        return this.extensions[name];
    };
    return Param;
}());
exports.Param = Param;
