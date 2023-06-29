<script lang="ts">
    import { onMount, setContext} from 'svelte';
    import { supabase } from '../lib/supabaseClient';
    import { goto } from '$app/navigation';


onMount(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`Supabase auth event: ${event}`);
    
    if (event === 'SIGNED_IN' && session) {
      if(session.user.email_confirmed_at) {
        goto('/login');
        
      }
    }
  });
});

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
