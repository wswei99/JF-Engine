import DisplayObject from "./DisplayObject";
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
        let len = view.parent.childList.length;
        let preView = len > 0 ? view.parent.childList[len-1] : view.parent;
        let nextView = preView.nextView;
        // 添加到全局的显示链条中去
        preView.nextView = view;
        view.preView = preView;
        view.nextView = nextView;
        nextView && (nextView.preView = view);

        this.childList.push(view);
        view.zIndex = this.childList.length - 1;   
        // 更新全局坐标
        view.coordinateToStage.x = view.x + view.parent.coordinateToStage.x;
        view.coordinateToStage.y = view.y + view.parent.coordinateToStage.y;    

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
                view.zIndex = -1;
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