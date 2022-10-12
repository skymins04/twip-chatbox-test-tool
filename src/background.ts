import type {
  ChromeRuntimeSendMessageRequest,
  TestMsg,
  TwipUser,
} from "@src/global";
import { getTestMsgProfile, getTestTwitchUserProfile } from "./lib/chatTest";

const chatControls: {
  [key: string]: {
    intervalTime: number;
    offsetTime: number;
    offsetFlag: boolean;
  };
} = {};
const intervals: { [key: string]: ChatTestInterval } = {};

chrome.alarms.create({ periodInMinutes: 4.9 });
chrome.alarms.onAlarm.addListener(() => {
  console.log("log for debug");
});

chrome.runtime.onMessage.addListener(
  (request: ChromeRuntimeSendMessageRequest, sender, sendResponse) => {
    if (sender.id) {
      switch (request.type) {
        case "twip-chat-control":
          twipChatControl(request, sender.id);
          break;
        case "twip-chat-clear":
          twipChatClear(request);
          break;
      }
    }
  }
);

class ChatTestInterval {
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

const twipChatControl = (
  request: ChromeRuntimeSendMessageRequest,
  senderId: string
) => {
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
          func: (testUser: TwipUser, testMsg: TestMsg) => {
            const userData = testUser.userData;
            let rawStr = "",
              i = 0;
            if (testMsg.emotes !== null) {
              for (const emote in testMsg.emotes) {
                let str = emote + ":",
                  j = 0;
                for (let item of testMsg.emotes[emote]) {
                  if (j !== 0) str += ",";
                  str += item;
                  j += 1;
                }
                if (i !== 0) rawStr += "/";
                rawStr += str;
                i += 1;
              }
              userData["emotes-raw"] = rawStr;
            }
            userData["emotes"] = testMsg.emotes;
            (window as any).ChatBox.processMessage(null, userData, testMsg.msg);
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
};

const twipChatClear = (request: ChromeRuntimeSendMessageRequest) => {
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
};

export {};
