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
    // Check the current session directly
    supabase.auth.getSession().then(sessionAccessor => {
        const userData = sessionAccessor.data?.session?.user;
        
        if (userData && userData.email_confirmed_at) {
            user.set(userData);
            goto('/user/' + userData.id);
        } else {
            goto('/login');
        }
    })
    .catch(error => {
        console.error("Error getting session:", error);
        goto('/login');
    });

    // Set event listener for future auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        if (event === 'SIGNED_IN' && session) {
            if (session.user.email_confirmed_at) {
                user.set(session.user);
                goto('/user/' + session.user.id);
            }
        } else if (event === 'SIGNED_OUT') {
            user.set(null);
            goto('/login');
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