import CONFIG from "./scripts/config.js";

import {
    generateNotification,
    handleAuthTokenPage,
    toggleIcon,
} from "./scripts/utils.js";

chrome.runtime.onInstalled.addListener((details) => {
    if (details?.reason === "install") {
        generateNotification("Спасибо за установку!");
    }
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.type === "login") {
        chrome.tabs.create({
            url: CONFIG.oauthUrl,
            active: true,
        });
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(toggleIcon);
chrome.webNavigation.onBeforeNavigate.addListener(handleAuthTokenPage);