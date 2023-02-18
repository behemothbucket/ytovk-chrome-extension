import { setPopup } from "./utils.js";

function setToken(token) {
	chrome.storage.sync.set({
		token
	});
	checkLoginState();
}

function showToken() {
	chrome.storage.sync.get(["token"], (res) => {
		alert(res.token + "\n                                                          " +
		"         zZz🐝zzzZ");
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

export { setToken, showToken, checkLoginState };