(function(define) {'use strict'
	define("latte_webgl/drawWebGL.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var loader_1 = require("./loader");
		var param_1 = require("./param");
		var DrawWebGL = /** @class */ (function () {
		    function DrawWebGL(dom, loader) {
		        if (loader === void 0) { loader = loader_1.defaultLoader; }
		        this.params = {};
		        this.gl = DrawWebGL.createGLContext(dom);
		        this.loader = loader;
		    }
		    DrawWebGL.prototype.loadFile = function (file, callback) {
		        this.loader.loadFile(file, callback);
		    };
		    DrawWebGL.prototype.loadImage = function (file, callback) {
		        this.loader.loadImage(file, callback);
		    };
		    DrawWebGL.prototype.draw = function (name, data) {
		        var param = this.params[name];
		        this.gl.useProgram(param.shaderProgram);
		        this.gl.drawArrays(this.gl.POINTS, 0, 1);
		    };
		    DrawWebGL.prototype.createParam = function (name, vertex, fragment) {
		        var vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertex);
		        var fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragment);
		        if (vertexShader && fragmentShader) {
		            var shaderProgram = this.gl.createProgram();
		            this.gl.attachShader(shaderProgram, vertexShader);
		            this.gl.attachShader(shaderProgram, fragmentShader);
		            this.gl.linkProgram(shaderProgram);
		            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
		                var log = this.gl.getProgramInfoLog(shaderProgram);
		                console.error('createParam error ', log);
		                vertexShader && this.gl.deleteShader(vertexShader);
		                fragmentShader && this.gl.deleteShader(fragmentShader);
		                shaderProgram && this.gl.deleteProgram(shaderProgram);
		                return false;
		            }
		            this.params[name] = new param_1.Param(this.gl, vertexShader, fragmentShader, shaderProgram);
		            return this.params[name];
		        }
		        else {
		            vertexShader && this.gl.deleteShader(vertexShader);
		            fragmentShader && this.gl.deleteShader(fragmentShader);
		        }
		        return null;
		    };
		    DrawWebGL.prototype.createShader = function (type, shareSource) {
		        var shader = this.gl.createShader(type);
		        this.gl.shaderSource(shader, shareSource);
		        this.gl.compileShader(shader);
		        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		            this.gl.deleteShader(shader);
		            return null;
		        }
		        return shader;
		    };
		    DrawWebGL.prototype.useProgram = function (name) {
		        if (!this.params[name]) {
		            console.error("not find the param");
		            return;
		        }
		        this.gl.useProgram(this.params[name].shaderProgram);
		    };
		    DrawWebGL.prototype.clean = function () {
		        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		        this.gl.disable(this.gl.SCISSOR_TEST);
		        this.gl.disable(this.gl.STENCIL_TEST);
		        this.gl.disable(this.gl.DEPTH_TEST);
		        this.gl.frontFace(this.gl.CW);
		        this.gl.enable(this.gl.BLEND);
		        this.gl.colorMask(true, true, true, true);
		        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		    };
		    DrawWebGL.createGLContext = function (canvas) {
		        var names = ["webgl", "experimental-webgl"];
		        var context = null;
		        for (var i = 0; i < names.length; i++) {
		            try {
		                context = canvas.getContext(names[i]);
		            }
		            catch (err) {
		                break;
		            }
		        }
		        if (context) {
		            context.viewportWidth = canvas.width;
		            context.viewportHeight = canvas.height;
		        }
		        else {
		            alert("Failed to create webGL context!");
		        }
		        return context;
		    };
		    return DrawWebGL;
		}());
		exports.DrawWebGL = DrawWebGL;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/index.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
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
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/loader.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var latte_lib = require("latte_lib");
		var loadProtocol = (function () {
		    var ajaxLocation = location.href;
		    var rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/; //打印[http://localhost:8080,http:,localhost,8080]  
		    var rhash = /#.*$/;
		    //匹配开头的"//"字段  
		    var rprotocol = /^\/\//;
		    //获取前面的协议字段，如"http:","file:"等  
		    var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
		    //第一个replace去掉用hash值,第二个replace表示如果去掉hash值以后开头已经是//那么也要进行相应的处理  
		    //let result=ajaxLocation.replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
		    return ajaxLocParts[1];
		})();
		var Loader = /** @class */ (function () {
		    function Loader() {
		        this.loadImages = {};
		        this.images = {};
		        this.loadImageEvent = new latte_lib.events();
		    }
		    Loader.prototype._loadFile = function (url, callback) {
		        var xhr;
		        window.XMLHttpRequest ? xhr = new XMLHttpRequest() : xhr = new ActiveXObject("Microsoft.XMLHTTP");
		        xhr.open("get", url, true);
		        xhr.send(null);
		        xhr.onreadystatechange = function () {
		            if (xhr.responseText != '') {
		                //console.log(xhr.readyState, xhr.status);
		            }
		            if (xhr.readyState == 4) {
		                if (loadProtocol == 'file:') {
		                    if (xhr.responseURL == '') {
		                        return callback(new Error('not find'));
		                    }
		                    else {
		                        return callback(null, xhr.responseText);
		                    }
		                }
		                else {
		                    if (xhr.status == 200) {
		                        return callback(null, xhr.responseText);
		                    }
		                }
		            }
		        };
		    };
		    Loader.prototype.loadFile = function (obj, callback) {
		        if (latte_lib.utils.isString(obj)) {
		            obj = {
		                url: obj,
		                parser: function (data) {
		                    return data;
		                }
		            };
		        }
		        if (!latte_lib.utils.isObject(obj)) {
		            return callback(new Error('url format error'));
		        }
		        var text = require(obj.url);
		        if (text != null) {
		            return callback(null, text);
		        }
		        this._loadFile(obj.url, function (err, data) {
		            if (err) {
		                return callback(err);
		            }
		            data = obj.parser(data);
		            return callback(null, data);
		        });
		    };
		    Loader.prototype.loadImage = function (url, callback) {
		        var _this = this;
		        if (this.loadImages[url]) {
		            this.loadImageEvent.once(url, callback);
		        }
		        if (this.images[url]) {
		            return this.images[url];
		        }
		        this.loadImageEvent.once(url, callback);
		        var image = this.images[url] = new Image();
		        image.src = url;
		        image.onload = function () {
		            _this.loadImages[url] = undefined;
		            _this.loadImageEvent.emit(url, undefined, {
		                source: image,
		                info: {
		                    x: 0,
		                    y: 0,
		                    width: image.width,
		                    height: image.height
		                }
		            });
		        };
		        image.onerror = function (err) {
		            console.error('loadImageError', url);
		            _this.images[url] = undefined;
		            _this.loadImages[url] = undefined;
		            _this.loadImageEvent.emit(url, err);
		        };
		        this.loadImages[url] = 1;
		        return image;
		    };
		    return Loader;
		}());
		exports.Loader = Loader;
		var defaultLoader = new Loader();
		exports.defaultLoader = defaultLoader;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/math/matrix4.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var latte_lib = require("latte_lib");
		var vector3_1 = require("./vector3");
		var vector4_1 = require("./vector4");
		var Matrix4 = /** @class */ (function () {
		    function Matrix4(data) {
		        if (data === void 0) { data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; }
		        this.multiply = this.concat;
		        this.data = new Float32Array(data);
		    }
		    /**
		     * 重制
		     * Set the identity matrix.
		     * @return this
		     */
		    Matrix4.prototype.setIdentity = function () {
		        var e = this.data;
		        e[0] = 1;
		        e[4] = 0;
		        e[8] = 0;
		        e[12] = 0;
		        e[1] = 0;
		        e[5] = 1;
		        e[9] = 0;
		        e[13] = 0;
		        e[2] = 0;
		        e[6] = 0;
		        e[10] = 1;
		        e[14] = 0;
		        e[3] = 0;
		        e[7] = 0;
		        e[11] = 0;
		        e[15] = 1;
		        return this;
		    };
		    Matrix4.prototype.set = function (matrix) {
		        var data;
		        if (!latte_lib.utils.isArray(matrix)) {
		            data = matrix.data;
		        }
		        for (var i = 0, len = data.length; i < len; i++) {
		            this.data[i] = data[i];
		        }
		        return this;
		    };
		    Matrix4.prototype.concat = function (matrix) {
		        var ai0, ai1, ai2, ai3;
		        var e = this.data;
		        var a = this.data;
		        var b = matrix.data;
		        // If e equals b, copy b to temporary matrix.
		        if (e === b) {
		            b = new Float32Array(16);
		            for (var i = 0; i < 16; ++i) {
		                b[i] = e[i];
		            }
		        }
		        for (var i = 0; i < 4; i++) {
		            ai0 = a[i];
		            ai1 = a[i + 4];
		            ai2 = a[i + 8];
		            ai3 = a[i + 12];
		            e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
		            e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
		            e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
		            e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
		        }
		        return this;
		    };
		    Matrix4.prototype.multiplyVector3 = function (matrix) {
		        var e = this.data;
		        var p = matrix.data;
		        var v = new vector3_1.Vector3();
		        var result = v.data;
		        result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + e[12];
		        result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + e[13];
		        result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[14];
		        return v;
		    };
		    Matrix4.prototype.multiplyVector4 = function (matrix) {
		        var e = this.data;
		        var p = matrix.data;
		        var v = new vector4_1.Vector4();
		        var result = v.data;
		        result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
		        result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
		        result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
		        result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
		        return v;
		    };
		    Matrix4.prototype.transpose = function () {
		        var e, t;
		        e = this.data;
		        t = e[1];
		        e[1] = e[4];
		        e[4] = t;
		        t = e[2];
		        e[2] = e[8];
		        e[8] = t;
		        t = e[3];
		        e[3] = e[12];
		        e[12] = t;
		        t = e[6];
		        e[6] = e[9];
		        e[9] = t;
		        t = e[7];
		        e[7] = e[13];
		        e[13] = t;
		        t = e[11];
		        e[11] = e[14];
		        e[14] = t;
		        return this;
		    };
		    Matrix4.prototype.setInverseOf = function (other) {
		        var i, s, d, inv, det;
		        s = other.data;
		        d = this.data;
		        inv = new Float32Array(16);
		        inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
		            + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
		        inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
		            - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
		        inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
		            + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
		        inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
		            - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
		        inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
		            - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
		        inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
		            + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
		        inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
		            - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
		        inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
		            + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
		        inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
		            + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
		        inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
		            - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
		        inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
		            + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
		        inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
		            - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
		        inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
		            - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
		        inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
		            + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
		        inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
		            - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
		        inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
		            + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
		        det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
		        if (det === 0) {
		            return this;
		        }
		        det = 1 / det;
		        for (i = 0; i < 16; i++) {
		            d[i] = inv[i] * det;
		        }
		        return this;
		    };
		    Matrix4.prototype.invert = function () {
		        return this.setInverseOf(this);
		    };
		    Matrix4.prototype.setOrtho = function (left, right, bottom, top, near, far) {
		        var e, rw, rh, rd;
		        if (left === right || bottom === top || near === far) {
		            throw 'null frustum';
		        }
		        rw = 1 / (right - left);
		        rh = 1 / (top - bottom);
		        rd = 1 / (far - near);
		        e = this.data;
		        e[0] = 2 * rw;
		        e[1] = 0;
		        e[2] = 0;
		        e[3] = 0;
		        e[4] = 0;
		        e[5] = 2 * rh;
		        e[6] = 0;
		        e[7] = 0;
		        e[8] = 0;
		        e[9] = 0;
		        e[10] = -2 * rd;
		        e[11] = 0;
		        e[12] = -(right + left) * rw;
		        e[13] = -(top + bottom) * rh;
		        e[14] = -(far + near) * rd;
		        e[15] = 1;
		        return this;
		    };
		    Matrix4.prototype.ortho = function (left, right, bottom, top, near, far) {
		        return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
		    };
		    ;
		    Matrix4.prototype.setFrustum = function (left, right, bottom, top, near, far) {
		        var e, rw, rh, rd;
		        if (left === right || top === bottom || near === far) {
		            throw 'null frustum';
		        }
		        if (near <= 0) {
		            throw 'near <= 0';
		        }
		        if (far <= 0) {
		            throw 'far <= 0';
		        }
		        rw = 1 / (right - left);
		        rh = 1 / (top - bottom);
		        rd = 1 / (far - near);
		        e = this.data;
		        e[0] = 2 * near * rw;
		        e[1] = 0;
		        e[2] = 0;
		        e[3] = 0;
		        e[4] = 0;
		        e[5] = 2 * near * rh;
		        e[6] = 0;
		        e[7] = 0;
		        e[8] = (right + left) * rw;
		        e[9] = (top + bottom) * rh;
		        e[10] = -(far + near) * rd;
		        e[11] = -1;
		        e[12] = 0;
		        e[13] = 0;
		        e[14] = -2 * near * far * rd;
		        e[15] = 0;
		        return this;
		    };
		    Matrix4.prototype.frustum = function (left, right, bottom, top, near, far) {
		        return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far));
		    };
		    Matrix4.prototype.setPerspective = function (fovy, aspect, near, far) {
		        var e, rd, s, ct;
		        if (near === far || aspect === 0) {
		            throw 'null frustum';
		        }
		        if (near <= 0) {
		            throw 'near <= 0';
		        }
		        if (far <= 0) {
		            throw 'far <= 0';
		        }
		        fovy = Math.PI * fovy / 180 / 2;
		        s = Math.sin(fovy);
		        if (s === 0) {
		            throw 'null frustum';
		        }
		        rd = 1 / (far - near);
		        ct = Math.cos(fovy) / s;
		        e = this.data;
		        e[0] = ct / aspect;
		        e[1] = 0;
		        e[2] = 0;
		        e[3] = 0;
		        e[4] = 0;
		        e[5] = ct;
		        e[6] = 0;
		        e[7] = 0;
		        e[8] = 0;
		        e[9] = 0;
		        e[10] = -(far + near) * rd;
		        e[11] = -1;
		        e[12] = 0;
		        e[13] = 0;
		        e[14] = -2 * near * far * rd;
		        e[15] = 0;
		        return this;
		    };
		    Matrix4.prototype.perspective = function (fovy, aspect, near, far) {
		        return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
		    };
		    Matrix4.prototype.setScale = function (x, y, z) {
		        var e = this.data;
		        e[0] = x;
		        e[4] = 0;
		        e[8] = 0;
		        e[12] = 0;
		        e[1] = 0;
		        e[5] = y;
		        e[9] = 0;
		        e[13] = 0;
		        e[2] = 0;
		        e[6] = 0;
		        e[10] = z;
		        e[14] = 0;
		        e[3] = 0;
		        e[7] = 0;
		        e[11] = 0;
		        e[15] = 1;
		        return this;
		    };
		    Matrix4.prototype.scale = function (x, y, z) {
		        var e = this.data;
		        e[0] *= x;
		        e[4] *= y;
		        e[8] *= z;
		        e[1] *= x;
		        e[5] *= y;
		        e[9] *= z;
		        e[2] *= x;
		        e[6] *= y;
		        e[10] *= z;
		        e[3] *= x;
		        e[7] *= y;
		        e[11] *= z;
		        return this;
		    };
		    Matrix4.prototype.setTranslate = function (x, y, z) {
		        var e = this.data;
		        e[0] = 1;
		        e[4] = 0;
		        e[8] = 0;
		        e[12] = x;
		        e[1] = 0;
		        e[5] = 1;
		        e[9] = 0;
		        e[13] = y;
		        e[2] = 0;
		        e[6] = 0;
		        e[10] = 1;
		        e[14] = z;
		        e[3] = 0;
		        e[7] = 0;
		        e[11] = 0;
		        e[15] = 1;
		        return this;
		    };
		    Matrix4.prototype.translate = function (x, y, z) {
		        var e = this.data;
		        e[12] += e[0] * x + e[4] * y + e[8] * z;
		        e[13] += e[1] * x + e[5] * y + e[9] * z;
		        e[14] += e[2] * x + e[6] * y + e[10] * z;
		        e[15] += e[3] * x + e[7] * y + e[11] * z;
		        return this;
		    };
		    ;
		    Matrix4.prototype.setRotate = function (angle, x, y, z) {
		        if (x === void 0) { x = 1; }
		        if (y === void 0) { y = 1; }
		        if (z === void 0) { z = 1; }
		        var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;
		        angle = Math.PI * angle / 180;
		        e = this.data;
		        s = Math.sin(angle);
		        c = Math.cos(angle);
		        if (0 !== x && 0 === y && 0 === z) {
		            // Rotation around X axis
		            if (x < 0) {
		                s = -s;
		            }
		            e[0] = 1;
		            e[4] = 0;
		            e[8] = 0;
		            e[12] = 0;
		            e[1] = 0;
		            e[5] = c;
		            e[9] = -s;
		            e[13] = 0;
		            e[2] = 0;
		            e[6] = s;
		            e[10] = c;
		            e[14] = 0;
		            e[3] = 0;
		            e[7] = 0;
		            e[11] = 0;
		            e[15] = 1;
		        }
		        else if (0 === x && 0 !== y && 0 === z) {
		            // Rotation around Y axis
		            if (y < 0) {
		                s = -s;
		            }
		            e[0] = c;
		            e[4] = 0;
		            e[8] = s;
		            e[12] = 0;
		            e[1] = 0;
		            e[5] = 1;
		            e[9] = 0;
		            e[13] = 0;
		            e[2] = -s;
		            e[6] = 0;
		            e[10] = c;
		            e[14] = 0;
		            e[3] = 0;
		            e[7] = 0;
		            e[11] = 0;
		            e[15] = 1;
		        }
		        else if (0 === x && 0 === y && 0 !== z) {
		            // Rotation around Z axis
		            if (z < 0) {
		                s = -s;
		            }
		            e[0] = c;
		            e[4] = -s;
		            e[8] = 0;
		            e[12] = 0;
		            e[1] = s;
		            e[5] = c;
		            e[9] = 0;
		            e[13] = 0;
		            e[2] = 0;
		            e[6] = 0;
		            e[10] = 1;
		            e[14] = 0;
		            e[3] = 0;
		            e[7] = 0;
		            e[11] = 0;
		            e[15] = 1;
		        }
		        else {
		            // Rotation around another axis
		            len = Math.sqrt(x * x + y * y + z * z);
		            if (len !== 1) {
		                rlen = 1 / len;
		                x *= rlen;
		                y *= rlen;
		                z *= rlen;
		            }
		            nc = 1 - c;
		            xy = x * y;
		            yz = y * z;
		            zx = z * x;
		            xs = x * s;
		            ys = y * s;
		            zs = z * s;
		            e[0] = x * x * nc + c;
		            e[1] = xy * nc + zs;
		            e[2] = zx * nc - ys;
		            e[3] = 0;
		            e[4] = xy * nc - zs;
		            e[5] = y * y * nc + c;
		            e[6] = yz * nc + xs;
		            e[7] = 0;
		            e[8] = zx * nc + ys;
		            e[9] = yz * nc - xs;
		            e[10] = z * z * nc + c;
		            e[11] = 0;
		            e[12] = 0;
		            e[13] = 0;
		            e[14] = 0;
		            e[15] = 1;
		        }
		        return this;
		    };
		    Matrix4.prototype.rotate = function (angle, x, y, z) {
		        if (x === void 0) { x = 1; }
		        if (y === void 0) { y = 1; }
		        if (z === void 0) { z = 1; }
		        return this.concat(new Matrix4().setRotate(angle, x, y, z));
		    };
		    Matrix4.prototype.setLookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		        var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
		        fx = centerX - eyeX;
		        fy = centerY - eyeY;
		        fz = centerZ - eyeZ;
		        // Normalize f.
		        rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
		        fx *= rlf;
		        fy *= rlf;
		        fz *= rlf;
		        // Calculate cross product of f and up.
		        sx = fy * upZ - fz * upY;
		        sy = fz * upX - fx * upZ;
		        sz = fx * upY - fy * upX;
		        // Normalize s.
		        rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
		        sx *= rls;
		        sy *= rls;
		        sz *= rls;
		        // Calculate cross product of s and f.
		        ux = sy * fz - sz * fy;
		        uy = sz * fx - sx * fz;
		        uz = sx * fy - sy * fx;
		        // Set to this.
		        e = this.data;
		        e[0] = sx;
		        e[1] = ux;
		        e[2] = -fx;
		        e[3] = 0;
		        e[4] = sy;
		        e[5] = uy;
		        e[6] = -fy;
		        e[7] = 0;
		        e[8] = sz;
		        e[9] = uz;
		        e[10] = -fz;
		        e[11] = 0;
		        e[12] = 0;
		        e[13] = 0;
		        e[14] = 0;
		        e[15] = 1;
		        // Translate.
		        return this.translate(-eyeX, -eyeY, -eyeZ);
		    };
		    Matrix4.prototype.lookAt = function (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
		        return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
		    };
		    Matrix4.prototype.dropShadow = function (plane, light) {
		        var mat = new Matrix4();
		        var e = mat.data;
		        var dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];
		        e[0] = dot - light[0] * plane[0];
		        e[1] = -light[1] * plane[0];
		        e[2] = -light[2] * plane[0];
		        e[3] = -light[3] * plane[0];
		        e[4] = -light[0] * plane[1];
		        e[5] = dot - light[1] * plane[1];
		        e[6] = -light[2] * plane[1];
		        e[7] = -light[3] * plane[1];
		        e[8] = -light[0] * plane[2];
		        e[9] = -light[1] * plane[2];
		        e[10] = dot - light[2] * plane[2];
		        e[11] = -light[3] * plane[2];
		        e[12] = -light[0] * plane[3];
		        e[13] = -light[1] * plane[3];
		        e[14] = -light[2] * plane[3];
		        e[15] = dot - light[3] * plane[3];
		        return this.concat(mat);
		    };
		    Matrix4.prototype.dropShadowDirectionally = function (normX, normY, normZ, planeX, planeY, planeZ, lightX, lightY, lightZ) {
		        var a = planeX * normX + planeY * normY + planeZ * normZ;
		        return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
		    };
		    Matrix4.prototype.getMethod = function () {
		        return "uniformMatrix4fv";
		    };
		    Matrix4.prototype.getData = function () {
		        return [false, this.data];
		    };
		    return Matrix4;
		}());
		exports.Matrix4 = Matrix4;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/math/vector1.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var Vector1 = /** @class */ (function () {
		    function Vector1(data) {
		        this.data = data;
		    }
		    Vector1.prototype.getMethod = function () {
		        return parseInt(this.data + "") === this.data ? "uniform1i" : "uniform1f";
		    };
		    Vector1.prototype.getData = function () {
		        return [this.data];
		    };
		    Vector1.byteSize = 1;
		    return Vector1;
		}());
		exports.Vector1 = Vector1;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/math/vector2.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var Vector2 = /** @class */ (function () {
		    function Vector2(data) {
		        if (data === void 0) { data = [0, 0]; }
		        this.data = new Float32Array(data);
		    }
		    Vector2.prototype.getMethod = function () {
		        return "uniform2f";
		    };
		    Vector2.prototype.getData = function () {
		        return this.data;
		    };
		    Vector2.byteSize = 2;
		    return Vector2;
		}());
		exports.Vector2 = Vector2;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/math/vector3.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var Vector3 = /** @class */ (function () {
		    function Vector3(data) {
		        if (data === void 0) { data = [0, 0, 0]; }
		        this.data = new Float32Array(data);
		    }
		    Vector3.prototype.normalize = function () {
		        var v = this.data;
		        var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
		        if (g) {
		            if (g == 1)
		                return this;
		        }
		        else {
		            v[0] = 0;
		            v[1] = 0;
		            v[2] = 0;
		            return this;
		        }
		        g = 1 / g;
		        v[0] = c * g;
		        v[1] = d * g;
		        v[2] = e * g;
		        return this;
		    };
		    Vector3.prototype.getMethod = function () {
		        return "uniform3f";
		    };
		    Vector3.prototype.getData = function () {
		        return [this.data[0], this.data[1], this.data[2]];
		    };
		    Vector3.byteSize = 3;
		    return Vector3;
		}());
		exports.Vector3 = Vector3;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/math/vector4.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var Vector4 = /** @class */ (function () {
		    function Vector4(data) {
		        if (data === void 0) { data = [0, 0, 0, 0]; }
		        this.data = new Float32Array(data);
		    }
		    Vector4.prototype.getMethod = function () {
		        return "uniform4f";
		    };
		    Vector4.prototype.getData = function () {
		        return [this.data[0], this.data[1], this.data[2], this.data[3]];
		    };
		    Vector4.byteSize = 4;
		    return Vector4;
		}());
		exports.Vector4 = Vector4;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/param.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
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
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/webgl/webGLBuffer.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var latte_lib = require("latte_lib");
		var mWebGLBuffer = /** @class */ (function () {
		    function mWebGLBuffer(gl, type, drawType) {
		        this.gl = gl;
		        this.type = type;
		        this.drawType = drawType;
		    }
		    mWebGLBuffer.prototype.resetBuffer = function () {
		        if (this.buffer) {
		            this.gl.deleteBuffer(this.buffer);
		        }
		        this.buffer = this.gl.createBuffer();
		    };
		    mWebGLBuffer.prototype.bind = function (o, stride, offset) {
		        if (stride === void 0) { stride = 0; }
		        if (offset === void 0) { offset = 0; }
		        // this.gl.bindBuffer(this.type, this.buffer);
		        this.gl.enableVertexAttribArray(o.index);
		        this.gl.vertexAttribPointer(o.index, o.byteSize, this.gl.FLOAT, false, stride, offset);
		        return this;
		    };
		    mWebGLBuffer.prototype.set = function (data) {
		        var array;
		        if (latte_lib.utils.isArray(data)) {
		            if (this.type == this.gl.ELEMENT_ARRAY_BUFFER) {
		                array = new Int16Array(data);
		            }
		            else {
		                array = new Float32Array(data);
		            }
		        }
		        else {
		            array = data;
		        }
		        this.gl.bindBuffer(this.type, this.buffer);
		        this.gl.bufferData(this.type, array, this.drawType);
		    };
		    mWebGLBuffer.create = function (gl, type, drawType) {
		        var webglBuffer = new mWebGLBuffer(gl, type, drawType);
		        webglBuffer.resetBuffer();
		        return webglBuffer;
		    };
		    return mWebGLBuffer;
		}());
		exports.mWebGLBuffer = mWebGLBuffer;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/webgl/webGLExt.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var mWebGLExtension = /** @class */ (function () {
		    function mWebGLExtension(gl) {
		        this.parameter = {};
		        this.gl = gl;
		    }
		    mWebGLExtension.prototype.getParameter = function (name) {
		        if (this.ext) {
		            this.parameter[name] = this.gl.getParameter(this.ext[name]);
		        }
		        return this.parameter[name];
		    };
		    mWebGLExtension.prototype.isOK = function () {
		        return this.ext;
		    };
		    mWebGLExtension.create = function (gl, name) {
		        var mExt = new mWebGLExtension(gl);
		        var ext = gl.getExtension(name) ||
		            gl.getExtension("WEBKIT_" + name) ||
		            gl.getExtension("MOZ_" + name);
		        mExt.ext = ext;
		        return mExt;
		    };
		    return mWebGLExtension;
		}());
		exports.mWebGLExtension = mWebGLExtension;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/webgl/webGLObject.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
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
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
	define("latte_webgl/webgl/webGLTexture.js", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {
		"use strict";
		exports.__esModule = true;
		var mWebGLTexture = /** @class */ (function () {
		    function mWebGLTexture(gl) {
		        this.gl = gl;
		    }
		    mWebGLTexture.prototype.resetTexture = function () {
		        this.texture = this.gl.createTexture();
		    };
		    mWebGLTexture.prototype.set = function (webglObject, image, config) {
		        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
		        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
		        // this.gl.uniform1i(, 0);
		    };
		    mWebGLTexture.prototype.set2 = function (webglObject, image) {
		        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
		        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
		        this.gl.activeTexture(this.gl.TEXTURE0);
		        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
		        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
		        this.gl.generateMipmap(this.gl.TEXTURE_2D);
		    };
		    mWebGLTexture.prototype.bind = function (index) {
		        this.gl.activeTexture(this.gl["TEXTURE" + index]);
		        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		    };
		    mWebGLTexture.create = function (gl) {
		        var texture = new mWebGLTexture(gl);
		        texture.resetTexture();
		        return texture;
		    };
		    return mWebGLTexture;
		}());
		exports.mWebGLTexture = mWebGLTexture;
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });