<script>
    export let label = '';
    export let action = () => {};
  </script>
  
  <button class="w-full py-2 px-4 rounded bg-blue-300 hover:bg-blue-600 transition-colors" 
          on:click={action}>
    {label}
  </button>
  