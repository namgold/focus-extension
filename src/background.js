import { DEFAULT } from "./utils/const";

chrome.storage.local.set(DEFAULT);

let resetArray = [
    "facebook.com",
    "twitter.com",
    "youtube.com",
    "reddit.com",
    "pinterest.com",
    "vimeo.com",
    "plus.google",
    "tumblr.com",
    "instagram.com",
];

const ICON_ON = {
    38: "logo192.png"
}

const ICON_OFF = {
    38: "logo192-off.png"
}

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    console.log('onUpdated', { id, info, tab });
    chrome.storage.local.get(function(storage) {
        if (storage.activated
            && storage.blockWebsites.find(item => tab.url.toLowerCase().includes(item))
            && (Date.now() - storage.pausedTimestamp > storage.resetAmount * 2000 || Date.now() - storage.pausedTimestamp < storage.pauseAmount * 2000 ))
                chrome.tabs.remove(tab.id);
    });
});

/**
 * Adds Chrome onClicked listener that senses when to update extension state
 * The key difference is this method has tabID: tab.id stored as well in the
 * chrome.browserAction call
 */
chrome.browserAction.onClicked.addListener(function(tab) {
    // chrome.storage.sync.get(['activated'], function(items) {
    //     let bool = items.activated;
    //     if(bool == null) {
    //         bool = "false";
    //     }
    //     if(bool.indexOf("true") > -1) {

    //         chrome.browserAction.setIcon({
    //             path: ICON_OFF,
    //             tabId: tab.id
    //         });
    //         chrome.storage.sync.set({'activated': 'false'}, function() {});
    //     }
    //     else {
    //         chrome.browserAction.setIcon({
    //             path: ICON_ON,
    //             tabId: tab.id
    //         });
    //         chrome.storage.sync.set({'activated': 'true'}, function() {});
    //     }
    // });
});

chrome.tabs.onCreated.addListener((...e) => console.log('onCreated: ', e));
chrome.tabs.onMoved.addListener((...e) => console.log('onMoved: ', e));
chrome.tabs.onActivated.addListener((...e) => console.log('onActivated: ', e));
chrome.tabs.onHighlighted.addListener((...e) => console.log('onHighlighted: ', e));
chrome.tabs.onDetached.addListener((...e) => console.log('onDetached: ', e));
chrome.tabs.onAttached.addListener((...e) => console.log('onAttached: ', e));
chrome.tabs.onRemoved.addListener((...e) => console.log('onRemoved: ', e));
chrome.tabs.onReplaced.addListener((...e) => console.log('onReplaced: ', e));
chrome.tabs.onZoomChange.addListener((...e) => console.log('onZoomChange: ', e));
chrome.tabs.onCreated.addListener((...e) => console.log('onCreated: ', e));