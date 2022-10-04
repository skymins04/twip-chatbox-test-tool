import type {
  ChromeRuntimeSendMessageRequest,
  ChromeRuntimeSendMessageType,
} from "@src/global";
import {
  chatTestBtnState,
  currentTabId,
  defaultChatTestDelay,
  isRandomChatTestDelayOffset,
  isVaildcurrentPage,
  randomChatTestDelayOffset,
  testUserTypeFilter,
} from "@lib/store";
import { get } from "svelte/store";

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
  };
}

export function sendMsgToChromeRuntime(type: ChromeRuntimeSendMessageType) {
  chrome.runtime.sendMessage(getChromeRuntimeSendMessageParam(type));
}
