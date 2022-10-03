<script lang="ts">
  import type { Writable } from "svelte/store";
  export let store: Writable<number>;
  export let disabled: boolean = false;
  export let step: number = 100;
  export let min: number = 0;

  const inputOnChage = (event: Event) => {
    const value = parseInt((event.target as any).value.replace(/[^0-9]/g, '').replace(/^0+(?=[1-9])/g, ''));
    store.set(value < min ? min : value);
  };
</script>

<div class={`input-number-wrap ${disabled ? 'disabled': ''}`}>
  <div class="btn" on:click={() => {if(!disabled) store.set($store > min ? $store - step : min)}}>-</div>
  <input type="text" bind:value={$store} on:keydown={inputOnChage} on:keyup={inputOnChage} disabled={disabled}/>
  <div class="btn" on:click={() => {if(!disabled) store.set($store + step)}}>+</div>
</div>

<style lang="scss">
  .input-number-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    box-shadow: 0 2px 5px -2px #ccc;
    background-color: #F3E7FE;
    overflow: hidden;
    
    &.disabled {
      background-color: #eee;

      .btn, input {
        color: #666;

        &:hover {
          cursor:auto;
          background-color: initial;
        }
      }
    }
    .btn, input {
      color: rgb(var(--theme-color-1));
      font-size: 12px;
    }

    .btn {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 10px 3px;
      transition: .2s;
      
      &:first-child {
        border-right: 1px solid #ccc;
      }
      &:last-child {
        border-left: 1px solid #ccc;
      }

      &:hover {
        cursor: pointer;
        background-color: rgba($color: var(--theme-color-1), $alpha: 0.1);
      }
    }

    input {
      width: 50px;
      border: none;
      text-align: center;
      background-color: transparent;
    }
  }
</style>