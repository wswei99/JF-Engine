export default class Ajax {
    constructor() {

    }
    // 服务器响应的数据类型，支持LAjax.TEXT，LAjax.JSON，LAjax.ARRAY_BUFFER，LAjax.BLOB四种类型。
    static responseType = null;
    static canUseBlob = window.Blob || window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    static local = !(location.protocol === 'http:' || location.protocol === 'https:');
    static progress = null;
    static TEXT = 'text';
    static JSON = 'json';
    static ARRAY_BUFFER = 'arraybuffer';
    static BLOB = 'BLOB';


    static get(url, data, oncomplete, onerror) {
        Ajax.getRequest('get', url, data, oncomplete, onerror);
    }
    static post(url, data, oncomplete, onerror) {
        Ajax.getRequest('post', url, data, oncomplete, onerror);
    }
    static getRequest(type, url, data, oncomplete, err) {
        let ajax = Ajax.getHttp();
        if (!ajax) {
            return;
        }
        let str = '',
            a = '';
        if (data) {
            for (let key in data) {
                str += (a + key + "=" + d[key]);
                a = "&";
            }
        }
        if (type.toLowerCase() === 'get' && str.length > 0) {
            url += ((url.indexOf('?') >= 0 ? '&' : '?') + str);
            str = null;
        }
        ajax.onerror = (e)=>{
            if(err){
                err(e);
                err = null;
            }
        }
        ajax.addEventListener('progress',(e)=>{
            if(e.currentTarget.status == 404){
                if (err) {
                    err(e.currentTarget);
                    err = null;
                }
            }else if(e.currentTarget.status == 200){
                if(Ajax.progress){
                    Ajax.progress(e);
                }
            }
        }, false);
        ajax.open(type, url, true);
        if(Ajax.responseType){
            if(Ajax.responseType === Ajax.JSON){
                try{
                    ajax.responseType = Ajax.responseType;
                }catch(e){
                    ajax.responseType = Ajax.TEXT;
                    ajax._responseType = "json";
                }
            }else{
                ajax.responseType = Ajax.responseType;
            }
            Ajax.responseType = Ajax.TEXT;
        }
        ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        ajax.onreadystatechange = (e)=>{
            let request = e.currentTarget;
            if(request.readyState == 4){
                if(request.status >= 200 && request.status < 300 || request.status === 304){
                    if(oncomplete){
                        if(request._responseType == Ajax.JSON){
                            request._responseType = Ajax.TEXT;
                            oncomplete(JSON.parse(request.responseText));
                        }else if (request.responseType == Ajax.ARRAY_BUFFER || request.responseType == Ajax.BLOB || request.responseType == Ajax.JSON) {
                            oncomplete(request.response);
                        } else if (request.responseText.length > 0) {
                            oncomplete(request.responseText);
                        } else {
                            oncomplete(null);
                        }
                    }
                }else{
                    if (err) {
                        err(request);
                        err = null;
                    }
                }
            }
        }
        ajax.send(data);
    }
    static getHttp() {
        if (typeof XMLHttpRequest != UNDEFINED) {
            return new XMLHttpRequest();
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                if (!this.err) {
                    this.err(e);
                }
            }
        }
        return false;
    }
}