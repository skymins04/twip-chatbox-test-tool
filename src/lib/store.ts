import { writable } from "svelte/store";
import { CHAT_TEST_TYPES, LOCALSTORAGE_KEYS } from "@lib/constant";
import type { ChatTestType, UserTypeFilter } from "@src/global";

/**
 * LocalStorage Init
 */
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
  if (!localStorage.getItem(LOCALSTORAGE_KEYS.userTypeFilter))
    localStorage.setItem(
      LOCALSTORAGE_KEYS.userTypeFilter,
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
})();

/**
 * Svelte Store Init
 */

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

export const testUserTypeFilter = writable<UserTypeFilter>(
  JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.userTypeFilter))
);

export const chatTestBtnState = writable<boolean>(
  JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.chatTestBtnState))
);

export const isVaildcurrentPage = writable("");

export const currentTabId = writable<number>(null);