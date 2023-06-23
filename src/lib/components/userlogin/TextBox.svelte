<script>
    export let value = '';
    export let placeholder = '';
    export let password = false;
</script>

{#if password}
    <input type="password" 
           class="m-2 border-blue-300 hover:border-blue-600 focus:border-blue-600 transition-colors w-full py-2 px-4 rounded" 
           placeholder={placeholder} 
           on:input="{(e) => value = e.target.value}" />
{:else}
    <input type="text" 
           class="m-2 border-blue-300 hover:border-blue-600 focus:border-blue-600 transition-colors w-full py-2 px-4 rounded" 
           placeholder={placeholder} 
           on:input="{(e) => value = e.target.value}" />
{/if}
