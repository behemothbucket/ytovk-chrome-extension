import {
    generateNotification,
    handleMessage,
    handleUrls,
} from "./scripts/utils.js";

chrome.runtime.onInstalled.addListener((details) => {
    if (details?.reason === "install") {
        generateNotification("Спасибо за установку!");
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url) await handleUrls(tabId, tab);
});

chrome.runtime.onMessage.addListener(handleMessage);
