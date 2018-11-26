import EventEmitter from "../events/EventEmitter";
import { getUID } from "../utils/Util";
import Rectangle from './Rectangle';
import Matrix from "../geom/Matrix";
import RenderCheck from "../renderers/RenderCheck";
/**
 * 
 */
export default class DisplayObject extends EventEmitter {
    constructor() {
        super();
        /**
         * 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标
         */
        this.uid = getUID();
        // this.x = 0;
        // this.y = 0;
        this._w = 0;
        this._h = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotate = 0;
        this.alpha = 1;
        this.visible = true;
        // 调用显示对象被指定的 mask 对象遮罩。
        this.mask = null;
        // BlendMode 类中的一个值，用于指定要使用的混合模式
        this.blendMode = null;
        // 包含当前与显示对象关联的每个滤镜对象的索引数组
        this.filters = null;
        // 表示包含此显示对象的 DisplayObjectContainer 对象
        this.parent = null;
        // 绘制区域
        this.renderRect = new Rectangle();
        // 背景颜色
        this.background = null;

        this.worldMatrix = new Matrix();
        this.localMatrix = new Matrix();

        let self = this;
        this.matrix = new Proxy(this.localMatrix, {
            set(trapTarget, key, value, receiver) {

                if (self.parent) {
                    if(key !== 'g'){
                        // 父类先渲染子类所在区域
                        self.parent.renderRect = RenderCheck.getRenderRect(self);
                        RenderCheck.renderer.render(self.parent); 
                    }
                    // 修改自己世界Matrix
                    Reflect.set(trapTarget, key, value, receiver)
                    self.updateMatrix();
                    // self.renderRect = RenderCheck.getRenderRect(self);
                    self.renderRect.height = RenderCheck.getRenderRect(self).height;
                    self.renderRect.width = RenderCheck.getRenderRect(self).width;
                    self.renderRect.x = RenderCheck.getRenderRect(self).x - self.x;
                    self.renderRect.y = RenderCheck.getRenderRect(self).y - self.y;

                    // 执行自身的渲染
                    RenderCheck.render(self);
                    // 执行子类的渲染
                    // if(self.childList && self.childList.length > 0){
                    //     for(let i = 0, len = self.childList.length; i < len; i++){
                    //         let child = self.childList[i];
                    //         child.matrix.g += 1;
                    //     }
                    // }
                }
                // 检测父类是否需要渲染
                // RenderCheck.check(self);

                return Reflect.set(trapTarget, key, value, receiver);
                // return true;
            }
        })
    }
    updateMatrix() {
        const lm = this.localMatrix;
        // wsw 暂时不实现倾斜功能和缩放
        const pwm = this.parent.worldMatrix;
        const wm = this.worldMatrix;

        wm.a = (lm.a * pwm.a) + (lm.b * pwm.c);
        wm.b = (lm.a * pwm.b) + (lm.b * pwm.d);
        wm.c = (lm.c * pwm.a) + (lm.d * pwm.c);
        wm.d = (lm.c * pwm.b) + (lm.d * pwm.d);
        wm.e = (lm.e * pwm.a) + (lm.f * pwm.c) + pwm.e;
        wm.f = (lm.e * pwm.b) + (lm.f * pwm.d) + pwm.f;
    }

    set x(value) {
        if (value !== this.matrix.e) {
            this.matrix.e = value;
        }
    }
    get x() {
        return this.matrix.e;
    }
    set y(value) {
        if (value !== this.matrix.f) {
            this.matrix.f = value;
        }
    }
    get y() {
        return this.matrix.f;
    }

    set width(value) {
        this._w = value;
        this.renderRect.width = value;
        RenderCheck.render(this);
    }
    get width() {
        return this._w;
    }
    set height(value) {
        this._h = value;
        this.renderRect.height = value;
        RenderCheck.render(this);
    }
    get height() {
        return this._h;
    }

}