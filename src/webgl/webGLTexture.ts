import { WebGLObject } from "./webGLObject";
import { Vector1 } from "../math/vector1"

export class mWebGLTexture {
  texture: WebGLTexture;
  gl: WebGLRenderingContext;
  index: number;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }
  resetTexture() {
    this.texture = this.gl.createTexture();
  }
  set(webglObject: WebGLObject, image: HTMLImageElement, config?: any) {

    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    // this.gl.uniform1i(, 0);
  }
  set2(webglObject: WebGLObject, image: HTMLImageElement) {
    this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
      this.gl.UNSIGNED_BYTE, image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
  }
  bind(index: number) {
    this.gl.activeTexture(this.gl["TEXTURE" + index]);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
  static create(gl: WebGLRenderingContext) {
    let texture = new mWebGLTexture(gl);
    texture.resetTexture();
    return texture;
  }
}