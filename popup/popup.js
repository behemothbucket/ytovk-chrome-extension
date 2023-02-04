let authButton = document.querySelector("button");
authButton.addEventListener("click", invokeAuthorization);

function invokeAuthorization() {
    let currentUrl = window.location.href;
    chrome.runtime.sendMessage({ type: "login", currentUrl });
}
