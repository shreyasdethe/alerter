chrome.runtime.onInstalled.addListener(() => {
    console.log("Install complete");
});


chrome.alarms.onAlarm.addListener(alarm => {
    chrome.notifications.create(
        "", {
        type: "basic",
        iconUrl: "assets/bell.png",
        title: alarm.name,
        message: `This is your reminder to ${alarm.name}`,
        priority: 2
    });
});