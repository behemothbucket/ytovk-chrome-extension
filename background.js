import {
	generateNotification,
	handleMessage,
	handleUrls,
} from "./scripts/utils.js";

import { checkLoginState } from "./scripts/storage.js";

chrome.runtime.onInstalled.addListener((details) => {
	if (details?.reason === "install") {
		generateNotification("Спасибо за установку!");
	}
	checkLoginState();
});

chrome.runtime.onStartup.addListener(checkLoginState);

chrome.tabs.onUpdated.addListener(handleUrls);

chrome.runtime.onMessage.addListener(handleMessage);
