<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '../lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '@supabase/supabase-js';

	export const user: Writable<User|null> = writable(null);

	onMount(async () => {
        const { data, error } = await supabase.auth.getSession()

        let userData = data.session?.user;

		if (userData && userData.email_confirmed_at) {
			user.set(userData);

            console.log('User ID:', userData.id)
			// Fetch the username using the user's ID
			const { data, error } = await supabase
				.from('Users')
				.select('username')
				.eq('id', userData.id)
                .single();

            console.log(data);

			if (error) {
				console.error("Error fetching username:", error);
                //goto('/error');
				return;
			}

			if (data && data.username) {
				goto(`/${data.username}`);
			} else {
				// If for some reason the username isn't found, handle this case
				goto('/login');
			}

		} else {
			// If the user isn't authenticated
			goto('/login');
		}
	});
</script>

{#if $user} 
	<h2>Welcome back, {$user.email}</h2>
	<p>Your email was confirmed at: {$user.confirmed_at}</p>
{:else}
	<h1>Welcome to The Blogging Website</h1>
	<p>It seems there was an issue with your authentication. Please try again later.</p>
{/if}
