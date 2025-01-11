<script>
  import LoginScreen from '$lib/views/LoginScreen.svelte';
	import { userStore } from '$lib/stores/UserStore';
	import { onMount } from 'svelte';

  onMount(async () => {
        await userStore.checkSession();
		await userStore.clearUser();
    });
</script>

<LoginScreen />
