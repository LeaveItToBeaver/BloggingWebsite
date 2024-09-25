<script lang="ts">
	import DOMPurify from 'dompurify';
	import { postStore, type Post } from '$lib/stores/PostStore';
	import { onMount } from 'svelte';
	import favorite_icon from '$lib/icons/favorite_icon.svg';
	import favorite_icon_filled from '$lib/icons/favorite_icon_filled.svg';
	import { supabase } from '$lib/supabaseClient';
	import { userStore } from '$lib/stores/UserStore';
	import UserInformation from '$lib/views/UserInformation.svelte';

	export let post: Post;
	export let userImage: string;
	export let userName: string;
	export let likedPosts: string[];

	let sanitizedContent: string;
	let formattedDate: string;
	let totalLikes = post.likes;
	let postLiked: boolean | undefined;

	function sanitizeContent() {
		if (typeof post.content === 'object' && 'html' in post.content) {
			sanitizedContent = DOMPurify.sanitize(post.content.html);
		} else {
			sanitizedContent = DOMPurify.sanitize(post.content as string);
		}
	}

	function formatDate() {
		const date = new Date(post.created_at);
		formattedDate = new Intl.DateTimeFormat('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(date);
	}

	async function favoritePost() {
		// Toggle the like status
		if (postLiked) {
			totalLikes -= 1;
			postLiked = false;
			await postStore.unlikePost(post.id);
		} else {
			totalLikes += 1;
			postLiked = true;
			await postStore.likePost(post.id);
		}
	}

	onMount(() => {
		sanitizeContent();
		formatDate();
		postLiked = Array.isArray(likedPosts) && likedPosts.includes(post.id);
	});
</script>

<div class="card bg-white w-4/5 max-w-screen-lg mx-auto my-4 flex flex-col items-center p-4">
	<div class="flex flex-col w-full items-start align-center justify-evenly m-2">
		<h2 class="text-black text-2xl font-bold">
			{post.title}
		</h2>
		<h2 class="text-1xl">
			{formattedDate}
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
		{#if postLiked}
			<button on:click={favoritePost}
				><img
					src={favorite_icon_filled}
					alt="Like Post"
					class="w-5 h-5 rounded-full mr-2"
				/></button
			>
		{/if}
		<button on:click={favoritePost}
			><img src={favorite_icon} alt="Like Post" class="w-5 h-5 rounded-full ml-2 mr-2" /></button
		>
		<h3 class="text-black text-lg font-semibold">Likes: {totalLikes || '0'}</h3>
	</div>
</div>
