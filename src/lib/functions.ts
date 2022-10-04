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
  userTypeFilter,
} from "@src/store";
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
    userTypeFilter: get(userTypeFilter),
  };
}

export function sendMsgToChromeRuntime(type: ChromeRuntimeSendMessageType) {
  chrome.runtime.sendMessage(getChromeRuntimeSendMessageParam(type));
}
