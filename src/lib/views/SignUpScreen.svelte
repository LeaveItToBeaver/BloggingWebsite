<script>
  import { supabase } from '$lib/supabaseClient'; 
  import Textbox from '$lib/components/userlogin/TextBox.svelte';
  import Button from '$lib/components/userlogin/Button.svelte';

  let email = '';
  let password = '';

  async function signUp() {
      const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password
      })
  }
</script>

<div class="flex flex-auto justify-center items-center">
  <h1>Welcome!</h1>
</div>

<div class="flex w-full h-screen flex-auto justify-center items-center">
    <div class="flex flex-col max-w-min justify-center items-center align-middle border-yellow-600 border-2">
        <Textbox bind:value={email} placeholder="Email" />
        <Textbox bind:value={password} placeholder="Password" password={true} />
        <Button label="Sign Up!" on:click={signUp} />
    </div>
</div>