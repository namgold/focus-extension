import { init, isRemove } from "./utils/helper";

// chrome.tabs.onUpdated.addListener((...e) => console.info('onUpdated: ', e))
// chrome.tabs.onActivated.addListener((...e) => console.info('onActivated: ', e));
// chrome.tabs.onMoved.addListener((...e) => console.info('onMoved: ', e));
// chrome.tabs.onHighlighted.addListener((...e) => console.info('onHighlighted: ', e));
// chrome.tabs.onDetached.addListener((...e) => console.info('onDetached: ', e));
// chrome.tabs.onAttached.addListener((...e) => console.info('onAttached: ', e));
// chrome.tabs.onRemoved.addListener((...e) => console.info('onRemoved: ', e));
// chrome.tabs.onReplaced.addListener((...e) => console.info('onReplaced: ', e));
// chrome.tabs.onZoomChange.addListener((...e) => console.info('onZoomChange: ', e));
// chrome.tabs.onCreated.addListener((...e) => console.info('onCreated: ', e));

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    isRemove(tab.url, result => {
        if (result) chrome.tabs.remove(id);
    })
});

chrome.tabs.onActivated.addListener(activeInfo => {
    isRemove(result => {
        if (result) chrome.tabs.remove(activeInfo.tabId);
    })
});

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
    // clear();
    init();
});