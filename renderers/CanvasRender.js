import Stage from "../display/Stage";

export default class CanvasRender {
    constructor(canvas = document.createElement('canvas')) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.blendMode = 'source-over';
    }

    render(view) {
        // preRender
        if (view.blendMode !== this.blendMode) {
            this.context.globalCompositeOperation = this.blendMode = view.blendMode;
        }
        this.context.save();
        this.transform(view);
        // render
        if (view.background) {
            this.context.fillStyle = view.background;
            if (view.renderRect) {
                    let renderRect = view.renderRect;
                    this.context.fillRect(renderRect.x, renderRect.y, renderRect.w, renderRect.h);
            } else {
                this.context.fillRect(0, 0, view.width, view.height);
            }
        }
        // 渲染纹理
        if (view.image) {

        }
        // endRender
        this.context.restore();
    }
    clear(view) {
        
    }
    transform(view) {
        this.context.transform(view.matrix.a, view.matrix.b, view.matrix.c, view.matrix.d, view.matrix.e, view.matrix.f);
    }

}