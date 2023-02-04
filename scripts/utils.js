function handleAuthTokenPage(tabInfo) {
    const isOauthTokenPage = tabInfo.url?.match(/oauth\.vk\.com\/blank\.html/);
    if (isOauthTokenPage) {
        chrome.tabs.remove(tabInfo.tabId);
        generateNotification("Привязка аккаунта произошла успешно");
    }
}

function toggleIcon(details) {
    const isYoutubeVideoPage = details.url?.match(/watch/);

    if (isYoutubeVideoPage) {
        chrome.action.setIcon({
            path: "img/icon_active.png", tabId: details.tabId,
        });
    } else {
        chrome.action.setIcon({
            path: "img/icon_disabled.png", tabId: details.tabId,
        });
    }
}

function generateNotification(text) {
    chrome.notifications.create("greeting",
        {
            type: "basic",
            iconUrl: "img/icon_active.png",
            title: "YToVK",
            message: text,
        },
        (id) => {
            setTimeout(() => {
                chrome.notifications.clear(id);
            }, 1500);
        },
    );
}

export { generateNotification, handleAuthTokenPage, toggleIcon };