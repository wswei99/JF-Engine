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

                    // 首先计算出变动前后的差异部分
                    let beforeDiffRect = null;
                    // let beforeRect = new Rectangle(self.coordinateToStage.x, self.coordinateToStage.y, self.width, self.height);
                    // Reflect.set(trapTarget, key, value, receiver);
                    // let afterRect = new Rectangle(self.coordinateToStage.x, self.coordinateToStage.y, self.width, self.height);


                    // 变动后,原位置需要进行渲染的矩形部分
                    if (key === 'e') {
                        //  x轴方向移动的距离
                        let diffX = value - self.matrix.e;
                        let w = Math.abs(diffX) > self.width ? self.width : Math.abs(diffX);

                        if (Math.abs(diffX) > self.width || diffX > 0) {
                            // 视图已经完全移动出原来位置
                            beforeDiffRect = new Rectangle(self.coordinateToStage.x, self.coordinateToStage.y, w, self.height)
                        } else if (diffX < 0) {
                            beforeDiffRect = new Rectangle(self.coordinateToStage.x + self.width - w, self.coordinateToStage.y, w, self.height)
                        } else {
                            // 未移动
                            beforeDiffRect = null;
                        }
                    }
                    if (key === 'f') {
                        //  y轴方向移动
                        let diffY = value - self.matrix.f;;
                        let h = Math.abs(diffY) > self.height ? self.height : Math.abs(diffY);
                        if (Math.abs(diffY) > self.height || diffY > 0) {
                            // 视图已经完全移动出原来位置
                            beforeDiffRect = new Rectangle(self.coordinateToStage.x, self.coordinateToStage.y, self.width, h)
                        } else if (diffY < 0) {
                            beforeDiffRect = new Rectangle(self.coordinateToStage.x, self.coordinateToStage.y + self.height - h, self.width, h)
                        } else {
                            // 未移动
                            beforeDiffRect = null;
                        }
                    }
                    // 渲染变动前需要渲染的区域
                    if(beforeDiffRect){
                        let crossNextViewList = RenderCheck.renderWithViewAndRect(self, beforeDiffRect);
                        for (let i = 0, len = crossNextViewList.length; i < len; i++) {
                            RenderCheck.render(crossNextViewList[i]);
                        }
                    }
                    // 更新自身信息
                    Reflect.set(trapTarget, key, value, receiver);
                    // 更新坐标
                    if (key === 'e' || key === 'f' || key === 'g') {
                        self.coordinateToStage.x = self.matrix.e + self.parent.coordinateToStage.x;
                        self.coordinateToStage.y = self.matrix.f + self.parent.coordinateToStage.y;
                        self.renderRect.x = self.coordinateToStage.x;
                        self.renderRect.y = self.coordinateToStage.y;
                        self.renderRect.width = self.width;
                        self.renderRect.height = self.height;
                    }
                    // 渲染自身
                    // RenderCheck.render(self);
                    // 渲染变动之后需要渲染的区域
                    let crossNextViewList = RenderCheck.renderWithViewAndRect(self, self.renderRect, false);
                    
                    if (crossNextViewList) {
                        // 被其他视图所覆盖,无需渲染
                        RenderCheck.render(self);
                        for (let i = 0, len = crossNextViewList.length; i < len; i++) {
                            RenderCheck.render(crossNextViewList[i]);
                        }
                    }























                    // // 渲染分两步,向下和向上(添加中间层overflowList)
                    // // 先判断是否有子类超出父视图
                    // // wsw 暂时实现视图变动前矩形渲染,后期需要优化成移动前后差异区域渲染
                    // if (RenderCheck.overflowList.length === 0) {
                    //     // 先向前渲染,即找出当前视图所在位置的下层视图,让它(们)去渲染
                    //     // 如果是addchild等方法引起的渲染,则不进行向前渲染
                    //     let crossViewList = [];
                    //     if (key !== 'g') {
                    //         let pView = self.preView;
                    //         // 所有相交的视图
                    //         while (pView !== 'root') {
                    //             // 判断当前视图和被遍历视图是否相交
                    //             let crossRect = RenderCheck.viewCross(self, pView);
                    //             if (crossRect) {
                    //                 // 记录两视图相交的矩形区域
                    //                 pView.renderRect = crossRect;
                    //                 crossViewList.unshift(pView)
                    //                 // 视图相交, 继续判断view是否全包围self
                    //                 if (crossRect.x === self.coordinateToStage.x &&
                    //                     crossRect.y === self.coordinateToStage.y &&
                    //                     crossRect.width === self.width &&
                    //                     crossRect.height === self.height
                    //                 ) {
                    //                     // view全包围self
                    //                     // 停止遍历
                    //                     break;
                    //                 }
                    //             }
                    //             pView = pView.preView;
                    //         }
                    //     }
                    //     // 把自身添加进渲染梯队
                    //     crossViewList.push(self);
                    //     // 向后渲染
                    //     let nView = self.nextView;
                    //     while (nView) {
                    //         let crossRect = RenderCheck.viewCross(self, nView);
                    //         if (crossRect) {
                    //             // 视图相交
                    //             nView.renderRect = crossRect;
                    //             crossViewList.push(nView);
                    //             // 视图相交, 继续判断view是否全包围self
                    //             if (crossRect.x === self.coordinateToStage.x &&
                    //                 crossRect.y === self.coordinateToStage.y &&
                    //                 crossRect.width === self.width &&
                    //                 crossRect.height === self.height
                    //             ) {
                    //                 break;
                    //             }
                    //         }
                    //         nView = nView.nextView;
                    //     }
                    //     // 更新自身信息
                    //     Reflect.set(trapTarget, key, value, receiver);
                    //     // 更新坐标
                    //     if (key === 'e' || key === 'f' || key === 'g') {
                    //         self.coordinateToStage.x = self.matrix.e + self.parent.coordinateToStage.x;
                    //         self.coordinateToStage.y = self.matrix.f + self.parent.coordinateToStage.y;
                    //         self.renderRect.x = self.coordinateToStage.x;
                    //         self.renderRect.y = self.coordinateToStage.y;
                    //     }

                    //     // 渲染所有需要渲染的元素(内含大量重复绘制图形,需要后期优化);
                    //     for (let i = 0; i < crossViewList.length; i++) {
                    //         let view = crossViewList[i];
                    //         RenderCheck.render(view);
                    //     }
                    //     crossViewList.length = 0;
                    //     // 重新查询身后视图是否需要绘制
                    //     nView = self.nextView;
                    //     while (nView) {
                    //         let crossRect = RenderCheck.viewCross(self, nView);
                    //         if (crossRect) {
                    //             // 视图相交
                    //             nView.renderRect = crossRect;
                    //             crossViewList.push(nView);
                    //             // 视图相交, 继续判断view是否全包围self
                    //             if (crossRect.x === self.coordinateToStage.x &&
                    //                 crossRect.y === self.coordinateToStage.y &&
                    //                 crossRect.width === self.width &&
                    //                 crossRect.height === self.height
                    //             ) {
                    //                 break;
                    //             }
                    //         }
                    //         nView = nView.nextView;
                    //     }
                    //     for (let i = 0; i < crossViewList.length; i++) {
                    //         let view = crossViewList[i];
                    //         RenderCheck.render(view);
                    //     }


                    // } else {
                    //     // wsw 有子视图超出自己父视图的显示范围
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