<script lang="ts">
    import UserDashboard from "$lib/components/user-components/UserDashboard.svelte"
    import DocumentEditor from "../../lib/components/misc/DocumentEditor.svelte"
    import add_icon from '../../lib/icons/add_icon.svg';

    let viewDocumentEditor = false;

    function openDocumentBuilder(){
        viewDocumentEditor = true;
    }

</script>

<UserDashboard/>

<div class="flex flex-col items-center ">
	<div class="flex flex-row flex-1">
		<button class="btn btn-circle" on:click={openDocumentBuilder}>
            <img srcset={add_icon} alt="Add blog post" class="h-20 w-20 rounded-full">
        </button>
	</div>
	<div id="editor" class="flex flex-row flex-2">
        {#if viewDocumentEditor}
            <DocumentEditor/>
        {/if}
    </div>
</div>
