import Matrix from "./Matrix";

export default class Transform {
    constructor() {
        this.matrix = new Matrix();
        // 位置
        this.x = 0;
        this.y = 0;
        // 缩放
        this.scaleX = 1;
        this.scaleY = 1;
        // 旋转
        this.rotate = 0;
        // 倾斜
        this.skewX = 0;
        this.skewY = 0;
        // 锚点
        this.anchorX = 0;
        this.anchorY = 0;
    }
    updateTransform(key, value){
        this[key] = value;
        this.matrix.setTransform(this.x, this.y, this.anchorX, this.anchorY, this.scaleX, this.scaleY, this.rotate,this.skewX, this.skewY);
    }
}