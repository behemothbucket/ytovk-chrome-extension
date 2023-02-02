const youtubeVideoUrl = "https://www.youtube.com/watch?";
const icons = {
    "active": "../images/icon_active.png",
    "disabled": "../images/icon_disabled.png",
};

// Toggle icon type when video detected
chrome.tabs.onUpdated.addListener(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        toggleIcon(tabs[0]);
    });
});

function toggleIcon(currentTab) {
    let iconType = currentTab.url.includes(youtubeVideoUrl) ? icons.active : icons.disabled;

    chrome.action.setIcon({
        path: iconType,
        tabId: currentTab.id,
    });
}