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
        console.warn('URL "' + url + '" is invalid');
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

let gettingActivatedTab = false;

const getActivatedTab = done => {
    if (gettingActivatedTab) return;
    try {
        gettingActivatedTab = true;
        chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
            gettingActivatedTab = false;
            if (Array.isArray(tabs) && tabs[0]) done(tabs[0]);
            else setTimeout(() => getActivatedTab(done), 100);
        });
    } catch (e) {
        gettingActivatedTab = false;
        console.error('🚀 Error in getActivatedTab > query', e);
        setTimeout(() => getActivatedTab(done), 100);
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
});

chrome.tabs.onUpdated.addListener((...e) => console.info('onUpdated: ', e))
chrome.tabs.onMoved.addListener((...e) => console.info('onMoved: ', e));
chrome.tabs.onActivated.addListener((...e) => console.info('onActivated: ', e));
chrome.tabs.onHighlighted.addListener((...e) => console.info('onHighlighted: ', e));
chrome.tabs.onDetached.addListener((...e) => console.info('onDetached: ', e));
chrome.tabs.onAttached.addListener((...e) => console.info('onAttached: ', e));
chrome.tabs.onRemoved.addListener((...e) => console.info('onRemoved: ', e));
chrome.tabs.onReplaced.addListener((...e) => console.info('onReplaced: ', e));
chrome.tabs.onZoomChange.addListener((...e) => console.info('onZoomChange: ', e));
chrome.tabs.onCreated.addListener((...e) => console.info('onCreated: ', e));

chrome.storage.onChanged.addListener(changes => {
    if (changes?.pausedActivated?.newValue) {
        const timeoutValue = changes.pausedActivated.newValue.timestamp + changes.pausedActivated.newValue.pauseAmount * 60000 - Date.now();
        setTimeout(() => {
            const intervalId = setInterval(() => {
                chrome.tabs.getSelected(current => {
                    chrome.tabs.remove(current.id, () => clearInterval(intervalId));
                });
            }, 100);
        }, timeoutValue);
    }
})

chrome.runtime.onInstalled.addListener((id, previousVersion, reason) => {
    console.log('Extension has been installed', { id, previousVersion, reason });
    reset()
});