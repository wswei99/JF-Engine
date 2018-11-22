import DisplayObjectContainer from "./DisplayObjectContainer";
import Renderer from '../renderers/Renderer';
import Timer from "../utils/Timer";
import RenderCheck from "../renderers/RenderCheck";

export default class Stage extends DisplayObjectContainer {
    constructor(width = 375, height = 667, bgColor = '#ccc') {
        super();
        this.width = width;
        this.height = height;
        this.background = bgColor;
        // this.renderer = new Renderer(width, height, bgColor);
        // this.timer = new Timer(() => { this.renderer.render() });
        // this.timer.start();

        RenderCheck.stageRender(this);
        this.view1 = null;

        this.init();


    }
    init() {
        let view1 = new DisplayObjectContainer();
        view1.width = 100;
        view1.height = 100;
        view1.background = 'red';
        this.addChild(view1);
        view1.x = 50;
        view1.y = 10;
        this.view1 = view1;
        // let view2 = new DisplayObjectContainer();
        // view2.width = 100;
        // view2.height = 100;
        // view2.background = 'cyan';
        // this.addChild(view2);
        // view2.x = 0;
        // view2.y = 0;
        // setInterval(() => {
        //     view1.x += 5;
        //     // console.log(view2);
        // }, 500);

        // setTimeout(() => {
        //     // this.renderer.renderType.context.clearRect(view1.x, view1.y, view1.width, view1.height);
        //     view1.x = 150;
        // }, 1000);


        this.speedX = 2;
        this.speedY = 3;
        let self = this;
        requestAnimationFrame(self.test.bind(this));

    }
    test() {
        // console.log(111)
        if (this.view1.x + this.view1.width > this.width || this.view1.x < 0) {
            this.speedX = -this.speedX;
            this.background = 'cyan';
        }
        this.view1.x += this.speedX;
        if (this.view1.y + this.view1.height > this.height || this.view1.y < 0) {
            this.speedY = -this.speedY;
        }
        this.view1.y += this.speedY;
        let self = this;
        requestAnimationFrame(self.test.bind(this));
    }
}