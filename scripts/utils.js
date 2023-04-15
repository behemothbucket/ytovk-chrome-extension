import { Config } from "./config.js";
import { getToken, setToken } from "./storage.js";
import { saveTrackToDownloads } from "./storage.js";

function handleUrls(tabId, changeInfo, tab) {
    if (tab.url.match(Config.OAUTH_TOKEN_PAGE_PATTERN) && changeInfo.url) {
        chrome.tabs.remove(tabId);
        setToken(tab.url);
    }
    return true;
}

function handleMessage(request, sender) {
    if (request.type === "login") {
        chrome.tabs.create({
            url: Config.OAUTH_URL,
            active: true,
        });
    }

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
}

async function saveAudioToVK(url, artist, shortTitle) {
    const tokenObject = await getToken();
    const token = tokenObject.token;

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
        const response = await fetch("https://youtovk1.ru/save", {
            method: "POST",
            body,
            headers,
        });
        const json = await response.json();

        if (response.ok) {
            saveTrackToDownloads(artist, shortTitle, json.url);
            await chrome.runtime.sendMessage({ type: "audioSaved" });
        } else {
            console.log(`Error: code ${response.status}`);
        }
    } catch (error) {
        console.log(error.message);
    }
}

export { handleMessage, handleUrls };
