import Point from '../display/Point';
export default class Matrix {
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }
    set(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;

        return this;
    }
    // 应用当前转换获取新位置,可用于从子坐标空间到世界坐标空间。
    apply(pos, newPos) {
        newPos = newPos || new Point();
        const x = pos.x;
        const y = pos.y;
        newPos.x = (this.a * x) + (this.c * y) + this.e;
        newPos.y = (this.b * x) + (this.d * y) + this.f;
        return newPos;
    }
    // 应用当前转换获取新位置,可用于从世界坐标空间转到子坐标空间。
    applyInverse(pos, newPos) {
        newPos = newPos || new Point();
        const id = 1 / ((this.a * this.d) + (this.c * -this.b));
        const x = pos.x;
        const y = pos.y;
        newPos.x = (this.d * id * x) + (-this.c * id * y) + (((this.f * this.c) - (this.e * this.d)) * id);
        newPos.y = (this.a * id * y) + (-this.b * id * x) + (((-this.f * this.a) + (this.e * this.b)) * id);
        return newPos;
    }
    // 位移
    translate(x, y) {
        this.e += x;
        this.f += y;

        return this;
    }
    // 缩放
    scale(x, y) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.e *= x;
        this.f *= y;
        return this;
    }
    // 旋转
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const a1 = this.a;
        const c1 = this.c;
        const e1 = this.e;
        this.a = (a1 * cos) - (this.b * sin);
        this.b = (a1 * sin) + (this.b * cos);
        this.c = (c1 * cos) - (this.d * sin);
        this.d = (c1 * sin) + (this.d * cos);
        this.e = (e1 * cos) - (this.f * sin);
        this.f = (e1 * sin) + (this.f * cos);
        return this;
    }
}