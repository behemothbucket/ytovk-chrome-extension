import {
	generateNotification,
	handleMessage,
	handleUrls,
} from "./scripts/utils.js";

chrome.runtime.onInstalled.addListener((details) => {
	//TODO Сделать проверку
	if (details?.reason === "install") {
		generateNotification("Спасибо за установку!");
	}
});

chrome.tabs.onUpdated.addListener(handleUrls);

chrome.runtime.onMessage.addListener(handleMessage);
