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

const tabStatus = {};
const twipChatboxAutosaveIntervals = {};
const chatControls = {};
const intervals = {};
const chromeAlert = (tabId, msg) => {
    chrome.scripting.executeScript({
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
const chromeConfirm = (tabId, msg, callback) => {
    chrome.scripting
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
const createTwipChatBoxAutosaveInterval = (tabId, tab, twipChatboxID) => {
    const interval = setInterval(async () => {
        console.log(tabId, twipChatboxID, tab.status);
        if (tabStatus[tabId.toString()] === "closed") {
            clearInterval(interval);
            if (twipChatboxAutosaveIntervals[twipChatboxID])
                twipChatboxAutosaveIntervals[twipChatboxID] = null;
        }
        else {
            const customThemeSource = await chrome.scripting
                .executeScript({
                target: {
                    tabId,
                },
                func: () => {
                    const $ = window.$;
                    return $(".CodeMirror")[0].CodeMirror.getValue();
                },
                world: "MAIN",
            })
                .then((result) => result[0].result);
            const tmp = {};
            if (customThemeSource) {
                tmp[getAutosaveLocalStorageKey(twipChatboxID)] = customThemeSource;
                await chrome.storage.local.set(tmp);
                console.log(await chrome.storage.local.get(getAutosaveLocalStorageKey(twipChatboxID)));
            }
        }
    }, 500);
    twipChatboxAutosaveIntervals[twipChatboxID] = {
        tabId: tabId.toString(),
        interval,
    };
    chromeAlert(tabId, "Twip Chatbox 커스텀테마 소스코드 자동저장이 실행되었습니다.");
};
const runTwipChatboxAutosave = async (tabId, tab) => {
    if (tab.url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/)) {
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
            createTwipChatBoxAutosaveInterval(tabId, tab, twipChatboxID);
        }
        else {
            chromeConfirm(tabId, "이미 동일한 Twip Chatbox가 다른 탭에서 자동저장을 실행 중이므로 현재 탭에서 자동저장을 실행할 수 없습니다.\n다른 탭에서 실행중인 자동저장을 종료하고 현재 탭에서 자동저장을 실행할까요?", () => {
                clearInterval(twipChatboxAutosaveIntervals[twipChatboxID].interval);
                twipChatboxAutosaveIntervals[twipChatboxID] = null;
                createTwipChatBoxAutosaveInterval(tabId, tab, twipChatboxID);
            });
        }
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
    if (intervals[senderId]) {
        intervals[senderId].clear();
        intervals[senderId] = null;
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
        intervals[senderId] = interval;
    }
    else {
        if (intervals[senderId]) {
            intervals[senderId].clear();
            intervals[senderId] = null;
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
chrome.alarms.create({ periodInMinutes: 4.9 });
chrome.alarms.onAlarm.addListener(() => {
    console.log("log for debug");
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
            case "twip-chatbox-autosave":
                await chrome.storage.local.set({
                    TWIP_CHATBOX_AUTOSAVE_STATUS: request.autosaveStatus,
                });
                break;
        }
    }
});
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    for (const twipChatboxID of Object.keys(twipChatboxAutosaveIntervals)) {
        if (twipChatboxAutosaveIntervals[twipChatboxID] &&
            twipChatboxAutosaveIntervals[twipChatboxID].tabId === tabId.toString()) {
            clearInterval(twipChatboxAutosaveIntervals[twipChatboxID].interval);
            twipChatboxAutosaveIntervals[twipChatboxID] = null;
        }
    }
    if (tabStatus[tabId.toString()])
        tabStatus[tabId.toString()] = "closed";
    const twipChatboxAutosaveStatus = await chrome.storage.local
        .get("TWIP_CHATBOX_AUTOSAVE_STATUS")
        .then((result) => result["TWIP_CHATBOX_AUTOSAVE_STATUS"]);
    console.log(tabId, twipChatboxAutosaveStatus);
    if (twipChatboxAutosaveStatus === undefined) {
        await chrome.storage.local.set({ TWIP_CHATBOX_AUTOSAVE_STATUS: false });
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
                clearInterval(twipChatboxAutosaveIntervals[twipChatboxID].interval);
                twipChatboxAutosaveIntervals[twipChatboxID] = null;
            }
        }
    }
});
