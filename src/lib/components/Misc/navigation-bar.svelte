<!-- Nav.svelte -->
<script>
	import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabaseClient";
    let searchTerm = "";
    // TODO: Import user's image, default to some placeholder for now
    let userImage = "/path/to/user/image.png";
    async function logout() {
        await supabase.auth.signOut();
        goto('/login');
    }

    function settingsPage(){
        goto('/user-information')
    }
</script>

<div class="bg-gray-700 p-4 fixed w-full top-0 flex justify-center items-center">
    <!-- Search Bar -->
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
        <img src={userImage} alt="User Image" class="h-10 w-10 rounded-full" />

        <!-- Home & Settings Icons -->
        <!-- Note: You'll need some SVGs or icon fonts for these icons -->
        <button class="btn btn-circle btn-ghost">
            🏠 <!-- Replace with a home icon -->
        </button>

        <button class="btn btn-circle btn-ghost" on:click={settingsPage}>
            ⚙️ <!-- Replace with a settings icon -->
        </button>
        <button class="btn btn-circle btn-ghost" on:click={logout}>
            Logout
        </button>
    </div>
</div>
