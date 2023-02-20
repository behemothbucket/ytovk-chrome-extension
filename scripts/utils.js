import { Config } from "./config.js";
import { setToken } from "./storage.js";
import { saveTrack } from "./storage.js";

function handleUrls(tabId, changeInfo, tab) {
	if ((tab.url).match(Config.OAUTH_TOKEN_PAGE_PATTERN) && changeInfo.url) {
		setToken(tab.url);
		generateNotification("Привязка аккаунта произошла успешно", 2500);
		chrome.tabs.remove(tabId);
		return true;
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

	if (request.type === "downloadTrack") {
		chrome.downloads.download({
			filename: request.filename,
			url: request.url,
		});
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
		const headers =  { 
			"Accept": "application/json",
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch("http://youtovk.ru/save", { method: "POST", body, headers });
			const json = await response.json();

			if (response.ok) {
				generateNotification("Успешно сохранено");
				saveTrack(artist, shortTitle, json.url);
				// Игнорируем ошибку если пользователь закрыл popup, аудио все равно сохранится,
				// а эта ошибка будет указывать на то, что некому принимать сообщение на стороне popup, 
				// оно и понятно, ведь когда popup закрыт onMessage лисенер не работает
				chrome.runtime.sendMessage({ type: "audioSaved" }).catch(error => console.log(error));
			} else {
				generateNotification(`Неудача, код ошибки: ${response.status}`);
			}
		} catch (error) {
			generateNotification("Failed to save");
		}
	});
}

export {
	generateNotification,
	handleMessage,
	handleUrls,
	setPopup,
};