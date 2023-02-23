import { Config } from "./config.js";
import { setToken } from "./storage.js";
import { saveTrack } from "./storage.js";

function handleUrls(tabId, changeInfo, tab) {
    if (tab.url.match(Config.OAUTH_TOKEN_PAGE_PATTERN) && changeInfo.url) {
        chrome.tabs.remove(tabId);
        setToken(tab.url);
    }
    return true;
}

function handleMessage(request, sender, sendResponse) {
    if (request.type === "login") {
        chrome.tabs.create({
            url: Config.OAUTH_URL,
            active: true,
        });
    }

    if (request.type === "setPopup")
        chrome.action.setPopup({ popup: request.path });

    if (request.type === "setBadge") {
        chrome.action.setBadgeText({
            text: "YT",
            tabId: sender.tab.id,
        });
        chrome.action.setBadgeBackgroundColor({
            color: "#cf222e",
            tabId: sender.tab.id,
        });
    }

    if (request.type === "saveAudioToVK") {
        saveAudioToVK(request.url, request.artist, request.shortTitle);
    }

    if (request.type === "downloadTrack") {
        chrome.downloads.download({
            filename: request.filename,
            url: request.url,
        });
    }

    // return true;
}

function setPopup(pathPopup) {
    chrome.action.setPopup({ popup: pathPopup });
}

function saveAudioToVK(url, artist, shortTitle) {
    chrome.storage.sync.get(["token"], async (result) => {
        const token = result.token;
        const body = JSON.stringify({
            url,
            token,
            artist,
            shortTitle,
        });
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        try {
            const response = await fetch("http://youtovk.ru/save", {
                method: "POST",
                body,
                headers,
            });
            const json = await response.json();

            if (response.ok) {
                saveTrack(artist, shortTitle, json.url);
                setPopup("../popup/loading/success.html");
                sendSavingResult("saved", "200");
            } else {
                setPopup("../popup/loading/fail.html");
                sendSavingResult("serverError", response.status);
            }
        } catch (error) {
            setPopup("../popup/loading/fail.html");
            sendSavingResult("requestError", "");
        }
    });
}

function sendSavingResult(result, responseStatus) {
    chrome.runtime
        .sendMessage({
            type: "savingState",
            result,
            responseStatus,
        })
        .catch(() => console.log("Probably popup is closed"));
}

export { handleMessage, handleUrls, setPopup };
