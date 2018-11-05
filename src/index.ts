import { DrawWebGL } from "./drawWebGL"
import { Matrix4 } from "./math/matrix4";
import { Vector4 } from "./math/vector4";
import { Vector3 } from "./math/vector3"
import { Vector1 } from "./math/vector1"
export function createDrawWebGL(dom: HTMLCanvasElement) {
    return new DrawWebGL(dom);
}
export {
    Matrix4,
    Vector4,
    Vector3,
    Vector1
}