import EventEmitter from "../events/EventEmitter";
import { getUID } from "../utils/Util";
import Rectangle from './Rectangle';
import Matrix from "../geom/Matrix";
import RenderCheck from "../renderers/RenderCheck";
import Point from "./Point";
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
        // 相对于舞台的坐标(即全局坐标)
        this.coordinateToStage = new Point();


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
        // 全局矩阵和本地矩阵
        this.worldMatrix = new Matrix();
        this.localMatrix = new Matrix();
        // 深度
        this.zIndex = -1;
        // 
        this.nextView = null;
        this.preView = null;

        let self = this;
        // 对矩阵设置陷阱
        this.matrix = new Proxy(this.localMatrix, {
            set(trapTarget, key, value, receiver) {
                if (self.parent) {
                    // 更新坐标



                    // 渲染分两步,向下和向上(添加中间层overflowList)
                    // 先判断是否有子类超出父视图
                    // wsw 暂时实现视图变动前矩形渲染,后期需要优化成移动前后差异区域渲染
                    if (RenderCheck.overflowList.length === 0) {
                        // 所有子视图都被父视图所包含
                        // 先向下渲染,即找出当前视图所在位置的下层视图,让它(们)去渲染

                        // 先找兄弟视图
                        let pView = self.preView;
                        // 所有相交的视图
                        let crossViewList = [];
                        while (pView !== 'root'){
                            // 判断当前视图和被遍历视图是否相交
                            let crossRect = RenderCheck.viewCross(self, pView);
                            if (crossRect) {
                                // 记录两视图相交的矩形区域
                                pView.renderRect = crossRect;
                                // 视图相交, 继续判断view是否全包围self
                                if (crossRect.x === self.coordinateToStage.x &&
                                    crossRect.y === self.coordinateToStage.y &&
                                    crossRect.width === self.width &&
                                    crossRect.height === self.height
                                ) {
                                    // view全包围self
                                    // 渲染view
                                    crossViewList.push(pView)
                                    // RenderCheck.render(view);
                                    // 停止遍历
                                    break;
                                } else {
                                    // wsw view 部分包围self,需要继续寻找,知道找全所有包围self的视图
                                    crossViewList.push(pView);
                                }
                            }
                            pView = pView.preView;
                        } 
                        // 倒序遍历,分个渲染
                        for (let i = crossViewList.length - 1; i >= 0; i--) {
                            let view = crossViewList[i];
                            RenderCheck.render(view);
                        }
                        // 向上渲染
                        if (self.zIndex < self.parent.childList.length - 1) {
                            // self 上方还存在兄弟视图
                        }
                    } else {
                        // wsw 有子视图超出自己父视图的显示范围
                    }

                    // 渲染自身,先更新属性
                    Reflect.set(trapTarget, key, value, receiver);
                    // 更新坐标
                    if (key === 'e' || key === 'f' || key === 'g') {
                        self.coordinateToStage.x = self.matrix.e + self.parent.coordinateToStage.x;
                        self.coordinateToStage.y = self.matrix.f + self.parent.coordinateToStage.y;
                        self.renderRect.x = self.coordinateToStage.x;
                        self.renderRect.y = self.coordinateToStage.y;
                    }
                    RenderCheck.render(self);


                    // if(key !== 'g'){
                    //     // 父类先渲染子类所在区域
                    //     self.parent.renderRect = RenderCheck.getRenderRect(self);
                    //     RenderCheck.renderer.render(self.parent); 
                    // }
                    // // 修改自己世界Matrix
                    // Reflect.set(trapTarget, key, value, receiver)
                    // self.updateMatrix();
                    // // self.renderRect = RenderCheck.getRenderRect(self);
                    // console.log(self.parent.renderRect);
                    // self.renderRect.height = RenderCheck.getRenderRect(self).height;
                    // self.renderRect.width = RenderCheck.getRenderRect(self).width;
                    // self.renderRect.x = RenderCheck.getRenderRect(self).x - self.x;
                    // self.renderRect.y = RenderCheck.getRenderRect(self).y - self.y;
                    // // 执行自身的渲染
                    // RenderCheck.render(self);
                    // // 执行子类的渲染
                    // if(self.childList && self.childList.length > 0){
                    //     for(let i = 0, len = self.childList.length; i < len; i++){
                    //         let child = self.childList[i];
                    //         child.matrix.g += 1;
                    //     }
                    // }
                }
                return Reflect.set(trapTarget, key, value, receiver);
            }
        })
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
        // if (value !== this.matrix.e) {
        this.matrix.e = value;
        // }
    }
    get x() {
        return this.matrix.e;
    }
    set y(value) {
        // if (value !== this.matrix.f) {
        this.matrix.f = value;
        // }
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