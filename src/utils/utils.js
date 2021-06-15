const jQuery = window.jQuery;

// let requestIntervalTimeMap = new WeakMaps();
// let requestTimeoutTimeMap = new WeakMaps();

export const T = {
    // requestInterval: (func, interval) => {
    //     if (Date.now() - (requestIntervalTimeMap.get(func) || 0) > interval) {
    //         func();
    //         requestIntervalTimeMap.set(func, Date.now());
    //     }
    //     requestAnimationFrame(() => T.requestInterval(func, interval));
    // },
    // requestTimeout: (func, timeout) => {
    //     if (Date.now() - (requestTimeoutTimeMap.get(func) || 0) > timeout) {
    //         func();
    //         return;
    //     }
    //     requestAnimationFrame(() => T.requestTimeout(func, timeout));
    // },
    secondToMinutes: second => {
        return T.format2(Math.floor(second / 60)) + ':' + T.format2(Math.floor(second % 60));
    },
    formatLink: url => new URL(url.startsWith('https://') || url.startsWith('http://') ? url : 'https://' + url),
    randomPassword: (length = 10) => Array(Math.ceil(length / 10)).fill().map(() => Math.random().toString(36).substring(2, 15)).join('').slice(-length),
    addKey: website => !website.key && (website.key = T.randomPassword(50)),
    format2: number => number < 10 ? '0' + number : number,
}

jQuery && setTimeout(() => jQuery.fn.getCursorPosition = function() {
    var input = this.get(0);
    if (!input) return; // No (input) element found
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        return input.selectionStart;
    } else if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return sel.text.length - selLen;
    }
});
