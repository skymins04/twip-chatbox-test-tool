import type {
  ChromeRuntimeSendMessageRequest,
  TwipMsg,
  TwipUser,
  UserTypeFilter,
} from "./global";

const intervals: any = {};
const chatControls: any = {};

class CustomInterval {
  constructor(callback: () => void, senderId: string) {
    this.callback = callback;
    this.senderId = senderId;
    this.set();
  }

  private callback: () => void;
  private senderId: string;
  private timer: NodeJS.Timeout | null = null;

  private set() {
    this.timer = setTimeout(
      async () => {
        await this.callback();
        await this.set();
      },
      chatControls[this.senderId].offsetFlag
        ? chatControls[this.senderId].intervalTime +
            chatControls[this.senderId].offsetTime * Math.random()
        : chatControls[this.senderId].intervalTime
    );
  }

  clear() {
    if (this.timer) clearTimeout(this.timer);
  }
}

const testTwitchUserProfiles: Array<TwipUser> = [
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
];
const getTestTwitchUserProfile = (filter?: UserTypeFilter) => {
  const userProfiles = filter
    ? testTwitchUserProfiles.filter((itm) => filter[itm.type])
    : testTwitchUserProfiles;

  return userProfiles[Math.floor(Math.random() * userProfiles.length)];
};
const testTwipMsgProfiles: Array<TwipMsg> = [
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
const getTestTwipMsgProfile = () =>
  testTwipMsgProfiles[Math.floor(Math.random() * testTwipMsgProfiles.length)];

chrome.alarms.create({ periodInMinutes: 4.9 });
chrome.alarms.onAlarm.addListener(() => {
  console.log("log for debug");
});

chrome.runtime.onMessage.addListener(
  (request: ChromeRuntimeSendMessageRequest, sender, sendResponse) => {
    if (sender.id) {
      if (request.type === "tool-start") {
      } else if (request.type === "chat-control") {
        console.log("run chat-control");
        const senderId = sender.id;

        chatControls[senderId] = {
          intervalTime: request.intervalTime,
          offsetTime: request.randomOffset,
          offsetFlag: request.randomFlag,
        };
        if (request.runningState) {
          if (!intervals[senderId]) {
            const interval = new CustomInterval(async () => {
              const testUser = getTestTwitchUserProfile(request.userTypeFilter);
              const testMsg = getTestTwipMsgProfile();
              chrome.scripting.executeScript({
                target: {
                  tabId: request.tabId as number,
                },
                func: (testUser: TwipUser, testMsg: TwipMsg) => {
                  console.log("user-data", testUser.userData);
                  let rawStr = "";
                  let i = 0;
                  if (testMsg.emotes !== null) {
                    for (let emote in testMsg.emotes) {
                      if (i !== 0) rawStr += "/";

                      let str = emote + ":";
                      let j = 0;
                      for (let item of testMsg.emotes[emote]) {
                        if (j !== 0) str += ",";
                        str += item;
                        j += 1;
                      }
                      rawStr += str;
                      i += 1;
                    }
                    testUser.userData["emotes-raw"] = rawStr;
                    console.log(rawStr);
                  }
                  testUser.userData["emotes"] = testMsg.emotes;
                  console.log(testUser.userData["emotes"]);
                  (window as any).ChatBox.processMessage(
                    null,
                    testUser.userData,
                    testMsg.msg
                  );
                },
                args: [testUser, testMsg],
                world: "MAIN",
              });
            }, senderId);
            intervals[senderId] = interval;
          }
        } else {
          if (intervals[senderId]) {
            intervals[senderId].clear();
            intervals[senderId] = null;
          }
        }
      } else if (request.type === "clear-chat") {
        console.log("run clear-chat");
        chrome.scripting.executeScript({
          target: {
            tabId: request.tabId,
          },
          func: () => {
            (window as any).document.getElementById("log").innerHTML = "";
          },
          world: "MAIN",
        });
      }
    }
  }
);

export {};
