import DisplayObjectContainer from "./DisplayObjectContainer";
import RenderCheck from "../renderers/RenderCheck";
import Timer from "../utils/Timer";

export default class Stage extends DisplayObjectContainer {
    constructor(width = 375, height = 667, bgColor = '#ccc') {
        super();
        this.width = width;
        this.height = height;
        this.background = bgColor;
        // this.timer.start();
        
        this.preView = "root";
        
        RenderCheck.render(this);
        this.view1 = null;
        this.view2 = null;
        
        
        this.list = [];
        this.init();

        this.fps = 0;
        this._sTime = new Date();

        this.timer = new Timer(this.test.bind(this));
        this.timer.start();

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


        // let view2 = new DisplayObjectContainer();
        // view2.width = 100;
        // view2.height = 100;
        // view2.background = 'cyan';
        // view1.addChild(view2);
        // view2.x = 60;
        // view2.y = 50;
        // this.view2 = view2;

        // console.log(view2);


        // let view3 = new DisplayObjectContainer();
        // view3.width = 175;
        // view3.height = 150;
        // view3.x = 50;
        // view3.y = 25;
        // view3.background = 'rgb(255,0,0)';
        // view1.addChild(view3);
    
        // this.list = []

        for (let i = 0; i < 200; i++) {
            let view = new DisplayObjectContainer();
            view.width =  Math.floor(Math.random()*100);
            view.height =  Math.floor(Math.random()*100);

            // view.width =  100;
            // view.height =  100;

            view.x =  Math.floor(Math.random()*175);
            view.y =  Math.floor(Math.random()*467);

            view.background = 'rgb('+Math.random()*256+','+Math.random()*256+','+Math.random()*256+')';
            view1.addChild(view);

            this.list.push(view);
            view.speedX = Math.floor(Math.random()*4 + 1);
            view.speedY = Math.floor(Math.random()*3 + 1);

        }
        // this.addChild(view2);
        

        // setInterval(() => {
        //     view2.y -= 5;
        //     // console.log(view2);
        // }, 500);

        // setTimeout(() => {
        //     view2.x += 100;
        // }, 2000);


        this.speedX = 2;
        this.speedY = 3;
        let self = this;
        // requestAnimationFrame(self.test.bind(this));

    }
    test(data) {
        // console.log(Math.floor(1000/data))
        
        let fTime = new Date();
        if(fTime - this._sTime >= 1000){

            console.log(this.fps);
            this.fps = 0;
            this._sTime = fTime;
        }else{
            ++this.fps;
        }


        let self = this;

        for(let i = 0, len = this.list.length;i < len; i++){
            let view = this.list[i];
            if(view.x + view.width > this.width -50 || view.x < -50){
                view.speedX = -view.speedX;
            }
            view.x += view.speedX;

            if(view.y + view.height > this.height -50 || view.y < -50){
                view.speedY = -view.speedY;
            }
            view.y += view.speedY;
        }



        // requestAnimationFrame(self.test.bind(this));
    }
}