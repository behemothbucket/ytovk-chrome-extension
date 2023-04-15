function changePopupAndCurrenLocation(folder, popupHtml = folder) {
    let currentUrl = window.location.href;
    let rawPath = currentUrl.substring(0, currentUrl.indexOf("popup"));
    let pathPopup = `popup/${folder}/${popupHtml}.html`;
    window.location.href = rawPath + pathPopup;
    setPopup(pathPopup);
}

function setPopup(path) {
    chrome.action.setPopup({ popup: path })
}

export { changePopupAndCurrenLocation, setPopup };
