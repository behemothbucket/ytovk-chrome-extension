import { Config } from "../../scripts/config.js";
import { showToken } from "../../scripts/storage.js";

let buttonClear = document.querySelector(".button_clear");
let buttonSave = document.querySelector(".button_save");
let inputs = document.querySelectorAll("input");
let buttons = document.querySelectorAll("button");
let errorIcons = document.querySelectorAll(".icon-info-circled");
let buttonPlaylist = document.querySelector(".downloads_button");
let formButtonPlaylist = document.querySelector(".downloads_form_button");
let labelInputUrl = document.getElementById("url_label");
let inputURL = document.getElementById("url");
let inputTitle = document.getElementById("title");
let inputArtist = document.getElementById("artist");

(async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    if (checkYtUrl(tab.url)) {
        chrome.tabs
            .sendMessage(tab.id, { type: "validateVideo" })
            .then((result) => {
                if (result.valid) {
                    renderValidVideoForm(tab.url);
                } else {
                    renderInvalidVideoForm();
                }
            })
            .catch(() => console.log("Probably popup is closed"));
    }
})();

const checkYtUrl = (url) => url.match(Config.YOUTUBE_VIDEO_PAGE_PATTERN);

buttonClear.addEventListener("click", () => {
    for (const input of inputs) {
        input.value = "";
        input.style.borderColor = "#d1d5da";
        input.classList.remove("invalid");
        disableErrorIcons();
    }
});

// TODO
// убрать эту огромную логику в отдельную функцию
// постараться распределить переиспользуемые функции в отдельный модуль
// а ЛУЧШЕ? сделать все в ООП стиле, и наследовать от главного класса (Page Factory???)
buttonSave.addEventListener("click", async () => {
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
        if (checkYtUrl(inputURL.value)) {
            await chrome.runtime
                .sendMessage({
                    type: "saveAudioToVK",
                    url: inputURL.value,
                    artist: inputArtist.value,
                    shortTitle: inputTitle.value,
                })
                .catch(() => console.log("Probably popup is closed"));
            let currentUrl = window.location.href;
            let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
            let pathPopup = "popup/loading/loading.html";
            window.location.href = rawPath + pathPopup;
            await chrome.runtime
                .sendMessage({
                    type: "setPopup",
                    path: pathPopup,
                })
                .catch(() => console.log("Probably popup is closed"));
        } else {
            inputURL.style.borderColor = "#cf222e";
            inputURL.classList.add("invalid");
            inputURL.nextElementSibling.style.zIndex = "0";
        }
    }
});

function disableErrorIcons() {
    errorIcons.forEach((icon) => {
        icon.style.zIndex = "-1";
    });
}

inputs.forEach((input) => {
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

// TODO Вынести setPopup в utils, message не нужен
buttonPlaylist.addEventListener("click", () => {
    let currentUrl = window.location.href;
    let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
    let pathPopup = "popup/downloads/downloads.html";
    window.location.href = rawPath + pathPopup;
    chrome.runtime.sendMessage({
        type: "setPopup",
        path: pathPopup,
    });
});

function renderValidVideoForm(url) {
    inputURL.value = url;
    labelInputUrl.innerHTML = `<button class="yt_label button" tabindex="-1">
<i class="icon-youtube-play" aria-hidden="true" style="font-size: 16px;"></i>&nbsp;YouTube</button>`;
    setTimeout(() => {
        inputURL.setSelectionRange(0, 0);
        inputURL.focus();
    }, 200);
    setTimeout(() => {
        inputArtist.focus();
    }, 600);
}

function renderInvalidVideoForm() {
    let form = document.querySelector(".form");
    form.innerHTML =
        "<strong style='color: #000';><span style='font-weight: 600;color: inherit;vertical-align: center;'>⚠️ Warning</span></div><br><br>Video length <= 6min 0s<br>NO Stream<br><br>Slow server :(</strong>";
    buttonPlaylist.style.marginTop = "10px";
    form.appendChild(formButtonPlaylist);
}
