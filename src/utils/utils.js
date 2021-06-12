let requestIntervalTimeMap = new WeakMaps();
let requestTimeoutTimeMap = new WeakMaps();

export const T = {
    requestInterval: (func, interval) => {
        if (Date.now() - (requestIntervalTimeMap.get(func) || 0) > interval) {
            func();
            requestIntervalTimeMap.set(func, Date.now());
        }
        requestAnimationFrame(() => T.requestInterval(func, interval));
    },
    requestTimeout: (func, timeout) => {
        if (Date.now() - (requestTimeoutTimeMap.get(func) || 0) > timeout) {
            func();
            return;
        }
        requestAnimationFrame(() => T.requestTimeout(func, timeout));
    },
}