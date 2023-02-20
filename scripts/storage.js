import { setPopup } from "./utils.js";

function setToken(url) {
	const options = {};
	options.token = url.substring(url.indexOf("=") + 1, url.indexOf("&"));
	chrome.storage.sync.set(options);
	checkLoginState();
}

function showToken() {
	chrome.storage.sync.get(["token"], (res) => {
		alert(res.token);
	});
}

function saveTrack(artist, shortTitle, url) {
	chrome.storage.local.get(["downloads"], (result) => {
		let downloads = result.downloads;
		if (!downloads[artist]) {
			downloads[artist] = { [shortTitle]: url };
		} else {
			downloads[artist] = Object.assign(downloads[artist], { [shortTitle]: url } );
		}
		chrome.storage.local.set({ downloads });
	});
}

function checkLoginState() {
	chrome.storage.sync.get(["token"], (res) => {
		if (res.token) {
			chrome.action.setIcon({
				path: "img/icon_active.png",
			});
			setPopup("popup/form/form.html");
		} else {
			chrome.action.setIcon({
				path: "img/icon_disabled.png",
			});
			setPopup("popup/auth/auth.html");
		}
	});
}

function createDownloadsStore() {
	chrome.storage.local.set({ downloads: {} });
}

export { 
	setToken, 
	showToken, 
	saveTrack, 
	checkLoginState, 
	createDownloadsStore 
};