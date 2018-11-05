import { Loader, defaultLoader } from "./loader"
import { Param } from "./param";
export class DrawWebGL {
    gl: WebGLRenderingContext;
    loader: Loader;
    params: any = {};
    loadFile(file: string, callback: Function) {
        this.loader.loadFile(file, callback);
    }
    loadImage(file: string, callback: Function) {
        this.loader.loadImage(file, callback);
    }
    draw(name: string, data: any) {
        let param = this.params[name];
        this.gl.useProgram(param.shaderProgram);
        this.gl.drawArrays(this.gl.POINTS, 0, 1);
    }
    constructor(dom: HTMLCanvasElement, loader: Loader = defaultLoader) {
        this.gl = DrawWebGL.createGLContext(dom);
        this.loader = loader;
    }
    createParam(name: string, vertex: string, fragment: string) {
        let vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertex);
        let fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragment);
        if (vertexShader && fragmentShader) {
            let shaderProgram = this.gl.createProgram();
            this.gl.attachShader(shaderProgram, vertexShader);
            this.gl.attachShader(shaderProgram, fragmentShader);
            this.gl.linkProgram(shaderProgram);
            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                let log = this.gl.getProgramInfoLog(shaderProgram);
                console.error('createParam error ', log);
                vertexShader && this.gl.deleteShader(vertexShader);
                fragmentShader && this.gl.deleteShader(fragmentShader);
                shaderProgram && this.gl.deleteProgram(shaderProgram);
                return false;
            }
            this.params[name] = new Param(this.gl, vertexShader, fragmentShader, shaderProgram);
            return this.params[name];
        } else {
            vertexShader && this.gl.deleteShader(vertexShader);
            fragmentShader && this.gl.deleteShader(fragmentShader);
        }
        return null;
    }
    createShader(type: any, shareSource: string) {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, shareSource);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    useProgram(name: string) {
        if (!this.params[name]) {
            console.error("not find the param");
            return;
        }
        this.gl.useProgram(this.params[name].shaderProgram);
    }
    clean() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.disable(this.gl.SCISSOR_TEST);
        this.gl.disable(this.gl.STENCIL_TEST);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.frontFace(this.gl.CW);
        this.gl.enable(this.gl.BLEND);
        this.gl.colorMask(true, true, true, true);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    static createGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
        let names = ["webgl", "experimental-webgl"];
        let context = null;
        for (var i = 0; i < names.length; i++) {
            try {
                context = canvas.getContext(names[i]);
            } catch (err) {
                break;
            }
        }
        if (context) {
            context.viewportWidth = canvas.width;
            context.viewportHeight = canvas.height;
        } else {
            alert("Failed to create webGL context!");
        }
        return context;
    }
}