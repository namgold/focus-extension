import { DEFAULT } from "./utils/const";
import { T } from "./utils/utils";

const reset = () => {
    chrome.storage.local.clear();
    DEFAULT.blockWebsites.forEach(website => T.addKey(website));
    chrome.storage.local.set(DEFAULT);
}

const isRemove = (storage, url) => {
    if (!url) return false;
    let u;
    try {
        u = new URL(url);
    } catch (e) {
        console.log('URL "' + url + '" is invalid');
        return false;
    }
    return storage.activated
        && storage.pausedActivated
        && Number.isInteger(storage.pausedActivated.timestamp)
        && Number.isInteger(storage.pausedActivated.pauseAmount)
        && Number.isInteger(storage.pausedActivated.resetAmount)
        && storage.blockWebsites.find(website => website.active && u.hostname.toLowerCase().includes(website.url.toLowerCase()))
        && !(Date.now() >= storage.pausedActivated.timestamp && Date.now() - storage.pausedActivated.timestamp < storage.pausedActivated.pauseAmount * 60000);
}
chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    chrome.storage.local.get(storage => {
        if (isRemove(storage, tab.url)) chrome.tabs.remove(id);
    });
});

const getActivatedTab = done => {
    try {
        chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
            try {
                if (Array.isArray(tabs)) {
                    if (tabs[0]) {
                        done(tabs[0]);
                    }
                } else {
                    setTimeout(function() {
                        getActivatedTab(done);
                    }, 100);
                }
            } catch(err) {
                console.error('Error in getActivatedTab > query > callback', err);
                setTimeout(function() {
                    getActivatedTab(done);
                }, 100);
            }
        });
    } catch (e) {
        console.error('Error in getActivatedTab > query', e);
        setTimeout(function() {
            getActivatedTab(done);
        }, 100);
    }
}


chrome.tabs.onActivated.addListener(activeInfo => {
    getActivatedTab(tab => {
        if (tab) {
            chrome.storage.local.get(storage => {
                if (isRemove(storage, tab.url)) chrome.tabs.remove(activeInfo.tabId);
            });
        }
    });
    // const intervalId = setInterval(() => {
    //     count++;
    //     chrome.tabs.get(activeInfo.tabId, tab => {
    //         if (tab) {
    //             clearInterval(intervalId);
    //             chrome.storage.local.get(storage => {
    //                 if (isRemove(storage, tab.url)) chrome.tabs.remove(activeInfo.tabId);
    //             });
    //         }
    //     });
    //     if (count > 1000)
    //         clearInterval(intervalId);
    // }, 200);
});

chrome.tabs.onUpdated.addListener((...e) => console.log('onUpdated: ', e))
chrome.tabs.onMoved.addListener((...e) => console.log('onMoved: ', e));
chrome.tabs.onActivated.addListener((...e) => console.log('onActivated: ', e));
chrome.tabs.onHighlighted.addListener((...e) => console.log('onHighlighted: ', e));
chrome.tabs.onDetached.addListener((...e) => console.log('onDetached: ', e));
chrome.tabs.onAttached.addListener((...e) => console.log('onAttached: ', e));
chrome.tabs.onRemoved.addListener((...e) => console.log('onRemoved: ', e));
chrome.tabs.onReplaced.addListener((...e) => console.log('onReplaced: ', e));
chrome.tabs.onZoomChange.addListener((...e) => console.log('onZoomChange: ', e));
chrome.tabs.onCreated.addListener((...e) => console.log('onCreated: ', e));

chrome.storage.onChanged.addListener(changes => {
    if (changes?.pausedActivated?.newValue) {
        const timeoutValue = changes.pausedActivated.newValue.timestamp + changes.pausedActivated.newValue.pauseAmount * 60000 - Date.now();
        setTimeout(() => {
            chrome.tabs.getSelected(current => {
                console.log({current});
            })
        }, timeoutValue + 1);
    }
})

chrome.runtime.onInstalled.addListener((id, previousVersion, reason) => {
    console.log('Extension has been installed', { id, previousVersion, reason });
    reset()
});