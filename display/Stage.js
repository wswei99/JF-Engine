import DisplayObjectContainer from "./DisplayObjectContainer";

import Renderer from '../renderers/Renderer';

// import RenderCheck from "../renderers/RenderCheck";
import Timer from "../utils/Timer";
import Rectangle from "./Rectangle";
import { touchEvent } from "../events/Events";
import LoadQueue from "../utils/LoadQueue";
import { loadQueue } from "../utils/Util";
import Bitmap from "./Bitmap";

export default class Stage extends DisplayObjectContainer {
    constructor(width = 375, height = 667, bgColor = '#ccc') {
        super();
        this.width = width;
        this.height = height;
        this.background = bgColor;
        this.renderer = new Renderer(width, height, this);
        this.renderer.stage = this;
        this.timer = new Timer(this.renderer.render, this.renderer);
        this.timer.start();

        this.prevView = "root";

        this.view1 = null;
        this.view2 = null;

        this.list = [];
        this.init();

        this.fps = 0;
        this._sTime = new Date();

    }
    init() {
        let view1 = new DisplayObjectContainer();
        view1.width = this.width - 100;
        view1.height = this.height - 100;
        view1.background = 'green';
        this.addChild(view1);
        view1.x = 50;
        view1.y = 100;


        let view2 = new DisplayObjectContainer();
        view2.width = 100;
        view2.height = 100;
        view2.background = 'cyan';
        view1.addChild(view2);
        view2.x = 50;
        view2.y = 50;

        view2.anchorX = 50;
        view2.anchorY = 50;
        view2.rotate = 45;
        this.view2 = view2;
        // view2.skewX = 0.5;
        view2.on(touchEvent.tap, () => {
            console.log('点击了view2');
        })


        let view3 = new DisplayObjectContainer();
        view3.width = 175;
        view3.height = 150;
        view3.x = 10;
        view3.y = 25;
        view3.background = 'rgb(255,0,0)';
        view1.addChild(view3);

        view3.on(touchEvent.tap, () => {
            console.log('点击了view3');
        })
        view3.on(touchEvent.touchMove, () => {
            console.log('点击了view的move');
        })
        // this.list = []


        // let loadQueue = new LoadQueue( {type:'png',src:'./images/1.png'});
        // loadQueue.start();

        loadQueue.add({ type: 'png', src: './images/2.png' });
        loadQueue.start();
        loadQueue.on('complete',this.test.bind(this));



    }
    test() {
        let view4 = new Bitmap('./images/2.png');
        this.addChild(view4);
        view4.x = 0;
        view4.y = 0;
    }
}