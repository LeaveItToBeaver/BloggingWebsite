<script>
    import "../app.css";
    import Nav from "$lib/components/misc/NavigationBar.svelte";
</script>

<style>
    .main-content {
        margin-top: 3rem; 
        overflow-y: auto;
    }
</style>

<Nav /> 

<div class="main-content">
    <slot /> 
</div>
