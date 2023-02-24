import { changePopupAndCurrenLocation } from "../../scripts/location.js";

let figcaption = document.querySelector("figcaption");

setInterval(() => {
    figcaption.textContent += ".";
    if (figcaption.textContent.length > 10) figcaption.textContent = "Loading";
}, 1000);

setTimeout(() => {
    changePopupAndCurrenLocation("loading", "fail");
}, 10000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "audioSaved") {
        changePopupAndCurrenLocation("loading", "success");
    }
});
