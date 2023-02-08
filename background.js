import {
	generateNotification,
	handleMessage,
	handleUrls,
} from "./scripts/utils.js";

import { toggleIcon } from "./scripts/storage.js";

chrome.runtime.onInstalled.addListener((details) => {
	//TODO Сделать проверку
	if (details?.reason === "install") {
		generateNotification("Спасибо за установку!");
	}
	chrome.action.setPopup({ popup: "popup/button/button.html" });
});

chrome.runtime.onStartup.addListener(toggleIcon);

chrome.tabs.onUpdated.addListener(handleUrls);

chrome.runtime.onMessage.addListener(handleMessage);
