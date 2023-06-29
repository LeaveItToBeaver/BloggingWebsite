<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '../lib/supabaseClient';
	import { goto } from '$app/navigation';
    import { writable, type Writable } from 'svelte/store';
    

    interface User {
	    email?: string;
	    id?: string;
	    confirmed_at?: string;
    }

export const user: Writable<User|null> = writable(null);

	onMount(() => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			console.log(`Supabase auth event: ${event}`);
			if (event === 'SIGNED_IN' && session) {
				if (session.user.email_confirmed_at) {
					user.set(session.user);
					goto('/signup');
				}
			}
		});
	});
</script>

{#if $user} 
	<h2>Welcome back, {$user.email}</h2>
	<p>Your email was confirmed at: {$user.confirmed_at}</p>
{:else}
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{/if}