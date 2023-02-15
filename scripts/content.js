(() => {
	new MutationObserver(function() {
		if (document.getElementsByClassName("item style-scope ytd-watch-metadata")[0]){
			attachVKButton();
		}
		this.disconnect();
	}).observe(document, {
		childList: true, subtree: true,
	});
})();


function attachVKButton() {

	chrome.runtime.sendMessage({ type: "setBadge" });
	
	if (document.querySelector("#shadow")) return;

	const ownerDiv = document.querySelector("div#owner");

	// Делаю стили здесь, потому что если добавлять их в shadow-DOM при перезагрузке страницы,
	// мы увидим как рендерится кнопка. (Так же пробовал делать через добавление стилей к самой странице)
	let styles = `
	.VK_download_button {
	font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    margin-left: 15px;
	margin-right: 25px;
    padding: 0 16px;
    border-radius: 8px;
    height: 30px;
    white-space: nowrap;
    line-height: 16px;
    text-align: center;
    border: 0;
    outline: 0;
    background-image: -webkit-linear-gradient(top, #2c74c9, #295192);
    background-image: -moz-linear-gradient(top, #2c74c9, #295192);
    background-image: -ms-linear-gradient(top, #2c74c9, #295192);
    background-image: -o-linear-gradient(top, #2c74c9, #295192);
    background-image: linear-gradient(top, #2c74c9, #295192);
    box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transition: background-color 0.15s ease-in-out;
   }
   
	.VK_download_button:active {
	background-image: -webkit-linear-gradient(top, #225b9f, #23467f);
	background-image: -moz-linear-gradient(top, #225b9f, #23467f);
	background-image: -ms-linear-gradient(top, #225b9f, #23467f);
	background-image: -o-linear-gradient(top, #225b9f, #23467f);
	background-image: linear-gradient(top, #225b9f, #23467f);
    box-shadow: inset 0 0 0 1px #17407d;
    transform: scale(99%);
	`;

	const VKButtonStyleSheet = document.createElement("style");
	VKButtonStyleSheet.innerText = styles;
	document.head.appendChild(VKButtonStyleSheet);

	const downloadButton = document.createElement("button");
	downloadButton.setAttribute("class", "VK_download_button");
	downloadButton.innerText = "Save as MP3";

	downloadButton.addEventListener("click", () => {
		if (isNotValidVideo()) {
			generateWarningMessage();
			return;
		}

		let baseUrl = "https://youtovk.ru/download?url=";
		let queryUrl = window.location.href;
		let url = baseUrl + queryUrl;
		window.open(url, "_parent");
	});

	ownerDiv.appendChild(downloadButton);
}

function isNotValidVideo() {
	let hours, minutes;

	let totalLengthText = document.querySelector(".ytp-progress-bar")
		.getAttribute("aria-valuetext")
		.match(/\(.*?\)/)[0];

	let hms = totalLengthText.match(/\d+\s.(?=.)/gm)
		.map(string => parseInt(string));

	hms.length === 3 ? [hours, minutes,] = hms : [minutes,] = hms;

	return document.querySelector(".ytp-live-badge").checkVisibility() || hours > 0 || minutes >= 6;
}
	
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === "isNotValidVideo") {
		sendResponse({ isNotValidVideo: isNotValidVideo() } );
	}
});

function generateWarningMessage() {
	let videoTitle = document.querySelector("h1.style-scope.ytd-watch-metadata");
	let warningDiv = document.createElement("div");
	warningDiv.setAttribute("class", "warningVK");
	videoTitle.style.marginBottom = "10px";
	warningDiv.innerHTML = "<span style='font-size: 1.5rem'>⚠️ Warning: Video length <= 6min 0s | NO Stream | Slow server :(</span>";    
	videoTitle.parentNode.appendChild(warningDiv);
	setTimeout(() => document.querySelector(".warningVK").remove(), 2500);
}