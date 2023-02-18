import { setToken } from "./storage.js";

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

function handleMessage(request, sender, _sendResponse) {
	if (request.token) setToken(request.token);

	if (request.type === "setPopup") chrome.action.setPopup({ popup: request.path });
	
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

	
	return true;
}


function setPopup(pathPopup) {
	chrome.action.setPopup({ popup: pathPopup });
}

export {
	generateNotification,
	handleMessage,
	setPopup,
};