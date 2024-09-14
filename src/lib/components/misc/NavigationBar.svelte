<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from "$lib/supabaseClient";
    import { goto } from "$app/navigation";
    import { userStore } from '../../stores/UserStore';

    import account_circle from '../../icons/account_circle.svg';
    import home_icon from '../../icons/home_icon.svg';
    import logout_icon from '../../icons/logout.svg';
    import settings_icon from '../../icons/settings.svg';

    let searchTerm = "";
    let userImage = account_circle;
    let user;
    let username: string | null | undefined;

    // Update the user when the store changes
    $: user = $userStore;

    async function logout() {
        await supabase.auth.signOut();
        userStore.setUser(null);
        goto('/login');
    }

    function settingsPage(){
        goto('/user-information');
    }

    function homePage(){
        goto(`/${username}`);
    };

    onMount(async () => {
        await userStore.checkSession();

        if (user && user.image) {
            userImage = user.image.url;
            username = user.userName;
            console.log('User Image URL in Navbar: ', userImage);
        } else {
            userImage = account_circle;
        }

        console.log("User:", user?.id);
        console.log("Current user in navbar:", user?.id);
    });
</script>


<div class="nav-bar bg-gray-300 p-4 flex justify-center items-center">
    <div class="flex-1 px-2">
        <input 
            type="text" 
            bind:value={searchTerm} 
            placeholder="Search..."
            class="input input-bordered w-full"
        />
    </div>

    <!-- User Image -->
    <div class="flex items-center space-x-4">
        <button class="btn btn-circle btn-ghost" on:click={homePage}>
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img srcset={userImage} alt="User Image" class="h-9 w-9 rounded-full" />
        </button>

        <!-- Home Icon (always visible) -->
        <button class="btn btn-circle btn-ghost">
            <img srcset={home_icon} alt="Home Icon" class="h-9 w-9 rounded-full" />
        </button>

        <!-- Conditionally render the Settings and Logout icons -->
        {#if user}
            <button class="btn btn-circle btn-ghost" on:click={settingsPage}>
                <img srcset={settings_icon} alt="Settings Icon" class="h-9 w-9 rounded-full" />
            </button>
            <button class="btn btn-circle btn-ghost" on:click={logout}>
                <img srcset={logout_icon} alt="Logout Icon" class="h-9 w-9 rounded-full" />
            </button>
        {/if}
    </div>
</div>
