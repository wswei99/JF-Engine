/**
 * 双向链表
 *
 * @export
 * @class DoublyLinkedList
 */
export default class DoublyLinkedList {

    // 在链表某一元素之后插入一个新元素
    static insert(pView, nview) {
        let nextView = pView.nextView;
        // 添加到全局的显示链条中去
        pView.nextView = nview;
        nview.prevView = pView;

        nview = nview.tail || nview;
        nview.nextView = nextView;
        nextView && (nextView.prevView = nview);
    }
    static textNum = 0;
    // 将子元素添加到父视图后,插入到链表中去
    static parentAddChild(parent, child) {
        child.parent = parent;
        parent.childList.push(child);
        child.zIndex = parent.childList.length - 1;
        // 先遍历出父类的最后尾节点
        let pView = parent;
        while (pView.tail) {
            pView = pView.tail;
        }
        DoublyLinkedList.insert(pView || parent, child);
        parent.tail = child;

    }
    // 将元素从链表中移除
    static removeAt(view) {
        let pView = view.prevView,
            nView = view.tail ? view.tail.nextView : view.nextView;
        pView && (pView.nextView = nView);
        nView && (nView.prevView = pView);
        view.prevView = null;
    }
    // 将子元素从父视图上移除
    static parentRemoveChild(parent, child) {
        let pView = child.prevView;
        if (parent.tail.uid === child.uid) {
            // 如果该视图是父视图的最后一个,则重新修改父视图的尾节点
            if (parent.uid === pView.uid) {
                parent.tail = null;
            } else {
                parent.tail = pView;
            }
        }
        child.parent = null;
        child.zIndex = -1;
        // 从双向链上脱离
        DoublyLinkedList.removeAt(child);
    }
}