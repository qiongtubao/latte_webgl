import { Matrix4 } from "../math/matrix4";
import { Vector4 } from "../math/vector4";
import { Vector1 } from "../math/vector1";
import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";

export enum Type {
    AttribLocation = "AttribLocation",
    UniformLocation = "UniformLocation"
}
export class WebGLObject {
    attributeName: string;
    byteSize: number;
    index: any;
    gl: WebGLRenderingContext;
    type: Type;
    class: any;
    constructor(gl: WebGLRenderingContext, name: string, type: Type) {
        this.gl = gl;
        this.attributeName = name;
        this.type = type;
    }
    set(value: any) {
        if (this.class == null) {
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
        } else if (this.class != undefined) {
            let v = new this.class(value);
            this.gl[v.getMethod()].apply(this.gl, ([this.index]).concat(v.getData()));
        } else {
            throw new Error('type mismatch');
        }

    }
    static create(gl: WebGLRenderingContext, attributeName: string, type: Type, className: string) {
        let webglObject = new WebGLObject(gl, attributeName, type);
        switch (className) {
            case "vec1i":
                webglObject.byteSize = Vector1.byteSize;
                webglObject.class = Vector1;
                break;
            case "vec2":
                webglObject.byteSize = Vector2.byteSize;
                webglObject.class = Vector2;
                break;
            case "vec3":
                webglObject.byteSize = Vector3.byteSize;
                webglObject.class = Vector3;
                break;
            case "vec4":
                webglObject.byteSize = Vector4.byteSize;
                webglObject.class = Vector4;
                break;
            case "matrix4":
                webglObject.class = Matrix4;
                break;
        }
        return webglObject;
    }

}