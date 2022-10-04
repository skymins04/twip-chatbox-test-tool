import type {
  ChromeRuntimeSendMessageRequest,
  TwipMsg,
  TwipUser,
} from "@src/global";
import {
  getTestTwipMsgProfile,
  getTestTwitchUserProfile,
} from "./lib/chatTest";

const chatControls: {
  [key: string]: {
    intervalTime: number;
    offsetTime: number;
    offsetFlag: boolean;
  };
} = {};

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

const intervals: { [key: string]: CustomInterval } = {};

chrome.alarms.create({ periodInMinutes: 4.9 });
chrome.alarms.onAlarm.addListener(() => {
  console.log("log for debug");
});

chrome.runtime.onMessage.addListener(
  (request: ChromeRuntimeSendMessageRequest, sender, sendResponse) => {
    if (sender.id) {
      if (request.type === "chat-control") {
        const senderId = sender.id;

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
          const interval = new CustomInterval(async () => {
            const testUser = getTestTwitchUserProfile(
              request.testUserTypeFilter
            );
            const testMsg = getTestTwipMsgProfile();
            console.log(
              "run chat-control",
              request.runningState,
              request.tabId
            );
            if (request.tabId) {
              chrome.scripting.executeScript({
                target: {
                  tabId: request.tabId,
                },
                func: (testUser: TwipUser, testMsg: TwipMsg) => {
                  const userData = testUser.userData;
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
                    userData["emotes-raw"] = rawStr;
                  }
                  userData["emotes"] = testMsg.emotes;
                  (window as any).ChatBox.processMessage(
                    null,
                    userData,
                    testMsg.msg
                  );
                },
                args: [testUser, testMsg],
                world: "MAIN",
              });
            }
          }, senderId);
          intervals[senderId] = interval;
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
