import DisplayObjectContainer from "./DisplayObjectContainer";

import Renderer from '../renderers/Renderer';

// import RenderCheck from "../renderers/RenderCheck";
import Timer from "../utils/Timer";
import Rectangle from "./Rectangle";
import { touchEvent } from "../events/Events";

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
        // view1.y = 50;
        view1.x = 50;
        view1.y = 100;
        // view1.x = 0;
        // view1.y = 50;


        // this.view1 = view1;
        // view1.rotate = 30;
        // view1.scaleX = 2;
        // view1.scaleY = 0.5;
        // view1.scaleX = 0.8;



        let view2 = new DisplayObjectContainer();
        view2.width = 100;
        view2.height = 100;
        view2.background = 'cyan';
        view1.addChild(view2);
        // view2.transform.matrix = view1.transform.matrix;
        view2.x = 50;
        view2.y = 50;
        // view2.scaleX = 2;
        view2.rotate = 30;
        // view2.transform.updateTransform(view1);
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

        // for (let i = 0; i < 2000; i++) {
        //     let view = new DisplayObjectContainer();
        //     view.width =  Math.floor(Math.random()*100);
        //     view.height =  Math.floor(Math.random()*100);

        //     // view.width =  100;
        //     // view.height =  100;

        //     view.x =  Math.floor(Math.random()*175);
        //     view.y =  Math.floor(Math.random()*467);

        //     view.background = 'rgb('+Math.random()*256+','+Math.random()*256+','+Math.random()*256+')';
        //     view1.addChild(view);

        //     this.list.push(view);
        //     view.speedX = Math.floor(Math.random()*4 + 1);
        //     view.speedY = Math.floor(Math.random()*3 + 1);

        // }
        // this.addChild(view2);


        // setInterval(() => {
        //     view2.y -= 5;
        //     // console.log(view2);
        // }, 500);

        // setTimeout(() => {
        //     view1.removeChild(view2);
        // }, 2000);

        // setTimeout(() => {
        //     this.removeChild(view1);
        // }, 4000);

        // setTimeout(() => {
        //     this.addChild(view1);
        // }, 6000);


        // setTimeout(() => {
        //     view3.addChild(view2);
        //     console.log(this);
        // }, 8000);

        // setTimeout(() => {
        //    this.timer.stop();
        // }, 1000);

        this.speedX = 2;
        this.speedY = 3;
        let self = this;
        // requestAnimationFrame(self.test.bind(this));

    }
    // test(data) {
    //     // console.log(Math.floor(1000/data))
    //     let v = this.nextView;
    //     RenderCheck.renderer.renderType.context.clearRect(0,0,this.width, this.height);
    //     while(v){
    //         v.renderRect = new Rectangle(v.x, v.y, v.width, v.height);
    //         RenderCheck.render(v);
    //         v = v.nextView;
    //     }


    //     let fTime = new Date();
    //     if(fTime - this._sTime >= 1000){

    //         console.log(this.fps);
    //         this.fps = 0;
    //         this._sTime = fTime;
    //     }else{
    //         ++this.fps;
    //     }


    //     let self = this;

    //     for(let i = 0, len = this.list.length;i < len; i++){
    //         let view = this.list[i];
    //         if(view.x + view.width > this.width || view.x < -50){
    //             view.speedX = -view.speedX;
    //         }
    //         view.x += view.speedX; 

    //         if(view.y + view.height > this.height || view.y < -50){
    //             view.speedY = -view.speedY;
    //         }
    //         view.y += view.speedY;
    //     }



    //     // requestAnimationFrame(self.test.bind(this));
    // }
}