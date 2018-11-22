import CanvasRender from "./CanvasRender";
import Stage from "../display/Stage";

export default class Renderer {
    constructor(width, height, bgColor) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        // 添加到文档流
        document.body.appendChild(this.canvas);
        // 更新窗口大小
        this.resize(this.width, this.height);
        // wsw 后期添加支持webgl
        this.renderType = new CanvasRender(this.canvas);
    }
    isWebGLSupported() {
        const contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };
        try {
            if (!window.WebGLRenderingContext) {
                return false;
            }
            let gl = this.canvas.getContext('webgl', contextOptions) || this.canvas.getContext('experimental-webgl', contextOptions);
            const success = !!(gl && gl.getContextAttributes().stencil);
            if (gl) {
                const loseContext = gl.getExtension('WEBGL_lose_context');
                if (loseContext) {
                    loseContext.loseContext();
                }
            }
            gl = null;
            return success;
        } catch (e) {
            return false;
        }
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        if (this.autoResize) {
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
        }
    }
    render(view) {
        this.renderType.render(view);

    }
}