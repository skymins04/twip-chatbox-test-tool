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

export const chromePrompt = async (
  tabId: number,
  msg: string,
  defaultValue = ""
) => {
  await chrome.scripting
    .executeScript({
      target: {
        tabId,
      },
      func: (msg, defaultValue) => {
        return window.prompt(msg, defaultValue);
      },
      args: [msg, defaultValue],
      world: "MAIN",
    })
    .then((result) => result[0].result);
};

export const getTwipOverlayData = async (tabId: number) => {
  return await chrome.scripting
    .executeScript({
      target: {
        tabId,
      },
      func: () => {
        const $ = (window as any).$;
        const date = new Date();
        return {
          css: $(".CodeMirror")[0].CodeMirror.getValue(),
          title: $("#chatbox_name").val(),
          timestamp: `${date.toLocaleDateString()}  ${date.toLocaleTimeString()}`,
        };
      },
      world: "MAIN",
    })
    .then((result) => result[0].result);
};

export const getAutosaveLocalStorageKey = (twipChatboxId: string) =>
  `TWIP_CHATBOX_AUTOSAVE_${twipChatboxId}`;

export const isVaildTwipChatboxSettingsPage = (url: string) =>
  url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/) ? true : false;
