import {
	generateNotification,
	handleMessage,
	handleTokenUrl,
} from "./scripts/utils.js";

chrome.runtime.onInstalled.addListener((details) => {
	//TODO Сделать проверку
	if (details?.reason === "install") {
		generateNotification("Спасибо за установку!");
	}
});

chrome.tabs.onUpdated.addListener(handleTokenUrl);

chrome.runtime.onMessage.addListener(handleMessage);
