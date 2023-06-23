<script>
  import { supabase } from '$lib/supabaseClient'; 

  let email = '';
  let password = '';

  async function logIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
  }
</script>

<div>
  <input bind:value={email} placeholder="Email" />
  <input bind:value={password} type="password" placeholder="Password" />
  <button on:click={logIn}>Log In</button>
</div>
