import Rectangle from "../display/Rectangle";
import Renderer from "./Renderer";

export default class RenderCheck {
    static check(view) {
        if (view.parent) {
            // 先渲染父类
            view.parent.renderRect = new Rectangle(view.matrix.e, view.matrix.f, view.width, view.height);
            RenderCheck.renderer.render(view.parent);
        }
    }
    static renderer = new Renderer(375, 667, '#ccc');
    static render(view) {
        (view.parent || view.uid === 1) && RenderCheck.renderer.render(view);
    }

    // 获取子视图在父视图上的映射区域
    static getRenderRect(view) {
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
        if (Math.abs(b2x + b1x - a2x - a1x) <= view.width + view.parent.width && Math.abs(b2y + b1y - a2y - a1y) <= view.height + view.parent.height) {
            // 相交的矩形左上角c1和右下角c2
            let c1x = Math.max(a1x, b1x),
                c1y = Math.max(a1y, b1y),
                c2x = Math.min(a2x, b2x),
                c2y = Math.min(a2y, b2y);
            // (c1x-b1x)将子视图重新归置到父视图坐标系中(即以父视图的左上角为坐标轴原点)
            return new Rectangle(c1x - b1x, c1y - b1y, c2x - c1x, c2y - c1y);
        }
        // 如果子视图超出父视图,则需要渲染超出部分

        return new Rectangle(0, 0, 0, 0);
    }

    // 所有子视图超出父视图的集合
    static overflowList = [];
    // 判断两个视图是否相交
    static viewCross(view1, view2) {
        // 首先判断子视图是否在父视图的渲染区域内
        // 罗列出矩形左上角a1和右下角a2坐标/父视图左上角b1和有右下角b2
        let a1x = view1.coordinateToStage.x,
            a1y = view1.coordinateToStage.y,
            a2x = a1x + view1.width,
            a2y = a1y + view1.height,
            b1x = view2.coordinateToStage.x,
            b1y = view2.coordinateToStage.y,
            b2x = b1x + view2.width,
            b2y = b1y + view2.height;
        if (Math.abs(b2x + b1x - a2x - a1x) <= view1.width + view2.width && Math.abs(b2y + b1y - a2y - a1y) <= view1.height + view2.height) {
            // 相交的矩形左上角c1和右下角c2
            let c1x = Math.max(a1x, b1x),
                c1y = Math.max(a1y, b1y),
                c2x = Math.min(a2x, b2x),
                c2y = Math.min(a2y, b2y);
            // (c1x-b1x)将子视图重新归置到父视图坐标系中(即以父视图的左上角为坐标轴原点)
            return new Rectangle(c1x, c1y, c2x - c1x, c2y - c1y);
        }
        return false;
    }

    // 查询该视图某一区域的上方或者下方的视图,直到找到全包围该区域的视图为止
    static findCrossViewWithViewAndRect(view, rect, preOrNext = 'pre') {
        let connectView = view[preOrNext + 'View'];
        let crossViewList = [];
        while (connectView && connectView !== 'root') {
            // 判断当前视图和被遍历视图是否相交
            let crossRect = RenderCheck.acrossWithTwoRect(rect, new Rectangle(connectView.coordinateToStage.x, connectView.coordinateToStage.y, connectView.width, connectView.height));
            if (crossRect) {
                // 记录两视图相交的矩形区域
                connectView.renderRect = crossRect;
                preOrNext === 'pre' ? crossViewList.unshift(connectView) : crossViewList.push(connectView);
                // 视图相交, 继续判断view是否全包围view
                if (crossRect.x === rect.x &&
                    crossRect.y === rect.y &&
                    crossRect.width === rect.width &&
                    crossRect.height === rect.height
                ) {
                    // view全包围self
                    if (preOrNext === 'next') {
                        // 如果该区域被后面的视图完全覆盖,则无需渲染该区域,
                        // wsw 后期优化,该字符串替换成全局变量
                        return 'allCross';
                    }
                    break;
                }
            }
            connectView = connectView[preOrNext + 'View'];
        }
        return crossViewList;
    }

    // 判断两个区域是否相交,
    static acrossWithTwoRect(rect1, rect2) {
        // 首先判断子视图是否在父视图的渲染区域内
        // 罗列出矩形左上角a1和右下角a2坐标/父视图左上角b1和有右下角b2
        let a1x = rect1.x,
            a1y = rect1.y,
            a2x = a1x + rect1.width,
            a2y = a1y + rect1.height,
            b1x = rect2.x,
            b1y = rect2.y,
            b2x = b1x + rect2.width,
            b2y = b1y + rect2.height;
        if (Math.abs(b2x + b1x - a2x - a1x) <= rect1.width + rect2.width && Math.abs(b2y + b1y - a2y - a1y) <= rect1.height + rect2.height) {
            // 相交的矩形左上角c1和右下角c2
            let c1x = Math.max(a1x, b1x),
                c1y = Math.max(a1y, b1y),
                c2x = Math.min(a2x, b2x),
                c2y = Math.min(a2y, b2y);
            // (c1x-b1x)将子视图重新归置到父视图坐标系中(即以父视图的左上角为坐标轴原点)
            return new Rectangle(c1x, c1y, c2x - c1x, c2y - c1y);
        }
        return false;
    }
    // 渲染矩形块所在的区域
    static renderWithViewAndRect(view, rect, needRenderPreView = true) {
        // 找出beforeDiffRect之前(即下方)需要渲染的视图,先判断该区域是否被别的视图遮挡
        // 这里暂时使用折中方案:如果该区域被上方视图全部遮盖,则跳过渲染,如果一点儿也没有被覆盖,则渲染该区域下方的视图,部分遮盖的则先渲染下方视图,之后再渲染上方视图
        // 查看该区域上方的视图
        let crossNextViewList = RenderCheck.findCrossViewWithViewAndRect(view, rect, 'next');
        
        if (!crossNextViewList) {
            // 该区域上方没有覆盖其他视图,则直接去渲染该区域下方的视图
            crossNextViewList = [];
        } else if (crossNextViewList === 'allCross') {
            // 如果该区域被上方视图完全覆盖,则前后都无需渲染
            crossNextViewList = false;
            return false;
        }
        if(needRenderPreView){
            // 查看该区域下方的视图
            let crossPreViewList = RenderCheck.findCrossViewWithViewAndRect(view, rect, 'pre');
            // 视图下方一定有其他视图(最底部是stage)
            // 合并该区域上下方所有需要渲染的视图
            crossNextViewList = crossPreViewList.concat(crossNextViewList);
        }
        return crossNextViewList;
    }

}