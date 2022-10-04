import type { ChatTestType } from "./global";

export const CHAT_TEST_TYPES: Array<ChatTestType> = [
  { id: 1, type: "트윕 오버레이 테스트", unavailable: false },
  { id: 2, type: "트위치 채팅 테스트", unavailable: false },
];

export const CHAT_TEST_ALERT_TEXT = {
  NOT_TWIP_CHATBOX_OVERLAY: "현재 탭이 트윕 챗박스 오버레이가 아닙니다.",
  NOT_TWITCH_CHAT_PAGE: "현재 탭이 트위치 채팅 페이지가 아닙니다.",
};

export const LOCALSTORAGE_KEYS = {
  chatTestType: "1",
  chatTestBtnState: "2",
  chatTestDelay: "3",
  chatTestRandomDelayOffset: "4",
  isChatTestRandomDelayOffset: "5",
  userTypeFilter: "6",
};
