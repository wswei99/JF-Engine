export default class Matrix {
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    // set(a, b, c, d, tx, ty) {
    //     this.a = a;
    //     this.b = b;
    //     this.c = c;
    //     this.d = d;
    //     this.tx = tx;
    //     this.ty = ty;

    //     return this;
    // }
    // translate(x, y)
    // {
    //     this.tx += x;
    //     this.ty += y;

    //     return this;
    // }
    // scale(x, y)
    // {
    //     this.a *= x;
    //     this.d *= y;
    //     this.c *= x;
    //     this.b *= y;
    //     this.tx *= x;
    //     this.ty *= y;
    //     return this;
    // }
    // rotate(angle)
    // {
    //     angle = Math.PI / 180 * angle;
    //     const cos = Math.cos(angle);
    //     const sin = Math.sin(angle);

    //     const a1 = this.a;
    //     const c1 = this.c;
    //     const tx1 = this.tx;

    //     this.a = (a1 * cos) - (this.b * sin);
    //     this.b = (a1 * sin) + (this.b * cos);
    //     this.c = (c1 * cos) - (this.d * sin);
    //     this.d = (c1 * sin) + (this.d * cos);
    //     this.tx = (tx1 * cos) - (this.ty * sin);
    //     this.ty = (tx1 * sin) + (this.ty * cos);

    //     return this;
    // }
    // append(matrix)
    // {
    //     const a1 = this.a;
    //     const b1 = this.b;
    //     const c1 = this.c;
    //     const d1 = this.d;

    //     this.a = (matrix.a * a1) + (matrix.b * c1);
    //     this.b = (matrix.a * b1) + (matrix.b * d1);
    //     this.c = (matrix.c * a1) + (matrix.d * c1);
    //     this.d = (matrix.c * b1) + (matrix.d * d1);

    //     this.tx = (matrix.tx * a1) + (matrix.ty * c1) + this.tx;
    //     this.ty = (matrix.tx * b1) + (matrix.ty * d1) + this.ty;

    //     return this;
    // }
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
    // prepend(matrix)
    // {
    //     const tx1 = this.tx;

    //     if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1)
    //     {
    //         const a1 = this.a;
    //         const c1 = this.c;

    //         this.a = (a1 * matrix.a) + (this.b * matrix.c);
    //         this.b = (a1 * matrix.b) + (this.b * matrix.d);
    //         this.c = (c1 * matrix.a) + (this.d * matrix.c);
    //         this.d = (c1 * matrix.b) + (this.d * matrix.d);
    //     }

    //     this.tx = (tx1 * matrix.a) + (this.ty * matrix.c) + matrix.tx;
    //     this.ty = (tx1 * matrix.b) + (this.ty * matrix.d) + matrix.ty;

    //     return this;
    // }

    
}