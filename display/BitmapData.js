import { loadQueue } from '../utils/Util';
export default class BitmapData{
    constructor(url, x = 0, y = 0, width = 0, height = 0, dataType){
        // this.image = image;
        this.item = loadQueue.get(url);
        this.width = this.item.width;
        this.height = this.item.height;
        this.texture = this.item.content;
    }
    
}