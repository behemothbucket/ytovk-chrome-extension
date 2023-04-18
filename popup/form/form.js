import { Config } from "../../scripts/config.js";
import { changePopupAndCurrenLocation } from "../../scripts/location.js";

// TODO refactor this

let buttonClear = document.querySelector(".button-clear");
let buttonSave = document.querySelector(".button-save");
let inputs = document.querySelectorAll("input");
let errorIcons = document.querySelectorAll(".icon-info-circled");
let buttonPlaylist = document.querySelector(".downloads-button");
let formButtonPlaylist = document.querySelector(".downloads-wrapper-button");
let labelInputUrl = document.getElementById("url-label");
let inputURL = document.getElementById("url");
let inputTitle = document.getElementById("shortTitle");
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
      .catch((error) => console.error(error));
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
      await chrome.runtime.sendMessage({
        type: "saveAudioToVK",
        url: inputURL.value,
        artist: inputArtist.value,
        shortTitle: inputTitle.value,
      });
      changePopupAndCurrenLocation("loading");
    } else {
      inputURL.style.borderColor = "#cf222e";
      inputURL.classList.add("invalid");
      inputURL.nextElementSibling.style.zIndex = "0";
    }
  }
});

inputs.forEach((input) => {
  input.addEventListener("input", function() {
    if (this.value) {
      this.style.borderColor = "#d1d5da";
      this.classList.remove("invalid");
    } else {
      this.style.borderColor = "#cf222e";
      this.classList.add("invalid");
    }
  });
  input.addEventListener("click", function() {
    this.nextElementSibling.style.zIndex = "-1";
  });
  input.addEventListener("keypress", (event) => {
    let regex = new RegExp("^[a-zA-Z0-9()]+$");
    if (!regex.test(event.key)) {
      event.preventDefault();
      return false;
    }
  });
});

buttonPlaylist.addEventListener("click", () => {
  changePopupAndCurrenLocation("downloads");
});

function renderValidVideoForm(url) {
  inputURL.value = url;
  labelInputUrl.innerHTML = `<button class="yt-label button" tabindex="-1">
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
    "<strong style='color: #000'><span style='font-weight: 600;color: inherit;vertical-align: center;'>⚠️ Warning</span></div><br><br>Video length <= 6min 0s<br>NO Stream<br><br>Slow server :(</strong>";
  buttonPlaylist.style.marginTop = "10px";
  form.appendChild(formButtonPlaylist);
}

function disableErrorIcons() {
  errorIcons.forEach((icon) => {
    icon.style.zIndex = "-1";
  });
}
