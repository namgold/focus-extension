import { DEFAULT, storage } from "./const";
import { T } from "./utils";

export const clear = () => {
    storage.clear();
}

export const init = () => {
    storage.get(storageData => {
        DEFAULT.blockWebsites.forEach(website => T.addKeyBlockWebsites(website));
        storage.set(Object.assign({}, DEFAULT, storageData));
    });
}

export const reset = () => {
    clear();
    init();
}

let gettingActivatedTab = false;

export const getActivatedTab = done => {
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

export const TIME_STATUS = {
    BLOCKING_ALLOW_PAUSE: 'BLOCKING_ALLOW_PAUSE',
    PAUSING: 'PAUSING',
    BLOCKING_PREVENT_PAUSE: 'BLOCKING_PREVENT_PAUSE',
    DISABLED: 'DISABLED',
}

export const getTimeStatus = (storageData, done = i => i) => {
    const getTimeStatusWithStorage = (pstorage, pdone) => {
        if (pstorage.pausedActivated
         && Number.isInteger(pstorage.pausedActivated.timestamp)
         && Number.isInteger(pstorage.pausedActivated.pauseAmount)
         && Number.isInteger(pstorage.pausedActivated.resetAmount)) {
            if (pstorage.activated) {
                // -timeline-|---------->-----------------pausedTimestamp----->--------pauseEndTimestamp---------------->------------resetTimestamp------------->--------------
                // -now------|-----BLOCKING_ALLOW_PAUSE---------------------PAUSING-------------------------BLOCKING_PREVENT_PAUSE--------------------BLOCKING_ALLOW_PAUSE-----
                const now = Date.now();
                const pausedTimestamp   = pstorage.pausedActivated.timestamp;
                const pauseEndTimestamp = pausedTimestamp + pstorage.pausedActivated.pauseAmount * 60000;
                const resetTimestamp    = pausedTimestamp + pstorage.pausedActivated.resetAmount * 60000;
                if (now < pausedTimestamp || now >= resetTimestamp)    return pdone(TIME_STATUS.BLOCKING_ALLOW_PAUSE);
                if (pausedTimestamp <= now && now < pauseEndTimestamp) return pdone(TIME_STATUS.PAUSING);
                if (pauseEndTimestamp <= now && now < resetTimestamp)  return pdone(TIME_STATUS.BLOCKING_PREVENT_PAUSE);
                return pdone('hihi ai bik');
            } else {
                return pdone(TIME_STATUS.DISABLED);
            }
        } else {
            throw new TypeError();
        }
    }
    if (storageData && typeof storageData == 'object' && storageData.pausedActivated) return getTimeStatusWithStorage(storageData, done);
    else {
        done = storageData;
        storage.get(pstorage => getTimeStatusWithStorage(pstorage, done));
    }
}

export const isBlockWebsite = (url, storageData, done = i => i) => {
    const isBlockWebsiteWithParams = (purl, pstorage, pdone) => {
        if (!purl) return pdone(false);
        let u;
        try {
            u = new URL(purl);
        } catch (e) {
            console.warn('URL "' + purl + '" is invalid');
            return pdone(false);
        }
        const result = !!pstorage.blockWebsites.find(blockWebsite => blockWebsite.active && u.hostname.toLowerCase().includes(blockWebsite.url.toLowerCase()))
        return pdone(result);
    }
    if (url && typeof url == 'string') {
        if (storageData && typeof storageData === 'object' && storageData.blockWebsites) return isBlockWebsiteWithParams(url, storageData, done);
        else {
            done = storageData;
            storage.get(pstorage => isBlockWebsiteWithParams(url, pstorage, done));
        }
    }
    else {
        getActivatedTab(tab => {
            if (storageData && typeof storageData === 'object' && storageData.blockWebsites) isBlockWebsiteWithParams(tab.url, storageData, done);
            else storage.get(pstorageData => isBlockWebsiteWithParams(tab.url, pstorageData, done));
        });
    }
}

export const isRemove = (url, done) => {
    if (typeof url === 'function') {
        done = url;
        url = undefined;
    }
    storage.get(storageData => {
        isBlockWebsite(url, storageData, result => {
            if (result) done(getTimeStatus(storageData) === TIME_STATUS.BLOCKING_ALLOW_PAUSE || getTimeStatus(storageData) === TIME_STATUS.BLOCKING_PREVENT_PAUSE);
            else done(false);
        })
    });
}