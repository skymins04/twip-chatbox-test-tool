<script lang="ts">
  import { Dialog, DialogDescription, DialogOverlay, DialogTitle, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@rgossiaux/svelte-headlessui";
  import { CHAT_TEST_ALERT_TEXT, CHAT_TEST_TYPES, LOCALSTORAGE_KEYS } from "@src/lib/constant";
  import InputNumber from "../InputNumber.svelte";
  import { chatTestBtnState, defaultChatTestDelay, isLoading, isRandomChatTestDelayOffset, isVaildcurrentPage, randomChatTestDelayOffset, selectedChatTestType, testMsgProfiles, testUserTypeFilter } from "@lib/store";
  import {useEffect} from "@src/lib/hooks";
  import { getTestMsgPreviewHTMLString, sendMsgToChromeRuntime, getTestMsgByRawString } from "@src/lib/functions";
  import type { UserTypeFilter } from "@src/global";
  import {defaultTestMsgProfiles, testMsgEmoticons} from '@lib/chatTest';

  let isOpenClearOverlayDialog = false;
  let isOpenSettingTestUserFilter = false;
  let isOpenSettingTestMsg = false;
  let tmpTestUserTypeFilter: UserTypeFilter;
  let testMsgPreviewRawString = '';


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
    if(!$isLoading) {
      sendMsgToChromeRuntime("twip-chat-control");
    } 
  }, () => [$chatTestBtnState, $isLoading]);

  useEffect(() => {
    if($chatTestBtnState) {
      sendMsgToChromeRuntime("twip-chat-control");
    }
  }, () => [$testUserTypeFilter, $defaultChatTestDelay, $isRandomChatTestDelayOffset, $randomChatTestDelayOffset]);

  useEffect(() => {
    if(isOpenSettingTestUserFilter) {
      tmpTestUserTypeFilter = $testUserTypeFilter;
      console.log(tmpTestUserTypeFilter);
    }
    else {
      tmpTestUserTypeFilter = null;
    }
  }, () => [isOpenSettingTestUserFilter]);
</script>

<div class="chat-test-tap-wrap">
  <Listbox value={$selectedChatTestType} on:change={(e) => {$chatTestBtnState = false; $selectedChatTestType = e.detail}} class="chat-test-type-select"> 
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

  <div class={`chat-test-btn ${$isVaildcurrentPage !== "" ? "disabled" : ""} ${$chatTestBtnState ? 'active' : ''}`} 
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
      <span class="title">테스트 유저 유형 설정</span>
      <div class="input">
        <div class={`btn ${$selectedChatTestType.id !== 1 ? 'disabled' : ''}`} on:click={() => {if($selectedChatTestType.id === 1) isOpenSettingTestUserFilter = true;}}>목록열기</div>
      </div>
    </div>
    <div class="chat-test-options-item">
      <span class="title">테스트 메시지 설정</span>
      <div class="input">
        <div class="btn" on:click={() => {testMsgPreviewRawString = ''; isOpenSettingTestMsg = true;}}>목록열기</div>
      </div>
    </div>
    <div class="chat-test-options-item">
      <span class="title">오버레이 화면 초기화</span>
      <div class="input">
        <div class={`btn ${$isVaildcurrentPage !== "" || $selectedChatTestType.id !== 1 ? "disabled" : ""}`} on:click={() => {if($isVaildcurrentPage === "" && $selectedChatTestType.id === 1) isOpenClearOverlayDialog = true;}}>초기화</div>
      </div>
    </div>
  </div>
  

  {#if isOpenClearOverlayDialog || isOpenSettingTestUserFilter || isOpenSettingTestMsg}
    <div style={"display:block; width: 100%; height: 100%; position: fixed !important; top: 0; left: 0; background-color: rgba(0, 0, 0, .3); animation: opacity-fade .2s ease-in-out;"}></div>
  {/if}
  <Dialog class="dialog" open={isOpenClearOverlayDialog} on:close={() => {isOpenClearOverlayDialog = false;}}>
    <DialogOverlay/>
    <DialogTitle>오버레이 화면 초기화</DialogTitle>
    <DialogDescription>오버레이에 발행된 모든 테스트 메시지를 제거하시겠습니까?</DialogDescription>
    <div class="btn" on:click={() => {sendMsgToChromeRuntime("twip-chat-clear"); isOpenClearOverlayDialog = false;}}>확인</div>
    <div class="btn" on:click={() => {isOpenClearOverlayDialog = false;}}>취소</div>
  </Dialog>
  <Dialog class="dialog" open={isOpenSettingTestUserFilter} on:close={() => {isOpenSettingTestUserFilter = false;}}>
    <DialogOverlay/>
    <DialogTitle>테스트 유저 유형 설정</DialogTitle>
    <DialogDescription>채팅 테스트에 사용될 테스트 유저의 유형별 표시 여부를 설정할 수 있습니다.</DialogDescription>

    <div class="dialog-options">
      {#if tmpTestUserTypeFilter}
        <div class="dialog-options-item">
          <span class="title">일반시청자</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-normal" bind:checked={tmpTestUserTypeFilter['normal']}><label for="chat-test-user-type-normal"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title"><img class="icon" src="/icon/broadcaster.png" alt=""/>브로드케스터</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-broadcaster" bind:checked={tmpTestUserTypeFilter['broadcaster']}><label for="chat-test-user-type-broadcaster"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title"><img class="icon" src="/icon/moderator.png" alt=""/>모더레이터</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-moderator" bind:checked={tmpTestUserTypeFilter['moderator']}><label for="chat-test-user-type-moderator"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title"><img class="icon" src="/icon/partner.png" alt=""/>파트너</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-partner" bind:checked={tmpTestUserTypeFilter['partner']}><label for="chat-test-user-type-partner"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title">구독자</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-subscriber" bind:checked={tmpTestUserTypeFilter['subscriber']}><label for="chat-test-user-type-subscriber"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title"><img class="icon" src="/icon/turbo.png" alt=""/>터보</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-turbo" bind:checked={tmpTestUserTypeFilter['turbo']}><label for="chat-test-user-type-turbo"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title"><img class="icon" src="/icon/premium.png" alt=""/>프리미엄</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-premium" bind:checked={tmpTestUserTypeFilter['premium']}><label for="chat-test-user-type-premium"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title"><img class="icon" src="/icon/bits.png" alt=""/>비트</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-bits" bind:checked={tmpTestUserTypeFilter['bits']}><label for="chat-test-user-type-bits"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title"><img class="icon" src="/icon/admin.png" alt=""/>어드민</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-admin" bind:checked={tmpTestUserTypeFilter['admin']}><label for="chat-test-user-type-admin"></label></div>
        </div>
        <div class="dialog-options-item">
          <span class="title"><img class="icon" src="/icon/staff.png" alt=""/>스태프</span>
          <div class="input"><input type="checkbox" id="chat-test-user-type-staff" bind:checked={tmpTestUserTypeFilter['staff']}><label for="chat-test-user-type-staff"></label></div>
        </div>
      {/if}
    </div>

    <div class="btn" on:click={() => {testUserTypeFilter.set({...tmpTestUserTypeFilter}); localStorage.setItem(LOCALSTORAGE_KEYS.userTypeFilter,JSON.stringify($testUserTypeFilter)); isOpenSettingTestUserFilter = false;}}>저장</div>
    <div class="btn" on:click={() => {isOpenSettingTestUserFilter = false;}}>취소</div>
  </Dialog>
  <Dialog class="dialog" open={isOpenSettingTestMsg} on:close={() => {isOpenSettingTestMsg = false;}}>
    <DialogOverlay/>
    <DialogTitle>테스트 메시지 설정</DialogTitle>
    <DialogDescription>채팅 테스트에 사용될 메시지를 설정할 수 있습니다.</DialogDescription>

    <div class="emoticon-add-btn-wrap">
      {#each testMsgEmoticons as emoticon}
      <img on:click={() => {testMsgPreviewRawString += ` $${emoticon.symbol}`}} src={emoticon.imgSrc} alt="">
      {/each}
    </div>

    <div class="test-msg-add-wrap">
      <input type="text" bind:value={testMsgPreviewRawString}>
      <div class="btn" on:click={() => {testMsgProfiles.set([getTestMsgByRawString(testMsgPreviewRawString), ...$testMsgProfiles]); testMsgPreviewRawString = ''; localStorage.setItem(LOCALSTORAGE_KEYS.testMsg, JSON.stringify($testMsgProfiles));}}>추가</div>
    </div>

    <div class="test-msg-preview">
      미리보기: <span>{@html getTestMsgPreviewHTMLString(testMsgPreviewRawString)}</span>
    </div>

    <div class="test-msg-list-wrap">
      {#each $testMsgProfiles as testMsgData, idx}
        <div class="test-msg">
          {@html getTestMsgPreviewHTMLString(testMsgData.msg)}
          <div class="del-btn" on:click={() => {if($testMsgProfiles.length > 1) {$testMsgProfiles.splice(idx, 1); testMsgProfiles.set($testMsgProfiles); localStorage.setItem(LOCALSTORAGE_KEYS.testMsg, JSON.stringify($testMsgProfiles));}}}></div>
        </div>
      {/each}
    </div>

    <div class="btn" on:click={() => {isOpenSettingTestMsg = false;}}>완료</div>
    <div class="btn" on:click={() => {testMsgProfiles.set(defaultTestMsgProfiles); localStorage.setItem(LOCALSTORAGE_KEYS.testMsg, JSON.stringify($testMsgProfiles));}}>초기화</div>
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
  .emoticon-add-btn-wrap {
    position: relative;
    width: 100%;
    margin-bottom: 5px;
    
    img {
      height: 18px;
      margin-right: 5px;

      &:hover {
        cursor: pointer;
      }
    }
  }
  .test-msg-add-wrap {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;

    input[type="text"] {
      border: 1px solid #ccc;
      width: 100%;
      height: 22px;
    }

    .btn {
      min-width: 40px;
    }
  }
  .test-msg-preview {
    position: relative;
    display: block;
    width: 100%;
    margin-bottom: 15px;

    span {
      word-break: break-all;
    }
  }
  .test-msg-list-wrap {
    position: relative;
    display: block;
    width: 100%;
    height: 120px;
    border: 1px solid #ccc;
    margin-bottom: 15px;
    overflow-y: scroll;

    .test-msg {
      position: relative;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: .5em 2em .5em 1em;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .del-btn {
        position: absolute;
        display: block;
        width: 1em;
        height: 1em;
        right: .5em;
        top: 50%;
        transform: translateY(-50%);
        
        &::before, &::after {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          width: 100%;
          height: 2px;
          border-radius: 1px;
          background-color: #666;
        }
        &::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        &::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        &:hover {
          cursor: pointer;
        }

        &:hover::before, &:hover::after {
          background-color: #242424;
        }
      }
    }
  }

  :global(.test-msg-preview span img, .test-msg img) {
    display: inline-block;
    height: 1em;
  }
</style>