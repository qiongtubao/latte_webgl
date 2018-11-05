export class mWebGLExtension {
    name: string;
    attributeName: string;
    gl: WebGLRenderingContext;
    ext: any;
    parameter: any = {};
    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }
    getParameter(name: string) {
        if (this.ext) {
            this.parameter[name] = this.gl.getParameter(this.ext[name]);
        }
        return this.parameter[name];
    }
    isOK() {
        return this.ext;
    }
    static create(gl: WebGLRenderingContext, name: string) {
        let mExt = new mWebGLExtension(gl);
        let ext = gl.getExtension(name) ||
            gl.getExtension("WEBKIT_" + name) ||
            gl.getExtension("MOZ_" + name);
        mExt.ext = ext;
        return mExt;
    }
}