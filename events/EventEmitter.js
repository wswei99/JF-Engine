export default class EventEmitter{
    constructor() {
        this.listeners = {};
    }
    // 监听事件
    on(type, fn, context = this) {
        if (type && fn) {
            this.listeners[type] = this.listeners[type] || {};
            let key = fn.name || (console.warn('使用匿名函数,可能会造成内存泄漏!'), new Date().getTime());
            this.listeners[type][key] = {fn,context};
        } else {
            throw ('事件类型和相应函数为必填!');
        }
        return this;
    }
    once() {
        // wsw
    }
    off(type, fn, context) {
        if (type && fn && this.listeners[type] && this.listeners[type][fn.name]) {
            delete this.listeners[type][fn.name];
        } else {
            throw ('事件类型和相应函数为必填!');
        }
        return this;
    }
    // 执行事件
    emit(type, param = this) {
        let eventType = null;
        if (typeof type === 'string') {
            eventType = type;
        } else {
            eventType = type.type;
        }
        let fns = this.listeners && this.listeners[eventType];
        if (Object.keys(fns)) {
            for(let key in fns){
                fns[key].fn.call(fns[key].context, param);
            }
        }
    }
}