export const chromeAlert = async (tabId: number, msg: string) => {
  await chrome.scripting.executeScript({
    target: {
      tabId,
    },
    func: (msg) => {
      window.alert(msg);
    },
    args: [msg],
    world: "MAIN",
  });
};

export const chromeConfirm = async (
  tabId: number,
  msg: string,
  callback: () => void
) => {
  await chrome.scripting
    .executeScript({
      target: {
        tabId,
      },
      func: (msg) => {
        return window.confirm(msg);
      },
      args: [msg],
      world: "MAIN",
    })
    .then((result) => result[0].result)
    .then((result) => {
      if (result) callback();
    });
};

export const getAutosaveLocalStorageKey = (twipChatboxId: string) =>
  `TWIP_CHATBOX_AUTOSAVE_${twipChatboxId}`;

export const isVaildTwipChatboxSettingsPage = (url: string) =>
  url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/) ? true : false;
