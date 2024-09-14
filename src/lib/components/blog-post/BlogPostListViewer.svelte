<script lang="ts">
	import { onMount } from 'svelte';
	import BlogPostComponent from '$lib/components/blog-post/BlogPostComponent.svelte';
	import { postStore, type Post } from '$lib/stores/PostStore';

	export let selectedUserId: string;
	export let userImage: string;
	export let userName: string;

	let posts: Post[] = [];

	// Subscribe to the postStore
	postStore.subscribe((value) => {
		posts = value;
	});

	// Function to load posts for the selected user
	async function loadPosts() {
		await postStore.fetchPosts(selectedUserId);
	}

	// Load posts when the component is mounted or selectedUserId changes
	$: if (selectedUserId) {
		loadPosts();
	}

	onMount(() => {
		if (selectedUserId) {
			loadPosts();
		}
	});
</script>

<div class="post-list">
	{#each posts as post (post.id)}
		<BlogPostComponent {post} {userImage} {userName} />
	{/each}
</div>

<style>
	.post-list {
		display: flex;
		flex-direction: column;
		margin: 1rem 0;
	}
</style>
