const $ = window.$;
const Swal = window.Swal;

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
    addKeyBlockWebsites: website => !website.key && (website.key = T.randomPassword(50)),
    format2: number => number < 10 ? '0' + number : number,

    NOTIFY_TYPE: {
        DANGER: 'danger',
        SUCCESS: 'success',
        INFO: 'info',
        WARNING: 'warning'
    },
    notify: (message, type) => $.notify({ message }, { type, placement: { from: 'bottom' }, z_index: 2000 }),

    ALERT_TYPE: {
        WARNING: 'warning',
        ERROR: 'error',
        SUCCESS: 'success',
        INFO: 'info',
        QUESTION: 'question'
    },

    alert: (text, type, isShowButton, timer) => {
        let options = { text };
        if (type) {
            if (typeof type == 'boolean') {
                options.showConfirmButton = type;
                options.icon = 'success';
                if (timer) options.timer = timer;
            }
            else if (typeof type == 'number') {
                options.timer = type;
                options.icon = 'success';
            }
            else options.icon = type;
            if (isShowButton !== undefined) {
                if (typeof isShowButton == 'number') {
                    options.timer = options.showConfirmButton;
                    options.showConfirmButton = true;
                }
                else {
                    options.showConfirmButton = isShowButton;
                    if (timer) options.timer = timer;
                }
            }
            else options.showConfirmButton = true;
        }
        else {
            options.icon = 'success';
            options.showConfirmButton = true;
        }
        Swal.fire(options);
    },

    confirm: (title, html, type, isFocusCancel, done) => {
        if (typeof type == 'function') {
            done = type;
            type = 'warning';
            isFocusCancel = false;
        } else if (typeof type == 'boolean') {
            done = isFocusCancel;
            isFocusCancel = type;
            type = 'warning';
        } else if (typeof isFocusCancel == 'function') {
            done = isFocusCancel;
            isFocusCancel = false;
        }
        Swal.fire({ icon: type, title, html, focusCancel: isFocusCancel, showConfirmButton: true, showCancelButton: true, }).then(done);
    },

    setIntervalRoundSecond: (callback) => {
        const intervalId = { id: null };
        const handler = () => {
            const next = 1000 - Date.now() % 1000;
            setTimeout(() => {
                callback();
                intervalId.id = setInterval(() => {
                    const now = Date.now();
                    callback();
                    if (now % 1000 > 5) {
                        clearInterval(intervalId.id);
                        handler();
                    }
                }, 1000);
            }, next);
        }
        handler();
        return intervalId;
    }
}

$ && setTimeout(() => $.fn.getCursorPosition = function() {
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

/*eslint no-extend-native: ["error", { "exceptions": ["Array"] }]*/
Array.prototype.getUniques = function(selector = x => x) {
    let map = new Map();
    let result = [];
    this.forEach(i => {
        if (!map.get(selector(i))) {
            map.set(selector(i), true);
            result.push(i);
        }
    })
    return result;
}

Array.prototype.hasDuplicate = function(selector = x => x) {
    let map = new Map();
    for (let i of this) {
        if (!map.get(selector(i))) {
            map.set(selector(i), true);
        } else {
            return true;
        }
    }
    return false;
}