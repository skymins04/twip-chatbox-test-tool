<script lang="ts">
  import { Dialog, DialogDescription, DialogOverlay, DialogTitle, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@rgossiaux/svelte-headlessui";
  import { CHAT_TEST_ALERT_TEXT, CHAT_TEST_TYPES, LOCALSTORAGE_KEYS } from "@src/constant";
  import InputNumber from "../InputNumber.svelte";
  import { chatTestBtnState, defaultChatTestDelay, isRandomChatTestDelayOffset, isVaildcurrentPage, randomChatTestDelayOffset, selectedChatTestType, currentTabId } from "@src/store";
  import {useEffect} from "@src/lib/hooks";
  import { sendMsgToChromeRuntime } from "@src/lib/functions";

  let isOpenClearOverlayDialog = false;

  defaultChatTestDelay.subscribe(value => {
    localStorage.setItem(LOCALSTORAGE_KEYS.chatTestDelay, value.toString());
  });
  randomChatTestDelayOffset.subscribe(value => {
    localStorage.setItem(LOCALSTORAGE_KEYS.chatTestRandomDelayOffset, value.toString());
  });
  selectedChatTestType.subscribe(value => {
    localStorage.setItem(LOCALSTORAGE_KEYS.chatTestType, JSON.stringify(value));
  });
  isRandomChatTestDelayOffset.subscribe(value => {
    localStorage.setItem(LOCALSTORAGE_KEYS.isChatTestRandomDelayOffset, JSON.stringify(value));
  });

  useEffect(() => {
    sendMsgToChromeRuntime("chat-control");
  }, () => [$chatTestBtnState, $defaultChatTestDelay, $isRandomChatTestDelayOffset, $randomChatTestDelayOffset]);
</script>

<div class="chat-test-tap-wrap">
  <Listbox value={$selectedChatTestType} on:change={(e) => {$selectedChatTestType = e.detail}} class="chat-test-type-select"> 
    <ListboxButton class="chat-test-type-select-btn">
      <span>{$selectedChatTestType.type}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-gray-400"><path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></ListboxButton>
    <ListboxOptions class="chat-test-type-select-options">
      {#each CHAT_TEST_TYPES as chatTestType (chatTestType.id)}
        <ListboxOption class="chat-test-type-select-options-item" value={chatTestType} disabled={chatTestType.unavailable}>
          {chatTestType.type}
        </ListboxOption>
      {/each}
    </ListboxOptions>
  </Listbox>

  {#if CHAT_TEST_ALERT_TEXT[$isVaildcurrentPage]}
    <div class="alert-text">{CHAT_TEST_ALERT_TEXT[$isVaildcurrentPage]}</div>
  {/if}

  <div class={`chat-test-btn ${$isVaildcurrentPage === "" ? "" : "disabled"} ${$chatTestBtnState ? 'active' : ''}`} 
    on:click={() => {
      if($isVaildcurrentPage === "") {
        chatTestBtnState.set(!$chatTestBtnState);
        localStorage.setItem(LOCALSTORAGE_KEYS.chatTestBtnState, JSON.stringify($chatTestBtnState));
      }
    }}>
  </div>

  <div class="chat-test-options">
    <div class="chat-test-options-item">
      <span class="title">기본 채팅 간견 (ms)</span>
      <div class="input">
        <InputNumber store={defaultChatTestDelay} min={100}/>
      </div>
    </div>
    <div class="chat-test-options-item">
      <span class="title">랜덤 오프셋 (ms)</span>
      <div class="input">
        <input type="checkbox" id="random-offset-checkbox" bind:checked={$isRandomChatTestDelayOffset}/>
        <label for="random-offset-checkbox" />
        <InputNumber store={randomChatTestDelayOffset} min={100} disabled={!$isRandomChatTestDelayOffset}/>
      </div>
    </div>
    <div class="chat-test-options-item">
      <span class="title">테스트유저유형</span>
      <div class="input">
        <div class="btn">목록열기</div>
      </div>
    </div>
    <div class="chat-test-options-item">
      <span class="title">테스트메시지목록</span>
      <div class="input">
        <div class="btn">목록열기</div>
      </div>
    </div>
    <div class="chat-test-options-item">
      <span class="title">오버레이 화면 초기화</span>
      <div class="input">
        <div class={`btn ${$isVaildcurrentPage === "" ? "" : "disabled"}`} on:click={() => {if($isVaildcurrentPage === "") isOpenClearOverlayDialog = true;}}>초기화</div>
      </div>
    </div>
  </div>
  

  {#if isOpenClearOverlayDialog}
    <div style={"display:block; width: 100%; height: 100%; position: fixed !important; top: 0; left: 0; background-color: rgba(0, 0, 0, .3); animation: opacity-fade .2s ease-in-out;"}></div>
  {/if}
  <Dialog class="dialog" open={isOpenClearOverlayDialog} on:close={() => {isOpenClearOverlayDialog = false;}}>
    <DialogOverlay/>
    <DialogTitle>오버레이 화면 초기화</DialogTitle>
    <DialogDescription>오버레이에 발행된 모든 채팅 메시지를 제거하시겠습니까?</DialogDescription>
    <div class="btn" on:click={() => {sendMsgToChromeRuntime('clear-chat'); isOpenClearOverlayDialog = false;}}>확인</div>
    <div class="btn" on:click={() => {isOpenClearOverlayDialog = false;}}>취소</div>
  </Dialog>
</div>

<style lang="scss">
  .chat-test-tap-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 30px;

    :global(.chat-test-type-select) {
      position: relative;
      width: 100%;
    }

    :global(.chat-test-type-select-btn) {
      position: relative;
      width: 100%;
      padding: var(--global-padding-5) var(--global-padding-10);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #F3E7FE;
      border: none;
      border-radius: 8px;
      box-shadow: 0 2px 5px -2px #ccc;
      font-size: 12px;
    }
    :global(.chat-test-type-select-btn:hover) {
      cursor: pointer;
    }
    :global(.chat-test-type-select-btn svg) {
      height: 20px;
      fill: rgb(var(--theme-color-1));
    }
    :global(.chat-test-type-select-btn span) {
      color: rgb(var(--theme-color-1));
    }
    :global(.chat-test-type-select-options) {
      position: absolute;
      width: 100%;
      padding: var(--global-padding-10) 0;
      border-radius: 8px;
      background-color: #F3E7FE;
      animation: opacity-fade .2s ease-in-out;
    }
    :global(.chat-test-type-select-options-item) {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      padding: 10px 0 10px 40px;
      list-style: none;
      transition: .2s;
      color: rgb(var(--theme-color-1));
      font-size: 12px;
    }
    :global(.chat-test-type-select-options-item[aria-selected="true"]) {
      font-weight: 500;
    }
    :global(.chat-test-type-select-options-item[aria-selected="true"]::before) {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 12px;
      width: 20px;
      height: 20px;
      transform: translateY(calc(-50% - 2px));
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='rgb(140, 16, 241)' aria-hidden='true' class='w-5 h-5'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E");
    }
    :global(.chat-test-type-select-options-item:hover) {
      cursor: pointer;
      background-color: rgba($color: var(--theme-color-1), $alpha: 0.1);
    }

    .alert-text {
      color: rgb(255, 44, 44);
      font-size: 12px;
    }

    .chat-test-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #ccc;
      font-size: 32px;
      font-weight: bold;
      color: white;
      transition: .2s;
      box-shadow: 0 0 5px #666;

      &.disabled:hover {
        cursor: not-allowed !important;
        box-shadow: 0 0 5px #666 !important;
      }
      &:before {
        content: 'OFF';
      }

      &:hover {
        cursor: pointer;
        box-shadow: 0 0 10px #666;
      }
      &.active {
        background-color: rgb(var(--theme-color-1));
      }
      &.active:before {
        content: 'ON';
      }
    }

    .chat-test-options {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 10px;

      .chat-test-options-item {
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