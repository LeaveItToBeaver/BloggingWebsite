<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '../supabaseClient';
    import { goto } from '$app/navigation';
    import { userStore } from './UserStore';

    $: user = $userStore;

    onMount(async () => {
        await userStore.checkSession();

        if (user && user.email_confirmed_at) {
            console.log('User ID:', user.id);

            const { data, error } = await supabase
                .from('Users')
                .select('username')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("Error fetching username:", error);
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
