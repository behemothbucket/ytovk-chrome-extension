import CONFIG from "./config.js";

function handleTokenUrl(tabId, changeInfo, tab) {
	if ((tab.url).match(CONFIG.OAUTH_TOKEN_PAGE_PATTERN) && changeInfo.url) {
		chrome.action.setIcon({
			path: "img/icon_active.png",
		});
		generateNotification("Привязка аккаунта произошла успешно", 2500);
		chrome.tabs.remove(tabId);
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

function handleMessage(request) {
	if (request.type === "login") {
		chrome.tabs.create({
			url: CONFIG.OAUTH_URL,
			active: true,
		});
	}
}


export {
	generateNotification,
	handleMessage,
	handleTokenUrl,
};