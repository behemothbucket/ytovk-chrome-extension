import { createDownloadsStore } from "../../scripts/storage.js";
//TODO Вынести переиспользуемые функции в helpers

let buttonBack = document.querySelector(".button_back");
let buttonDeleteAll = document.querySelector(".button_delete_all");
let downloads = document.querySelector(".downloads");
let navButtons = document.querySelector(".nav_buttons");

buttonDeleteAll.addEventListener("click", () => {
    createDownloadsStore();
    document
        .querySelectorAll(".track_wrapper")
        .forEach((track) => track.remove());
    if (!document.querySelector(".empty_downloads_wrapper"))
        showEmptyDownloadsText();
});

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

function showDownloads() {
    chrome.storage.local.get(["downloads"]).then((result) => {
        let downloads = result.downloads;

        if (Object.keys(downloads).length === 0 || downloads === undefined) {
            showEmptyDownloadsText();
            return;
        }

        renderTracks(downloads);
    });
}

function showEmptyDownloadsText() {
    let emptyDownloadsTextDiv = document.createElement("div");
    emptyDownloadsTextDiv.classList.add("empty_downloads_wrapper");
    emptyDownloadsTextDiv.innerHTML =
        "<span class='empty_downloads_text'>No downloads</span>";
    downloads.appendChild(emptyDownloadsTextDiv);
}

function renderTracks(downloads) {
    for (let artist in downloads) {
        for (let shortTitle in downloads[artist]) {
            let trackWrapper = document.createElement("div");
            trackWrapper.classList.add("track_wrapper");
            trackWrapper.innerHTML = `
	<span class="track_info">
		<span class="title">${shortTitle}</span> <br>
		<span class="artist">${artist}</span>
	</span>
	<button data-url="${downloads[artist][shortTitle]}" class="button button_download">Download</button>
	`;
            insertAfter(navButtons, trackWrapper);
            document
                .querySelector(".button_download")
                .addEventListener("click", downloadTrack);
        }
    }
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function downloadTrack(event) {
    let { artist, title, url } = getTrackInfo(event.target);
    let filename = `${artist} - ${title}.mp3`.replace(
        /[`~!@#$%^&*()_|+=?;:'",<>{}[\]\\/]/gi,
        ""
    );
    chrome.runtime.sendMessage({ type: "downloadTrack", filename, url });
}

function getTrackInfo(track) {
    let url = track.dataset.url;
    let artist = track
        .querySelector(".track_info")
        .querySelector(".artist").textContent;
    let title = track
        .querySelector(".track_info")
        .querySelector(".title").textContent;
    return { artist, title, url };
}

showDownloads();
