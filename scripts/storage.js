function saveToken(url) {
	const token = { access_token: url.substring(url.indexOf("=") + 1) };

	chrome.storage.sync.set(token, () => {
	});

	chrome.storage.sync.get(["access_token"], (res) => {
		console.log(res.access_token);
	});
}

function setActiveIcon() {
	chrome.storage.sync.get(["access_token"], (res) => {
		if (res.access_token) {
			chrome.action.setIcon({
				path: "img/icon_active.png",
			});
		}
	});
}

export { saveToken, setActiveIcon };