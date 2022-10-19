import type {
  ChromeRuntimeSendMessageRequest,
  TestMsg,
  TwipOverlay,
  TwipUser,
} from "@src/global";
import { getTestMsgProfile, getTestTwitchUserProfile } from "@lib/chatTest";
import { LOCALSTORAGE_KEYS } from "./lib/constant";

const tabStatus: { [key: string]: "alive" | "closed" } = {};
const twipChatboxAutosaveIntervals: {
  [key: string]: { tabId: string; interval: chrome.alarms.Alarm };
} = {};

const chatControls: {
  [key: string]: {
    intervalTime: number;
    offsetTime: number;
    offsetFlag: boolean;
  };
} = {};
const twipChatboxTextIntervals: { [key: string]: ChatTestInterval } = {};

const chromeAlert = async (tabId: number, msg: string) => {
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
const chromeConfirm = async (
  tabId: number,
  msg: string,
  callback: () => void
) => {
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
      if (result) callback();
    });
};
const getAutosaveLocalStorageKey = (twipChatboxId: string) =>
  `TWIP_CHATBOX_AUTOSAVE_${twipChatboxId}`;
const isVaildTwipChatboxSettingsPage = (url: string) =>
  url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/) ? true : false;

const createTwipChatBoxAutosaveInterval = async (
  tabId: number,
  twipChatboxId: string
) => {
  chrome.alarms.create(`twip-autosave_${tabId}_${twipChatboxId}`, {
    periodInMinutes: (1 / 60) * 5,
  });
  twipChatboxAutosaveIntervals[twipChatboxId] = {
    tabId: tabId.toString(),
    interval: await chrome.alarms.get(
      `twip-autosave_${tabId}_${twipChatboxId}`
    ),
  };
  chrome.action.setIcon({
    tabId,
    path: { "48": "icon/icon48-autosave.png" },
  });
  chrome.action.setTitle({
    tabId,
    title:
      "Twip chatbox test tool\n\n현재 탭에서 Twip Chatbox 커스텀테마 소스코드 자동저장이 실행 중입니다.",
  });
  await chromeAlert(
    tabId,
    "현재 탭에서 Twip Chatbox 커스텀테마 소스코드 자동저장이 실행되었습니다."
  );
};

const stopTwipChatboxAutosave = async (twipChatboxId: string) => {
  if (twipChatboxAutosaveIntervals[twipChatboxId]) {
    const tabId = parseInt(twipChatboxAutosaveIntervals[twipChatboxId].tabId);
    await chrome.alarms.clear(
      twipChatboxAutosaveIntervals[twipChatboxId].interval.name
    );
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

const runTwipChatboxAutosave = async (
  tabId: number,
  tab: chrome.tabs.Tab,
  runOption = true
) => {
  if (runOption) {
    if (isVaildTwipChatboxSettingsPage(tab.url)) {
      tabStatus[tabId.toString()] = "alive";
      const twipChatboxId = await chrome.scripting
        .executeScript({
          target: {
            tabId,
          },
          func: () => {
            const $ = (window as any).$;
            const twipChatboxDemoSrc = $("#demo").attr("src") as string;
            const twipChatboxId = twipChatboxDemoSrc.match(
              /(?<=\/widgets\/chatbox\/).*(?=\?demo\=1)/
            );
            return twipChatboxId[0];
          },
          args: [],
          world: "MAIN",
        })
        .then((matchResult) => matchResult[0].result);
      if (!twipChatboxAutosaveIntervals[twipChatboxId]) {
        await createTwipChatBoxAutosaveInterval(tabId, twipChatboxId);
      } else if (
        twipChatboxAutosaveIntervals[twipChatboxId].tabId !== tabId.toString()
      ) {
        await chromeConfirm(
          tabId,
          "이미 동일한 Twip Chatbox가 다른 탭에서 자동저장을 실행 중이므로 현재 탭에서 자동저장을 실행할 수 없습니다.\n다른 탭에서 실행중인 자동저장을 종료하고 현재 탭에서 자동저장을 실행할까요?",
          async () => {
            await stopTwipChatboxAutosave(twipChatboxId);
            await createTwipChatBoxAutosaveInterval(tabId, twipChatboxId);
          }
        );
      }
    }
  } else {
    for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
      if (
        twipChatboxAutosaveIntervals[twipChatboxId].tabId === tabId.toString()
      ) {
        await stopTwipChatboxAutosave(twipChatboxId);
      }
    }
    await chromeAlert(
      tabId,
      "현재 탭의 Twip Chatbox 커스텀테마 소스코드 자동저장이 종료되었습니다."
    );
  }
};

class ChatTestInterval {
  constructor(callback: () => void, tabId: string) {
    this.callback = callback;
    this.tabId = tabId;
    this.set();
  }

  private callback: () => void;
  private tabId: string;
  private timer: NodeJS.Timeout | null = null;

  private set() {
    this.timer = setTimeout(
      async () => {
        await this.callback();
        await this.set();
      },
      chatControls[this.tabId].offsetFlag
        ? chatControls[this.tabId].intervalTime +
            chatControls[this.tabId].offsetTime * Math.random()
        : chatControls[this.tabId].intervalTime
    );
  }

  clear() {
    if (this.timer) clearTimeout(this.timer);
  }
}

const twipChatControl = (request: ChromeRuntimeSendMessageRequest) => {
  if (twipChatboxTextIntervals[request.tabId.toString()]) {
    twipChatboxTextIntervals[request.tabId.toString()].clear();
    delete twipChatboxTextIntervals[request.tabId.toString()];
  }
  chatControls[request.tabId.toString()] = {
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
    }, request.tabId.toString());
    twipChatboxTextIntervals[request.tabId.toString()] = interval;
  } else {
    if (twipChatboxTextIntervals[request.tabId.toString()]) {
      twipChatboxTextIntervals[request.tabId.toString()].clear();
      delete twipChatboxTextIntervals[request.tabId.toString()];
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

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const alarmType = alarm.name.split("_")[0];
  const tabId = parseInt(alarm.name.split("_")[1]);
  switch (alarmType) {
    case "twip-autosave":
      const twipChatboxId = alarm.name.split("_")[2];
      console.log(new Date(), tabId, twipChatboxId);
      if (tabStatus[tabId.toString()] === "closed") {
        await chrome.alarms.clear(alarm.name);
        if (twipChatboxAutosaveIntervals[twipChatboxId])
          delete twipChatboxAutosaveIntervals[twipChatboxId];
      } else {
        const customThemeSource = await chrome.scripting
          .executeScript({
            target: {
              tabId,
            },
            func: () => {
              const $ = (window as any).$;
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

        if (customThemeSource.css) {
          const autosaveLocalStorageKey =
            getAutosaveLocalStorageKey(twipChatboxId);

          let tmp: { [key: string]: any } = {};
          tmp[autosaveLocalStorageKey] = customThemeSource.css;
          await chrome.storage.local.set(tmp);

          tmp = {};
          const autosavedOverlayData: TwipOverlay = {
            localStorageKey: getAutosaveLocalStorageKey(twipChatboxId),
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
              } else {
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

chrome.runtime.onMessage.addListener(
  async (request: ChromeRuntimeSendMessageRequest, sender, sendResponse) => {
    switch (request.type) {
      case "twip-chat-control":
        console.log("hello world");
        if (request.tabId) twipChatControl(request);
        break;
      case "twip-chat-clear":
        twipChatClear(request);
        break;
      case "twip-chatbox-autosave-enable":
        const tmp: { [key: string]: boolean } = {};
        tmp[LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus] =
          request.autosaveStatus;
        await chrome.storage.local.set(tmp);

        if (request.tab) {
          let currentTabIsRunning = false;
          for (const twipChatboxId of Object.keys(
            twipChatboxAutosaveIntervals
          )) {
            if (
              twipChatboxAutosaveIntervals[twipChatboxId] &&
              twipChatboxAutosaveIntervals[twipChatboxId].tabId ===
                request.tab.id.toString()
            )
              currentTabIsRunning = true;
          }
          if (request.autosaveStatus) {
            if (
              !currentTabIsRunning &&
              isVaildTwipChatboxSettingsPage(request.tab.url)
            ) {
              await chromeConfirm(
                request.tab.id,
                "현재 탭에 Twip Chatbox 자동저장을 실행하시겠습니까?",
                async () => {
                  await runTwipChatboxAutosave(
                    request.tab.id,
                    request.tab,
                    true
                  );
                }
              );
            }
            await chromeAlert(
              request.tab.id,
              "(주의) 다른 탭의 Twip Chatbox 설정페이지들은 새로고침 후 자동저장이 실행됩니다."
            );
          }
        }
        break;
      case "twip-chatbox-get-autosave":
        let tmpTwipChatboxId: string = null;
        for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
          if (
            twipChatboxAutosaveIntervals[twipChatboxId] &&
            twipChatboxAutosaveIntervals[twipChatboxId].tabId ===
              request.tabId.toString()
          ) {
            return sendResponse({ autosaveStatus: true, twipChatboxId });
          } else if (
            twipChatboxAutosaveIntervals[twipChatboxId].tabId ===
            request.tabId.toString()
          ) {
            tmpTwipChatboxId = twipChatboxId;
          }
        }
        return sendResponse({
          autosaveStatus: false,
          twipChatboxId: tmpTwipChatboxId,
        });
      case "twip-chatbox-set-autosave":
        await runTwipChatboxAutosave(
          request.tab.id,
          request.tab,
          request.autosaveStatus
        );
        break;
      case "twip-chatbox-apply":
        if (isVaildTwipChatboxSettingsPage(request.tab.url)) {
          const customCSS: string = await chrome.storage.local
            .get(request.overlay.localStorageKey)
            .then((res) => res[request.overlay.localStorageKey]);
          await chrome.scripting.executeScript({
            target: {
              tabId: request.tab.id,
            },
            func: (css, title) => {
              const $ = (window as any).$;
              $(".CodeMirror")[0].CodeMirror.setValue(css);
              $('.styles[data-name="custom"]').click();
              $("#chatbox_name").val(title);
              $("#chatbox_name").trigger("change");
            },
            args: [customCSS, request.overlay.title],
            world: "MAIN",
          });
          await chromeAlert(
            request.tab.id,
            `현재 탭에 선택한 자동저장 오버레이를 적용했습니다.\nTwip Chatbox 설정페이지의 "설정하기" 버튼을 클릭해야 저장됩니다.`
          );
        }
        break;
    }
  }
);

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
    if (
      twipChatboxAutosaveIntervals[twipChatboxId] &&
      twipChatboxAutosaveIntervals[twipChatboxId].tabId === tabId.toString()
    ) {
      await chrome.alarms.clear(
        twipChatboxAutosaveIntervals[twipChatboxId].interval.name
      );
      delete twipChatboxAutosaveIntervals[twipChatboxId];
    }
  }
  if (tabStatus[tabId.toString()]) tabStatus[tabId.toString()] = "closed";

  const twipChatboxAutosaveStatus = await chrome.storage.local
    .get(LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus)
    .then((result) => result[LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus]);

  console.log(tabId, twipChatboxAutosaveStatus);

  if (twipChatboxAutosaveStatus === undefined) {
    const tmp: { [key: string]: boolean } = {};
    tmp[LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus] = false;
    await chrome.storage.local.set(tmp);
  }

  if (twipChatboxAutosaveStatus && changeInfo.status === "complete")
    await runTwipChatboxAutosave(tabId, tab);
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  if (tabStatus[tabId.toString()] === "alive") {
    tabStatus[tabId.toString()] = "closed";
    for (const twipChatboxId of Object.keys(twipChatboxAutosaveIntervals)) {
      if (
        twipChatboxAutosaveIntervals[twipChatboxId] &&
        twipChatboxAutosaveIntervals[twipChatboxId].tabId === tabId.toString()
      ) {
        await chrome.alarms.clear(
          twipChatboxAutosaveIntervals[twipChatboxId].interval.name
        );
        delete twipChatboxAutosaveIntervals[twipChatboxId];
      }
    }
  }
});

export {};
