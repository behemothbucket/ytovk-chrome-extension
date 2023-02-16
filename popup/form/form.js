import { Config } from "../../scripts/config.js";
import { getToken } from "../../scripts/storage.js";

let inputURL = document.querySelector("input[name='URL']");
let labelUrlInput = document.getElementById("url_label");
let inputTitle = document.querySelector("input[name='title']");
let buttonClear = document.querySelector(".button_clear");
let buttonDownload = document.querySelector(".button_download");
let inputs = document.querySelectorAll("input");
let errorIcons = document.querySelectorAll(".icon-info-circled");
let playlistButton = document.querySelector(".vk_playlist_button");
let artistInput = document.querySelector("input[name='artist']");
let playlistFormButton = document.querySelector(".playlist_form_button");

checkCurrentVideoForDownload();

buttonClear.addEventListener("click", () => {
	for (const input of inputs) {
		input.value = "";
		input.style.borderColor = "#d1d5da";
		input.classList.remove("invalid");
		disableErrorIcons();
	}
});

buttonDownload.addEventListener("click", () => {
	let totalValidInputs = 0;

	for (const input of inputs) {
		if (input.value) {
			totalValidInputs++;
		} else {
			input.style.borderColor = "#cf222e";
			input.classList.add("invalid");
			input.nextElementSibling.style.zIndex = "0";
		}
	}

	if (totalValidInputs === 3) {
		chrome.tabs.query({
			active: true,
			currentWindow: true, }, (_) => {
			let baseUrl = "https://youtovk.ru/download?url=";
			let queryUrl = inputURL.value;
			let queryArtist = artistInput.value;
			let queryTitle = inputTitle.value;
			let url = `${baseUrl}${queryUrl}&artist=${queryArtist}&shortTitle=${queryTitle}`;
			window.open(url, "_parent");
		});
	}
});

function disableErrorIcons() {
	errorIcons.forEach(icon => {
		icon.style.zIndex = "-1";
	});
}

inputs.forEach(input => {
	input.addEventListener("input", () => {
		if (input.value) {
			input.style.borderColor = "#d1d5da";
			input.classList.remove("invalid");
		} else {
			input.style.borderColor = "#cf222e";
			input.classList.add("invalid");
		}
	});
	input.addEventListener("click", () => {
		input.nextElementSibling.style.zIndex = "-1";
	});
});

window.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		event.target.classList.add("active");
		event.target.click();
		setTimeout(() => {
			event.target.classList.remove("active");
		}, 100);
	}
});

inputURL.addEventListener("keyup", async () => {
	if (inputURL.value === "get_token") {
		getToken();
		inputURL.value = "";
	}
});

playlistButton.addEventListener("click", () => {
	let currentUrl = window.location.href;
	let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
	let pathPopup = "popup/playlist/playlist.html";
	window.location.href = rawPath + pathPopup;
	chrome.runtime.sendMessage({
		type: "setPopup",
		path: pathPopup,
	});
});

function checkCurrentVideoForDownload() {
	chrome.tabs.query({
		active: true,
		currentWindow: true, }, async (tabs) => {
		if (tabs[0].url?.match(Config.YOUTUBE_VIDEO_PAGE_PATTERN)) {
			const response = await chrome.tabs.sendMessage(tabs[0].id, { type: "isNotValidVideo" });
			if (await response.isNotValidVideo) {
				renderInvalidVideoForm();
			} else {
				renderValidVideoForm(tabs[0]);
			}
		}
	});
}

function renderValidVideoForm(tab) {
	inputURL.value = tab.url;
	labelUrlInput.innerHTML = `<button class="yt_label button" tabindex="-1">
<i class="icon-youtube-play" aria-hidden="true" style="font-size: 16px;"></i>&nbsp;YouTube</button>`;
	setTimeout(() => {
		inputURL.setSelectionRange(0, 0);
		inputURL.focus();
	}, 200);
	setTimeout(() => {
		inputTitle.focus();
	}, 600);
}

function renderInvalidVideoForm() {
	let form = document.querySelector(".form");
	form.innerHTML = "<strong style='color: #000';>⚠️ Warning<br><br>Video length <= 6min 0s<br>NO Stream<br><br>Slow server :(</strong>";
	playlistButton.style.marginTop = "10px";
	form.appendChild(playlistFormButton);
}