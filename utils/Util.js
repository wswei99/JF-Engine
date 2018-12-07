import LoadQueue from "./LoadQueue";

var _uid = 0;
export const getUID = ()=>{
    return ++_uid;
}
export const loadQueue = new LoadQueue();