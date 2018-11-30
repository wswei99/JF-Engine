import EventEmitter from "../events/EventEmitter";
import { getUID } from "../utils/Util";
import Rectangle from './Rectangle';
import Matrix from "../geom/Matrix";
import RenderCheck from "../renderers/RenderCheck";
import Point from "./Point";
import Transform from "../geom/Transform";
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
        this.transform = new Transform();
        this.width = 0;
        this.height = 0;
        
        this.alpha = 1;
        this.visible = true;
        // 调用显示对象被指定的 mask 对象遮罩。
        this.mask = null;
        // BlendMode 类中的一个值，用于指定要使用的混合模式
        this.blendMode = 'source-over';
        // 包含当前与显示对象关联的每个滤镜对象的索引数组
        this.filters = null;
        // 表示包含此显示对象的 DisplayObjectContainer 对象
        this.parent = null;
        // 绘制区域
        this.renderRect = new Rectangle();
        // 背景颜色
        this.background = null;
        // 全局矩阵和本地矩阵
        this.worldMatrix = new Matrix();
        this.localMatrix = new Matrix();
        // 深度
        this.zIndex = -1;
        // 双向链表
        this.nextView = null;
        this.prevView = null;
    }
    // 更新本地矩阵到全局(父视图)矩阵
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
        this.transform.transformTranslateX(value);
    }
    get x() {
        return this.transform.matrix.e;
    }
    set y(value) {
        this.transform.transformTranslateY(value);
    }
    get y() {
        return this.transform.matrix.f;
    }
    set rotate(value) {
        this.transform.transformRotate(value);
    }
    get rotate() {
        return this.transform.rotate;
    }

    set scaleX(value) {
        this.transform.transformScaleX(value);
    }
    get scaleX() {
        return this.transform.a;
    }

    set scaleY(value) {
        this.transform.transformScaleY(value);
    }
    get scaleY() {
        return this.transform.d;
    }

    
}