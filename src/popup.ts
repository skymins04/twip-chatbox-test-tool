let store = {
  tabActivate: false,
  runningState: false,
};
type StoreKeyType = "tabActivate" | "runningState";
let isReady = false;
const startBtn = $("#start-btn");

const getStore = (key: StoreKeyType) => {
  return store[key];
};
const setStore = (key: StoreKeyType, value: any) => {
  if (key === "tabActivate" || key === "runningState") {
    store[key] = value;
    localStorage.setItem("store", JSON.stringify(store));
  }
};

$(document).on("DOMContentLoaded", (event) => {
  const data = localStorage.getItem("store");
  if (data) {
    store = JSON.parse(data);
  }
  setInterval(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentURL = tabs[0].url;
      if (currentURL?.match(/^https:\/\/twip\.kr\/widgets\/chatbox\/.+$/)) {
        setStore("tabActivate", true);
        $("#state-msg").html("current tab is twip chatbox");
        startBtn.removeClass("blocked");
        $(".btns").addClass("active");
        isReady = true;
      } else {
        setStore("tabActivate", false);
        $("#state-msg").html("current tab isn't twip chatbox");
        startBtn.addClass("blocked");
        $(".btns").removeClass("active");
        isReady = false;
      }
    });
  }, 10);
});

startBtn.on("click", async (event) => {
  console.log(getStore("runningState"), isReady, startBtn.hasClass("off"));
  if (!getStore("runningState") && isReady && startBtn.hasClass("off")) {
    setStore("runningState", true);
    startBtn.removeClass("off");
    startBtn.addClass("on");
  } else if (isReady) {
    setStore("runningState", false);
    startBtn.removeClass("on");
    startBtn.addClass("off");
  }

  chrome.runtime.sendMessage({ runningState: getStore("runningState") });
});
