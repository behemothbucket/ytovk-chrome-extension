import {
	generateNotification,
	handleMessage,
	handleUrls,
} from "./scripts/utils.js";

import { checkLoginState, createDownloadsStore } from "./scripts/storage.js";

chrome.runtime.onInstalled.addListener((details) => {
	if (details?.reason === "install") {
		generateNotification("Спасибо за установку!");
	}
	checkLoginState();
	createDownloadsStore();
});

chrome.tabs.onUpdated.addListener(handleUrls);

chrome.runtime.onStartup.addListener(checkLoginState);

chrome.runtime.onMessage.addListener(handleMessage);
