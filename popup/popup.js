let authButton = document.querySelector("button");
authButton.addEventListener("click", invokeAuthorization);

function invokeAuthorization() {
    chrome.runtime.sendMessage({ type: "login" });
}
