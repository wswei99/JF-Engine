import EventEmitter from "../events/EventEmitter";
import { getUID } from "../utils/Util";
import Transform from "../geom/Transform";
import Rectangle from './Rectangle';
import Stage from "./Stage";
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
        this.renderRect = new Rectangle(0,0,50,50);
        // 背景颜色
        this.background = null;

        this.worldMatrix = new Matrix();
        this.localMatrix = new Matrix();

        let self = this;
        this.matrix = new Proxy(this.localMatrix, {
            set(trapTarget, key, value, receiver){
                RenderCheck.check(self);
                return Reflect.set(trapTarget, key, value, receiver);
            }
        })
    }

    set x(value) {
        if(value !== this.matrix.e){
            this.matrix.e = value;
            // 执行自身的渲染
            RenderCheck.render(this);
        }
    }
    get x() {
        return this.matrix.e;
    }
    set y(value) {
        if(value !== this.matrix.f){
            this.matrix.f = value;
            // 执行自身的渲染
            RenderCheck.render(this);
        }
    }
    get y() {
        return this.matrix.f;
    }
    
    set width(value){
        this._w = value;
        this.renderRect.w = value;
        RenderCheck.render(this);
    }
    get width(){
        return this._w;
    }
    set height(value){
        this._h = value;
        this.renderRect.h = value;
        RenderCheck.render(this);
    }
    get height(){
        return this._h;
    }

}