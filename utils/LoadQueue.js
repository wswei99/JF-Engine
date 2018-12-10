import EventEmitter from "../events/EventEmitter";
import Loader from './Loader';

export default class LoadQueue extends EventEmitter {
    constructor(source) {
        super();
        this._source = [];
        this.add(source);
        this._loaded = 0;
        this._connections = 0;
        this._currentIndex = -1;
        // 同时下载的最大连接数, 默认为2;
        this.maxConnections = 2;
    }
    // 下载队列实例本身
    add(source) {
        if (source) {
            source = source instanceof Array ? source : [source];
            this._source = this._source.concat(source);
        }
        return this;
    }
    // 根据id或src地址获取资源对象。
    get(id) {
        if (id) {
            let source = this._source;
            for (let i = 0; i < source.length; i++) {
                let item = source[i];
                if (item.id === id || item.src === id) {
                    return item;
                }
            }
            return null;
        }
    }
    // 根据id或src地址获取资源内容
    getContent(id) {
        let item = this.get(id);
        return item && item.content;
    }
    // 开始下载队列
    start() {
        this._loadNext();
        return this;
    }
    _loadNext() {
        let source = this._source,
            len = source.length;
        if (this._loaded >= len) {
            this.emit('complete');
            return;
        }
        if (this._currentIndex < len - 1 && this._connections < this.maxConnections) {
            let index = ++this._currentIndex;
            let item = source[index];
            let loader = this._getLoader(item);
            if (loader) {
                let onLoad = loader.onLoad,
                    onError = loader.onError;
                loader.onLoad = (e) => {
                    loader.onLoad = onLoad;
                    loader.onError = onError;
                    let content = (onLoad && onLoad.call(loader, e)) || e.target;
                    this._onItemLoad(index, content);
                }
                loader.onError = (e) => {
                    loader.onLoad = onLoad;
                    loader.onError = onError;
                    onError && onError.call(loader, e);
                    this._onItemError(index, e);
                }
                this._connections++;
            }
            this._loadNext();
            loader && loader.load(item);
        }
    }
    _getLoader(item) {
        let loader = item.loader;
        if (loader) {
            return loader;
        }
        let type = item.type || this.getExtension(item.src);
        switch (type) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'webp':
                loader = new Loader();
                break;
            case 'js':
            case 'jsonp':
                // loader = new ScriptLoader();
                break;
            default :
                break;
        }
        return loader;
    }
    _onItemLoad(index, content) {
        let item = this._source[index];
        item.loaded = true;
        item.content = content;
        this._connections--;
        this._loaded++;
        this.emit('load', item);
        this._loadNext();
    }
    _onItemError(index, e) {
        let item = this._source[index];
        item.error = e;
        this._connections--;
        this._loaded++;
        this.fire('error', item);
        this._loadNext();
    }
    // 获取全部或已下载的资源的字节大小
    getSize(loaded) {
        let size = 0,
            source = this._source;
        for (var i = 0; i < source.length; i++) {
            var item = source[i];
            size += (loaded ? item.loaded && item.size : item.size) || 0;
        }
        return size;
    }
    // 获取已下载的资源数量
    getLoaded() {
        return this._loaded;
    }
    getTotal() {
        return this._source.length;
    }

    getExtension(src){
        var extRegExp = /\/?[^/]+\.(\w+)(\?\S+)?$/i, match, extension;
        match = src.match(extRegExp)
        if(match){
            extension = match[1].toLowerCase();
        }
        return extension || null;
    }
}