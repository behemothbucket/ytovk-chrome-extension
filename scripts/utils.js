import CONFIG from "./config.js";

async function handleUrls(tabId, tab) {
    if ((tab.url).match(CONFIG.OAUTH_TOKEN_PAGE_PATTERN)) {
        await chrome.action.setIcon({
            path: "img/icon_active.png",
        });
        generateNotification("Привязка аккаунта произошла успешно", 2500);
        await chrome.tabs.remove(tabId);
        return;
    }

    if ((tab.url).match(CONFIG.YOUTUBE_VIDEO_PAGE_PATTERN)) {
        await chrome.action.setBadgeText({
            text: "1",
            tabId: tabId,
        });
    } else {
        await chrome.action.setBadgeText({
            text: "",
            tabId: tabId,
        });
    }
}

function generateNotification(text, delay = 1500) {
    chrome.notifications.create("", {
            type: "basic",
            iconUrl: "img/icon_active.png",
            title: "YToVK",
            message: text,
        },
        (id) => {
            setTimeout(() => {
                chrome.notifications.clear(id);
            }, delay);
        },
    );
}

async function handleMessage(request) {
    if (request.type === "login") {
        await chrome.tabs.create({
            url: CONFIG.OAUTH_URL,
            active: true,
        });
    }
}


export {
    generateNotification,
    handleMessage,
    handleUrls,
};