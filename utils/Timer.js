import EventEmitter from "../events/EventEmitter";
import { timerEvent } from '../events/Events';

export default class Timer extends EventEmitter{
    constructor(callback, context){
        super();
        this._requestId = null;
        this.started = false;
        this.speed = 1;
        this.lastTime = -1;
        this.callback = callback;
        this._tick = (time)=>{
            this._requestId = null;
            if(this.started){
                this.update(time);
                if(this.started && this._requestId === null){
                    this._requestId = requestAnimationFrame(this._tick);
                }
            }
        }
        this.on(timerEvent.timer, this.callback, context);
    }
    start(){
        this.started = true;
        if(this._requestId === null){
            this.lastTime = performance.now();
            this._requestId = requestAnimationFrame(this._tick);
        }
    }
    stop(){
        this.started = false;
    }
    update(currentTime = performance.now()){
        this.emit(timerEvent.timer, currentTime - this.lastTime);
        this.lastTime = performance.now();
    }
    reset(){
        // wsw
    }
}