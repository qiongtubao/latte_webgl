import { WebGLObject } from "./webGLObject";
import * as latte_lib from "latte_lib"
export class mWebGLBuffer {
    type: any;
    gl: WebGLRenderingContext;
    buffer: WebGLBuffer;
    drawType: any;
    constructor(gl: WebGLRenderingContext, type: any, drawType: any) {
        this.gl = gl;
        this.type = type;
        this.drawType = drawType;

    }
    resetBuffer() {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
        }
        this.buffer = this.gl.createBuffer();
    }
    bind(o: WebGLObject, stride: number = 0, offset: number = 0) {
        // this.gl.bindBuffer(this.type, this.buffer);
        this.gl.enableVertexAttribArray(o.index);
        this.gl.vertexAttribPointer(o.index, o.byteSize, this.gl.FLOAT, false, stride, offset);
        return this;
    }
    set(data: number[] | Float32Array | Int16Array) {
        let array: Float32Array;
        if (latte_lib.utils.isArray(data)) {
            if (this.type == this.gl.ELEMENT_ARRAY_BUFFER) {
                array = new Int16Array(data);
            } else {
                array = new Float32Array(data);
            }
        } else {
            array = (<Float32Array>data);
        }
        this.gl.bindBuffer(this.type, this.buffer);
        this.gl.bufferData(this.type, array, this.drawType);
    }
    static create(gl: WebGLRenderingContext, type: any, drawType: any) {
        let webglBuffer = new mWebGLBuffer(gl, type, drawType);
        webglBuffer.resetBuffer();
        return webglBuffer;
    }
}