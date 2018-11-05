!function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/drawWebGL.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=t("./loader"),s=t("./param"),u=function(){function r(t,e){void 0===e&&(e=a.defaultLoader),this.params={},this.gl=r.createGLContext(t),this.loader=e}return r.prototype.loadFile=function(t,e){this.loader.loadFile(t,e)},r.prototype.loadImage=function(t,e){this.loader.loadImage(t,e)},r.prototype.draw=function(t,e){var r=this.params[t];this.gl.useProgram(r.shaderProgram),this.gl.drawArrays(this.gl.POINTS,0,1)},r.prototype.createParam=function(t,e,r){var i=this.createShader(this.gl.VERTEX_SHADER,e),o=this.createShader(this.gl.FRAGMENT_SHADER,r);if(i&&o){var n=this.gl.createProgram();if(this.gl.attachShader(n,i),this.gl.attachShader(n,o),this.gl.linkProgram(n),!this.gl.getProgramParameter(n,this.gl.LINK_STATUS)){var a=this.gl.getProgramInfoLog(n);return console.error("createParam error ",a),i&&this.gl.deleteShader(i),o&&this.gl.deleteShader(o),n&&this.gl.deleteProgram(n),!1}return this.params[t]=new s.Param(this.gl,i,o,n),this.params[t]}return i&&this.gl.deleteShader(i),o&&this.gl.deleteShader(o),null},r.prototype.createShader=function(t,e){var r=this.gl.createShader(t);return this.gl.shaderSource(r,e),this.gl.compileShader(r),this.gl.getShaderParameter(r,this.gl.COMPILE_STATUS)?r:(this.gl.deleteShader(r),null)},r.prototype.useProgram=function(t){this.params[t]?this.gl.useProgram(this.params[t].shaderProgram):console.error("not find the param")},r.prototype.clean=function(){this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.disable(this.gl.SCISSOR_TEST),this.gl.disable(this.gl.STENCIL_TEST),this.gl.disable(this.gl.DEPTH_TEST),this.gl.frontFace(this.gl.CW),this.gl.enable(this.gl.BLEND),this.gl.colorMask(!0,!0,!0,!0),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null)},r.createGLContext=function(t){for(var e=["webgl","experimental-webgl"],r=null,i=0;i<e.length;i++)try{r=t.getContext(e[i])}catch(t){break}return r?(r.viewportWidth=t.width,r.viewportHeight=t.height):alert("Failed to create webGL context!"),r},r}();e.DrawWebGL=u})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/index.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=t("./drawWebGL"),s=t("./math/matrix4");e.Matrix4=s.Matrix4;var u=t("./math/vector4");e.Vector4=u.Vector4;var h=t("./math/vector3");e.Vector3=h.Vector3;var l=t("./math/vector1");e.Vector1=l.Vector1,e.createDrawWebGL=function(t){return new a.DrawWebGL(t)}})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/loader.js",["require","exports","module","window","__filename","__dirname"],function(e,t,r,i,o,n){t.__esModule=!0;var a,s=e("latte_lib"),u=(a=location.href,(/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/.exec(a.toLowerCase())||[])[1]),h=function(){function t(){this.loadImages={},this.images={},this.loadImageEvent=new s.events}return t.prototype._loadFile=function(t,e){var r;(r=i.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")).open("get",t,!0),r.send(null),r.onreadystatechange=function(){if(r.responseText,4==r.readyState){if("file:"==u)return""==r.responseURL?e(new Error("not find")):e(null,r.responseText);if(200==r.status)return e(null,r.responseText)}}},t.prototype.loadFile=function(r,i){if(s.utils.isString(r)&&(r={url:r,parser:function(t){return t}}),!s.utils.isObject(r))return i(new Error("url format error"));var t=e(r.url);if(null!=t)return i(null,t);this._loadFile(r.url,function(t,e){return t?i(t):(e=r.parser(e),i(null,e))})},t.prototype.loadImage=function(e,t){var r=this;if(this.loadImages[e]&&this.loadImageEvent.once(e,t),this.images[e])return this.images[e];this.loadImageEvent.once(e,t);var i=this.images[e]=new Image;return i.src=e,i.onload=function(){r.loadImages[e]=void 0,r.loadImageEvent.emit(e,void 0,{source:i,info:{x:0,y:0,width:i.width,height:i.height}})},i.onerror=function(t){console.error("loadImageError",e),r.images[e]=void 0,r.loadImages[e]=void 0,r.loadImageEvent.emit(e,t)},this.loadImages[e]=1,i},t}(),l=new(t.Loader=h);t.defaultLoader=l})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/math/matrix4.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=t("latte_lib"),s=t("./vector3"),u=t("./vector4"),h=function(){function h(t){void 0===t&&(t=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),this.multiply=this.concat,this.data=new Float32Array(t)}return h.prototype.setIdentity=function(){var t=this.data;return t[0]=1,t[4]=0,t[8]=0,t[12]=0,t[1]=0,t[5]=1,t[9]=0,t[13]=0,t[2]=0,t[6]=0,t[10]=1,t[14]=0,t[3]=0,t[7]=0,t[11]=0,t[15]=1,this},h.prototype.set=function(t){var e;a.utils.isArray(t)||(e=t.data);for(var r=0,i=e.length;r<i;r++)this.data[r]=e[r];return this},h.prototype.concat=function(t){var e,r,i,o,n=this.data,a=this.data,s=t.data;if(n===s){s=new Float32Array(16);for(var u=0;u<16;++u)s[u]=n[u]}for(u=0;u<4;u++)e=a[u],r=a[u+4],i=a[u+8],o=a[u+12],n[u]=e*s[0]+r*s[1]+i*s[2]+o*s[3],n[u+4]=e*s[4]+r*s[5]+i*s[6]+o*s[7],n[u+8]=e*s[8]+r*s[9]+i*s[10]+o*s[11],n[u+12]=e*s[12]+r*s[13]+i*s[14]+o*s[15];return this},h.prototype.multiplyVector3=function(t){var e=this.data,r=t.data,i=new s.Vector3,o=i.data;return o[0]=r[0]*e[0]+r[1]*e[4]+r[2]*e[8]+e[12],o[1]=r[0]*e[1]+r[1]*e[5]+r[2]*e[9]+e[13],o[2]=r[0]*e[2]+r[1]*e[6]+r[2]*e[10]+e[14],i},h.prototype.multiplyVector4=function(t){var e=this.data,r=t.data,i=new u.Vector4,o=i.data;return o[0]=r[0]*e[0]+r[1]*e[4]+r[2]*e[8]+r[3]*e[12],o[1]=r[0]*e[1]+r[1]*e[5]+r[2]*e[9]+r[3]*e[13],o[2]=r[0]*e[2]+r[1]*e[6]+r[2]*e[10]+r[3]*e[14],o[3]=r[0]*e[3]+r[1]*e[7]+r[2]*e[11]+r[3]*e[15],i},h.prototype.transpose=function(){var t,e;return e=(t=this.data)[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this},h.prototype.setInverseOf=function(t){var e,r,i,o,n;if(r=t.data,i=this.data,(o=new Float32Array(16))[0]=r[5]*r[10]*r[15]-r[5]*r[11]*r[14]-r[9]*r[6]*r[15]+r[9]*r[7]*r[14]+r[13]*r[6]*r[11]-r[13]*r[7]*r[10],o[4]=-r[4]*r[10]*r[15]+r[4]*r[11]*r[14]+r[8]*r[6]*r[15]-r[8]*r[7]*r[14]-r[12]*r[6]*r[11]+r[12]*r[7]*r[10],o[8]=r[4]*r[9]*r[15]-r[4]*r[11]*r[13]-r[8]*r[5]*r[15]+r[8]*r[7]*r[13]+r[12]*r[5]*r[11]-r[12]*r[7]*r[9],o[12]=-r[4]*r[9]*r[14]+r[4]*r[10]*r[13]+r[8]*r[5]*r[14]-r[8]*r[6]*r[13]-r[12]*r[5]*r[10]+r[12]*r[6]*r[9],o[1]=-r[1]*r[10]*r[15]+r[1]*r[11]*r[14]+r[9]*r[2]*r[15]-r[9]*r[3]*r[14]-r[13]*r[2]*r[11]+r[13]*r[3]*r[10],o[5]=r[0]*r[10]*r[15]-r[0]*r[11]*r[14]-r[8]*r[2]*r[15]+r[8]*r[3]*r[14]+r[12]*r[2]*r[11]-r[12]*r[3]*r[10],o[9]=-r[0]*r[9]*r[15]+r[0]*r[11]*r[13]+r[8]*r[1]*r[15]-r[8]*r[3]*r[13]-r[12]*r[1]*r[11]+r[12]*r[3]*r[9],o[13]=r[0]*r[9]*r[14]-r[0]*r[10]*r[13]-r[8]*r[1]*r[14]+r[8]*r[2]*r[13]+r[12]*r[1]*r[10]-r[12]*r[2]*r[9],o[2]=r[1]*r[6]*r[15]-r[1]*r[7]*r[14]-r[5]*r[2]*r[15]+r[5]*r[3]*r[14]+r[13]*r[2]*r[7]-r[13]*r[3]*r[6],o[6]=-r[0]*r[6]*r[15]+r[0]*r[7]*r[14]+r[4]*r[2]*r[15]-r[4]*r[3]*r[14]-r[12]*r[2]*r[7]+r[12]*r[3]*r[6],o[10]=r[0]*r[5]*r[15]-r[0]*r[7]*r[13]-r[4]*r[1]*r[15]+r[4]*r[3]*r[13]+r[12]*r[1]*r[7]-r[12]*r[3]*r[5],o[14]=-r[0]*r[5]*r[14]+r[0]*r[6]*r[13]+r[4]*r[1]*r[14]-r[4]*r[2]*r[13]-r[12]*r[1]*r[6]+r[12]*r[2]*r[5],o[3]=-r[1]*r[6]*r[11]+r[1]*r[7]*r[10]+r[5]*r[2]*r[11]-r[5]*r[3]*r[10]-r[9]*r[2]*r[7]+r[9]*r[3]*r[6],o[7]=r[0]*r[6]*r[11]-r[0]*r[7]*r[10]-r[4]*r[2]*r[11]+r[4]*r[3]*r[10]+r[8]*r[2]*r[7]-r[8]*r[3]*r[6],o[11]=-r[0]*r[5]*r[11]+r[0]*r[7]*r[9]+r[4]*r[1]*r[11]-r[4]*r[3]*r[9]-r[8]*r[1]*r[7]+r[8]*r[3]*r[5],o[15]=r[0]*r[5]*r[10]-r[0]*r[6]*r[9]-r[4]*r[1]*r[10]+r[4]*r[2]*r[9]+r[8]*r[1]*r[6]-r[8]*r[2]*r[5],0===(n=r[0]*o[0]+r[1]*o[4]+r[2]*o[8]+r[3]*o[12]))return this;for(n=1/n,e=0;e<16;e++)i[e]=o[e]*n;return this},h.prototype.invert=function(){return this.setInverseOf(this)},h.prototype.setOrtho=function(t,e,r,i,o,n){var a,s,u,h;if(t===e||r===i||o===n)throw"null frustum";return s=1/(e-t),u=1/(i-r),h=1/(n-o),(a=this.data)[0]=2*s,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2*u,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=-2*h,a[11]=0,a[12]=-(e+t)*s,a[13]=-(i+r)*u,a[14]=-(n+o)*h,a[15]=1,this},h.prototype.ortho=function(t,e,r,i,o,n){return this.concat((new h).setOrtho(t,e,r,i,o,n))},h.prototype.setFrustum=function(t,e,r,i,o,n){var a,s,u,h;if(t===e||i===r||o===n)throw"null frustum";if(o<=0)throw"near <= 0";if(n<=0)throw"far <= 0";return s=1/(e-t),u=1/(i-r),h=1/(n-o),(a=this.data)[0]=2*o*s,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2*o*u,a[6]=0,a[7]=0,a[8]=(e+t)*s,a[9]=(i+r)*u,a[10]=-(n+o)*h,a[11]=-1,a[12]=0,a[13]=0,a[14]=-2*o*n*h,a[15]=0,this},h.prototype.frustum=function(t,e,r,i,o,n){return this.concat((new h).setFrustum(t,e,r,i,o,n))},h.prototype.setPerspective=function(t,e,r,i){var o,n,a,s;if(r===i||0===e)throw"null frustum";if(r<=0)throw"near <= 0";if(i<=0)throw"far <= 0";if(t=Math.PI*t/180/2,0===(a=Math.sin(t)))throw"null frustum";return n=1/(i-r),s=Math.cos(t)/a,(o=this.data)[0]=s/e,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=s,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=-(i+r)*n,o[11]=-1,o[12]=0,o[13]=0,o[14]=-2*r*i*n,o[15]=0,this},h.prototype.perspective=function(t,e,r,i){return this.concat((new h).setPerspective(t,e,r,i))},h.prototype.setScale=function(t,e,r){var i=this.data;return i[0]=t,i[4]=0,i[8]=0,i[12]=0,i[1]=0,i[5]=e,i[9]=0,i[13]=0,i[2]=0,i[6]=0,i[10]=r,i[14]=0,i[3]=0,i[7]=0,i[11]=0,i[15]=1,this},h.prototype.scale=function(t,e,r){var i=this.data;return i[0]*=t,i[4]*=e,i[8]*=r,i[1]*=t,i[5]*=e,i[9]*=r,i[2]*=t,i[6]*=e,i[10]*=r,i[3]*=t,i[7]*=e,i[11]*=r,this},h.prototype.setTranslate=function(t,e,r){var i=this.data;return i[0]=1,i[4]=0,i[8]=0,i[12]=t,i[1]=0,i[5]=1,i[9]=0,i[13]=e,i[2]=0,i[6]=0,i[10]=1,i[14]=r,i[3]=0,i[7]=0,i[11]=0,i[15]=1,this},h.prototype.translate=function(t,e,r){var i=this.data;return i[12]+=i[0]*t+i[4]*e+i[8]*r,i[13]+=i[1]*t+i[5]*e+i[9]*r,i[14]+=i[2]*t+i[6]*e+i[10]*r,i[15]+=i[3]*t+i[7]*e+i[11]*r,this},h.prototype.setRotate=function(t,e,r,i){var o,n,a,s,u,h,l,f,c,d,p,g;return void 0===e&&(e=1),void 0===r&&(r=1),void 0===i&&(i=1),t=Math.PI*t/180,o=this.data,n=Math.sin(t),a=Math.cos(t),0!==e&&0===r&&0===i?(e<0&&(n=-n),o[0]=1,o[4]=0,o[8]=0,o[12]=0,o[1]=0,o[5]=a,o[9]=-n,o[13]=0,o[2]=0,o[6]=n,o[10]=a,o[14]=0,o[3]=0,o[7]=0,o[11]=0):0===e&&0!==r&&0===i?(r<0&&(n=-n),o[0]=a,o[4]=0,o[8]=n,o[12]=0,o[1]=0,o[5]=1,o[9]=0,o[13]=0,o[2]=-n,o[6]=0,o[10]=a,o[14]=0,o[3]=0,o[7]=0,o[11]=0):0===e&&0===r&&0!==i?(i<0&&(n=-n),o[0]=a,o[4]=-n,o[8]=0,o[12]=0,o[1]=n,o[5]=a,o[9]=0,o[13]=0,o[2]=0,o[6]=0,o[10]=1,o[14]=0,o[3]=0,o[7]=0,o[11]=0):(1!==(s=Math.sqrt(e*e+r*r+i*i))&&(e*=u=1/s,r*=u,i*=u),h=1-a,l=e*r,f=r*i,c=i*e,d=e*n,p=r*n,g=i*n,o[0]=e*e*h+a,o[1]=l*h+g,o[2]=c*h-p,o[3]=0,o[4]=l*h-g,o[5]=r*r*h+a,o[6]=f*h+d,o[7]=0,o[8]=c*h+p,o[9]=f*h-d,o[10]=i*i*h+a,o[11]=0,o[12]=0,o[13]=0,o[14]=0),o[15]=1,this},h.prototype.rotate=function(t,e,r,i){return void 0===e&&(e=1),void 0===r&&(r=1),void 0===i&&(i=1),this.concat((new h).setRotate(t,e,r,i))},h.prototype.setLookAt=function(t,e,r,i,o,n,a,s,u){var h,l,f,c,d,p,g,m,_,y,b,w;return l=i-t,f=o-e,c=n-r,p=(f*=d=1/Math.sqrt(l*l+f*f+c*c))*u-(c*=d)*s,g=c*a-(l*=d)*u,m=l*s-f*a,y=(g*=_=1/Math.sqrt(p*p+g*g+m*m))*c-(m*=_)*f,b=m*l-(p*=_)*c,w=p*f-g*l,(h=this.data)[0]=p,h[1]=y,h[2]=-l,h[3]=0,h[4]=g,h[5]=b,h[6]=-f,h[7]=0,h[8]=m,h[9]=w,h[10]=-c,h[11]=0,h[12]=0,h[13]=0,h[14]=0,h[15]=1,this.translate(-t,-e,-r)},h.prototype.lookAt=function(t,e,r,i,o,n,a,s,u){return this.concat((new h).setLookAt(t,e,r,i,o,n,a,s,u))},h.prototype.dropShadow=function(t,e){var r=new h,i=r.data,o=t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3];return i[0]=o-e[0]*t[0],i[1]=-e[1]*t[0],i[2]=-e[2]*t[0],i[3]=-e[3]*t[0],i[4]=-e[0]*t[1],i[5]=o-e[1]*t[1],i[6]=-e[2]*t[1],i[7]=-e[3]*t[1],i[8]=-e[0]*t[2],i[9]=-e[1]*t[2],i[10]=o-e[2]*t[2],i[11]=-e[3]*t[2],i[12]=-e[0]*t[3],i[13]=-e[1]*t[3],i[14]=-e[2]*t[3],i[15]=o-e[3]*t[3],this.concat(r)},h.prototype.dropShadowDirectionally=function(t,e,r,i,o,n,a,s,u){var h=i*t+o*e+n*r;return this.dropShadow([t,e,r,-h],[a,s,u,0])},h.prototype.getMethod=function(){return"uniformMatrix4fv"},h.prototype.getData=function(){return[!1,this.data]},h}();e.Matrix4=h})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/math/vector1.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=function(){function t(t){this.data=t}return t.prototype.getMethod=function(){return parseInt(this.data+"")===this.data?"uniform1i":"uniform1f"},t.prototype.getData=function(){return[this.data]},t.byteSize=1,t}();e.Vector1=a})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/math/vector2.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=function(){function t(t){void 0===t&&(t=[0,0]),this.data=new Float32Array(t)}return t.prototype.getMethod=function(){return"uniform2f"},t.prototype.getData=function(){return this.data},t.byteSize=2,t}();e.Vector2=a})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/math/vector3.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=function(){function t(t){void 0===t&&(t=[0,0,0]),this.data=new Float32Array(t)}return t.prototype.normalize=function(){var t=this.data,e=t[0],r=t[1],i=t[2],o=Math.sqrt(e*e+r*r+i*i);return o?1==o||(o=1/o,t[0]=e*o,t[1]=r*o,t[2]=i*o):(t[0]=0,t[1]=0,t[2]=0),this},t.prototype.getMethod=function(){return"uniform3f"},t.prototype.getData=function(){return[this.data[0],this.data[1],this.data[2]]},t.byteSize=3,t}();e.Vector3=a})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/math/vector4.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=function(){function t(t){void 0===t&&(t=[0,0,0,0]),this.data=new Float32Array(t)}return t.prototype.getMethod=function(){return"uniform4f"},t.prototype.getData=function(){return[this.data[0],this.data[1],this.data[2],this.data[3]]},t.byteSize=4,t}();e.Vector4=a})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/param.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=t("./webgl/webGLObject"),s=t("./webgl/webGLBuffer"),u=t("./webgl/webGLTexture"),h=t("./webgl/webGLExt"),l=function(){function t(t,e,r,i){this.attributes={},this.buffers={},this.textures={},this.extensions={},this.gl=t,this.vertexShader=e,this.fragmentShader=r,this.shaderProgram=i}return t.prototype.getAttribLocation=function(t,e){if(null==this.attributes[t]&&(this.attributes[t]=a.WebGLObject.create(this.gl,t,a.Type.AttribLocation,e),this.attributes[t].index=this.gl.getAttribLocation(this.shaderProgram,t)),this.attributes[t].type!=a.Type.AttribLocation)throw new Error("type error");return this.attributes[t]},t.prototype.getUniformLocation=function(t,e){if(null==this.attributes[t]&&(this.attributes[t]=a.WebGLObject.create(this.gl,t,a.Type.UniformLocation,e),this.attributes[t].index=this.gl.getUniformLocation(this.shaderProgram,t)),this.attributes[t].type!=a.Type.UniformLocation)throw new Error("type error");return this.attributes[t]},t.prototype.getElementArrayBuffer=function(t,e){return void 0===e&&(e=this.gl.DYNAMIC_DRAW),this.getBuffer(t,this.gl.ELEMENT_ARRAY_BUFFER,e)},t.prototype.getArrayBuffer=function(t,e){return void 0===e&&(e=this.gl.DYNAMIC_DRAW),this.getBuffer(t,this.gl.ARRAY_BUFFER,e)},t.prototype.getBuffer=function(t,e,r){if(void 0===r&&(r=this.gl.DYNAMIC_DRAW),!this.buffers[t]){var i=s.mWebGLBuffer.create(this.gl,e,r);if(!i)throw new Error("create buffer error");this.buffers[t]=i}return this.buffers[t]},t.prototype.bindBuffer=function(t,e,r,i){void 0===i&&(i=0),this.buffers[t].bind(this.attributes[e],r,i)},t.prototype.set=function(t,e){if(null==this.attributes[t])throw new Error("not attribute:"+t);this.attributes[t].set(e)},t.prototype.createTexture=function(t,e){if(!this.textures[t]){var r=u.mWebGLTexture.create(this.gl);if(!r)return null;this.textures[t]=r}return this.textures[t]},t.prototype.bindTexture=function(t,e){this.textures[t]?this.textures[t].bind(e):console.error("not find texture")},t.prototype.getExtension=function(t){if(!this.extensions[t]){var e=h.mWebGLExtension.create(this.gl,t);this.extensions[t]=e}return this.extensions[t]},t}();e.Param=l})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/webgl/webGLBuffer.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=t("latte_lib"),s=function(){function o(t,e,r){this.gl=t,this.type=e,this.drawType=r}return o.prototype.resetBuffer=function(){this.buffer&&this.gl.deleteBuffer(this.buffer),this.buffer=this.gl.createBuffer()},o.prototype.bind=function(t,e,r){return void 0===e&&(e=0),void 0===r&&(r=0),this.gl.enableVertexAttribArray(t.index),this.gl.vertexAttribPointer(t.index,t.byteSize,this.gl.FLOAT,!1,e,r),this},o.prototype.set=function(t){var e;e=a.utils.isArray(t)?this.type==this.gl.ELEMENT_ARRAY_BUFFER?new Int16Array(t):new Float32Array(t):t,this.gl.bindBuffer(this.type,this.buffer),this.gl.bufferData(this.type,e,this.drawType)},o.create=function(t,e,r){var i=new o(t,e,r);return i.resetBuffer(),i},o}();e.mWebGLBuffer=s})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/webgl/webGLExt.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=function(){function o(t){this.parameter={},this.gl=t}return o.prototype.getParameter=function(t){return this.ext&&(this.parameter[t]=this.gl.getParameter(this.ext[t])),this.parameter[t]},o.prototype.isOK=function(){return this.ext},o.create=function(t,e){var r=new o(t),i=t.getExtension(e)||t.getExtension("WEBKIT_"+e)||t.getExtension("MOZ_"+e);return r.ext=i,r},o}();e.mWebGLExtension=a})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/webgl/webGLObject.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a,s=t("../math/matrix4"),u=t("../math/vector4"),h=t("../math/vector1"),l=t("../math/vector2"),f=t("../math/vector3");(a=e.Type||(e.Type={})).AttribLocation="AttribLocation",a.UniformLocation="UniformLocation";var c=function(){function n(t,e,r){this.gl=t,this.attributeName=e,this.type=r}return n.prototype.set=function(t){if(null==this.class)switch(t.constructor){case Array:this.byteSize=t.length,this.gl["uniform"+t.length+"f"].apply(this.gl,[this.index].concat(t));break;case Number:this.gl.uniform1i(this.index,t);break;default:t.getMethod&&this.gl[t.getMethod()].apply(this.gl,[this.index].concat(t.getData()))}else{if(null==this.class)throw new Error("type mismatch");var e=new this.class(t);this.gl[e.getMethod()].apply(this.gl,[this.index].concat(e.getData()))}},n.create=function(t,e,r,i){var o=new n(t,e,r);switch(i){case"vec1i":o.byteSize=h.Vector1.byteSize,o.class=h.Vector1;break;case"vec2":o.byteSize=l.Vector2.byteSize,o.class=l.Vector2;break;case"vec3":o.byteSize=f.Vector3.byteSize,o.class=f.Vector3;break;case"vec4":o.byteSize=u.Vector4.byteSize,o.class=u.Vector4;break;case"matrix4":o.class=s.Matrix4}return o},n}();e.WebGLObject=c})}(),function(t){"use strict";(typeof define==="function"?define:function(t,e,r){r(require,exports,module)})("latte_webgl/webgl/webGLTexture.js",["require","exports","module","window","__filename","__dirname"],function(t,e,r,i,o,n){e.__esModule=!0;var a=function(){function r(t){this.gl=t}return r.prototype.resetTexture=function(){this.texture=this.gl.createTexture()},r.prototype.set=function(t,e,r){this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,!0),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,e)},r.prototype.set2=function(t,e){this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1),this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,1),this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,e),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_NEAREST),this.gl.generateMipmap(this.gl.TEXTURE_2D)},r.prototype.bind=function(t){this.gl.activeTexture(this.gl["TEXTURE"+t]),this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture)},r.create=function(t){var e=new r(t);return e.resetTexture(),e},r}();e.mWebGLTexture=a})}();