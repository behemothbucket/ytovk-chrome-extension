let figcaption = document.querySelector("figcaption");

setInterval(() => {
    figcaption.textContent += ".";
    if (figcaption.textContent.length > 10) figcaption.textContent = "Loading";
}, 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "savingState") {
        if (request.result === "saved") {
            let currentUrl = window.location.href;
            let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
            let pathPopup = "popup/loading/success.html";
            window.location.href = rawPath + pathPopup;
        }
        if (request.result === "serverError") {
            let currentUrl = window.location.href;
            let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
            let pathPopup = "popup/loading/fail.html";
            window.location.href = rawPath + pathPopup;
            document.querySelector(
                "figcaption"
            ).textContent = `Error - ${request.responseStatus}`;
        }
        if (request.result === "requestError") {
            let currentUrl = window.location.href;
            let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
            let pathPopup = "popup/loading/fail.html";
            window.location.href = rawPath + pathPopup;
            document.querySelector("figcaption").textContent =
                "Can't send request to sever.Please try again";
        }
    }
});
