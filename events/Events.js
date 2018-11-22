
// 简单判断是否支持触摸
const supportTouch = 'ontouchstart' in window;
export const touchEvent = {
    tap:supportTouch ? 'touchstart' : 'mousedown',
    touchStart:supportTouch ? 'touchstart' : 'mousedown',
    touchMove:supportTouch ? 'touchmove' : 'mousemove',
    touchEnd:supportTouch ? 'touchend' : 'mouseup'
}

export const timerEvent = {
    timer:'timer',
    timerComplete:'timerComplete'
}

