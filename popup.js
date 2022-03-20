document.addEventListener('DOMContentLoaded', function () {
    document.body.style.backgroundColor = "#88d3b0";
    let errorText = document.getElementById("errorText");

    // Set default values for the text fields
    let alarmTextField = document.getElementById("enterText");
    chrome.storage.sync.get("alarmText", (result) => {
        alarmTextField.defaultValue = (result.alarmText === undefined) ? "Drink water" : result.alarmText;
    });

    let alarmTimeField = document.getElementById("enterTime");
    chrome.storage.sync.get("alarmTime", (result) => {
        alarmTimeField.defaultValue = (result.alarmTime === undefined) ? 5 : result.alarmTime;
    });

    let startStopButton = document.getElementById("startStopButton");

    let isRunning = null;
    chrome.storage.sync.get("isAlarmRunning", (result) => {
        isRunning = (result.isAlarmRunning === undefined) ? false : result.isAlarmRunning;
        startStopButton.innerText = (isRunning) ? "Stop" : "Start";
    });



    startStopButton.addEventListener("click", () => {
        // Store the alarm values
        chrome.storage.sync.set({
            "alarmText": alarmTextField.value.toString(),
            "alarmTime": parseInt(alarmTimeField.value)
        });

        if (!isRunning) {
            // Create an alarm here
            chrome.alarms.create("SINGULAR_ALARM", {
                periodInMinutes: parseInt(alarmTimeField.value)
            });

            chrome.alarms.onAlarm.addListener(alarm => {
                if (alarm.name === "SINGULAR_ALARM") {
                    chrome.runtime.sendMessage({
                        type: "alarm",
                        options: {
                            type: "basic",
                            iconUrl: "bell.png",
                            title: alarmTextField.value,
                            message: `This is your reminder to ${alarmTextField.value}`,
                            priority: 2
                        }
                    }, () => { });
                }
            });

            isRunning = true;
            startStopButton.innerText = "Stop";
        }
        else {
            // save running state to false
            chrome.storage.sync.set({ "isAlarmRunning": false });
            // Destroy the created alarm here
            chrome.alarms.clear("SINGULAR_ALARM", () => {
                // callback when alarm cleared
            });

            isRunning = false;
            startStopButton.innerText = "Start";
        }

        // save running state
        chrome.storage.sync.set({ "isAlarmRunning": isRunning });
    }, false);

}, false);