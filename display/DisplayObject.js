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
    getWorldMatrix() {

        if(this.prevView === 'root'){
            return this.transform.matrix;
        }

        const ltm = this.transform.matrix;
        // wsw 暂时不实现倾斜功能
        const ptm = this.parent && this.parent.getWorldMatrix();
        const wtm = new Matrix();

        wtm.a = (ltm.a * ptm.a) + (ltm.b * ptm.c);
        wtm.b = (ltm.a * ptm.b) + (ltm.b * ptm.d);
        wtm.c = (ltm.c * ptm.a) + (ltm.d * ptm.c);
        wtm.d = (ltm.c * ptm.b) + (ltm.d * ptm.d);
        wtm.tx = (ltm.tx * ptm.a) + (ltm.ty * ptm.c) + ptm.tx;
        wtm.ty = (ltm.tx * ptm.b) + (ltm.ty * ptm.d) + ptm.ty;

        return wtm;
    }


    set x(value) {
        this.transform.updateTransform('x', value);
    }
    get x() {
        return this.transform.matrix.tx;
    }
    set y(value) {
        this.transform.updateTransform('y',value);
    }
    get y() {
        return this.transform.matrix.ty;
    }
    set rotate(value) {
        this.transform.updateTransform('rotate',value);
    }
    get rotate() {
        return this.transform.rotate;
    }

    set scaleX(value) {
        this.transform.updateTransform('scaleX',value);
    }
    get scaleX() {
        return this.transform.a;
    }

    set scaleY(value) {
        this.transform.updateTransform('scaleY',value);
    }
    get scaleY() {
        return this.transform.d;
    }
    // 斜切
    set skewX(value) {
        this.transform.updateTransform('skewX',value);
    }
    get skewX() {
        return this.transform.skewX;
    }
    // 斜切
    set skewY(value) {
        this.transform.updateTransform('skewY',value);
    }
    get skewY() {
        return this.transform.skewY;
    }
    
    
}