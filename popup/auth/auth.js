let authButton = document.querySelector(".auth_button");

authButton.addEventListener("click", () => {
	chrome.runtime.sendMessage({ type: "login" });
});