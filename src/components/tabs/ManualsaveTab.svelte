<script lang="ts">
  import type { ChromeRuntimeSendMessageRequest, TwipOverlay, TwipOverlays } from "@src/global";
  import { Dialog, DialogOverlay, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";
  import CodeMirror from "svelte-codemirror-editor";
  import {css} from "@codemirror/lang-css";
  import { AUTOSAVE_ALERT_TEXT, LOCALSTORAGE_KEYS } from "@lib/common/constant";
  import { useEffect } from "@lib/popup/hooks";

  let autosaveStatus = false;
  let isVaildTwipChatboxSettingsPage = false;
  let manualsavedOverlays: TwipOverlays = {};
  let selectedManualsavedOverlayIndex: number = null;
  let selectedManualsavedOverlay: TwipOverlay = null;
  let selectedManualsavedOverlayCSSContent: string = null;
  let isVaildSelectedManualsavedOverlay = false;
  let currentTabTwipChatboxId: string = null;
  let isOpenPreviewOverlay = false;
  let isOpenEditOverlay = false;
  let editedOverlayTitle = "";

  const saveTwipChatboxTheme = async () => {
    await chrome.runtime.sendMessage({
      type: "twip-chatbox-overlay-save",
      tab: await chrome.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]),
    } as ChromeRuntimeSendMessageRequest, async () => {
      await getManualsavedOverlayDatas();
    });
  };

  const clickEditOverlay = () => {
    if(isVaildSelectedManualsavedOverlay) {
      isOpenEditOverlay = true;
      editedOverlayTitle = selectedManualsavedOverlay.title;
    }
  };
  const clickDownloadOverlay = async () => {
    if(isVaildSelectedManualsavedOverlay && selectedManualsavedOverlay) {
      const cssContentObject = await chrome.storage.local.get(selectedManualsavedOverlay.localStorageKey);
      const file = new Blob([cssContentObject[selectedManualsavedOverlay.localStorageKey]], {type: "text/plain"});
      const aTag = document.createElement("a");
      const fileUrl = URL.createObjectURL(file);
      aTag.href = fileUrl;
      aTag.download = `twip_customCSS_${selectedManualsavedOverlay.title}_${selectedManualsavedOverlay.chatboxId}_${selectedManualsavedOverlay.latestUpdate}.css`;
      document.body.appendChild(aTag);
      aTag.click();
      setTimeout(() => {
        document.body.removeChild(aTag);
        window.URL.revokeObjectURL(fileUrl);
      }, 0);
    }
  };
  const clickApplyOverlayToCurrentTab = async () => {
    if(!autosaveStatus && isVaildTwipChatboxSettingsPage && isVaildSelectedManualsavedOverlay && selectedManualsavedOverlay) {
      await chrome.runtime.sendMessage({
          type: "twip-chatbox-overlay-apply",
          tab: await chrome.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]),
          overlay: selectedManualsavedOverlay 
        } as ChromeRuntimeSendMessageRequest);
    }
  };
  const getManualsavedOverlayDatas = async () => {
    await chrome.storage.local.get('TWIP_MANUALSAVED_OVERLAYS').then(({TWIP_MANUALSAVED_OVERLAYS}) => {
        if(!TWIP_MANUALSAVED_OVERLAYS) manualsavedOverlays = {};
        else manualsavedOverlays = TWIP_MANUALSAVED_OVERLAYS;
    });
  };
  const renameOverlay = async () => {
    if(editedOverlayTitle.trim() !== "") {
      const tmp: TwipOverlay = { ...selectedManualsavedOverlay, title: editedOverlayTitle };
      await chrome.runtime.sendMessage({
        type: "twip-chatbox-overlay-rename",
        overlay: tmp 
      } as ChromeRuntimeSendMessageRequest, () => {
        setTimeout(async () => {
          await getManualsavedOverlayDatas();
        }, 100);
        isOpenEditOverlay = false;
      });
    }
  };
  const removeOverlay = async () => {
    await chrome.runtime.sendMessage({
      type: "twip-chatbox-overlay-remove",
      tab: await chrome.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]),
      overlay: selectedManualsavedOverlay 
    } as ChromeRuntimeSendMessageRequest, () => {
      setTimeout(async () => {
        await getManualsavedOverlayDatas();
      }, 100);
      isOpenEditOverlay = false;
    });
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

    await getManualsavedOverlayDatas();
  })();

  useEffect(() => {
    isVaildSelectedManualsavedOverlay =  selectedManualsavedOverlay && selectedManualsavedOverlayIndex !== null;
    if(selectedManualsavedOverlay) {
      chrome.storage.local.get(selectedManualsavedOverlay.localStorageKey).then(res => {selectedManualsavedOverlayCSSContent = res[selectedManualsavedOverlay.localStorageKey];});
    }
  }, () => [selectedManualsavedOverlayIndex, selectedManualsavedOverlay]);

  useEffect(() => {
    if(selectedManualsavedOverlay) {
      for(const key of Object.keys(manualsavedOverlays)) {
        if(selectedManualsavedOverlay.chatboxId === manualsavedOverlays[key].chatboxId)
          selectedManualsavedOverlay = manualsavedOverlays[key];
      }
    }
  }, () => [manualsavedOverlays])

</script>

<div class="settings-tab-wrap">
  {#if !isVaildTwipChatboxSettingsPage}
    <div class="alert-text">{AUTOSAVE_ALERT_TEXT.NOT_TWIP_CHABOX_SETTINGS_PAGE}</div>
  {/if}

  <div class="settings-options">
    <div class="settings-options-item">
      <span class="title">현재 탭 커스텀 테마 저장</span>
      <div class="input">
        <div on:click={() => {if(isVaildTwipChatboxSettingsPage) saveTwipChatboxTheme()}} class={`btn ${isVaildTwipChatboxSettingsPage ? '' : 'disabled'}`}>저장하기</div>
      </div>
    </div>
  </div>

  <div class="settings-manualsaved-overlays-wrap">
    <div class="settings-manualsaved-overlays-title">저장된 오버레이 커스텀테마</div>
    <div class="settings-manualsaved-overlays">
      {#if Object.keys(manualsavedOverlays).length !== 0}
        {#each Object.keys(manualsavedOverlays) as key, i}
          <div class={`settings-manualsaved-overlay ${selectedManualsavedOverlayIndex === i ? 'selected' : ''}`} 
              on:click={() => {
                selectedManualsavedOverlayIndex = i;
                selectedManualsavedOverlay = manualsavedOverlays[key];
                console.log('selected', selectedManualsavedOverlayIndex, selectedManualsavedOverlay);
              }}>
            <div class="settings-manualsaved-overlay-title">{manualsavedOverlays[key].title}{currentTabTwipChatboxId && currentTabTwipChatboxId === manualsavedOverlays[key].chatboxId ? ' (현재탭)' : '' }</div>
            <div class="settings-manualsaved-overlay-id">id: {manualsavedOverlays[key].chatboxId}</div>
            <div class="settings-manualsaved-overlay-latest-update">저장 일자: {manualsavedOverlays[key].latestUpdate}</div>
          </div>
        {/each}
      {:else}
      <div class="settings-manualsaved-overlay-none"></div>
      {/if}
    </div>

    <div class="settings-manualsaved-overlays-actions">
      <div class={`btn ${!autosaveStatus && isVaildSelectedManualsavedOverlay && isVaildTwipChatboxSettingsPage ? '' : 'disabled'}`} on:click={clickApplyOverlayToCurrentTab}>현재 탭에 적용</div>
      <div class={`btn ${isVaildSelectedManualsavedOverlay ? '' : 'disabled'}`} on:click={clickEditOverlay}>수정</div>
      <div class={`btn ${isVaildSelectedManualsavedOverlay ? '' : 'disabled'}`} on:click={() => {if(isVaildSelectedManualsavedOverlay && selectedManualsavedOverlay && selectedManualsavedOverlayCSSContent) isOpenPreviewOverlay = !isOpenPreviewOverlay;}}>미리보기</div>
      <div class={`btn ${isVaildSelectedManualsavedOverlay ? '' : 'disabled'}`} on:click={clickDownloadOverlay}>다운로드</div>
    </div>

    
  </div>
  
  {#if isOpenPreviewOverlay || isOpenEditOverlay}
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
          value={selectedManualsavedOverlayCSSContent ? selectedManualsavedOverlayCSSContent : ''}
          lang={css()}/>
        </TabPanel>
        <TabPanel>
          <div class="overlay-preview-wrap">
            <div class="preview-html-tag">
              {@html `<style>${
                selectedManualsavedOverlayCSSContent
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
  <Dialog class="dialog" open={isOpenEditOverlay} on:close={() => {isOpenEditOverlay = false;}}>
    <DialogOverlay/>
    <DialogTitle>오버레이 수정</DialogTitle>

    <div class="edit-overlay-name">
      <input type="text" id="edit-overlay-name-input" bind:value={editedOverlayTitle}>
      <div class="btn" on:click={renameOverlay}>이름 변경</div>
    </div>
    <div class="btn" on:click={removeOverlay}>오버레이 삭제</div>
    <div class="btn" on:click={() => {isOpenEditOverlay = false;}}>닫기</div>
  </Dialog>

</div>

<style lang="scss">
  .edit-overlay-name {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5em;
    margin-bottom: 20px;

    #edit-overlay-name-input {
      border: 1px solid #ccc;
      width: 100%;
      height: 22px;
    }
    
    .btn {
      width: 7em;
    }
  }
  

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

    .settings-manualsaved-overlays-wrap {
      position: relative;
      width: 100%;

      .settings-manualsaved-overlays-actions {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        width: 100%;
        margin-top: 10px;
      }

      .settings-manualsaved-overlays-title {
        width: 100%;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .settings-manualsaved-overlays {
        position: relative;
        width: 100%;
        max-height: 150px;
        min-height: 100px;
        padding: .2em;
        border: 1px solid #eee;
        overflow-y: scroll;

        .settings-manualsaved-overlay-none {
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

        .settings-manualsaved-overlay {
          position: relative;
          display: block;
          width: 100%;
          padding: .5em 1em;
          transition: .2s;
          border-bottom: 1px solid #eee;

          .settings-manualsaved-overlay-title {
            display: block;
            font-size: 12px;
            font-weight: bold;
          }
          .settings-manualsaved-overlay-id {
            display: block;
            font-size: 8px;
            color: #666;
          }
          .settings-manualsaved-overlay-latest-update {
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