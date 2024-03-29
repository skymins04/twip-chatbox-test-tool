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
async function chromeConfirm(tabId, msg) {
    return await chrome.scripting
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
        .then((result) => result[0].result);
}
async function chromePrompt(tabId, msg, defaultValue = "") {
    return await chrome.scripting
        .executeScript({
        target: {
            tabId,
        },
        func: (msg, defaultValue) => {
            return window.prompt(msg, defaultValue);
        },
        args: [msg, defaultValue],
        world: "MAIN",
    })
        .then((result) => result[0].result);
}
async function getTwipOverlayData(tabId) {
    return await chrome.scripting
        .executeScript({
        target: {
            tabId,
        },
        func: () => {
            const $ = window.$;
            const date = new Date();
            return {
                css: $(".CodeMirror")[0].CodeMirror.getValue(),
                title: $("#chatbox_name").val(),
                timestamp: `${date.toLocaleDateString()}  ${date.toLocaleTimeString()}`,
            };
        },
        world: "MAIN",
    })
        .then((result) => result[0].result);
}
const getAutosavedThemeLocalStorageKey = (twipChatboxId) => `TWIP_CHATBOX_AUTOSAVE_${twipChatboxId}`;
const getManualsavedThemeLocalStorage = (id) => `TWIP_CHATBOX_MANUALSAVE_${id}`;
const isVaildTwipChatboxSettingsPage = (url) => url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/) ? true : false;
function generateRandomString(num) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const tabStatus = {};
const twipChatboxAutosaveIntervals = {};
chrome.alarms.onAlarm.addListener(async (alarm) => {
    const alarmType = alarm.name.split("_")[0];
    const tabId = parseInt(alarm.name.split("_")[1]);
    switch (alarmType) {
        case "twip-autosave":
            const twipChatboxId = alarm.name.split("_")[2];
            if (tabStatus[tabId.toString()] === "closed") {
                await chrome.alarms.clear(alarm.name);
                if (twipChatboxAutosaveIntervals[twipChatboxId])
                    delete twipChatboxAutosaveIntervals[twipChatboxId];
            }
            else {
                const customThemeSource = await getTwipOverlayData(tabId);
                if (customThemeSource &&
                    customThemeSource.css &&
                    customThemeSource.title &&
                    customThemeSource.timestamp) {
                    const autosaveLocalStorageKey = getAutosavedThemeLocalStorageKey(twipChatboxId);
                    let tmp = {};
                    tmp[autosaveLocalStorageKey] = customThemeSource.css;
                    await chrome.storage.local.set(tmp);
                    tmp = {};
                    const autosavedOverlayData = {
                        localStorageKey: getAutosavedThemeLocalStorageKey(twipChatboxId),
                        chatboxId: twipChatboxId,
                        latestUpdate: customThemeSource.timestamp,
                        title: customThemeSource.title,
                    };
                    await chrome.storage.local
                        .get("TWIP_AUTOSAVED_OVERLAYS")
                        .then(async ({ TWIP_AUTOSAVED_OVERLAYS }) => {
                        if (!TWIP_AUTOSAVED_OVERLAYS) {
                            tmp[twipChatboxId] = autosavedOverlayData;
                            await chrome.storage.local.set({
                                TWIP_AUTOSAVED_OVERLAYS: tmp,
                            });
                        }
                        else {
                            tmp = TWIP_AUTOSAVED_OVERLAYS;
                            tmp[twipChatboxId] = autosavedOverlayData;
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
    switch (request.type) {
        case "twip-chatbox-chattest-control":
            if (request.tabId)
                await twipChatControl(request);
            break;
        case "twip-chatbox-chattest-clear":
            await twipChatClear(request);
            break;
        case "twip-chatbox-autosave-enable":
            const tmp = {};
            tmp[LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus] =
                request.autosaveStatus;
            await chrome.storage.local.set(tmp);
            if (request.tab) {
                let currentTabIsRunning = false;
                for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
                    if (twipChatboxAutosaveIntervals[twipChatboxId] &&
                        twipChatboxAutosaveIntervals[twipChatboxId].tabId ===
                            request.tab.id.toString())
                        currentTabIsRunning = true;
                }
                if (request.autosaveStatus) {
                    if (!currentTabIsRunning &&
                        isVaildTwipChatboxSettingsPage(request.tab.url)) {
                        if (await chromeConfirm(request.tab.id, "현재 탭에 Twip Chatbox 자동저장을 실행하시겠습니까?")) {
                            await runTwipChatboxAutosave(request.tab.id, request.tab, true);
                        }
                    }
                    await chromeAlert(request.tab.id, "(주의) 다른 탭의 Twip Chatbox 설정페이지들은 새로고침 후 자동저장이 실행됩니다.");
                }
            }
            break;
        case "twip-chatbox-autosave-get":
            let tmpTwipChatboxId = null;
            for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
                if (twipChatboxAutosaveIntervals[twipChatboxId] &&
                    twipChatboxAutosaveIntervals[twipChatboxId].tabId ===
                        request.tabId.toString()) {
                    return sendResponse({ autosaveStatus: true, twipChatboxId });
                }
                else if (twipChatboxAutosaveIntervals[twipChatboxId].tabId ===
                    request.tabId.toString()) {
                    tmpTwipChatboxId = twipChatboxId;
                }
            }
            return sendResponse({
                autosaveStatus: false,
                twipChatboxId: tmpTwipChatboxId,
            });
        case "twip-chatbox-autosave-set":
            await runTwipChatboxAutosave(request.tab.id, request.tab, request.autosaveStatus);
            break;
        case "twip-chatbox-overlay-apply":
            if (isVaildTwipChatboxSettingsPage(request.tab.url)) {
                const customCSS = await chrome.storage.local
                    .get(request.overlay.localStorageKey)
                    .then((res) => res[request.overlay.localStorageKey]);
                await chrome.scripting.executeScript({
                    target: {
                        tabId: request.tab.id,
                    },
                    func: (css, title) => {
                        const $ = window.$;
                        $(".CodeMirror")[0].CodeMirror.setValue(css);
                        $('.styles[data-name="custom"]').click();
                        $("#chatbox_name").val(title);
                        $("#chatbox_name").trigger("change");
                    },
                    args: [customCSS, request.overlay.title],
                    world: "MAIN",
                });
                await chromeAlert(request.tab.id, `현재 탭에 선택한 자동저장 오버레이를 적용했습니다.\nTwip Chatbox 설정페이지의 "설정하기" 버튼을 클릭해야 저장됩니다.`);
            }
            break;
        case "twip-chatbox-overlay-save":
            if (isVaildTwipChatboxSettingsPage(request.tab.url)) {
                const customThemeSource = await getTwipOverlayData(request.tab.id);
                if (customThemeSource &&
                    customThemeSource.css &&
                    customThemeSource.title &&
                    customThemeSource.timestamp) {
                    const overlayCustomThemeTitle = await chromePrompt(request.tab.id, "저장할 오버레이 커스텀 테마의 이름을 입력하세요.", customThemeSource.title);
                    const themeId = generateRandomString(10);
                    const manualSavedLocalStorageKey = getManualsavedThemeLocalStorage(themeId);
                    let tmp = {};
                    tmp[manualSavedLocalStorageKey] = customThemeSource.css;
                    await chrome.storage.local.set(tmp);
                    tmp = {};
                    const manualSavedOverlayData = {
                        localStorageKey: manualSavedLocalStorageKey,
                        chatboxId: themeId,
                        latestUpdate: customThemeSource.timestamp,
                        title: overlayCustomThemeTitle,
                    };
                    await chrome.storage.local
                        .get("TWIP_MANUALSAVED_OVERLAYS")
                        .then(async ({ TWIP_MANUALSAVED_OVERLAYS }) => {
                        if (!TWIP_MANUALSAVED_OVERLAYS) {
                            tmp[themeId] = manualSavedOverlayData;
                            await chrome.storage.local.set({
                                TWIP_MANUALSAVED_OVERLAYS: tmp,
                            });
                        }
                        else {
                            tmp = TWIP_MANUALSAVED_OVERLAYS;
                            tmp[themeId] = manualSavedOverlayData;
                            await chrome.storage.local.set({
                                TWIP_MANUALSAVED_OVERLAYS: tmp,
                            });
                        }
                    });
                    await chromeAlert(request.tab.id, `커스텀 테마 "${overlayCustomThemeTitle}"가 저장되었습니다.`);
                    sendResponse({});
                    break;
                }
            }
        case "twip-chatbox-overlay-rename":
            await chrome.storage.local
                .get("TWIP_MANUALSAVED_OVERLAYS")
                .then(async ({ TWIP_MANUALSAVED_OVERLAYS }) => {
                if (TWIP_MANUALSAVED_OVERLAYS &&
                    TWIP_MANUALSAVED_OVERLAYS[request.overlay.chatboxId]) {
                    let tmp = TWIP_MANUALSAVED_OVERLAYS;
                    tmp[request.overlay.chatboxId].title = request.overlay.title;
                    await chrome.storage.local.set({
                        TWIP_MANUALSAVED_OVERLAYS: tmp,
                    });
                }
            });
            sendResponse({});
            break;
        case "twip-chatbox-overlay-remove":
            if (await chromeConfirm(request.tab.id, "정말 오버레이를 삭제하시겠습니까?\n삭제된 오버레이는 복구할 수 없습니다.")) {
                await chrome.storage.local
                    .get("TWIP_MANUALSAVED_OVERLAYS")
                    .then(async ({ TWIP_MANUALSAVED_OVERLAYS }) => {
                    if (TWIP_MANUALSAVED_OVERLAYS &&
                        TWIP_MANUALSAVED_OVERLAYS[request.overlay.chatboxId]) {
                        delete TWIP_MANUALSAVED_OVERLAYS[request.overlay.chatboxId];
                        await chrome.storage.local.set({
                            TWIP_MANUALSAVED_OVERLAYS,
                        });
                    }
                })
                    .then(async () => {
                    await chromeAlert(request.tab.id, "오버레이를 삭제했습니다.");
                })
                    .then(() => {
                    sendResponse({});
                });
            }
            else {
                sendResponse({});
            }
            break;
    }
});
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    /**
     * Twip Chatting test
     */
    if (tab.url.match(/^https:\/\/(www\.)?twip\.kr\/widgets\/chatbox\/[0-9|a-z|A-Z]+/) &&
        changeInfo.status === "complete") {
        /**
         * Twip Chatbox 위젯 페이지 접속시 채팅 테스트에 필요한 함수 및 클래스, 객체 세팅을 최초 1회 실행
         */
        await chrome.scripting.executeScript({
            target: {
                tabId,
            },
            func: (testTwitchUserProfiles) => {
                const _w = window;
                _w.getTestMsgProfile = (msgs) => msgs[Math.floor(Math.random() * msgs.length)];
                _w.getTestTwitchUserProfile = (filter) => {
                    const userProfiles = filter
                        ? testTwitchUserProfiles.filter((itm) => filter[itm.type])
                        : testTwitchUserProfiles;
                    return userProfiles[Math.floor(Math.random() * userProfiles.length)];
                };
                _w.chatControls = {};
                class ChatTestInterval {
                    constructor(callback, tabId) {
                        this.timer = null;
                        this.callback = callback;
                        this.tabId = tabId;
                        this.set();
                    }
                    set() {
                        this.timer = setTimeout(async () => {
                            await this.callback();
                            await this.set();
                        }, _w.chatControls[this.tabId].offsetFlag
                            ? _w.chatControls[this.tabId].intervalTime +
                                _w.chatControls[this.tabId].offsetTime * Math.random()
                            : _w.chatControls[this.tabId].intervalTime);
                    }
                    clear() {
                        if (this.timer)
                            clearTimeout(this.timer);
                    }
                }
                _w.ChatTestInterval = ChatTestInterval;
            },
            args: [testTwitchUserProfiles],
            world: "MAIN",
        });
    }
    /**
     * Autosave
     */
    for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
        if (twipChatboxAutosaveIntervals[twipChatboxId] &&
            twipChatboxAutosaveIntervals[twipChatboxId].tabId === tabId.toString()) {
            await chrome.alarms.clear(twipChatboxAutosaveIntervals[twipChatboxId].interval.name);
            delete twipChatboxAutosaveIntervals[twipChatboxId];
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
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    /**
     * 탭 제거 시 해당 탭에 실행 중인 Autosave 정지
     */
    if (tabStatus[tabId.toString()] === "alive") {
        tabStatus[tabId.toString()] = "closed";
        for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
            if (twipChatboxAutosaveIntervals[twipChatboxId] &&
                twipChatboxAutosaveIntervals[twipChatboxId].tabId === tabId.toString()) {
                await chrome.alarms.clear(twipChatboxAutosaveIntervals[twipChatboxId].interval.name);
                delete twipChatboxAutosaveIntervals[twipChatboxId];
            }
        }
    }
});
/**
 * Autosave Functions
 */
const createTwipChatBoxAutosaveInterval = async (tabId, twipChatboxId) => {
    chrome.alarms.create(`twip-autosave_${tabId}_${twipChatboxId}`, {
        periodInMinutes: (1 / 60) * 5,
    });
    twipChatboxAutosaveIntervals[twipChatboxId] = {
        tabId: tabId.toString(),
        interval: await chrome.alarms.get(`twip-autosave_${tabId}_${twipChatboxId}`),
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
const stopTwipChatboxAutosave = async (twipChatboxId) => {
    if (twipChatboxAutosaveIntervals[twipChatboxId]) {
        const tabId = parseInt(twipChatboxAutosaveIntervals[twipChatboxId].tabId);
        await chrome.alarms.clear(twipChatboxAutosaveIntervals[twipChatboxId].interval.name);
        chrome.action.setIcon({
            tabId,
            path: { "48": "icon/icon48.png" },
        });
        await chrome.action.setTitle({
            tabId,
            title: "",
        });
        delete twipChatboxAutosaveIntervals[twipChatboxId];
    }
};
const runTwipChatboxAutosave = async (tabId, tab, runOption = true) => {
    if (runOption) {
        if (isVaildTwipChatboxSettingsPage(tab.url)) {
            tabStatus[tabId.toString()] = "alive";
            const twipChatboxId = await chrome.scripting
                .executeScript({
                target: {
                    tabId,
                },
                func: () => {
                    const $ = window.$;
                    const twipChatboxDemoSrc = $("#demo").attr("src");
                    const twipChatboxId = twipChatboxDemoSrc.match(/(?<=\/widgets\/chatbox\/).*(?=\?demo\=1)/);
                    return twipChatboxId[0];
                },
                args: [],
                world: "MAIN",
            })
                .then((matchResult) => matchResult[0].result);
            if (!twipChatboxAutosaveIntervals[twipChatboxId]) {
                await createTwipChatBoxAutosaveInterval(tabId, twipChatboxId);
            }
            else if (twipChatboxAutosaveIntervals[twipChatboxId].tabId !== tabId.toString()) {
                if (await chromeConfirm(tabId, "이미 동일한 Twip Chatbox가 다른 탭에서 자동저장을 실행 중이므로 현재 탭에서 자동저장을 실행할 수 없습니다.\n다른 탭에서 실행중인 자동저장을 종료하고 현재 탭에서 자동저장을 실행할까요?")) {
                    await stopTwipChatboxAutosave(twipChatboxId);
                    await createTwipChatBoxAutosaveInterval(tabId, twipChatboxId);
                }
            }
        }
    }
    else {
        for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
            if (twipChatboxAutosaveIntervals[twipChatboxId].tabId === tabId.toString()) {
                await stopTwipChatboxAutosave(twipChatboxId);
            }
        }
        await chromeAlert(tabId, "현재 탭의 Twip Chatbox 커스텀테마 소스코드 자동저장이 종료되었습니다.");
    }
};
/**
 * Twip Chatting test Functions
 */
const twipChatControl = async (request) => {
    if (request.runningState && request.tabId) {
        /**
         * run twip chatting test
         */
        await chrome.scripting.executeScript({
            target: {
                tabId: request.tabId,
            },
            func: (request) => {
                const _w = window;
                const intervalKey = `TWIP_CHATTEST_${request.tabId}`;
                if (_w[intervalKey]) {
                    _w[intervalKey].clear();
                    delete _w[intervalKey];
                }
                _w.chatControls[request.tabId.toString()] = {
                    intervalTime: request.intervalTime,
                    offsetTime: request.randomOffset,
                    offsetFlag: request.randomFlag,
                };
                _w[intervalKey] = new _w.ChatTestInterval(() => {
                    console.log("run interval twip-chat-control", request.tabId);
                    const testUser = _w.getTestTwitchUserProfile(request.testUserTypeFilter);
                    const testMsg = _w.getTestMsgProfile(request.testMsgs);
                    const userData = testUser.userData;
                    let rawStr = "";
                    let i = 0;
                    if (testMsg.emotes !== null) {
                        for (const emote in testMsg.emotes) {
                            let tmpStr = emote + ":";
                            let j = 0;
                            for (const item of testMsg.emotes[emote]) {
                                if (j !== 0)
                                    tmpStr += ",";
                                tmpStr += item;
                                j += 1;
                            }
                            if (i !== 0)
                                rawStr += "/";
                            rawStr += tmpStr;
                            i += 1;
                        }
                        userData["emotes-raw"] = rawStr;
                    }
                    userData["emotes"] = testMsg.emotes;
                    _w.ChatBox.processMessage(null, userData, testMsg.msg);
                }, request.tabId.toString());
            },
            args: [request],
            world: "MAIN",
        });
    }
    else if (!request.runningState && request.tabId) {
        /**
         * stop twip chatting test
         */
        await chrome.scripting.executeScript({
            target: {
                tabId: request.tabId,
            },
            func: (tabId) => {
                const _w = window;
                const intervalKey = `TWIP_CHATTEST_${tabId}`;
                if (_w[intervalKey]) {
                    _w[intervalKey].clear();
                    delete _w[intervalKey];
                }
            },
            args: [request.tabId],
            world: "MAIN",
        });
    }
};
const twipChatClear = async (request) => {
    await chrome.scripting.executeScript({
        target: {
            tabId: request.tabId,
        },
        func: () => {
            window.document.getElementById("log").innerHTML = "";
        },
        world: "MAIN",
    });
};
//# sourceMappingURL=background.js.map
