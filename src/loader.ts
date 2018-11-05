import * as latte_lib from "latte_lib"
let loadProtocol = (function () {
  let ajaxLocation = location.href;
  let rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/; //打印[http://localhost:8080,http:,localhost,8080]  
  let rhash = /#.*$/;
  //匹配开头的"//"字段  
  let rprotocol = /^\/\//;
  //获取前面的协议字段，如"http:","file:"等  
  let ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
  //第一个replace去掉用hash值,第二个replace表示如果去掉hash值以后开头已经是//那么也要进行相应的处理  
  //let result=ajaxLocation.replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
  return ajaxLocParts[1];
})();
export class Loader {
  loadImages: any = {};
  images: any = {};
  loadImageEvent: latte_lib.events = new latte_lib.events();
  private _loadFile(url, callback) {
    var xhr;
    (<any>window).XMLHttpRequest ? xhr = new XMLHttpRequest() : xhr = new ActiveXObject("Microsoft.XMLHTTP");
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
          } else {
            return callback(null, xhr.responseText);
          }
        } else {
          if (xhr.status == 200) {
            return callback(null, xhr.responseText);
          }
        }
      }
    }
  }
  loadFile(obj, callback) {
    if (latte_lib.utils.isString(obj)) {
      obj = {
        url: obj,
        parser: function (data) {
          return data;
        }
      };
    }
    if (!latte_lib.utils.isObject(obj)) {
      return callback(new Error('url format error'))
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
  }
  loadImage(url: string, callback: Function) {
    if (this.loadImages[url]) {
      this.loadImageEvent.once(url, callback);
    }
    if (this.images[url]) {
      return this.images[url];
    }
    this.loadImageEvent.once(url, callback);
    var image = this.images[url] = new Image();
    image.src = url;
    image.onload = () => {
      this.loadImages[url] = undefined;
      this.loadImageEvent.emit(url, undefined, {
        source: image,
        info: {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height
        }
      });
    }
    image.onerror = (err) => {
      console.error('loadImageError', url)
      this.images[url] = undefined;
      this.loadImages[url] = undefined;
      this.loadImageEvent.emit(url, err);
    }
    this.loadImages[url] = 1;
    return image;
  }
}
let defaultLoader = new Loader();
export {
  defaultLoader
}