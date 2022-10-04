<script lang="ts">
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels
  } from '@rgossiaux/svelte-headlessui';
  import ChatTestTab from '@components/tabs/ChatTestTab.svelte';
</script>

<div class="main-wrap">
  <TabGroup>
    <TabList class="main-tab-list">
      <Tab class="main-tab-btn">채팅테스트</Tab>
      <Tab class="main-tab-btn">테마프리셋</Tab>
      <Tab class="main-tab-btn">설정</Tab>
    </TabList>
    <TabPanels class="main-tab-panels">
      <TabPanel><ChatTestTab /></TabPanel>
      <TabPanel>오버레이</TabPanel>
      <TabPanel>설정</TabPanel>
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
      padding: var(--global-padding-20);
    }
  }
</style>