<script lang="ts">
  import type { ChromeRuntimeSendMessageRequest } from "@src/global";
  import { twipChatboxAutosaveStatus } from "@src/lib/store";

  twipChatboxAutosaveStatus.subscribe(async (value) => {
    await chrome.runtime.sendMessage({
          type: "twip-chatbox-autosave",
          autosaveStatus: value,
        } as ChromeRuntimeSendMessageRequest);
    console.log(await chrome.storage.local.get('TWIP_CHATBOX_AUTOSAVE_STATUS'));
  });

</script>

<div class="settings-tab-wrap">
  <div class="settings-options">
    <div class="settings-options-item">
      <span class="title">커스텀테마소스 자동저장</span>
      <div class="input">
        <input type="checkbox" id="twip-chatbox-autosave-status-checkbox" bind:checked={$twipChatboxAutosaveStatus}/>
        <label for="twip-chatbox-autosave-status-checkbox" />
      </div>
    </div>
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