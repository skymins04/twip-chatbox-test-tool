<script lang="ts">
  import { Dialog, DialogOverlay, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";
  import type { ChromeRuntimeSendMessageRequest, TwipOverlay, TwipOverlays } from "@src/global";
  import { AUTOSAVE_ALERT_TEXT, LOCALSTORAGE_KEYS } from "@src/lib/constant";
  import { useEffect } from "@src/lib/hooks";
  import { twipChatboxAutosaveStatus } from "@src/lib/store";
  import CodeMirror from "svelte-codemirror-editor";
  import {css} from "@codemirror/lang-css";

  let startFlag = false;
  let autosaveStatus = false;
  let isVaildTwipChatboxSettingsPage = false;
  let autosavedOverlays: TwipOverlays = {};
  let selectedAutosavedOverlayIndex: number = null;
  let selectedAutosavedOverlay: TwipOverlay = null;
  let selectedAutosavedOverlayCSSContent: string = null;
  let isVaildSelectedAutosavedOverlay = false;
  let currentTabTwipChatboxId: string = null;
  let isOpenPreviewOverlay = false;

  const toggleTwipChatboxAutosave = async () => {
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

  const clickGoToOverlaySettingsPage = async () => {if(isVaildSelectedAutosavedOverlay) {await chrome.tabs.create({url: `https://twip.kr/dashboard/chatbox/?chatbox_key=${selectedAutosavedOverlay.chatboxId}`})}}
  const clickDownloadOverlay = async () => {
    if(isVaildSelectedAutosavedOverlay && selectedAutosavedOverlay) {
      const cssContentObject = await chrome.storage.local.get(selectedAutosavedOverlay.localStorageKey);
      const file = new Blob([cssContentObject[selectedAutosavedOverlay.localStorageKey]], {type: "text/plain"});
      const aTag = document.createElement("a");
      const fileUrl = URL.createObjectURL(file);
      aTag.href = fileUrl;
      aTag.download = `twip_customCSS_${selectedAutosavedOverlay.title}_${selectedAutosavedOverlay.chatboxId}_${selectedAutosavedOverlay.latestUpdate}.css`;
      document.body.appendChild(aTag);
      aTag.click();
      setTimeout(() => {
        document.body.removeChild(aTag);
        window.URL.revokeObjectURL(fileUrl);
      }, 0);
    }
  };
  const clickApplyOverlayToCurrentTab = async () => {
    if(!autosaveStatus && isVaildTwipChatboxSettingsPage && isVaildSelectedAutosavedOverlay && selectedAutosavedOverlay) {
      await chrome.runtime.sendMessage({
          type: "twip-chatbox-apply",
          tab: await chrome.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]),
          overlay: selectedAutosavedOverlay 
        } as ChromeRuntimeSendMessageRequest);
    }
  };

  (async () => {
    const currentTab = await chrome.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]);

    isVaildTwipChatboxSettingsPage = currentTab.url.match(/^http(s?)\:\/\/twip\.kr\/dashboard\/chatbox.*$/) ? true : false;

    currentTabTwipChatboxId = await chrome.scripting
        .executeScript({
          target: {
            tabId: currentTab.id,
          },
          func: () => {
            const $ = (window as any).$;
            const twipChatboxDemoSrc = $("#demo").attr("src") as string;
            const twipChatboxId = twipChatboxDemoSrc.match(
              /(?<=\/widgets\/chatbox\/).*(?=\?demo\=1)/
            );
            return twipChatboxId[0];
          },
          args: [],
          world: "MAIN",
        })
        .then((matchResult) => matchResult[0].result);

    const getAutosaveDatas = async () => {
      await chrome.runtime.sendMessage({
        type: "twip-chatbox-get-autosave",
        tabId: currentTab.id,
      } as ChromeRuntimeSendMessageRequest, (res) => {
        console.log('get autosave current tab', res);
        if(res && (res.autosaveStatus === true || res.autosaveStatus === false)) {
          autosaveStatus = res.autosaveStatus;
        }
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

  useEffect(() => {
    isVaildSelectedAutosavedOverlay = 
      selectedAutosavedOverlay 
      && selectedAutosavedOverlayIndex !== null;
      if(selectedAutosavedOverlay) {
        chrome.storage.local.get(selectedAutosavedOverlay.localStorageKey).then(res => {selectedAutosavedOverlayCSSContent = res[selectedAutosavedOverlay.localStorageKey];});
      }
  }, () => [selectedAutosavedOverlayIndex, selectedAutosavedOverlay]);

  useEffect(() => {
    if(selectedAutosavedOverlay) {
      for(const key of Object.keys(autosavedOverlays)) {
        if(selectedAutosavedOverlay.chatboxId === autosavedOverlays[key].chatboxId)
          selectedAutosavedOverlay = autosavedOverlays[key];
      }
    }
  }, () => [autosavedOverlays])

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

  <div class="settings-autosaved-overlays-wrap">
    <div class="settings-autosaved-overlays-title">자동저장된 오버레이 커스텀테마</div>
    <div class="settings-autosaved-overlays">
      {#if Object.keys(autosavedOverlays).length !== 0}
        {#each Object.keys(autosavedOverlays) as key, i}
          <div class={`settings-autosaved-overlay ${selectedAutosavedOverlayIndex === i ? 'selected' : ''}`} 
              on:click={() => {
                selectedAutosavedOverlayIndex = i;
                selectedAutosavedOverlay = autosavedOverlays[key];
                console.log('selected', selectedAutosavedOverlayIndex, selectedAutosavedOverlay);
              }}>
            <div class="settings-autosaved-overlay-title">{autosavedOverlays[key].title}{currentTabTwipChatboxId && currentTabTwipChatboxId === autosavedOverlays[key].chatboxId ? ' (현재탭)' : '' }</div>
            <div class="settings-autosaved-overlay-id">id: {autosavedOverlays[key].chatboxId}</div>
            <div class="settings-autosaved-overlay-latest-update">최신 자동저장 일자: {autosavedOverlays[key].latestUpdate}</div>
          </div>
        {/each}
      {:else}
      <div class="settings-autosaved-overlay-none"></div>
      {/if}
    </div>

    <div class="settings-autosaved-overlays-actions">
      <div class={`btn ${!autosaveStatus && isVaildSelectedAutosavedOverlay && isVaildTwipChatboxSettingsPage ? '' : 'disabled'}`} on:click={clickApplyOverlayToCurrentTab}>현재 탭에 적용</div>
      <div class={`btn ${isVaildSelectedAutosavedOverlay ? '' : 'disabled'}`} on:click={clickGoToOverlaySettingsPage}>바로가기</div>
      <div class={`btn ${isVaildSelectedAutosavedOverlay ? '' : 'disabled'}`} on:click={() => {if(isVaildSelectedAutosavedOverlay && selectedAutosavedOverlay && selectedAutosavedOverlayCSSContent) isOpenPreviewOverlay = !isOpenPreviewOverlay;}}>미리보기</div>
      <div class={`btn ${isVaildSelectedAutosavedOverlay ? '' : 'disabled'}`} on:click={clickDownloadOverlay}>다운로드</div>
    </div>

    
  </div>
  
  {#if isOpenPreviewOverlay}
    <div style={"display:block; width: 100%; height: 100%; position: fixed !important; top: 0; left: 0; background-color: rgba(0, 0, 0, .3); animation: opacity-fade .2s ease-in-out;"}></div>
  {/if}
  <Dialog class="dialog" open={isOpenPreviewOverlay} on:close={() => {isOpenPreviewOverlay = false;}}>
    <DialogOverlay/>
    <DialogTitle>오버레이 미리보기</DialogTitle>

    <TabGroup>
      <TabList class="main-tab-list">
        <Tab class="main-tab-btn">소스코드</Tab>
        <Tab class="main-tab-btn">데모</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CodeMirror styles={{
            "&": {
              width: "100%",
              maxWidth: "100%",
              height: "200px",
              maxHeight: "200px",
              marginBottom: "10px",
              border: "1px solid #eee"
            }
          }}
          readonly={true}
          value={selectedAutosavedOverlayCSSContent ? selectedAutosavedOverlayCSSContent : ''}
          lang={css()}/>
        </TabPanel>
        <TabPanel>
          <div class="overlay-preview-wrap">
            <div class="preview-html-tag">
              {@html `<style>${
                selectedAutosavedOverlayCSSContent
                  .replace(/\\n/g, '')
                  .replace(/\$font_sizepx/g, '12px')
                  .replace(/\$font_face/g, 'Nanum Gothic')
                  .replace(/\$background_color/, 'rgba(0,0,0,0)')
                  .replace(/\$text_color/, '#000000')
                  .replace(/\$message_hide_delays/, '100000s')
                  .replace(/body/g, '.preview-body-tag')
                  .replace(/html/g, '.preview-html-tag')
                  .replace(/\#log/g, '.preview-id-log-tag')
                  .replace(/(?<=\}? *)\*(?= *\{)/g, '.overlay-preview-wrap *')
                }</style>`}
              <div class="preview-body-tag">
                <div class="preview-id-log-tag">
                  <div><span class="meta" style="color: #B22222"><span class="name">test트수1</span><span class="colon">:</span></span><span class="message">test message</span></div>
                  <div><span class="meta" style="color: #FF7F50"><span class="name">test트수2</span><span class="colon">:</span></span><span class="message">It's a sample chat test~~! Blah blah Blah blah</span></div>
                  <div class="broadcaster"><span class="meta" style="color: #00FF00"><span class="name">스트리머</span><span class="colon">:</span></span><span class="message">트하트하트하 유하유하유하</span></div>
                  <div class="broadcaster"><span class="meta" style="color: #0000FF"><span class="name">스트리머</span><span class="colon">:</span></span><span class="message">Hello world~~! Hi there~~~</span></div>
                  <div><span class="meta" style="color: #2E8B57"><span class="name">test트수3</span><span class="colon">:</span></span><span class="message">트하트하트하 유하유하유하유하</span></div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>

    
    
    <div class="btn" on:click={() => {isOpenPreviewOverlay = false;}}>닫기</div>
  </Dialog>

</div>

<style lang="scss">
  .overlay-preview-wrap {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .settings-tab-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;

    .settings-autosaved-overlays-wrap {
      position: relative;
      width: 100%;

      .settings-autosaved-overlays-actions {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        width: 100%;
        margin-top: 10px;
      }

      .settings-autosaved-overlays-title {
        width: 100%;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .settings-autosaved-overlays {
        position: relative;
        width: 100%;
        max-height: 150px;
        padding: .2em;
        border: 1px solid #eee;
        overflow-y: scroll;

        .settings-autosaved-overlay-none {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 3em 1em;

          &::before {
            content: '자동저장된 오버레이가 존재하지 않습니다.';
            font-size: 8px;
          }
        }

        .settings-autosaved-overlay {
          position: relative;
          display: block;
          width: 100%;
          padding: .5em 1em;
          transition: .2s;
          border-bottom: 1px solid #eee;

          .settings-autosaved-overlay-title {
            display: block;
            font-size: 12px;
            font-weight: bold;
          }
          .settings-autosaved-overlay-id {
            display: block;
            font-size: 8px;
            color: #666;
          }
          .settings-autosaved-overlay-latest-update {
            display: block;
            font-size: 10px;
            color: #666;
          }

          &:hover {
            cursor: pointer;
            background-color: #eee;
          }

          &:last-child {
            border-bottom: none;
          }

          &.selected {
            background-color: rgba(var(--theme-color-1), 0.1);

            &::after {
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);
              content: "✓";
              font-size: 12px;
              color: rgb(var(--theme-color-1));
            }
          }
        }
      }
    }
    
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
      gap: 5px;

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
          height: 23px;
        }
      }
    }    
  }
</style>