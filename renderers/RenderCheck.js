import Rectangle from "../display/Rectangle";
import { jf } from "../";
import Renderer from "./Renderer";

export default class RenderCheck{
    static check(view){
        if(view.parent){
            // 先渲染父类
            view.parent.renderRect = new Rectangle(view.matrix.e, view.matrix.f, view.width, view.height);
            RenderCheck.renderer.render(view.parent);
        }
    }
    static renderer = new Renderer(375, 667, '#ccc');
    static render(view){
        view.parent && RenderCheck.renderer.render(view);
    }
    static stageRender(view){
        RenderCheck.renderer.render(view)
    }
}