<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '../lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/UserStore';

	$: user = $userStore;

	onMount(async () => {
		await userStore.checkSession();

		if (user && user.email_confirmed_at) {
			if (!user.id) {
				console.error('User ID is undefined');
				return;
			}
			console.log('User ID:', user.id);

			const { data, error } = await supabase
				.from('Users')
				.select('username')
				.eq('id', user.id)
				.single();

			if (error) {
				console.error('Error fetching username:', error);
				goto('/error');
				return;
			}

			if (data && data.username) {
				goto(`/${data.username}`);
			} else {
				goto('/login');
			}
		} else {
			goto('/login');
		}
	});
</script>

{#if $userStore}
	<h2>Welcome back, {$userStore.email}</h2>
	<p>Your email was confirmed at: {$userStore.email_confirmed_at}</p>
{:else}
	<h1>Welcome to The Blogging Website</h1>
	<p>It seems there was an issue with your authentication. Please try again later.</p>
{/if}
