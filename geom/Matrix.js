export default class Matrix {
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    setTransform(x, y, anchorX, anchorY, scaleX, scaleY, rotate, skewX, skewY)
    {
        rotate = rotate * Math.PI / 180;
        this.a = Math.cos(rotate + skewY) * scaleX;
        this.b = Math.sin(rotate + skewY) * scaleX;
        this.c = -Math.sin(rotate - skewX) * scaleY;
        this.d = Math.cos(rotate - skewX) * scaleY;

        this.tx = x - ((anchorX * this.a) + (anchorY * this.c));
        this.ty = y - ((anchorX * this.b) + (anchorY * this.d));
        return this;
    }
}