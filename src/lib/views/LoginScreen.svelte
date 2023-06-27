<script>
  import { supabase } from '$lib/supabaseClient'; 
  import Textbox from '$lib/components/userlogin/TextBox.svelte';
  import Button from '$lib/components/userlogin/Button.svelte';

  let email = '';
  let password = '';

  async function signIn() {
      const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
      });
  }
</script>


<div class="flex w-full h-screen bg-transparent justify-center items-center text-white">
<div class="flex flex-col bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto items-center">
  <h2 class="text-2xl font-bold mb-6 text-center">Welcome back!</h2>
  <Textbox bind:value={email} placeholder="Email" />
  <Textbox bind:value={password} placeholder="Password" password={true} />
  <Button label="Sign In" on:click={signIn} />
</div>
</div>
