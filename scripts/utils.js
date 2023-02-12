import { Config } from "./config.js";
import { setToken } from "./storage.js";

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

	if (request.type === "setPopup") {
		chrome.action.setPopup({ popup: request.path });
	}
	
	return true;
}


function setPopup(pathPopup) {
	chrome.action.setPopup({ popup: pathPopup });
}

// function downloadFromYoutubeMp3(url) {
// 	// Находим XSRF-TOKEN
// 		let XFSRCookie = document.cookie.match(new RegExp(
// 			"(?:^|; )" + "XSRF-TOKEN".replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)",
// 		));
// 		XFSRCookie = decodeURIComponent(XFSRCookie[1])
// 		console.log(XFSRCookie);
	
// 	// 'Атакуем' через CSRF (XSRF)
// 		fetch("https://mp3y.download/csrf", {
// 			"headers": {
// 				"accept": "application/json, text/plain, */*",
// 				"accept-language": "ru-RU,ru;q=0.9,en-RU;q=0.8,en;q=0.7,en-US;q=0.6",
// 				"sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
// 				"sec-ch-ua-mobile": "?0",
// 				"sec-ch-ua-platform": "\"Linux\"",
// 				"sec-fetch-dest": "empty",
// 				"sec-fetch-mode": "cors",
// 				"sec-fetch-site": "same-origin",
// 				"x-locale": "ru",
// 				"x-requested-with": "XMLHttpRequest",
// 				"x-xsrf-token": XFSRCookie,
// 			},
// 			"referrer": "https://mp3y.download/ru/307/mp3-converter",
// 			"referrerPolicy": "strict-origin-when-cross-origin",
// 			"body": null,
// 			"method": "GET",
// 			"mode": "cors",
// 			"credentials": "include",
// 		});
// 	// Получаем ссылку и скачиваем
// 		fetch("https://mp3y.download/download/start", {
// 			"headers": {
// 				"accept": "application/json, text/plain, */*",
// 				"accept-language": "ru-RU,ru;q=0.9,en-RU;q=0.8,en;q=0.7,en-US;q=0.6",
// 				"content-type": "application/json",
// 				"sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
// 				"sec-ch-ua-mobile": "?0",
// 				"sec-ch-ua-platform": "\"Linux\"",
// 				"sec-fetch-dest": "empty",
// 				"sec-fetch-mode": "cors",
// 				"sec-fetch-site": "same-origin",
// 				"x-locale": "ru",
// 				"x-requested-with": "XMLHttpRequest",
// 				"x-xsrf-token": XFSRCookie,
// 			},
// 			"referrer": "https://mp3y.download/ru/307/mp3-converter",
// 			"referrerPolicy": "strict-origin-when-cross-origin",
// 			"body": `{\"url\":\"${url}\",\"extension\":\"mp3\"}`,
// 			"method": "POST",
// 			"mode": "cors",
// 			"credentials": "include",
// 		}).then((response) => response.json())
// 			.then((response) => {
// 				let timer = setInterval(() => {
// 					let rawDownloadURL = "https://mp3y.download/download/" + response.data.uuid;
// 					fetch(rawDownloadURL, {
// 						"headers": {
// 							"accept": "application/json, text/plain, */*",
// 							"accept-language": "ru-RU,ru;q=0.9,en-RU;q=0.8,en;q=0.7,en-US;q=0.6",
// 							"if-none-match": "W/\"6f8c7ac43cd9f83a85ee115b39a63e69\"",
// 							"sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
// 							"sec-ch-ua-mobile": "?0",
// 							"sec-ch-ua-platform": "\"Linux\"",
// 							"sec-fetch-dest": "empty",
// 							"sec-fetch-mode": "cors",
// 							"sec-fetch-site": "same-origin",
// 							"x-locale": "ru",
// 							"x-requested-with": "XMLHttpRequest",
// 							"x-xsrf-token": XFSRCookie,
// 						},
// 						"referrer": "https://mp3y.download/ru/307/mp3-converter",
// 						"referrerPolicy": "strict-origin-when-cross-origin",
// 						"body": null,
// 						"method": "GET",
// 						"mode": "cors",
// 						"credentials": "include",
// 					})
// 						.then((response) => response.json())
// 						.then((response) => {
// 							if (response.data.fileUrl) {
// 								clearInterval(timer);
// 								window.location.href = response.data.fileUrl;
// 							}
// 						});
// 				}, 2000);
// 			});
// 			window.close()
// 	}
	

export {
	generateNotification,
	handleMessage,
	handleUrls,
	setPopup,
};