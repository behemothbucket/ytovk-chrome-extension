(() => {
	if (!!document.querySelector("#shadow")) return;

	const ownerDiv = document.querySelector("div#owner");

	const downloadButton = document.createElement("button");
	downloadButton.innerText = "Save to VK";
	downloadButton.setAttribute("class", "download_button");

	const cssUrl = chrome.runtime.getURL("content.css");

	const root = document.createElement("div");
	root.style.position = "relative";
	root.setAttribute("id", "shadow");

	const shadowRoot = root.attachShadow({ mode: "open" });
	shadowRoot.innerHTML = `<link rel="stylesheet" href="${cssUrl}">`;

	shadowRoot.prepend(downloadButton);
	ownerDiv.appendChild(root);

	downloadButton.addEventListener("click", (event) => {
		alert("Пока что тестируем...");
	});

})();