import { Config } from "../../scripts/config.js";

let backButton = document.querySelector(".button_back");
let urlInput = document.querySelector("#URL-playlist");
let loadButton = document.querySelector(".button_load");
let errorMessage = document.querySelector(".error_message");

chrome.storage.sync.get(["playlist"], (result) => {
		try {
			VK.Widgets.Playlist("vk_playlist", result.playlist.ownerId, result.playlist.playlistId);
		} catch (e) {
			console.log(e);
		}
	},
);

function showPlaylist(parameters) {
	let [, ownerId, playlistId] = parameters;
	chrome.storage.sync.set({ playlist: { ownerId, playlistId } });
	VK.Widgets.Playlist("vk_playlist", ownerId, playlistId);
}

backButton.addEventListener("click", () => {
	let currentUrl = window.location.href;
	let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
	let pathPopup = "popup/form/form.html";
	window.location.href = rawPath + pathPopup;
	chrome.runtime.sendMessage({
		type: "setPopup",
		path: pathPopup,
	});
});

urlInput.addEventListener("input", checkInputValue);

urlInput.addEventListener("click", () => {
	urlInput.nextElementSibling.style.zIndex = "-1";
	errorMessage.style.display = "none";
});

loadButton.addEventListener("click", () => {
	if (!!(urlInput.value).match(Config.VK_PLAYLIST_ALBUM_PATTERN)) {
		removeIframes();
		checkInputValue();
		showPlaylist(getParametersOfUrl());
		errorMessage.style.display = "none";
		urlInput.style.borderColor = "#d1d5da";
	} else {
		errorMessage.style.display = "revert";
		urlInput.classList.add("invalid");
		urlInput.style.borderColor = "#cf222e";
	}
});

function getParametersOfUrl() {
	return urlInput.value.match(Config.VK_PLAYLIST_ALBUM_PATTERN);
}

function checkInputValue() {
	if (!!urlInput.value) {
		urlInput.style.borderColor = "#d1d5da";
		urlInput.classList.remove("invalid");
	} else {
		urlInput.style.borderColor = "#cf222e";
		urlInput.classList.add("invalid");
	}
}

function removeIframes() {
	let elements = document.getElementsByTagName("iframe");

	while (elements.length) {
		elements[0].parentNode.removeChild(elements[0]);
	}
}