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
  }
</style>