let buttonBack = document.querySelector(".button_back");
buttonBack.classList.toggle("loaded-state");

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