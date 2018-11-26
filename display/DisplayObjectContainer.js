import DisplayObject from "./DisplayObject";
import Stage from "./Stage";
import RenderCheck from "../renderers/RenderCheck";
export default class DisplayObjectContainer extends DisplayObject{
    constructor(){
        super();
        this.childList = [];
    }
    addChild(view){
        if(view.parent){
            view.parent.removeChild(view);
        }
        view.parent = this;
        this.childList.push(view);
        // 修改矩阵,触发渲染
        view.matrix.g += 1;
        return this;
    }
    addChildAt(view, i){
        // wsw
    }
    removeChild(view){
        for(let i = 0, len = this.childList.length; i < len; i++){
            if(view.uid === this.childList[i].uid){
                this.childList.splice(i, 1);
                view.parent = null;
                break;
            }
        }
        // wsw 这里触发重绘逻辑
    }
    getChildAt(i){
        // wsw
    }
    removeChildAt(i){
        // wsw
    }
    removeAllChild(){
        // wsw
    }
}