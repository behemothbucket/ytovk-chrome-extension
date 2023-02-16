import { setPopup } from "./utils.js";

function setToken(token) {
	chrome.storage.sync.set({
		token
	});
	checkLoginState();
}

function getToken() {
	chrome.storage.sync.get(["token"], (res) => {
		// \t not working good in alerts
		alert(res.access_token + "\n" +
			"                 	                                          " +
			"zzZZzzzZ 🐝");
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


export { setToken, getToken, checkLoginState };