import type {
  ChromeRuntimeSendMessageRequest,
  TestMsg,
  TwipOverlay,
  TwipUser,
  UserTypeFilter,
} from "@src/global";
import { testTwitchUserProfiles } from "@src/lib/common/chatTest";
import { LOCALSTORAGE_KEYS } from "@lib/common/constant";
import {
  chromeAlert,
  chromeConfirm,
  chromePrompt,
  generateRandomString,
  getAutosavedThemeLocalStorageKey,
  getManualsavedThemeLocalStorage,
  getTwipOverlayData,
  isVaildTwipChatboxSettingsPage,
} from "@lib/background/functions";

const tabStatus: { [key: string]: "alive" | "closed" } = {};
const twipChatboxAutosaveIntervals: {
  [key: string]: { tabId: string; interval: chrome.alarms.Alarm };
} = {};

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
      } else {
        const customThemeSource = await getTwipOverlayData(tabId);

        if (
          customThemeSource &&
          customThemeSource.css &&
          customThemeSource.title &&
          customThemeSource.timestamp
        ) {
          const autosaveLocalStorageKey =
            getAutosavedThemeLocalStorageKey(twipChatboxId);

          let tmp: { [key: string]: any } = {};
          tmp[autosaveLocalStorageKey] = customThemeSource.css;
          await chrome.storage.local.set(tmp);

          tmp = {};
          const autosavedOverlayData: TwipOverlay = {
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
      case "twip-chatbox-chattest-control":
        if (request.tabId) await twipChatControl(request);
        break;
      case "twip-chatbox-chattest-clear":
        await twipChatClear(request);
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
              if (
                await chromeConfirm(
                  request.tab.id,
                  "현재 탭에 Twip Chatbox 자동저장을 실행하시겠습니까?"
                )
              ) {
                await runTwipChatboxAutosave(request.tab.id, request.tab, true);
              }
            }
            await chromeAlert(
              request.tab.id,
              "(주의) 다른 탭의 Twip Chatbox 설정페이지들은 새로고침 후 자동저장이 실행됩니다."
            );
          }
        }
        break;
      case "twip-chatbox-autosave-get":
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
      case "twip-chatbox-autosave-set":
        await runTwipChatboxAutosave(
          request.tab.id,
          request.tab,
          request.autosaveStatus
        );
        break;
      case "twip-chatbox-overlay-apply":
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
      case "twip-chatbox-overlay-save":
        if (isVaildTwipChatboxSettingsPage(request.tab.url)) {
          const customThemeSource = await getTwipOverlayData(request.tab.id);
          if (
            customThemeSource &&
            customThemeSource.css &&
            customThemeSource.title &&
            customThemeSource.timestamp
          ) {
            const overlayCustomThemeTitle = await chromePrompt(
              request.tab.id,
              "저장할 오버레이 커스텀 테마의 이름을 입력하세요.",
              customThemeSource.title
            );

            const themeId = generateRandomString(10);
            const manualSavedLocalStorageKey =
              getManualsavedThemeLocalStorage(themeId);
            let tmp: { [key: string]: any } = {};
            tmp[manualSavedLocalStorageKey] = customThemeSource.css;
            await chrome.storage.local.set(tmp);

            tmp = {};
            const manualSavedOverlayData: TwipOverlay = {
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
                } else {
                  tmp = TWIP_MANUALSAVED_OVERLAYS;
                  tmp[themeId] = manualSavedOverlayData;
                  await chrome.storage.local.set({
                    TWIP_MANUALSAVED_OVERLAYS: tmp,
                  });
                }
              });
            await chromeAlert(
              request.tab.id,
              `커스텀 테마 "${overlayCustomThemeTitle}"가 저장되었습니다.`
            );
            sendResponse({});
            break;
          }
        }
      case "twip-chatbox-overlay-rename":
        await chrome.storage.local
          .get("TWIP_MANUALSAVED_OVERLAYS")
          .then(async ({ TWIP_MANUALSAVED_OVERLAYS }) => {
            if (
              TWIP_MANUALSAVED_OVERLAYS &&
              TWIP_MANUALSAVED_OVERLAYS[request.overlay.chatboxId]
            ) {
              let tmp: { [key: string]: any } = TWIP_MANUALSAVED_OVERLAYS;
              tmp[request.overlay.chatboxId].title = request.overlay.title;
              await chrome.storage.local.set({
                TWIP_MANUALSAVED_OVERLAYS: tmp,
              });
            }
          });
        sendResponse({});
        break;
      case "twip-chatbox-overlay-remove":
        if (
          await chromeConfirm(
            request.tab.id,
            "정말 오버레이를 삭제하시겠습니까?\n삭제된 오버레이는 복구할 수 없습니다."
          )
        ) {
          await chrome.storage.local
            .get("TWIP_MANUALSAVED_OVERLAYS")
            .then(async ({ TWIP_MANUALSAVED_OVERLAYS }) => {
              if (
                TWIP_MANUALSAVED_OVERLAYS &&
                TWIP_MANUALSAVED_OVERLAYS[request.overlay.chatboxId]
              ) {
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
        } else {
          sendResponse({});
        }
        break;
    }
  }
);

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  /**
   * Twip Chatting test
   */

  if (
    tab.url.match(
      /^https:\/\/(www\.)?twip\.kr\/widgets\/chatbox\/[0-9|a-z|A-Z]+/
    ) &&
    changeInfo.status === "complete"
  ) {
    /**
     * Twip Chatbox 위젯 페이지 접속시 채팅 테스트에 필요한 함수 및 클래스, 객체 세팅을 최초 1회 실행
     */
    await chrome.scripting.executeScript({
      target: {
        tabId,
      },
      func: (testTwitchUserProfiles: Array<TwipUser>) => {
        const _w = window as any;

        _w.getTestMsgProfile = (msgs: Array<TestMsg>) =>
          msgs[Math.floor(Math.random() * msgs.length)];
        _w.getTestTwitchUserProfile = (filter?: UserTypeFilter) => {
          const userProfiles = filter
            ? testTwitchUserProfiles.filter((itm) => filter[itm.type])
            : testTwitchUserProfiles;

          return userProfiles[Math.floor(Math.random() * userProfiles.length)];
        };

        _w.chatControls = {};
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
              _w.chatControls[this.tabId].offsetFlag
                ? _w.chatControls[this.tabId].intervalTime +
                    _w.chatControls[this.tabId].offsetTime * Math.random()
                : _w.chatControls[this.tabId].intervalTime
            );
          }

          clear() {
            if (this.timer) clearTimeout(this.timer);
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
  /**
   * 탭 제거 시 해당 탭에 실행 중인 Autosave 정지
   */
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

/**
 * Autosave Functions
 */

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
        if (
          await chromeConfirm(
            tabId,
            "이미 동일한 Twip Chatbox가 다른 탭에서 자동저장을 실행 중이므로 현재 탭에서 자동저장을 실행할 수 없습니다.\n다른 탭에서 실행중인 자동저장을 종료하고 현재 탭에서 자동저장을 실행할까요?"
          )
        ) {
          await stopTwipChatboxAutosave(twipChatboxId);
          await createTwipChatBoxAutosaveInterval(tabId, twipChatboxId);
        }
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

/**
 * Twip Chatting test Functions
 */

const twipChatControl = async (request: ChromeRuntimeSendMessageRequest) => {
  if (request.runningState && request.tabId) {
    /**
     * run twip chatting test
     */
    await chrome.scripting.executeScript({
      target: {
        tabId: request.tabId,
      },
      func: (request: ChromeRuntimeSendMessageRequest) => {
        const _w = window as any;
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
          const testUser = _w.getTestTwitchUserProfile(
            request.testUserTypeFilter
          );
          const testMsg = _w.getTestMsgProfile(request.testMsgs);
          const userData = testUser.userData;

          let rawStr = "";
          let i = 0;
          if (testMsg.emotes !== null) {
            for (const emote in testMsg.emotes) {
              let tmpStr = emote + ":";
              let j = 0;
              for (const item of testMsg.emotes[emote]) {
                if (j !== 0) tmpStr += ",";
                tmpStr += item;
                j += 1;
              }
              if (i !== 0) rawStr += "/";
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
  } else if (!request.runningState && request.tabId) {
    /**
     * stop twip chatting test
     */
    await chrome.scripting.executeScript({
      target: {
        tabId: request.tabId,
      },
      func: (tabId: number) => {
        const _w = window as any;
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

const twipChatClear = async (request: ChromeRuntimeSendMessageRequest) => {
  await chrome.scripting.executeScript({
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
