import * as latte_lib from "latte_lib"
import { Matrix4 } from "./math/matrix4";
import { WebGLObject, Type as WebGLObjectType } from "./webgl/webGLObject";
import { mWebGLBuffer } from "./webgl/webGLBuffer";
import { mWebGLTexture } from "./webgl/webGLTexture";
import { mWebGLExtension } from "./webgl/webGLExt";
export class Param {
    vertexShader: WebGLShader;
    fragmentShader: WebGLShader;
    shaderProgram: WebGLProgram;
    gl: WebGLRenderingContext;
    attributes: any = {};
    buffers: any = {};
    textures: any = {};
    extensions: any = {};
    constructor(gl, vertexShader, fragmentShader, shaderProgram) {
        this.gl = gl;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.shaderProgram = shaderProgram;
    }
    getAttribLocation(name: string, type?: string) {
        if (this.attributes[name] == null) {
            this.attributes[name] = WebGLObject.create(this.gl, name, WebGLObjectType.AttribLocation, type);
            this.attributes[name].index = this.gl.getAttribLocation(this.shaderProgram, name);
            //this.attributes[name] = this.gl.getAttribLocation(this.shaderProgram, name);
        }
        if (this.attributes[name].type != WebGLObjectType.AttribLocation) {
            throw new Error("type error");
        }
        return this.attributes[name];
    }
    getUniformLocation(name: string, type?: string) {
        if (this.attributes[name] == null) {
            this.attributes[name] = WebGLObject.create(this.gl, name, WebGLObjectType.UniformLocation, type);
            this.attributes[name].index = this.gl.getUniformLocation(this.shaderProgram, name);
        }
        if (this.attributes[name].type != WebGLObjectType.UniformLocation) {
            throw new Error("type error");
        }
        return this.attributes[name];
    }
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
    getElementArrayBuffer(name: string, drawType: any = this.gl.DYNAMIC_DRAW) {
        return this.getBuffer(name, this.gl.ELEMENT_ARRAY_BUFFER, drawType);
    }
    getArrayBuffer(name: string, drawType: any = this.gl.DYNAMIC_DRAW) {
        return this.getBuffer(name, this.gl.ARRAY_BUFFER, drawType);
    }
    getBuffer(name: string, arrayType: any, drawType: any = this.gl.DYNAMIC_DRAW) {
        if (!this.buffers[name]) {
            let buffer = mWebGLBuffer.create(this.gl, arrayType, drawType);
            if (!buffer) {
                throw new Error("create buffer error");
            }
            this.buffers[name] = buffer;
        }
        // this.buffers[name].set(bufferData);
        return this.buffers[name];
    }
    bindBuffer(name: string, attribute: string, stride: number, offset: number = 0) {
        this.buffers[name].bind(this.attributes[attribute], stride, offset);
    }
    // bindBuffer(attrName: string, size: number, stride: number, offset: number = 0) {
    //     //size是不是可以从本身数据类型里获得
    //     // this.gl.vertexAttribPointer(this.attributes[attrName], size, this.gl.FLOAT, false, stride, offset);
    //     // this.gl.enableVertexAttribArray(this.attributes[attrName]);
    // }
    set(name: string, value: number[]) {
        if (this.attributes[name] == null) {
            throw new Error("not attribute:" + name);
        }
        //this.gl["uniform" + value.length + "f"].apply(this.gl, ([this.attributes[name]]).concat(value));
        this.attributes[name].set(value);
    }
    createTexture(name: string, index: number) {
        if (!this.textures[name]) {
            let texture = mWebGLTexture.create(this.gl);
            if (!texture) {
                return null;
            }
            this.textures[name] = texture;
        }
        return this.textures[name];
    }
    bindTexture(name: string, index: number) {
        if (!this.textures[name]) {
            console.error('not find texture');
            return;
        }
        this.textures[name].bind(index);
    }

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
    getExtension(name: string) {
        if (!this.extensions[name]) {
            let ext = mWebGLExtension.create(this.gl, name);
            this.extensions[name] = ext;
        }
        return this.extensions[name];
    }
}