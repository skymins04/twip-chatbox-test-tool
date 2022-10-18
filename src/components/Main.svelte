<script lang="ts">
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels
  } from '@rgossiaux/svelte-headlessui';
  import ChatTestTab from '@components/tabs/ChatTestTab.svelte';
  import SettingsTab from './tabs/SettingsTab.svelte';
</script>

<div class="main-wrap">
  <TabGroup>
    <TabList class="main-tab-list">
      <Tab class="main-tab-btn">채팅테스트</Tab>
      <Tab class="main-tab-btn">테마프리셋</Tab>
      <Tab class="main-tab-btn">자동저장</Tab>
    </TabList>
    <TabPanels class="main-tab-panels">
      <TabPanel><ChatTestTab /></TabPanel>
      <TabPanel>오버레이</TabPanel>
      <TabPanel><SettingsTab /></TabPanel>
    </TabPanels>
  </TabGroup>
</div>

<style lang="scss">
  .main-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    padding: var(--global-padding-10);
    background-color: rgba(var(--theme-color-1), .1);

    :global(.main-tab-list) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 5px;
      margin-bottom: var(--global-padding-10);
      padding: var(--global-padding-5);
      border-radius: 11px;
      background-color: rgba(0,0,0, .1);
    }

    :global(.main-tab-btn) {
      width: 100%;
      padding: var(--global-padding-10) var(--global-padding-5);
      border: none;
      border-radius: 7px;
      background-color: transparent;
      transition: .2s;
      color: rgb(184, 152, 179);
      font-weight: bold;

      &:hover {
        cursor: pointer;
      }
    }
    :global(.main-tab-btn[aria-selected="true"]) {
      background-color: white;
      box-shadow: 0 0 5px #ccc;
      color: rgb(var(--theme-color-1));
    }
    :global(.main-tab-btn[aria-selected="false"]:hover) {
      background-color: rgba(0,0,0, .05);
    }
    :global(.main-tab-panels) {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 11px;
      background-color: white;
      padding: 25px var(--global-padding-20) var(--global-padding-20);
    }

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

    
  }

  :global(.btn) {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 10px 3px;
      border-radius: 7px;
      box-shadow: 0 2px 5px -2px #ccc;
      background-color: #F3E7FE;
      font-size: 12px;
      color: rgb(var(--theme-color-1));
      overflow: hidden;

      &:not(.disabled):hover {
        cursor: pointer;
      }
      &:not(.disabled):hover::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba($color: var(--theme-color-1), $alpha: 0.1);
        animation: opacity-fade .2s ease-in-out;
      }
    }
    :global(.btn.disabled) {
      color: #666 !important;
      background-color: #eee !important;

      &:hover {
        cursor: not-allowed;
      }
    }
</style>