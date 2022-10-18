<script lang="ts">
  import type { ChromeRuntimeSendMessageRequest, TwipAutosavedOverlays } from "@src/global";
  import { AUTOSAVE_ALERT_TEXT, LOCALSTORAGE_KEYS } from "@src/lib/constant";
  import { twipChatboxAutosaveStatus } from "@src/lib/store";
  let startFlag = false;
  let autosaveStatus = false;
  let isVaildTwipChatboxSettingsPage = false;
  let autosavedOverlays: TwipAutosavedOverlays = {};

  const toggleTwipChatboxAutosave = async () => {
    console.log('hello world');
    await chrome.runtime.sendMessage({
      type: "twip-chatbox-set-autosave",
      tab: await chrome.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]),
      autosaveStatus: !autosaveStatus
    } as ChromeRuntimeSendMessageRequest);
  };

  twipChatboxAutosaveStatus.subscribe(async (value) => {
    if(startFlag) {
      await chrome.runtime.sendMessage({
            type: "twip-chatbox-autosave-enable",
            autosaveStatus: value,
            tab: await chrome.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]),
          } as ChromeRuntimeSendMessageRequest);
      console.log(await chrome.storage.local.get(LOCALSTORAGE_KEYS.twipChatboxAutosaveStatus));
    }
    else {
      startFlag = true;
    }
  });

  (async () => {
    const currentTab = await chrome.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]);

    isVaildTwipChatboxSettingsPage = currentTab.url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/) ? true : false;

    const getAutosaveDatas = async () => {
      await chrome.runtime.sendMessage({
        type: "twip-chatbox-get-autosave",
        tabId: currentTab.id,
      } as ChromeRuntimeSendMessageRequest, (res) => {
        autosaveStatus = res.autosaveStatus;
      });

      await chrome.storage.local.get('TWIP_AUTOSAVED_OVERLAYS').then(({TWIP_AUTOSAVED_OVERLAYS}) => {
          if(!TWIP_AUTOSAVED_OVERLAYS) autosavedOverlays = {};
          else autosavedOverlays = TWIP_AUTOSAVED_OVERLAYS;
      });
    };

    getAutosaveDatas();

    setInterval(async () => {
      getAutosaveDatas();
    }, 100);
  })();

</script>

<div class="settings-tab-wrap">
  {#if !isVaildTwipChatboxSettingsPage}
    <div class="alert-text">{AUTOSAVE_ALERT_TEXT.NOT_TWIP_CHABOX_SETTINGS_PAGE}</div>
  {/if}

  <div class="settings-options">
    <div class="settings-options-item">
      <span class="title">현재탭 자동저장 상태</span>
      <div class="input">
        {autosaveStatus ? '활성' : '비활성'}
      </div>
    </div>
    <div class="settings-options-item">
      <span class="title">자동저장 항상 실행</span>
      <div class="input">
        <input type="checkbox" id="twip-chatbox-autosave-status-checkbox" bind:checked={$twipChatboxAutosaveStatus}/>
        <label for="twip-chatbox-autosave-status-checkbox" />
      </div>
    </div>
    <div class="settings-options-item">
      <span class="title">현재 탭 자동저장 실행</span>
      <div class="input">
        <div on:click={() => {if(isVaildTwipChatboxSettingsPage) toggleTwipChatboxAutosave()}} class={`btn ${isVaildTwipChatboxSettingsPage ? '' : 'disabled'}`}>{autosaveStatus ? '비활성화' : '활성화'}</div>
      </div>
    </div>
  </div>

  <div class="settings-autosaved-overlays">
    {#each Object.keys(autosavedOverlays) as key, i}
      <div class="settings-autosaved-overlay">
        {i+1}. {autosavedOverlays[key].title}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .settings-tab-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 30px;

    .alert-text {
      color: rgb(255, 44, 44);
      font-size: 12px;
    }

    .settings-options {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 10px;

      .settings-options-item {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 12px;
        }

        .input {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 5px;
        }
      }
    }    
  }
</style>