function saveToken(url) {
	const options = {};
	options.access_token = url.substring(url.indexOf("=") + 1);

	chrome.storage.sync.set(options);
	chrome.storage.sync.get(["access_token"], (res) => {
		console.log("ваш токен zzZZzzzZ 🐝 " + res.access_token);
	});

	toggleIcon();
}

function toggleIcon() {
	chrome.storage.sync.get(["access_token"], (res) => {
		if (res.access_token) {
			chrome.action.setIcon({
				path: "img/icon_active.png",
			});
			chrome.action.setPopup({ popup: "popup/form/form.html" });
		} else {
			chrome.action.setIcon({
				path: "img/icon_disabled.png",
			});
		}
	});
}

export { saveToken, toggleIcon };