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

export async function chromeConfirm(tabId: number, msg: string) {
  return await chrome.scripting
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
    .then((result) => result[0].result);
}

export async function chromePrompt(
  tabId: number,
  msg: string,
  defaultValue = ""
) {
  return await chrome.scripting
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
}

export async function getTwipOverlayData(tabId: number) {
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
}

export const getAutosavedThemeLocalStorageKey = (twipChatboxId: string) =>
  `TWIP_CHATBOX_AUTOSAVE_${twipChatboxId}`;

export const getManualsavedThemeLocalStorage = (id: string) =>
  `TWIP_CHATBOX_MANUALSAVE_${id}`;

export const isVaildTwipChatboxSettingsPage = (url: string) =>
  url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/) ? true : false;

export function generateRandomString(num) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
