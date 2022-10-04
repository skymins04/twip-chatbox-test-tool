const intervals = {};
const chatControls = {};
class CustomInterval {
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
chrome.alarms.create({ periodInMinutes: 4.9 });
chrome.alarms.onAlarm.addListener(() => {
    console.log("log for debug");
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (sender.id) {
        if (request.type === "tool-start") {
            chrome.scripting.executeScript({
                target: {
                    tabId: request.tabId,
                },
                func: () => {
                    window["testUsers"] = [
                        {
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
                        {
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
                        {
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
                        {
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
                        {
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
                        {
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
                    ];
                    window["testMsgs"] = [
                        { msg: "Hello World", emotes: null },
                        { msg: "Hi There~~~!", emotes: null },
                        { msg: "트하트하트하트하 유하유하유하유하", emotes: null },
                        {
                            msg: "It's a sample chat test~ blah blah blah blah blah",
                            emotes: null,
                        },
                        {
                            msg: "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라만세",
                            emotes: null,
                        },
                        {
                            msg: "남산 위에 저 소나무 철갑을 두른 듯 바람 서리 불변함은 우리 기상일세",
                            emotes: null,
                        },
                        { msg: "간장 공장 공장장은 강 공장장이다.", emotes: null },
                        {
                            msg: "트수만 믿고 있으라구 a a b b",
                            emotes: {
                                69: ["12-12", "14-14"],
                                86: ["16-16", "18-18"],
                            },
                        },
                        { msg: ":귀여운돼끼_1:", emotes: null },
                        { msg: ":귀여운돼끼_2:", emotes: null },
                        { msg: ":귀여운돼끼_3:", emotes: null },
                        {
                            msg: "채팅테스트 메시지입니다! 블라블라블라블라~~",
                            emotes: null,
                        },
                    ];
                    window["getTestUser"] = () => window["testUsers"][Math.floor(Math.random() * window["testUsers"].length)];
                    window["getTestMsg"] = () => window["testMsgs"][Math.floor(Math.random() * window["testMsgs"].length)];
                },
                world: "MAIN",
            });
        }
        else if (request.type === "chat-control") {
            const senderId = sender.id;
            chatControls[senderId] = {
                intervalTime: request.intervalTime,
                offsetTime: request.randomOffset,
                offsetFlag: request.randomFlag,
            };
            if (request.runningState) {
                if (!intervals[senderId]) {
                    const interval = new CustomInterval(async () => {
                        chrome.scripting.executeScript({
                            target: {
                                tabId: request.tabId,
                            },
                            func: () => {
                                let user = window["getTestUser"]();
                                let msgData = window["getTestMsg"]();
                                let rawStr = "";
                                let i = 0;
                                if (msgData.emotes !== null) {
                                    for (let emote in msgData.emotes) {
                                        if (i !== 0)
                                            rawStr += "/";
                                        let str = emote + ":";
                                        let j = 0;
                                        for (let item of msgData.emotes[emote]) {
                                            if (j !== 0)
                                                str += ",";
                                            str += item;
                                            j += 1;
                                        }
                                        rawStr += str;
                                        i += 1;
                                    }
                                    user["emotes-raw"] = rawStr;
                                    console.log(rawStr);
                                }
                                user["emotes"] = msgData.emotes;
                                console.log(user["emotes"]);
                                window.ChatBox.processMessage(null, user, msgData.msg);
                            },
                            world: "MAIN",
                        });
                    }, senderId);
                    intervals[senderId] = interval;
                }
            }
            else {
                intervals[senderId].clear();
                intervals[senderId] = null;
            }
        }
        else if (request.type === "clear-chat") {
            chrome.scripting.executeScript({
                target: {
                    tabId: request.tabId,
                },
                func: () => {
                    window.document.getElementById("log").innerHTML = "";
                },
                world: "MAIN",
            });
        }
    }
});
