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

function handleMessage(request, sender, sendResponse) {
	if (request.token) setToken(request.token);

	if (request.type === "setPopup") chrome.action.setPopup({ popup: request.path });
	
	if (request.type === "getToken") {
		chrome.storage.sync.get(["token"], res => {
			sendResponse({
				token: res.token,
			});
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

	if (request.type === "saveAudioToVK") {
		saveAudioToVK(request.url, request.artist, request.shortTitle);
	}

	// return true;
}

function setPopup(pathPopup) {
	chrome.action.setPopup({ popup: pathPopup });
}

function saveAudioToVK(url, artist, shortTitle) {
	chrome.storage.sync.get(["token"], async result => {
		const token = result.token;
		const body = JSON.stringify({
			url,
			token,
			artist,
			shortTitle
		});
		const headers =  { "Content-Type": "application/json" };

		try {
			const response = await fetch("http://youtovk.ru/save", { method: "POST", body, headers });

			if (response.ok) {
				generateNotification("Saved successfully");
			} else {
				generateNotification(`Failed to save (${response.status})`);
			}
		} catch (error) {
			generateNotification("Failed to save");
		} finally {
			chrome.runtime.sendMessage({ type: "audioSaved" });
		}
	});
}


export {
	generateNotification,
	handleMessage,
	setPopup,
};