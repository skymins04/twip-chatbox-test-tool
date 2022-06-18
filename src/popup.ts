let store: any = {
  tabActivate: false,
  runningState: false,
  intervalTime: 1000,
  randomFlag: false,
  randomOffset: 1000,
};
type StoreKeyType =
  | "tabActivate"
  | "runningState"
  | "intervalTime"
  | "randomFlag"
  | "randomOffset";
let isReady = false;
let tabId: number | undefined;
const startBtn = $("#start-btn");
const clearBtn = $("#clear-btn");
const importBtn = $("#import-btn");
const exportBtn = $("#export-btn");
const intervalInput = $("#input-interval");
const intervalOffsetInput = $("#input-interval-offset");
const intervalOffsetChk = $("#input-chk-interval-offset");

const getStore = (key: StoreKeyType) => {
  return store[key];
};
const setStore = (key: StoreKeyType, value: any) => {
  if (
    key === "tabActivate" ||
    key === "runningState" ||
    key === "intervalTime" ||
    key === "randomFlag" ||
    key === "randomOffset"
  ) {
    store[key] = value;
    localStorage.setItem("store", JSON.stringify(store));
  }
};

$(document).on("DOMContentLoaded", (event) => {
  const data = localStorage.getItem("store");
  if (data) {
    store = JSON.parse(data);
  }
  if (getStore("runningState")) {
    $("#start-btn").addClass("on");
    $("#start-btn").removeClass("off");
  } else {
    $("#start-btn").addClass("off");
    $("#start-btn").removeClass("on");
  }
  intervalInput.val(parseInt(getStore("intervalTime")));
  intervalOffsetInput.val(parseInt(getStore("randomOffset")));
  intervalOffsetChk.prop("checked", getStore("randomFlag"));
  if (getStore("randomFlag")) {
    intervalOffsetInput.prop("disabled", false);
  } else {
    intervalOffsetInput.prop("disabled", true);
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentURL = tabs[0].url;
    tabId = tabs[0].id;
    if (currentURL?.match(/^https:\/\/twip\.kr\/widgets\/chatbox\/.+$/)) {
      setStore("tabActivate", true);
      $("#state-msg").html("current tab is twip chatbox");
      startBtn.removeClass("blocked");
      $(".btns").addClass("active");
      isReady = true;
      chrome.runtime.sendMessage({ type: "tool-start", tabId });
    } else {
      setStore("tabActivate", false);
      $("#state-msg").html("current tab isn't twip chatbox");
      startBtn.addClass("blocked");
      $(".btns").removeClass("active");
      isReady = false;
    }
  });
});

startBtn.on("click", (event) => {
  if (!getStore("runningState") && isReady && startBtn.hasClass("off")) {
    setStore("runningState", true);
    startBtn.removeClass("off");
    startBtn.addClass("on");
  } else if (isReady) {
    setStore("runningState", false);
    startBtn.removeClass("on");
    startBtn.addClass("off");
  }

  chrome.runtime.sendMessage({ type: "chat-control", ...store, tabId });
});

clearBtn.on("click", (event) => {
  chrome.runtime.sendMessage({ type: "clear-chat", tabId });
});

intervalInput.on("change", (event) => {
  let val = parseInt($(event.target).val() as string);
  if (val < 10) val = 10;

  setStore("intervalTime", val);
  chrome.runtime.sendMessage({ type: "chat-control", ...store, tabId });
});
intervalOffsetChk.on("change", (event) => {
  const flag = $(event.target).prop("checked");
  setStore("randomFlag", flag);
  if (flag) {
    intervalOffsetInput.prop("disabled", false);
  } else {
    intervalOffsetInput.prop("disabled", true);
  }
  chrome.runtime.sendMessage({ type: "chat-control", ...store, tabId });
});
intervalOffsetInput.on("change", (event) => {
  let val = parseInt($(event.target).val() as string);
  if (val < 10) val = 10;

  setStore("randomOffset", val);
  chrome.runtime.sendMessage({ type: "chat-control", ...store, tabId });
});
