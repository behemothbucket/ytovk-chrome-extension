let authButton = document.querySelector(".auth-button");

authButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "login" });
});
