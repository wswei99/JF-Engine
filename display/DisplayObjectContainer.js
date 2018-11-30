import DisplayObject from "./DisplayObject";
import DoublyLinkedList from "../utils/DoublyLinkedList";
export default class DisplayObjectContainer extends DisplayObject {
    constructor() {
        super();
        this.childList = [];
        // 该父视图上的尾视图
        this.tail = null;
    }
    addChild(view) {
        if (view.parent) {
            view.parent.removeChild(view);
        }
        // 添加到全局双向链表中去
        DoublyLinkedList.parentAddChild(this, view);
        return this;
    }
    addChildAt(view, i) {
        // wsw
    }
    removeChild(view) {
        for (let i = 0, len = this.childList.length; i < len; i++) {
            if (view.uid === this.childList[i].uid) {
                this.childList.splice(i, 1);
                DoublyLinkedList.parentRemoveChild(this, view);
                break;
            }
        }
        // wsw 这里触发重绘逻辑
    }
    getChildAt(i) {
        // wsw
    }
    removeChildAt(i) {
        // wsw
    }
    removeAllChild() {
        // wsw
    }
}