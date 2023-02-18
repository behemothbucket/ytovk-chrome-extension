let inputs = document.querySelectorAll("input");
let inputPhone = document.querySelector("#phone");
let form = document.querySelector(".form");
let authButton = document.querySelector(".auth_button");
let errorIcons = document.querySelectorAll(".icon-info-circled");

inputPhone.addEventListener("input", validatePhone, false);
inputPhone.addEventListener("focus", validatePhone, false);
inputPhone.addEventListener("blur", validatePhone, false);
inputPhone.addEventListener("keydown", validatePhone, false);
inputPhone.addEventListener("click", validatePhone, false);

function validatePhone(event) {
	inputPhone.setSelectionRange(inputPhone.value.length, inputPhone.value.length);

	let keyCode;

	event.keyCode && (keyCode = event.keyCode);

	let pos = this.selectionStart;

	if (pos < 3) event.preventDefault();

	var matrix = "+7 (___) ___ ____",
		i = 0,
		def = matrix.replace(/\D/g, ""),
		val = this.value.replace(/\D/g, ""),
		new_value = matrix.replace(/[_\d]/g, (a) => {
			return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
		});

	i = new_value.indexOf("_");

	if (i != -1) {
		i < 5 && (i = 3);
		new_value = new_value.slice(0, i);
	}
	let reg = matrix.substr(0, this.value.length).replace(/_+/g, (a) => {
		return "\\d{1," + a.length + "}";
	}).replace(/[+()]/g, "\\$&");

	reg = new RegExp("^" + reg + "$");

	if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
	if (event.type === "blur" && this.value.length < 5)  this.value = "";
}

inputs.forEach(input => {
	input.addEventListener("input", () => {
		if (input.value) {
			input.style.borderColor = "#d1d5da";
			input.classList.remove("invalid");
		} else {
			input.style.borderColor = "#cf222e";
			input.classList.add("invalid");
		}
	});
	input.addEventListener("click", () => {
		input.nextElementSibling.style.zIndex = "-1";
		if (input.id === "password") {
			input.type = "password";
			input.style.fontStyle = "normal";
			input.placeholder = "";	
		}
	});
});

authButton.addEventListener("click", () => {
	let login = inputPhone.value.replace(/[^a-zA-Z0-9]/g, "");
	let password = document.querySelector("#password").value;

	if (login.length === 11 && password.length >= 6) { 
		auth(login, password);
	} else {
		indicateErrorCreds();
	}
});

function auth(login, password) {
	fetch("https://youtovk.ru/generateToken", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json" 
		},
		body: JSON.stringify({
			login,
			password
		})
	}).then((res) => {
		let json = res.json();
		if (res.status === 401) {
			return json.then(json => {
				showLoginStateMessage(`\u{1F625}\n${json.error}`);
				setTimeout(() => changePopup("auth"), 2000);
			});
		}
		if (res.status === 200) { 
			return json.then(json => {
				showLoginStateMessage("Authorization complete \u{1F973}");
				setTimeout(() => changePopup("form", json.token), 2000);
			});
		}
	});
}

function changePopup(popupName, token = null) {
	let currentUrl = window.location.href;
	let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
	let pathPopup = `popup/${popupName}/${popupName}.html`;
	window.location.href = rawPath + pathPopup;

	let popupOptions ={
		type: "setPopup",
		path: pathPopup,
		token,
	};

	chrome.runtime.sendMessage(popupOptions);
}

function showLoginStateMessage(message) {
	form.innerHTML = `<p style='color:black;'>${message}</p>`;
}

function indicateErrorCreds() {

	for (const input of inputs) {
		if (input.type === "password") {
			if (input.value.length < 6) {
				input.type = "text";
				input.style.fontStyle = "italic";
				input.placeholder = "min 6 char";
				input.value = "";
				input.style.borderColor = "#cf222e";
				input.classList.add("invalid");
				input.nextElementSibling.style.zIndex = "0";
			} else {
				input.style.borderColor = "#d1d5da";
				input.classList.remove("invalid");
			}
		} else {
			if (input.value.length < 17) {
				input.style.borderColor = "#cf222e";
				input.classList.add("invalid");
				input.nextElementSibling.style.zIndex = "0"; 
			} else {
				input.style.borderColor = "#d1d5da";
				input.classList.remove("invalid");
			}
			if (input.value.length > 14) {
				input.nextElementSibling.style.zIndex = "-1"; 
			}
		}
	}
}