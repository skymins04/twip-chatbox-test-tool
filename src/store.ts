import { writable } from "svelte/store";
import { CHAT_TEST_TYPES, LOCALSTORAGE_KEYS } from "./constant";
import type { ChatTestType } from "./global";

(() => {
  if (!localStorage.getItem(LOCALSTORAGE_KEYS.chatTestType))
    localStorage.setItem(
      LOCALSTORAGE_KEYS.chatTestType,
      JSON.stringify(CHAT_TEST_TYPES[0])
    );
  if (!localStorage.getItem(LOCALSTORAGE_KEYS.chatTestDelay))
    localStorage.setItem(LOCALSTORAGE_KEYS.chatTestDelay, "1000");
  if (!localStorage.getItem(LOCALSTORAGE_KEYS.chatTestRandomDelayOffset))
    localStorage.setItem(LOCALSTORAGE_KEYS.chatTestRandomDelayOffset, "1000");
  if (!localStorage.getItem(LOCALSTORAGE_KEYS.isChatTestRandomDelayOffset))
    localStorage.setItem(
      LOCALSTORAGE_KEYS.isChatTestRandomDelayOffset,
      "false"
    );
  if (!localStorage.getItem(LOCALSTORAGE_KEYS.chatTestBtnState))
    localStorage.setItem(LOCALSTORAGE_KEYS.chatTestBtnState, "false");
})();

export const selectedChatTestType = writable<ChatTestType>(
  JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.chatTestType))
);

export const defaultChatTestDelay = writable(
  parseInt(localStorage.getItem(LOCALSTORAGE_KEYS.chatTestDelay))
);

export const randomChatTestDelayOffset = writable(
  parseInt(localStorage.getItem(LOCALSTORAGE_KEYS.chatTestRandomDelayOffset))
);

export const isRandomChatTestDelayOffset = writable<boolean>(
  JSON.parse(
    localStorage.getItem(LOCALSTORAGE_KEYS.isChatTestRandomDelayOffset)
  )
);

export const chatTestBtnState = writable<boolean>(
  JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.chatTestBtnState))
);

export const isVaildcurrentPage = writable("");

export const currentTabId = writable<number>(null);
