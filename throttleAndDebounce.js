//防抖
function debounce(fn, delay, immediate) {
    let timer, result;
    // 这里不能使用箭头函数，不然 this 依然会指向 Windows对象
    // 使用rest参数，获取函数的多余参数
    const debounced = function (...args) {
        if (timer) clearTimeout(timer);
        if (immediate) {
            const callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            if (callNow) result = fn.apply(this, args);
        } else {
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        }
        return result;
    };

    debounced.cancel = () => {
        clearTimeout(timer);
        timer = null;
    };

    return debounced;
}

//节流
function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 上次执行时间点
    var previous = 0;
    if (!options) options = {};
    // 延迟执行函数
    var later = function () {
        // 若设定了开始边界不执行选项，上次执行时间始终为0
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        // func 可能会修改 timeout 变量
        result = func.apply(context, args);
        // 定时器变量引用为空，表示最后一次执行，则要清除闭包引用的变量
        if (!timeout) context = args = null;
    };
    var throttled = function () {
        var now = new Date().getTime();
        // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
        if (!previous && options.leading === false) previous = now;
        // 延迟执行时间间隔
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
        // remaining 大于时间窗口 wait，表示客户端系统时间被调整过
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        // 返回回调函数执行后的返回值
        return result;
    };
    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };
    return throttled;
}
