<script lang="ts">
	import UserDashboard from '$lib/components/user-components/UserDashboard.svelte';
	import DocumentEditorWrapper from '$lib/components/editor/DocumentEditorWrapper.svelte';
	import BlogPostListViewer from '$lib/components/blog-post/BlogPostListViewer.svelte';
	import { fetchUserInfo, getLoggedInUserId } from '$lib/utils/userUtils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let username = $page.params.username as string;
	let profileImageUrl = '';
	let fName = '';
	let lName = '';
	let blogName = '';
	let bio = '';
	let loggedInUserId: string | undefined;
	let isCurrentUser = false;
	let selectedUserId: string | undefined = undefined;
	let isLoading = true;

	async function loadUserInfo() {
		try {

		} catch (loadUserError) {
			console.log("An unexpected error occured while loading the user information:", loadUserError)
		}
		loggedInUserId = await getLoggedInUserId();
		const userInfo = await fetchUserInfo(username);
		if (userInfo) {
			selectedUserId = userInfo.id;
			fName = userInfo.first_name;
			lName = userInfo.last_name;
			profileImageUrl = userInfo.profile_image_url;
			blogName = userInfo.blog_name;
			bio = userInfo.bio;
			isCurrentUser = loggedInUserId === selectedUserId;
		}
		isLoading = false;
		console.log('username ID:', selectedUserId);
	}

	onMount(() => {
		loadUserInfo();
	});
</script>

{#if !isLoading && selectedUserId}
	<UserDashboard {profileImageUrl} {fName} {lName} {blogName} {bio} />
	<DocumentEditorWrapper {isCurrentUser} {selectedUserId} />
	<BlogPostListViewer {selectedUserId} userImage={profileImageUrl} userName={`${fName} ${lName}`} />
{:else}
	<p>Loading user information...</p>
{/if}
