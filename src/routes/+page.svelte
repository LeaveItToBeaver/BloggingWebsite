<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '../lib/supabaseClient';
    import { goto } from '$app/navigation';

onMount(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`Supabase auth event: ${event}`);
    
    if (event === 'USER_UPDATED' && session) {
      if(session.user.email_confirmed_at) {
        // The email is confirmed, now redirect to the confirm page
        // Replace "navigateTo" with your navigation function
        goto(`/${session.user.id}/confirm`);
      }
    }
  });
});

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
