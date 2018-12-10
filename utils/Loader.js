export default class Loader{
    load(data){
        let image = new Image();
        if(data.crossOrigin){
            image.crossOrigin = data.crossOrigin;
        }
        image.onload = ()=>{
            this.onLoad(image);
        }
        image.onerror = image.onabort = this.onError;
        image.src = data.src + (data.noCache ? (data.src.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date()): '');
    }
    onLoad(image){
        image.onload = image.onerror = image.onabort = null;
        return image;
    }
    onError(e){
        let image = e.target;
        image.onload = image.onerror = image.onabort = null;
        return e;
    }
}