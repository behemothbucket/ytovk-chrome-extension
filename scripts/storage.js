import { setPopup } from "./utils.js";

function setToken(url) {
	const options = {};
	options.access_token = url.substring(url.indexOf("=") + 1);

	chrome.storage.sync.set(options);

	checkLoginState();
}

function getToken() {
	chrome.storage.sync.get(["access_token"], (res) => {
		// \t not working good in alerts
		alert(res.access_token + "\n" +
			"                                                           " +
			"zzZZzzzZ 🐝");
	});
}

function checkLoginState() {
	chrome.storage.sync.get(["access_token"], (res) => {
		if (res.access_token) {
			chrome.action.setIcon({
				path: "img/icon_active.png",
			});
			setPopup("popup/form/form.html");
		} else {
			chrome.action.setIcon({
				path: "img/icon_disabled.png",
			});
			setPopup("popup/button/button.html");
		}
	});
}


export { setToken, getToken, checkLoginState };