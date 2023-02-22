let figcaption = document.querySelector("figcaption");
let buttonBack = document.querySelector(".button_back");

let interval = setInterval(() => {
    figcaption.textContent += ".";
    if (figcaption.textContent.length > 10) figcaption.textContent = "Loading";
}, 1000);

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

// TODO Нужно опрашивать при открытии
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "audioSaved") {
        clearInterval(interval);
        if (request.result) {
            figcaption.textContent = "Success! 🎉";
        } else {
            figcaption.textContent = `Fail! 🚨 Error: ${request.statusCode}`;
        }
    }
    buttonBack.classList.toggle("loaded-state");
    buttonBack.style.disabled = false;
});
