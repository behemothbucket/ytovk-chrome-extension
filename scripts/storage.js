import { setPopup } from "./location.js";

function setToken(url) {
    const options = {};
    options.token = url.substring(url.indexOf("=") + 1, url.indexOf("&"));
    chrome.storage.sync.set(options);
    checkLoginState();
}

function getToken() {
    return chrome.storage.sync.get(["token"]);
}

function getStorageDownloads() {
    return chrome.storage.local.get(["downloads"]);
}

function saveTrackToDownloads(artist, shortTitle, url) {
    chrome.storage.local.get(["downloads"], (result) => {
        let downloads = result.downloads;
        downloads.push({ artist, shortTitle, url });
        chrome.storage.local.set({ downloads });
    });
}

function checkLoginState() {
    chrome.storage.sync.get(["token"], (res) => {
        if (res.token) {
            chrome.action.setIcon({
                path: "img/icon_active.png",
            });
            setPopup("popup/form/form.html");
        } else {
            chrome.action.setIcon({
                path: "img/icon_disabled.png",
            });
            setPopup("popup/auth/auth.html");
        }
    });
}

function initializeDownloadStore() {
    chrome.storage.local.set({ downloads: [] });
}

export {
    setToken,
    getToken,
    getStorageDownloads,
    saveTrackToDownloads,
    checkLoginState,
    initializeDownloadStore,
};
