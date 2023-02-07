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


chrome.webNavigation.onHistoryStateUpdated.addListener(showSaveToVkButton, {
	url:
		[
			{ hostContains: "youtube.com" },
		],
});

function showSaveToVkButton(details) {
	chrome.scripting.executeScript({
		target: { tabId: details.tabId },
		files: ["content.js"],
	});
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.url) await handleUrls(tabId, tab);
});

chrome.runtime.onMessage.addListener(handleMessage);
