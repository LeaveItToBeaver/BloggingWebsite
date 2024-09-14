<script lang="ts">
	import DOMPurify from 'dompurify';
	import type { Post } from '$lib/stores/PostStore';
	import { onMount } from 'svelte';

	export let post: Post;
	export let userImage: string;
	export let userName: string;

	let sanitizedContent: string;

	function sanitizeContent() {
		if (typeof post.content === 'object' && 'html' in post.content) {
			sanitizedContent = DOMPurify.sanitize(post.content.html);
		} else {
			sanitizedContent = DOMPurify.sanitize(post.content as string);
		}
	}

	onMount(() => {
		sanitizeContent();
	});
</script>

<div class="card bg-white w-4/5 max-w-screen-lg mx-auto my-4 flex flex-col items-center p-4">
	<div class="flex flex-col w-full items-start align-center justify-evenly m-2">
		<h2 class="text-black text-2xl font-bold">
			{post.title}
		</h2>
		<h2 class="text-1xl">
			{post.created_at}
		</h2>
	</div>
	<div class="text-black post-content w-full mb-4">
		{@html sanitizedContent}
	</div>
	<div class="flex flex-row items-center w-full">
		{#if userImage}
			<img src={userImage} alt="User avatar" class="w-10 h-10 rounded-full mr-2" />
		{/if}
		<h3 class="text-black text-lg font-semibold">{userName || 'Anonymous'}</h3>
	</div>
</div>
