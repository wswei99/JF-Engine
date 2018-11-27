import DisplayObjectContainer from "./DisplayObjectContainer";
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

        this.preView = "root";

        RenderCheck.render(this);
        this.view1 = null;
        this.view2 = null;


        this.init();


    }
    init() {
        let view1 = new DisplayObjectContainer();
        view1.width = 275;
        view1.height = 567;
        view1.background = 'green';
        this.addChild(view1);
        view1.y = 50;
        view1.x = 50;
        this.view1 = view1;


        let view2 = new DisplayObjectContainer();
        view2.width = 100;
        view2.height = 100;
        view2.background = 'cyan';
        view1.addChild(view2);
        view2.x = 0;
        view2.y = 50;
        this.view2 = view2;

        // console.log(view2);


        let view3 = new DisplayObjectContainer();
        view3.width = 250;
        view3.height = 150;
        view3.x = 25;
        view3.y = 25;
        view3.background = 'orange';
        view1.addChild(view3);


        // setInterval(() => {
        //     view2.y -= 5;
        //     // console.log(view2);
        // }, 500);

        // setTimeout(() => {
        //     view2.y += 5;
        // }, 2000);


        this.speedX = 2;
        this.speedY = 3;
        let self = this;
        requestAnimationFrame(self.test.bind(this));

    }
    test() {
        // console.log(111)
        if (this.view2.x + this.view2.width > this.view1.width || this.view2.x <0) {
            this.speedX = -this.speedX;
            // this.background = 'cyan';
        }
        this.view2.x += this.speedX;

        if (this.view2.y + this.view2.height > this.view1.height|| this.view2.y < 0) {
            this.speedY = -this.speedY;
        }
        this.view2.y += this.speedY;
        
        let self = this;
        requestAnimationFrame(self.test.bind(this));
    }
}