import Matrix from "./Matrix";

export default class Transform{
    constructor(){
        this.matrix = new Matrix();
        this.oldMatrix = null;
    }
    copy(matrix){
        let m = new Matrix();
        m.a = matrix.a;
        m.b = matrix.b;
        m.c = matrix.c;
        m.d = matrix.d;
        m.e = matrix.e;
        m.f = matrix.f;
        return m;
    }
}