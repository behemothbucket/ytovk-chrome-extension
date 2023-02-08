import Config from "./config.js";
import { saveToken } from "./storage.js";

function handleUrls(tabId, changeInfo, tab) {
	if ((tab.url).match(Config.OAUTH_TOKEN_PAGE_PATTERN) && changeInfo.url) {
		saveToken(tab.url);
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

function handleMessage(request, sender, sendResponse) {
	if (request.type === "login") {
		chrome.tabs.create({
			url: Config.OAUTH_URL,
			active: true,
		});
	}

	if (request.type === "setBadge") {
		chrome.action.setBadgeText({
			text: "YT",
			tabId: sender.tab.id,
		});
		chrome.action.setBadgeBackgroundColor({
			color: "#cf222e",
			tabId: sender.tab.id,
		});
	}
}

export {
	generateNotification,
	handleMessage,
	handleUrls,
};