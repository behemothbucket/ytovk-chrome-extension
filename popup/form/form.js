import { Config } from "../../scripts/config.js";
import { showToken } from "../../scripts/storage.js";

let inputURL = document.querySelector("input[name='URL']");
let inputTitle = document.querySelector("input[name='title']");
let buttonClear = document.querySelector(".button_clear");
let buttonSave = document.querySelector(".button_save");
let inputs = document.querySelectorAll("input");
let errorIcons = document.querySelectorAll(".icon-info-circled");
let playlistButton = document.querySelector(".vk_playlist_button");
let artistInput = document.querySelector(".input[name='artist']");
let loadStateElements = document.querySelectorAll(".load_state");
let playlistFormButton = document.querySelector(".playlist_form_button");
let labelUrlInput = document.getElementById("url_label");

(async () => {
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

	if (tab.url.match(Config.YOUTUBE_VIDEO_PAGE_PATTERN)) {
		const response = await chrome.tabs.sendMessage(tab.id, { type: "validateVideo" });	
		if (await response.valid === false) { 
			renderInvalidVideoForm();
		} else {
			renderValidVideoForm(response.url);

		}	
	}
})();

buttonClear.addEventListener("click", () => {
	for (const input of inputs) {
		input.value = "";
		input.style.borderColor = "#d1d5da";
		input.classList.remove("invalid");
		disableErrorIcons();
	}
});

buttonSave.addEventListener("click", () => {
	let totalValidInputs = 0;
	let url = inputURL.value;

	for (const input of inputs) {
		if (input.value) {
			totalValidInputs++;
		} else {
			input.style.borderColor = "#cf222e";
			input.classList.add("invalid");
			input.nextElementSibling.style.zIndex = "0";
		}
	}

	if (totalValidInputs === 3 && url.match(Config.YOUTUBE_VIDEO_PAGE_PATTERN)) {
		chrome.storage.sync.get(["token"], async (result) => {
			let artist = artistInput.value;
			let shortTitle = inputTitle.value;
			let token = result.token;
			formState(0.5, "Loading...", "wait");

			const response = await fetch("http://localhost:4000/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url,
					token,
					artist,
					shortTitle
				})
			});
			
			const statusCode = await response.status;

			if (await statusCode === 200) {
				alert("Загружено! 😃");
			} else {
				alert("Ошибка( 😥");
			}

			await delay(1000).then(() => formState(1, "Save", "normal"));
		});
	} else {
		inputURL.style.borderColor = "#cf222e";
		inputURL.classList.add("invalid");
		inputURL.nextElementSibling.style.zIndex = "0";
	}
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
		showToken();
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

function formState(opacity, statusText, cursor) {
	for (let elem of loadStateElements) {
		elem.style.opacity = opacity;
		elem.disabled = true;
		elem.style.cursor = cursor;
	}
	buttonSave.textContent = statusText;
}

function renderValidVideoForm(url) {
	inputURL.value = url;
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
