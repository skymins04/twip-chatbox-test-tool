import type {
  ChromeRuntimeSendMessageRequest,
  ChromeRuntimeSendMessageType,
  TestMsg,
} from "@src/global";
import { get } from "svelte/store";
import { testMsgEmoticons } from "@lib/common/chatTest";
import {
  chatTestBtnState,
  currentTabId,
  defaultChatTestDelay,
  isRandomChatTestDelayOffset,
  isVaildcurrentPage,
  randomChatTestDelayOffset,
  testMsgProfiles,
  testUserTypeFilter,
} from "@lib/popup/store";

export function getChromeRuntimeSendMessageParam(
  type: ChromeRuntimeSendMessageType
): ChromeRuntimeSendMessageRequest {
  return {
    type,
    tabActivate: get(isVaildcurrentPage) === "",
    runningState: get(chatTestBtnState),
    intervalTime: get(defaultChatTestDelay),
    randomFlag: get(isRandomChatTestDelayOffset),
    randomOffset: get(randomChatTestDelayOffset),
    tabId: get(currentTabId),
    testUserTypeFilter: get(testUserTypeFilter),
    testMsgs: get(testMsgProfiles),
  };
}

export function sendMsgToChromeRuntime(type: ChromeRuntimeSendMessageType) {
  chrome.runtime.sendMessage(getChromeRuntimeSendMessageParam(type));
}

export function getTestMsgPreviewHTMLString(rawStr: string) {
  let tmp = rawStr;

  testMsgEmoticons.forEach((emoticon) => {
    tmp = tmp.replace(
      new RegExp(`\\\$${emoticon.symbol}`, "g"),
      `<img src="${emoticon.imgSrc}" alt=""/>`
    );
  });

  return tmp;
}

export function getTestMsgByRawString(rawStr: string): TestMsg {
  const testMsg: TestMsg = { msg: rawStr, emotes: null };

  testMsgEmoticons.forEach((emoticon) => {
    const emoticonRegExp = new RegExp(`\\\$${emoticon.symbol}`, "g");
    for (
      let result = emoticonRegExp.exec(rawStr);
      result !== null;
      result = emoticonRegExp.exec(rawStr)
    ) {
      const code = emoticon.code.toString();
      const emoticonIndex = `${result.index}-${
        result.index + emoticon.symbol.length
      }`;
      if (!testMsg.emotes) testMsg.emotes = {};
      if (!testMsg.emotes[code]) testMsg.emotes[code] = [];
      testMsg.emotes[code].push(emoticonIndex);
    }
  });

  return testMsg;
}

export function generateRandomString(num) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function getCurrentTabLocalstorageKey(str: string) {
  return str + "_" + get(currentTabId);
}
