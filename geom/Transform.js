import Matrix from "./Matrix";

export default class Transform {
    constructor() {
        this.matrix = new Matrix();
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotate = 0;
    }

    // 位移
    transformTranslateX(value) {
        this.matrix.e = value;
    }
    transformTranslateY(value) {
        this.matrix.f = value;
    }
    // 旋转
    transformRotate(value) {
        this.rotate = value;
        // 角度与弧度转换
        let rotateFlag = Math.PI / 180;
        this.matrix.a = Math.cos(value * rotateFlag);
        this.matrix.b = Math.sin(value * rotateFlag);
        this.matrix.c = -this.matrix.b;
        this.matrix.d = this.matrix.a;
    }
    // 缩放
    transformScaleX(value) {
        this.matrix.a = value;
    }
    transformScaleY(value) {
        this.matrix.d = value;
    }
}