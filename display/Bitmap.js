import DisplayObject from "./DisplayObject";
import { loadQueue } from "../utils/Util";

export default class Bitmap extends DisplayObject{
    constructor(url = null){
        super();
        this.type = 'bitmap';
        let item = loadQueue.get(url);
        this.width = item.content.width;
        this.height = item.content.height;
        this.loaded = item.loaded;
        this.texture = item.content;
    }
}