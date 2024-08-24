<!-- Nav.svelte -->

<style>
.nav-bar {
        z-index: 10; 
        position: fixed;
        top: 0;
        width: 100%;
        background-color: #fff; 
    }
</style>

<script>
	import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabaseClient";
	import account_circle from '../../icons/account_circle.svg';
    import home_icon from '../../icons/home_icon.svg';
    import logout_icon from '../../icons/logout.svg';
    import settings_icon from '../../icons/settings.svg';


    let searchTerm = "";
	let userImage = account_circle;
    async function logout() {
        await supabase.auth.signOut();
        goto('/login');
    }

    function settingsPage(){
        goto('/user-information')
    }
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
        <button class="btn btn-circle btn-ghost" >
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img srcset={account_circle} alt="User Image" class="h-9 w-9 rounded-full" />
        </button>
        <!-- Home & Settings Icons -->
        <button class="btn btn-circle btn-ghost" >
            <img srcset={home_icon} alt="Home Icon" class="h-9 w-9 rounded-full" />
        </button>

        <button class="btn btn-circle btn-ghost" on:click={settingsPage}>
            <img srcset={settings_icon} alt="Home Icon" class="h-9 w-9 rounded-full" />
        </button>
        <button class="btn btn-circle btn-ghost" on:click={logout}>
            <img srcset={logout_icon} alt="Home Icon" class="h-9 w-9 rounded-full" />
        </button>
    </div>
</div>
