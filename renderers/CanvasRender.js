
export default class CanvasRender {
    constructor(canvas = document.createElement('canvas'), stage) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.blendMode = 'source-over';
        this.stage = stage;
    }
    update(view = this.stage) {
        if (view.visible && view.alpha > 0) {
            this.context.save();
            this.render(view);
            if(view.tail || view.nextView){
                this.update(view.nextView);
            }
            this.context.restore();
        }
    }
    render(view) {

        // preRender
        if (view.blendMode !== this.blendMode) {
            this.context.globalCompositeOperation = view.blendMode;
        }
        this.transform(view);
        // render
        if (view.background) {
            this.context.fillStyle = view.background;
            this.context.fillRect(0, 0, view.width, view.height);
        }
        // 渲染纹理
        if (view.image) {

        }
    }
    clear(view) {

    }
    transform(view) {
        // 更新
        let matrix = view.transform.matrix;
        this.context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    }

}