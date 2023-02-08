import { Config } from "../../scripts/config.js";

let inputURL = document.getElementById("URL");
let labelUrlInput = document.getElementById("url_label");
let labelTitle = document.getElementById("title_label");

chrome.tabs.query({
	active: true,
	currentWindow: true,
}, (tabs) => {
	if (tabs[0].url?.match(Config.YOUTUBE_VIDEO_PAGE_PATTERN)) {
		inputURL.value = tabs[0].url;
		labelUrlInput.innerHTML = `<button class="yt_label button" tabindex="-1">
<i class="icon-youtube-play" aria-hidden="true" style="font-size: 16px;"></i>&nbsp;YouTube</button>`;
		setTimeout(() => {
			inputURL.setSelectionRange(0, 0);
			inputURL.focus();
		}, 200);
		setTimeout(() => {
			labelTitle.focus();
		}, 600);
	}
});

let wrapperForm = document.querySelector(".wrapper");
let buttonClear = document.querySelector(".button_clear");
let buttonDownload = document.querySelector(".button_download");
let inputs = document.querySelectorAll(".input");
let errorIcons = document.querySelectorAll(".icon-info-circled");

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
		if (!!input.value) {
			totalValidInputs++;
		} else {
			input.style.borderColor = "#cf222e";
			input.classList.add("invalid");
			input.nextElementSibling.style.zIndex = "0";
		}
	}

	if (totalValidInputs === 3) alert("Вы не вошли в аккаунт");

});

function disableErrorIcons() {
	errorIcons.forEach(icon => {
		icon.style.zIndex = "-1";
	});
}

inputs.forEach(input => {
	input.addEventListener("change", () => {
		if (!!input.value) {
			input.style.borderColor = "#d1d5da";
			input.classList.remove("invalid");
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

