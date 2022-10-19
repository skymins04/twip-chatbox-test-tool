import { writable } from "svelte/store";
import { CHAT_TEST_TYPES, LOCALSTORAGE_KEYS } from "@lib/constant";
import type {
  ChatTestType,
  ChromeRuntimeSendMessageRequest,
  TestMsg,
  UserTypeFilter,
} from "@src/global";
import { defaultTestMsgProfiles } from "@lib/chatTest";

/**
 * LocalStorage Init
 */
(async () => {
  const currentTab = await chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => tabs[0]);
  const getCurrentTabLocalstorageKey = (str: string) =>
    str + "_" + currentTab.id;
  currentTabId.set(currentTab.id);

  /**
   * Chatting Test Store init.
   */

  const localstorageChatTestType = localStorage.getItem(
    getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.chatTestType)
  );
  const localstorageChatTestDelay = localStorage.getItem(
    getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.chatTestDelay)
  );
  const localstorageChatTestRandomDelayOffset = localStorage.getItem(
    getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.chatTestRandomDelayOffset)
  );
  const localstorageIsChatTestRandomDelayOffset = localStorage.getItem(
    getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.isChatTestRandomDelayOffset)
  );
  const localstorageChatTestBtnState = localStorage.getItem(
    getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.chatTestBtnState)
  );
  const localstorageUserTypeFilter = localStorage.getItem(
    getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.userTypeFilter)
  );
  const localstorageTestMsg = localStorage.getItem(LOCALSTORAGE_KEYS.testMsg);

  if (!localstorageChatTestType)
    localStorage.setItem(
      getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.chatTestType),
      JSON.stringify(CHAT_TEST_TYPES[0])
    );
  else chatTestBtnState.set(JSON.parse(localstorageChatTestType));

  if (!localstorageChatTestDelay)
    localStorage.setItem(
      getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.chatTestDelay),
      "1000"
    );
  else defaultChatTestDelay.set(parseInt(localstorageChatTestDelay));

  if (!localstorageChatTestRandomDelayOffset)
    localStorage.setItem(
      getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.chatTestRandomDelayOffset),
      "1000"
    );
  else
    randomChatTestDelayOffset.set(
      parseInt(localstorageChatTestRandomDelayOffset)
    );

  if (!localstorageIsChatTestRandomDelayOffset)
    localStorage.setItem(
      getCurrentTabLocalstorageKey(
        LOCALSTORAGE_KEYS.isChatTestRandomDelayOffset
      ),
      "false"
    );
  else
    isRandomChatTestDelayOffset.set(
      JSON.parse(localstorageIsChatTestRandomDelayOffset)
    );

  if (!localstorageChatTestBtnState)
    localStorage.setItem(
      getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.chatTestBtnState),
      "false"
    );
  else chatTestBtnState.set(JSON.parse(localstorageChatTestBtnState));

  if (!localstorageUserTypeFilter)
    localStorage.setItem(
      getCurrentTabLocalstorageKey(LOCALSTORAGE_KEYS.userTypeFilter),
      JSON.stringify({
        broadcaster: true,
        moderator: true,
        partner: true,
        subscriber: true,
        turbo: true,
        normal: true,
        premium: true,
        bits: true,
        admin: true,
        staff: true,
      } as UserTypeFilter)
    );
  else testUserTypeFilter.set(JSON.parse(localstorageUserTypeFilter));

  if (!localstorageTestMsg)
    localStorage.setItem(
      LOCALSTORAGE_KEYS.testMsg,
      JSON.stringify(defaultTestMsgProfiles)
    );
  else testMsgProfiles.set(JSON.parse(localstorageTestMsg));

  /**
   * Autosave Store init.
   */

  await chrome.storage.local
    .get(LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus)
    .then((result) => result[LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus])
    .then(async (result) => {
      if (result) {
        twipChatboxAutosaveStatus.set(JSON.parse(result));
      } else {
        await chrome.runtime.sendMessage({
          type: "twip-chatbox-autosave-enable",
          autosaveStatus: false,
        } as ChromeRuntimeSendMessageRequest);
        twipChatboxAutosaveStatus.set(false);
      }
    });
})();

/**
 * Svelte Store default init.
 */

export const selectedChatTestType = writable<ChatTestType>(CHAT_TEST_TYPES[0]);

export const defaultChatTestDelay = writable(1000);

export const randomChatTestDelayOffset = writable(1000);

export const isRandomChatTestDelayOffset = writable<boolean>(false);

export const testUserTypeFilter = writable<UserTypeFilter>({
  broadcaster: true,
  moderator: true,
  partner: true,
  subscriber: true,
  turbo: true,
  normal: true,
  premium: true,
  bits: true,
  admin: true,
  staff: true,
});

export const chatTestBtnState = writable<boolean>(false);

export const isVaildcurrentPage = writable("");

export const currentTabId = writable<number>(null);

export const isLoading = writable<boolean>(true);

export const testMsgProfiles = writable<Array<TestMsg>>(defaultTestMsgProfiles);

export const twipChatboxAutosaveStatus = writable<boolean>(false);
