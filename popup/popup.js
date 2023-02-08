let authButton = document.querySelector(".button_login");
let buttonClear = document.querySelector(".button_clear");
let buttonDownload = document.querySelector(".button_download");
let inputs = document.querySelectorAll(".input");
let errorIcons = document.querySelectorAll(".icon-info-circled");
let inputURL = document.getElementById("URL");

inputURL.value = window.location.href;

buttonClear.addEventListener("click", () => {
	for (const input of inputs) {
		input.value = "";
		input.style.borderColor = "#d1d5da";
		input.classList.remove("invalid");
		disableErrorIcons();
	}
});

buttonDownload.addEventListener("click", () => {
	let totalValidInputs = 0;

	for (const input of inputs) {
		if (!!input.value) {
			totalValidInputs++;
		} else {
			input.style.borderColor = "#cf222e";
			input.classList.add("invalid");
			input.nextElementSibling.style.zIndex = "0";
		}
	}

	if (totalValidInputs === 3) alert("Вы не вошли в аккаунт");

});

function disableErrorIcons() {
	errorIcons.forEach(icon => {
		icon.style.zIndex = "-1";
	});
}

inputs.forEach(input => {
	input.addEventListener("change", () => {
		if (!!input.value) {
			input.style.borderColor = "#d1d5da";
			input.classList.remove("invalid");
		}
	});
	input.addEventListener("click", () => {
		input.nextElementSibling.style.zIndex = "-1";
	});
});


window.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		event.target.classList.add("active");
		event.target.click();
		setTimeout(() => {
			event.target.classList.remove("active");
		}, 100);
	}
});

authButton.addEventListener("click", () => {
	chrome.runtime.sendMessage({ type: "login" });
});
