<script>
  import { supabase } from ''; 

  let email = '';
  let password = '';

  async function logIn() {
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) {
          console.error('Error logging in:', error.message);
      }
  }
</script>

<div>
  <input bind:value={email} placeholder="Email" />
  <input bind:value={password} type="password" placeholder="Password" />
  <button on:click={logIn}>Log In</button>
</div>
