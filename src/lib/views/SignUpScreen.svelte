<script>
    import { supabase } from '$lib/supabaseClient'; 
	import { Container } from 'postcss';
  
    let email = '';
    let password = '';
  
    async function signUp() {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })
    }
</script>
<div class="flex w-full flex-auto justify-center border-blue-400 border-2">
    <div class="flex flex-col max-w-min justify-center items-center align-middle border-yellow-600 border-2 ">
        <input class="border-red-600 border-2 w-auto max-w-lg m-2" bind:value={email} placeholder="Email" />
        <input class="m-2 border-red-600 border-2" bind:value={password} type="password" placeholder="Password" />
        <button class="rounded-full border-cyan-700 border-2 w-3/4" on:click={signUp}>Sign Up!</button>
    </div>
</div>

