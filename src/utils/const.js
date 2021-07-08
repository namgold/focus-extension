export const DEFAULT = {
    blockWebsites: [
        { url: "facebook.com", active: true },
        { url: "youtube.com", active: false },
        { url: "twitter.com", active: true },
        { url: "reddit.com", active: true },
        { url: "pinterest.com", active: true },
        { url: "vimeo.com", active: true },
        { url: "tumblr.com", active: true },
        { url: "instagram.com", active: true },
        { url: "tiktok.com", active: true },
        { url: "quora.com", active: true },
        { url: "yahoo.com", active: true },
        { url: "netflix.com", active: true },
        { url: "voz.vn", active: true },
        { url: "o.voz.vn", active: true },
    ],
    // timeTracker: [],
    // elapsed: 0,
    pausedActivated: {
        timestamp: 0,
        pauseAmount: 5,
        resetAmount: 30,
    },
    pauseAmount: 5,
    resetAmount: 30,
    activated: true,
}

export const storage = chrome.storage.sync;