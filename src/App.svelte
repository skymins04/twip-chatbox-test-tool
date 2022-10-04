<script lang="ts">
	import Header from "@components/Header.svelte";
  import Main from "@components/Main.svelte";
  import {useEffect} from "./lib/hooks";
  import { currentTabId, isVaildcurrentPage, selectedChatTestType } from "./store";

	const init = () => {
		isVaildcurrentPage.set("");
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			const currentURL = tabs[0].url;
			currentTabId.set(tabs[0].id);
			switch($selectedChatTestType.id) {
			case 1:
				if(!currentURL.match(/^https:\/\/(www\.)?twip\.kr\/widgets\/chatbox\/[0-9|a-z|A-Z]+/)) {
					isVaildcurrentPage.set('NOT_TWIP_CHATBOX_OVERLAY');
				}
				break;
			case 2:
				if(!currentURL.match(/^https:\/\/(www\.)?twitch\.tv\/popout\/.+\/chat/)) {
					isVaildcurrentPage.set('NOT_TWITCH_CHAT_PAGE');
				}
				break;
			}
		});
	};

	init();

	useEffect(() => {
		init();
	}, () => [$selectedChatTestType]);
	
</script>

<div class="app-wrap">
	<Header />
	<Main />
</div>

<style>
	.app-wrap {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>