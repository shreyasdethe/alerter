chrome.runtime.onInstalled.addListener(() => {
    console.log("Install complete");
});

chrome.runtime.onMessage.addListener(data => {
    if (data.type === "alarm") {
        chrome.notifications.create("alert", data.options);
    }
});