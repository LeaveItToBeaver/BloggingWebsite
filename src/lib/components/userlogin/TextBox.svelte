<script>
  export let value = '';
  export let placeholder = '';
  export let password = false;
  export let cssClass = '';
</script>

{#if password}
  <input type="password" 
         class="m-2 border-blue-300 hover:border-blue-600 focus:border-blue-600 transition-colors w-full py-2 px-4 rounded {cssClass}" 
         placeholder={placeholder} 
         bind:value={value} />
{:else}
  <input type="text" 
         class="m-2 border-blue-300 hover:border-blue-600 focus:border-blue-600 transition-colors w-full py-2 px-4 rounded {cssClass}" 
         placeholder={placeholder} 
         bind:value={value} />
{/if}


<style>
  /* Define the red ring animation */
@keyframes highlight {
  0% {
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.5);
  }
  70% {
      box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}

.passwordMismatch {
  animation: highlight 1s ease-in-out;
  border: 1px solid red;
}
</style>