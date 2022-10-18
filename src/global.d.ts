/// <reference types="svelte" />

export interface TwitchBadge {
  broadcaster?: string;
  moderator?: string;
  partner?: string;
  subscriber?: string;
  turbo?: string;
  premium?: string;
  bits?: string;
  admin?: string;
  staff?: string;
}

export type TwitchUserType =
  | "broadcaster"
  | "moderator"
  | "partner"
  | "subscriber"
  | "turbo"
  | "normal"
  | "premium"
  | "bits"
  | "admin"
  | "staff";

export interface TestMsgEmoticon {
  symbol: string;
  code: number;
  imgSrc: string;
}

export interface TwipUser {
  type: TwitchUserType;
  userData: {
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
  };
}

export interface TestMsg {
  msg: string;
  emotes: {
    [key: number]: Array<string>;
  } | null;
}

export interface ChatTestType {
  id: number;
  type: string;
  unavailable: boolean;
}
export type ChromeRuntimeSendMessageType =
  | "twip-chat-control"
  | "twip-chat-clear"
  | "twip-chatbox-autosave-enable"
  | "twip-chatbox-get-autosave"
  | "twip-chatbox-set-autosave";

export interface UserTypeFilter {
  [key: TwitchUserType]: boolean;
}
export interface ChromeRuntimeSendMessageRequest {
  type: ChromeRuntimeSendMessageType;
  tabActivate?: boolean;
  runningState?: boolean;
  intervalTime?: number;
  randomFlag?: boolean;
  randomOffset?: number;
  tabId?: number | null;
  tab?: chrome.tabs.Tab;
  testUserTypeFilter?: UserTypeFilter;
  testMsgs?: Array<TestMsg>;
  autosaveStatus?: boolean;
}

export interface TwipOverlay {
  localStorageKey: string;
  chatboxId: string;
  latestUpdate: string;
  title: string;
}

export interface TwipOverlays {
  [key: string]: TwipOverlay;
}
