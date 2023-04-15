chrome.runtime.sendMessage({ type: "setBadge" });

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

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
	if (request.type === "validateVideo") {
		if (isNotValidVideo()) {
			sendResponse({ valid: false });
		} else {
			sendResponse({ valid: true , url: window.location.href });
		}
	}
});
