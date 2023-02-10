// Сделать нормально в ООП стиле

function downloadFromYoutubeMp3() {
// Находим XSRF-TOKEN
	let cookie = document.cookie.match(new RegExp(
		"(?:^|; )" + "XSRF-TOKEN".replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)",
	));
	cookie = cookie ? decodeURIComponent(cookie[1]) : undefined;
// 'Атакуем' через CSRF (XSRF)
	fetch("https://mp3y.download/csrf", {
		"headers": {
			"accept": "application/json, text/plain, */*",
			"accept-language": "ru-RU,ru;q=0.9,en-RU;q=0.8,en;q=0.7,en-US;q=0.6",
			"sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Linux\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-locale": "ru",
			"x-requested-with": "XMLHttpRequest",
			"x-xsrf-token": this.XFSRCookie,
		},
		"referrer": "https://mp3y.download/ru/307/mp3-converter",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include",
	});
// Получаем ссылку и скачиваем
	fetch("https://mp3y.download/download/start", {
		"headers": {
			"accept": "application/json, text/plain, */*",
			"accept-language": "ru-RU,ru;q=0.9,en-RU;q=0.8,en;q=0.7,en-US;q=0.6",
			"content-type": "application/json",
			"sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Linux\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-locale": "ru",
			"x-requested-with": "XMLHttpRequest",
			"x-xsrf-token": this.XFSRCookie,
		},
		"referrer": "https://mp3y.download/ru/307/mp3-converter",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": `{\"url\":\"${this.url}\",\"extension\":\"mp3\"}`,
		"method": "POST",
		"mode": "cors",
		"credentials": "include",
	}).then((response) => response.json())
		.then((response) => {
			let timer = setInterval(() => {
				let rawDownloadURL = "https://mp3y.download/download/" + response.data.uuid;
				fetch(rawDownloadURL, {
					"headers": {
						"accept": "application/json, text/plain, */*",
						"accept-language": "ru-RU,ru;q=0.9,en-RU;q=0.8,en;q=0.7,en-US;q=0.6",
						"if-none-match": "W/\"6f8c7ac43cd9f83a85ee115b39a63e69\"",
						"sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
						"sec-ch-ua-mobile": "?0",
						"sec-ch-ua-platform": "\"Linux\"",
						"sec-fetch-dest": "empty",
						"sec-fetch-mode": "cors",
						"sec-fetch-site": "same-origin",
						"x-locale": "ru",
						"x-requested-with": "XMLHttpRequest",
						"x-xsrf-token": this.XFSRCookie,
					},
					"referrer": "https://mp3y.download/ru/307/mp3-converter",
					"referrerPolicy": "strict-origin-when-cross-origin",
					"body": null,
					"method": "GET",
					"mode": "cors",
					"credentials": "include",
				})
					.then((response) => response.json())
					.then((response) => {
						if (response.data.fileUrl) {
							clearInterval(timer);
							window.location.href = response.data.fileUrl;
						}
					});
			}, 2000);
		});
}

export { downloadFromYoutubeMp3 };