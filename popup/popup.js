let authButton = document.querySelector(".button");
let buttonClear = document.querySelector(".button_clear");
let inputs = document.querySelectorAll(".input");

buttonClear.addEventListener("click", () => {
	for (const input of inputs) input.value = "";
});

// authButton.addEventListener("click", () => {
// 	chrome.runtime.sendMessage({ type: "login" });
// });

