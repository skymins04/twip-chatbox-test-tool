const testTwitchUserProfiles = [
    {
        type: "normal",
        userData: {
            badges: null,
            "badges-raw": null,
            color: null,
            "display-name": "testuser1",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: false,
            "user-id": "testuser1",
            "user-type": null,
            username: "testuser1",
        },
    },
    {
        type: "normal",
        userData: {
            badges: null,
            "badges-raw": null,
            color: null,
            "display-name": "testuser2",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: false,
            "user-id": "testuser2",
            "user-type": null,
            username: "testuser2",
        },
    },
    {
        type: "broadcaster",
        userData: {
            badges: {
                broadcaster: "1",
            },
            "badges-raw": "broadcaster/1",
            color: null,
            "display-name": "testbroadcaster",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: false,
            "user-id": "testbroadcaster",
            "user-type": null,
            username: "testbroadcaster",
        },
    },
    {
        type: "moderator",
        userData: {
            badges: {
                moderator: "1",
            },
            "badges-raw": "moderator/1",
            color: null,
            "display-name": "testmoderator",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: false,
            "user-id": "testmoderator",
            "user-type": null,
            username: "testmoderator",
        },
    },
    {
        type: "partner",
        userData: {
            badges: {
                partner: "1",
            },
            "badges-raw": "partner/1",
            color: null,
            "display-name": "testpartner",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: false,
            "user-id": "testpartner",
            "user-type": null,
            username: "testpartner",
        },
    },
    {
        type: "turbo",
        userData: {
            badges: {
                turbo: "1",
            },
            "badges-raw": "turbo/1",
            color: null,
            "display-name": "testturbo",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: true,
            "user-id": "testturbo",
            "user-type": null,
            username: "testturbo",
        },
    },
    {
        type: "premium",
        userData: {
            badges: {
                premium: "1",
            },
            "badges-raw": "premium/1",
            color: null,
            "display-name": "testpremium",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: true,
            "user-id": "testpremium",
            "user-type": null,
            username: "testpremium",
        },
    },
    {
        type: "bits",
        userData: {
            badges: {
                bits: "1",
            },
            "badges-raw": "bits/1",
            color: null,
            "display-name": "testbits",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: true,
            "user-id": "testbits",
            "user-type": null,
            username: "testbits",
        },
    },
    {
        type: "admin",
        userData: {
            badges: {
                admin: "1",
            },
            "badges-raw": "admin/1",
            color: null,
            "display-name": "testadmin",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: true,
            "user-id": "testadmin",
            "user-type": null,
            username: "testadmin",
        },
    },
    {
        type: "staff",
        userData: {
            badges: {
                staff: "1",
            },
            "badges-raw": "staff/1",
            color: null,
            "display-name": "teststaff",
            emotes: null,
            "emotes-raw": null,
            "first-msg": false,
            id: "testid",
            "message-type": "chat",
            mod: false,
            "returning-chatter": false,
            "room-id": "testid",
            subscriber: false,
            turbo: true,
            "user-id": "teststaff",
            "user-type": null,
            username: "teststaff",
        },
    },
];
const getTestTwitchUserProfile = (filter) => {
    const userProfiles = filter
        ? testTwitchUserProfiles.filter((itm) => filter[itm.type])
        : testTwitchUserProfiles;
    return userProfiles[Math.floor(Math.random() * userProfiles.length)];
};
const getTestMsgProfile = (msgs) => msgs[Math.floor(Math.random() * msgs.length)];

const LOCALSTORAGE_KEYS = {
    chatTestType: "chatTestType",
    chatTestBtnState: "chatTestBtnState",
    chatTestDelay: "chatTestDelay",
    chatTestRandomDelayOffset: "chatTestRandomDelayOffset",
    isChatTestRandomDelayOffset: "isChatTestRandomDelayOffset",
    userTypeFilter: "userTypeFilter",
    testMsg: "testMsg",
    twipChatboxAutosaveStatus: "twipChatboxAutosaveStatus",
};

const tabStatus = {};
const twipChatboxAutosaveIntervals = {};
const chatControls = {};
const twipChatboxTextIntervals = {};
const chromeAlert = async (tabId, msg) => {
    await chrome.scripting.executeScript({
        target: {
            tabId,
        },
        func: (msg) => {
            window.alert(msg);
        },
        args: [msg],
        world: "MAIN",
    });
};
const chromeConfirm = async (tabId, msg, callback) => {
    await chrome.scripting
        .executeScript({
        target: {
            tabId,
        },
        func: (msg) => {
            return window.confirm(msg);
        },
        args: [msg],
        world: "MAIN",
    })
        .then((result) => result[0].result)
        .then((result) => {
        if (result)
            callback();
    });
};
const getAutosaveLocalStorageKey = (twipChatboxID) => `TWIP_CHATBOX_AUTOSAVE_${twipChatboxID}`;
const isVaildTwipChatboxSettingsPage = (url) => url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/) ? true : false;
const createTwipChatBoxAutosaveInterval = async (tabId, twipChatboxID) => {
    chrome.alarms.create(`twip-autosave_${tabId}_${twipChatboxID}`, {
        periodInMinutes: (1 / 60) * 5,
    });
    twipChatboxAutosaveIntervals[twipChatboxID] = {
        tabId: tabId.toString(),
        interval: await chrome.alarms.get(`twip-autosave_${tabId}_${twipChatboxID}`),
    };
    chrome.action.setIcon({
        tabId,
        path: { "48": "icon/icon48-autosave.png" },
    });
    chrome.action.setTitle({
        tabId,
        title: "Twip chatbox test tool\n\n현재 탭에서 Twip Chatbox 커스텀테마 소스코드 자동저장이 실행 중입니다.",
    });
    await chromeAlert(tabId, "현재 탭에서 Twip Chatbox 커스텀테마 소스코드 자동저장이 실행되었습니다.");
};
const stopTwipChatboxAutosave = async (twipChatboxID) => {
    if (twipChatboxAutosaveIntervals[twipChatboxID]) {
        const tabId = parseInt(twipChatboxAutosaveIntervals[twipChatboxID].tabId);
        await chrome.alarms.clear(twipChatboxAutosaveIntervals[twipChatboxID].interval.name);
        chrome.action.setIcon({
            tabId,
            path: { "48": "icon/icon48.png" },
        });
        await chrome.action.setTitle({
            tabId,
            title: "",
        });
        delete twipChatboxAutosaveIntervals[twipChatboxID];
    }
};
const runTwipChatboxAutosave = async (tabId, tab, runOption = true) => {
    if (runOption) {
        if (isVaildTwipChatboxSettingsPage(tab.url)) {
            tabStatus[tabId.toString()] = "alive";
            const twipChatboxID = await chrome.scripting
                .executeScript({
                target: {
                    tabId,
                },
                func: () => {
                    const $ = window.$;
                    const twipChatboxDemoSrc = $("#demo").attr("src");
                    const twipChatboxID = twipChatboxDemoSrc.match(/(?<=\/widgets\/chatbox\/).*(?=\?demo\=1)/);
                    return twipChatboxID[0];
                },
                args: [],
                world: "MAIN",
            })
                .then((matchResult) => matchResult[0].result);
            if (!twipChatboxAutosaveIntervals[twipChatboxID]) {
                await createTwipChatBoxAutosaveInterval(tabId, twipChatboxID);
            }
            else if (twipChatboxAutosaveIntervals[twipChatboxID].tabId !== tabId.toString()) {
                await chromeConfirm(tabId, "이미 동일한 Twip Chatbox가 다른 탭에서 자동저장을 실행 중이므로 현재 탭에서 자동저장을 실행할 수 없습니다.\n다른 탭에서 실행중인 자동저장을 종료하고 현재 탭에서 자동저장을 실행할까요?", async () => {
                    await stopTwipChatboxAutosave(twipChatboxID);
                    await createTwipChatBoxAutosaveInterval(tabId, twipChatboxID);
                });
            }
        }
    }
    else {
        for (const twipChatboxID of Object.keys(twipChatboxAutosaveIntervals)) {
            if (twipChatboxAutosaveIntervals[twipChatboxID].tabId === tabId.toString()) {
                await stopTwipChatboxAutosave(twipChatboxID);
            }
        }
        await chromeAlert(tabId, "현재 탭의 Twip Chatbox 커스텀테마 소스코드 자동저장이 종료되었습니다.");
    }
};
class ChatTestInterval {
    constructor(callback, senderId) {
        this.timer = null;
        this.callback = callback;
        this.senderId = senderId;
        this.set();
    }
    set() {
        this.timer = setTimeout(async () => {
            await this.callback();
            await this.set();
        }, chatControls[this.senderId].offsetFlag
            ? chatControls[this.senderId].intervalTime +
                chatControls[this.senderId].offsetTime * Math.random()
            : chatControls[this.senderId].intervalTime);
    }
    clear() {
        if (this.timer)
            clearTimeout(this.timer);
    }
}
const twipChatControl = (request, senderId) => {
    if (twipChatboxTextIntervals[senderId]) {
        twipChatboxTextIntervals[senderId].clear();
        twipChatboxTextIntervals[senderId] = null;
    }
    chatControls[senderId] = {
        intervalTime: request.intervalTime,
        offsetTime: request.randomOffset,
        offsetFlag: request.randomFlag,
    };
    if (request.runningState) {
        const interval = new ChatTestInterval(async () => {
            const testUser = getTestTwitchUserProfile(request.testUserTypeFilter);
            const testMsg = getTestMsgProfile(request.testMsgs);
            console.log("run twip-chat-control", request.runningState, request.tabId);
            if (request.tabId) {
                chrome.scripting.executeScript({
                    target: {
                        tabId: request.tabId,
                    },
                    func: (testUser, testMsg) => {
                        const userData = testUser.userData;
                        let rawStr = "", i = 0;
                        if (testMsg.emotes !== null) {
                            for (const emote in testMsg.emotes) {
                                let str = emote + ":", j = 0;
                                for (let item of testMsg.emotes[emote]) {
                                    if (j !== 0)
                                        str += ",";
                                    str += item;
                                    j += 1;
                                }
                                if (i !== 0)
                                    rawStr += "/";
                                rawStr += str;
                                i += 1;
                            }
                            userData["emotes-raw"] = rawStr;
                        }
                        userData["emotes"] = testMsg.emotes;
                        window.ChatBox.processMessage(null, userData, testMsg.msg);
                    },
                    args: [testUser, testMsg],
                    world: "MAIN",
                });
            }
        }, senderId);
        twipChatboxTextIntervals[senderId] = interval;
    }
    else {
        if (twipChatboxTextIntervals[senderId]) {
            twipChatboxTextIntervals[senderId].clear();
            twipChatboxTextIntervals[senderId] = null;
        }
    }
};
const twipChatClear = (request) => {
    console.log("run clear-chat");
    chrome.scripting.executeScript({
        target: {
            tabId: request.tabId,
        },
        func: () => {
            window.document.getElementById("log").innerHTML = "";
        },
        world: "MAIN",
    });
};
chrome.alarms.onAlarm.addListener(async (alarm) => {
    const alarmType = alarm.name.split("_")[0];
    const tabId = parseInt(alarm.name.split("_")[1]);
    const twipChatboxID = alarm.name.split("_")[2];
    switch (alarmType) {
        case "twip-autosave":
            console.log(new Date(), tabId, twipChatboxID);
            if (tabStatus[tabId.toString()] === "closed") {
                await chrome.alarms.clear(alarm.name);
                if (twipChatboxAutosaveIntervals[twipChatboxID])
                    delete twipChatboxAutosaveIntervals[twipChatboxID];
            }
            else {
                const customThemeSource = await chrome.scripting
                    .executeScript({
                    target: {
                        tabId,
                    },
                    func: () => {
                        const $ = window.$;
                        return {
                            css: $(".CodeMirror")[0].CodeMirror.getValue(),
                            title: $("#chatbox_name").val(),
                        };
                    },
                    world: "MAIN",
                })
                    .then((result) => result[0].result);
                if (customThemeSource.css) {
                    const autosaveLocalStorageKey = getAutosaveLocalStorageKey(twipChatboxID);
                    let tmp = {};
                    tmp[autosaveLocalStorageKey] = customThemeSource.css;
                    await chrome.storage.local.set(tmp);
                    tmp = {};
                    const autosavedOverlayData = {
                        localStorageKey: getAutosaveLocalStorageKey(twipChatboxID),
                        chatboxId: twipChatboxID,
                        latestUpdate: new Date(),
                        title: customThemeSource.title,
                    };
                    await chrome.storage.local
                        .get("TWIP_AUTOSAVED_OVERLAYS")
                        .then(async ({ TWIP_AUTOSAVED_OVERLAYS }) => {
                        if (!TWIP_AUTOSAVED_OVERLAYS) {
                            tmp[twipChatboxID] = autosavedOverlayData;
                            await chrome.storage.local.set({
                                TWIP_AUTOSAVED_OVERLAYS: tmp,
                            });
                        }
                        else {
                            tmp = TWIP_AUTOSAVED_OVERLAYS;
                            tmp[twipChatboxID] = autosavedOverlayData;
                            await chrome.storage.local.set({
                                TWIP_AUTOSAVED_OVERLAYS: tmp,
                            });
                        }
                    });
                    console.log(await chrome.storage.local.get(autosaveLocalStorageKey));
                }
            }
            break;
    }
});
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (sender.id) {
        switch (request.type) {
            case "twip-chat-control":
                twipChatControl(request, sender.id);
                break;
            case "twip-chat-clear":
                twipChatClear(request);
                break;
            case "twip-chatbox-autosave-enable":
                const tmp = {};
                tmp[LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus] =
                    request.autosaveStatus;
                await chrome.storage.local.set(tmp);
                if (request.tab) {
                    let currentTabIsRunning = false;
                    for (const twipChatboxID of Object.keys(twipChatboxAutosaveIntervals)) {
                        if (twipChatboxAutosaveIntervals[twipChatboxID] &&
                            twipChatboxAutosaveIntervals[twipChatboxID].tabId ===
                                request.tab.id.toString())
                            currentTabIsRunning = true;
                    }
                    if (request.autosaveStatus) {
                        if (!currentTabIsRunning &&
                            isVaildTwipChatboxSettingsPage(request.tab.url)) {
                            await chromeConfirm(request.tab.id, "현재 탭에 Twip Chatbox 자동저장을 실행하시겠습니까?", async () => {
                                await runTwipChatboxAutosave(request.tab.id, request.tab, true);
                            });
                        }
                        await chromeAlert(request.tab.id, "(주의) 다른 탭의 Twip Chatbox 설정페이지들은 새로고침 후 자동저장이 실행됩니다.");
                    }
                }
                break;
            case "twip-chatbox-get-autosave":
                for (const twipChatboxID of Object.keys(twipChatboxAutosaveIntervals)) {
                    if (twipChatboxAutosaveIntervals[twipChatboxID] &&
                        twipChatboxAutosaveIntervals[twipChatboxID].tabId ===
                            request.tabId.toString()) {
                        return sendResponse({ autosaveStatus: true });
                    }
                }
                return sendResponse({ autosaveStatus: false });
            case "twip-chatbox-set-autosave":
                await runTwipChatboxAutosave(request.tab.id, request.tab, request.autosaveStatus);
                break;
        }
    }
});
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    for (const twipChatboxID of Object.keys(twipChatboxAutosaveIntervals)) {
        if (twipChatboxAutosaveIntervals[twipChatboxID] &&
            twipChatboxAutosaveIntervals[twipChatboxID].tabId === tabId.toString()) {
            await chrome.alarms.clear(twipChatboxAutosaveIntervals[twipChatboxID].interval.name);
            delete twipChatboxAutosaveIntervals[twipChatboxID];
        }
    }
    if (tabStatus[tabId.toString()])
        tabStatus[tabId.toString()] = "closed";
    const twipChatboxAutosaveStatus = await chrome.storage.local
        .get(LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus)
        .then((result) => result[LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus]);
    console.log(tabId, twipChatboxAutosaveStatus);
    if (twipChatboxAutosaveStatus === undefined) {
        const tmp = {};
        tmp[LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus] = false;
        await chrome.storage.local.set(tmp);
    }
    if (twipChatboxAutosaveStatus && changeInfo.status === "complete")
        await runTwipChatboxAutosave(tabId, tab);
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (tabStatus[tabId.toString()] === "alive") {
        tabStatus[tabId.toString()] = "closed";
        for (const twipChatboxID of Object.keys(twipChatboxAutosaveIntervals)) {
            if (twipChatboxAutosaveIntervals[twipChatboxID] &&
                twipChatboxAutosaveIntervals[twipChatboxID].tabId === tabId.toString()) {
                chrome.alarms.clear(twipChatboxAutosaveIntervals[twipChatboxID].interval.name);
                delete twipChatboxAutosaveIntervals[twipChatboxID];
            }
        }
    }
});
