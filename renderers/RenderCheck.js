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
    // 获取子视图在父视图上的映射区域
    static getRenderRect(view){
        // 首先判断子视图是否在父视图的渲染区域内
        // 罗列出矩形左上角a1和右下角a2坐标/父视图左上角b1和有右下角b2
        let a1x = view.x + view.parent.x,
            a1y = view.y + view.parent.y,
            a2x = a1x + view.width,
            a2y = a1y + view.height,
            b1x = view.parent.x,
            b1y = view.parent.y,
            b2x = view.parent.x + view.parent.width,
            b2y = view.parent.y + view.parent.height;
        if(Math.abs(b2x + b1x - a2x - a1x) <= view.width + view.parent.width  && Math.abs(b2y + b1y - a2y - a1y) <= view.height + view.parent.height){
            // 相交的矩形左上角c1和右下角c2
            let c1x= Math.max(a1x, b1x),
                c1y = Math.max(a1y, b1y),
                c2x = Math.min(a2x,b2x),
                c2y = Math.min(a2y, b2y);
            // (c1x-b1x)将子视图重新归置到父视图坐标系中(即以父视图的左上角为坐标轴原点)
            return new Rectangle(c1x - b1x, c1y - b1y, c2x - c1x, c2y - c1y);
        }
        // 如果子视图超出父视图,则需要渲染超出部分
        
        return new Rectangle(0,0,0,0);
    }

}