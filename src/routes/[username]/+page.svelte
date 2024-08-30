<script lang="ts">
	import UserDashboard from '$lib/components/user-components/UserDashboard.svelte';
	import DocumentEditor from '$lib/components/editor/DocumentEditor.svelte';
	import add_icon from '$lib/icons/add_icon.svg';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { userStore } from '$lib/stores/UserStore';
    import { v4 as uuid4 } from 'uuid'

	let editor: DocumentEditor;
	let viewDocumentEditor = false;

	$: user = $userStore;

	function openDocumentBuilder() {
		viewDocumentEditor = true;
	}

	async function saveContent() {
		if (editor) {
			try {
				const content = editor.getContent();
				const uuid = uuid4(); 
				const currentTimestamp = new Date().toISOString();

				const contentObject = {
					html: content
				};

				const { data, error } = await supabase
					.from('Posts')
					.insert([
						{
							id: uuid,
							created_at: currentTimestamp,
							user_id: user?.id,
							title: 'Default Post Title',
							content: contentObject
						}
					])
					.select();
				console.log('Content to save:', content);
			} catch (error) {
				console.error('Issue saving data', error);
			}
		} else {
			console.error('Editor not initialized');
		}
	}

	onMount(async () => {
		await userStore.checkSession();

		if (viewDocumentEditor && editor) {
			editor.setContent('<p>Initial content</p>');
		}
	});
</script>

<UserDashboard />

<div class="flex flex-col items-center w-full overflow-visible">
	<div class="flex flex-row align-middle justify-center">
		<button class="btn btn-circle" on:click={openDocumentBuilder}>
			<img
				src={add_icon}
				alt="Add blog post"
				class="w-20 rounded-full align-middle justify-center"
			/>
		</button>
	</div>
</div>

{#if viewDocumentEditor}
	<div id="editor">
		<DocumentEditor bind:this={editor} />
		<button on:click={saveContent}>Save Content</button>
	</div>
{/if}
