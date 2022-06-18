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

interface TwitchBadge {
  broadcaster?: string;
  moderator?: string;
  partner?: string;
  subcriber?: string;
}

interface TwitchUser {
  badges: TwitchBadge | null;
  "badges-raw": string | null;
  color: string | null;
  "display-name": string;
  emotes: Object | null;
  "emotes-raw": string | null;
  "first-msg": boolean;
  id: string;
  "message-type": string;
  mod: boolean;
  "returning-chatter": boolean;
  "room-id": string;
  subscriber: boolean;
  turbo: boolean;
  "user-id": string;
  "user-type": string | null;
  username: string;
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
          tabId: request.tabId as number,
        },
        func: () => {
          (window["testuser" as any] as any) = {
            badges: null,
            "badges-raw": null,
            color: null,
            "display-name": "testuser",
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
            "user-id": "tesetuser",
            "user-type": null,
            username: "testuser",
          };
        },
        world: "MAIN",
      });
    } else if (request.type === "chat-control") {
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
                tabId: request.tabId as number,
              },
              func: () => {
                (window as any).ChatBox.processMessage(
                  null,
                  window["testuser" as any],
                  "hello world"
                );
              },
              world: "MAIN",
            });
          }, senderId);
          intervals[senderId] = interval;
        }
      } else {
        intervals[senderId].clear();
        intervals[senderId] = null;
      }
    } else if (request.type === "clear-chat") {
      chrome.scripting.executeScript({
        target: {
          tabId: request.tabId as number,
        },
        func: () => {
          (window as any).document.getElementById("log").innerHTML = "";
        },
        world: "MAIN",
      });
    }
  }
});
