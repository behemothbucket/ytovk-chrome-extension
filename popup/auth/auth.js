let authButton = document.querySelector(".auth_button");

authButton.addEventListener("click", async () => {
    chrome.runtime.sendMessage({ type: "login" });
});
