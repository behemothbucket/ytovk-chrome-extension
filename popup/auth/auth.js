let inputPhone = document.querySelector("#phone");
let form = document.querySelector(".form");

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
	if (event.type == "blur" && this.value.length < 5)  this.value = "";
}

let authButton = document.querySelector(".auth_button");

authButton.addEventListener("click", () => {
	
	let login = inputPhone.value.replace(/[^a-zA-Z0-9]/g, "");
	let password = document.querySelector("#password").value;

	if (login.length === 11 && password.length >= 6) { 
		getToken(login, password)
			.then((responseBody) => {
				let token = responseBody.token;
				alert(token);
				// chrome.runtime.sendMessage({ type: "login", token });				
			});
	}
});

async function getToken(login, password) {
	const rawResponse = await fetch("http://localhost:3000/generateToken", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json" 
		},
		body: JSON.stringify({
			login,
			password
		})
	});

	return await rawResponse.json();
}
