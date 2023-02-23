import { handleMessage, handleUrls } from "./scripts/utils.js";

import { checkLoginState, initializeDownloadStore } from "./scripts/storage.js";

chrome.runtime.onInstalled.addListener((details) => {
    if (details?.reason === "install") {
        checkLoginState();
        initializeDownloadStore();
    }

    if (details?.reason === "update") checkLoginState();
});

chrome.tabs.onUpdated.addListener(handleUrls);

chrome.runtime.onStartup.addListener(checkLoginState);

chrome.runtime.onMessage.addListener(handleMessage);

// TODO После начала загрузки трека передавать сообщение в background для
// отображения попапа loading и инициирования загрузки
// если трек сохранен то убирать прогресс анимацию и показывать статичный попап
// о статусе загрузки и рядома кнопка OK которая возвращает к form
// так будет лучше для понимания, загрузился трек или нет
