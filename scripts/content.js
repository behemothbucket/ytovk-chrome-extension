(() => {
	new MutationObserver(function() {
		if (document.getElementsByClassName("item style-scope ytd-watch-metadata")[0]) {
			attachVKButton();
			this.disconnect();
		}
	}).observe(document, {
		childList: true, subtree: true,
	});
})();


function attachVKButton() {

	chrome.runtime.sendMessage({ type: "setBadge" });

	if (document.querySelector("#shadow")) return;

	const ownerDiv = document.querySelector("div#owner");

	// Делаю стили здесь, потому что если добавлять их в shadow-DOM при перезагрузке страницы,
	// мы увидим как рендерится кнопка. (Так же пробовал делать через добавление стилей к самой странице)
	let styles = `
	.VK_download_button {
	font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    margin-left: 20px;
    padding: 0 16px;
    border-radius: 8px;
    height: 30px;
    white-space: nowrap;
    line-height: 16px;
    text-align: center;
    border: 0;
    outline: 0;
    background-image: -webkit-linear-gradient(top, #2c74c9, #295192);
    background-image: -moz-linear-gradient(top, #2c74c9, #295192);
    background-image: -ms-linear-gradient(top, #2c74c9, #295192);
    background-image: -o-linear-gradient(top, #2c74c9, #295192);
    background-image: linear-gradient(top, #2c74c9, #295192);
    box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transition: background-color 0.15s ease-in-out;
   }
   
	.VK_download_button:active {
	background-image: -webkit-linear-gradient(top, #225b9f, #23467f);
	background-image: -moz-linear-gradient(top, #225b9f, #23467f);
	background-image: -ms-linear-gradient(top, #225b9f, #23467f);
	background-image: -o-linear-gradient(top, #225b9f, #23467f);
	background-image: linear-gradient(top, #225b9f, #23467f);
    box-shadow: inset 0 0 0 1px #17407d;
    transform: scale(99%);
	`;

	const VKButtonStyleSheet = document.createElement("style");
	VKButtonStyleSheet.innerText = styles;
	document.head.appendChild(VKButtonStyleSheet);

	const downloadButton = document.createElement("button");
	downloadButton.setAttribute("class", "VK_download_button");
	downloadButton.innerText = "Save";


	downloadButton.addEventListener("click", () => {
		let filename = "";
		// TODO Нужно изучить CORS и понять как делать нормальный GET запрос
		fetch(`http://localhost:3000/download?url=${window.location.href}`)
			.then(res => {
				let filenameRaw = res.headers.get("content-disposition").split("filename=")[1];
				filename = filenameRaw.substring(1, filenameRaw.length-1);
				return res.blob();
			})
			.then((blob) => {
				saveFile(blob, filename);
			});
	});

	ownerDiv.appendChild(downloadButton);
}

function saveFile(blob, filename = "file.mp3") {	
	// Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
	const blobUrl = URL.createObjectURL(blob);

	// Create a link element
	const link = document.createElement("a");

	// Set link's href to point to the Blob URL
	link.href = blobUrl;
	link.download = filename;

	// Append link to the body
	document.body.appendChild(link);

	//Dispatch click event on the link
	// This is necessary as link.click() does not work on the latest firefox
	link.dispatchEvent(
		new MouseEvent("click", { 
			bubbles: true, 
			cancelable: true, 
			view: window 
		})
	);

	// Remove link from body
	document.body.removeChild(link);
}
