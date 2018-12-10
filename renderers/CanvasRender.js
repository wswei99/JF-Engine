import { touchEvent } from '../events/Events';
import Point from '../display/Point';
export default class CanvasRender {
    constructor(canvas = document.createElement('canvas'), stage) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.blendMode = 'source-over';
        this.stage = stage;
        // wsw 屏幕适配
        let passiveEvent = false;
        try {
            let opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    passiveEvent = true;
                    return null;
                }
            });
            window.addEventListener("test", null, opts);
        } catch (e) { }
        passiveEvent = passiveEvent ? { capture: true, passive: true } : true;
        // 绑定事件
        this.canvas.addEventListener(touchEvent.tap, this.touchHandler.bind(this), passiveEvent);
        this.canvas.addEventListener(touchEvent.touchMove, this.touchHandler.bind(this), passiveEvent);
        this.canvas.addEventListener(touchEvent.touchEnd, this.touchHandler.bind(this), passiveEvent);
        // 事件相关
        this.checkPointInPath = false;
        this.tapPoint = new Point();
        this.tapView = null;
    }
    update(view = this.stage, firstView = true) {
        if (view.visible && view.alpha > 0) {
            this.context.save();
            this.render(view);
            if (view.tail) {
                this.update(view.nextView);
            }
            this.context.restore();
            if (!firstView) {
                return;
            }
            // 找出所有的兄弟视图
            let parentUid = view.parent && view.parent.uid;
            let tempView = view;
            while (1) {
                while (tempView.tail) {
                    tempView = tempView.tail;
                }
                tempView = tempView.nextView;
                if (tempView && tempView.parent.uid === parentUid) {
                    this.update(tempView, false);
                } else {
                    break;
                }
            }
        }
    }
    render(view) {
        // preRender
        if (view.blendMode !== this.blendMode) {
            this.context.globalCompositeOperation = view.blendMode;
        }
        this.transform(view);
        // render
        if (view.background) {
            this.context.beginPath();
            this.context.fillStyle = view.background;
            // this.context.fillRect(0, 0, view.width, view.height);
            this.context.rect(0, 0, view.width, view.height);
            this.context.fill();
            this.context.closePath();
        }
        // 渲染纹理
        if (view.loaded) {
            if (!view.width || !view.height) {
                return;
            }
            this.context.drawImage(view.texture, 0, 0, view.width, view.height);
            this.context.beginPath();
            this.context.rect(0, 0, view.width, view.height);
            this.context.closePath();
        }
        // 检测点击元素
        if (this.checkPointInPath && this.context.isPointInPath(this.tapPoint.x, this.tapPoint.y)) {
            this.tapView = view;
        }
    }
    clear(view) {

    }
    transform(view) {
        // 更新
        let matrix = view.transform.matrix;
        this.context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }

    // DOM事件处理函数。此方法会把事件调度到事件的坐标点所对应的可视对象。
    touchHandler(e) {
        let type = e.type,
            event = e,
            isTouch = type.indexOf('touch') === 0;
        // // 计算点击坐标
        if (isTouch) {
            let touches = event.touches,
                changedTouches = event.changedTouches;
            event = (touches && touches.length) ? touches[0] : (changedTouches && changedTouches.length) ? changedTouches[0] : null;
        }
        this.tapPoint.x = event.pageX || event.clientX;
        this.tapPoint.y = event.pageY || event.slientY;
        // 要求渲染机制去根据点来找出view
        this.checkPointInPath = true;
        this.update();
        this.checkPointInPath = false;
        this.tapView && this.tapView.emit(type);
    }
}