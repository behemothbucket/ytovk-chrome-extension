/* eslint-disable no-undef */
import { Config } from "../../scripts/config.js";

//TODO Вынести переиспользуемые функции в helpers

let buttonBack = document.querySelector(".button_back");
let inputUrl = document.querySelector("#URL-playlist");
let buttonLoad = document.querySelector(".button_load");
let errorMessage = document.querySelector(".error_message");

chrome.storage.sync.get(["playlist"], (result) => {
	try {
		VK.Widgets.Playlist("vk_playlist", result.playlist.ownerId, result.playlist.playlistId);
	} catch (e) {
		console.log(e);
	}
});

function showPlaylist(parameters) {
	let [, ownerId, playlistId] = parameters;
	chrome.storage.sync.set({ playlist: { ownerId, playlistId } });
	VK.Widgets.Playlist("vk_playlist", ownerId, playlistId);
}

buttonBack.addEventListener("click", () => {
	let currentUrl = window.location.href;
	let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
	let pathPopup = "popup/form/form.html";
	window.location.href = rawPath + pathPopup;
	chrome.runtime.sendMessage({
		type: "setPopup",
		path: pathPopup,
	});
});

inputUrl.addEventListener("input", checkInputValue);

inputUrl.addEventListener("click", () => {
	inputUrl.nextElementSibling.style.zIndex = "-1";
	errorMessage.style.display = "none";
});

buttonLoad.addEventListener("click", () => {
	if ((inputUrl.value).match(Config.VK_PLAYLIST_ALBUM_PATTERN)) {
		removeIframes();
		checkInputValue();
		showPlaylist(getParametersOfUrl());
		errorMessage.style.display = "none";
		inputUrl.style.borderColor = "#d1d5da";
	} else {
		errorMessage.style.display = "revert";
		inputUrl.classList.add("invalid");
		inputUrl.style.borderColor = "#cf222e";
	}
});

function getParametersOfUrl() {
	return inputUrl.value.match(Config.VK_PLAYLIST_ALBUM_PATTERN);
}

function checkInputValue() {
	if (inputUrl.value) {
		inputUrl.style.borderColor = "#d1d5da";
		inputUrl.classList.remove("invalid");
	} else {
		inputUrl.style.borderColor = "#cf222e";
		inputUrl.classList.add("invalid");
	}
}

function removeIframes() {
	let elements = document.getElementsByTagName("iframe");

	while (elements.length) {
		elements[0].parentNode.removeChild(elements[0]);
	}
}