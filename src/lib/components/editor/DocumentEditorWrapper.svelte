<script lang="ts">
	import DocumentEditor from '$lib/components/editor/DocumentEditor.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { writable } from 'svelte/store';
	import add_icon from '../../icons/add_icon.svg';

	export let isCurrentUser: boolean;
	export let selectedUserId: string;

	let editor: DocumentEditor;
	let enteredtitle = '';
	let dirty = false;
	let isPost = writable(false);
	let viewDocumentEditor = writable(false);

	function openDocumentBuilder() {
		viewDocumentEditor.set(true);
		dirty = false;
	}

	async function saveOrPostContent() {
		if (editor) {
			try {
				const content = editor.getContent();
				const currentTimestamp = new Date().toISOString();
				const contentObject = {
					html: content
				};

				const { data, error } = await supabase
					.from('Posts')
					.insert([
						{
							save_state: $isPost ? null : contentObject,
							created_at: currentTimestamp,
							last_save_date: currentTimestamp,
							user_id: selectedUserId,
							title: enteredtitle,
							content: $isPost ? contentObject : null
						}
					])
					.select();

				if (data) {
					viewDocumentEditor.set(false);
				}

				dirty = false;
				console.log('Content saved:', content);
			} catch (error) {
				console.error('Issue saving data:', error);
			}
		} else {
			console.error('Editor not initialized');
		}
	}

	async function saveDraft() {
		isPost.set(false); // Set to false to save as draft
		await saveOrPostContent();
	}

	async function postContent() {
		isPost.set(true); // Set to true to post the content
		await saveOrPostContent();
	}

	function closeEditor() {
		if (dirty && confirm('You have unsaved changes, would you like to save them as a draft?')) {
			saveDraft();
		}
		viewDocumentEditor.set(false);
	}
</script>

<div class="flex flex-col items-center w-full overflow-visible">
	<div class="flex flex-row align-middle justify-center">
		{#if isCurrentUser}
			<button class="btn btn-circle" on:click={openDocumentBuilder}>
				<img
					src={add_icon}
					alt="Add blog post"
					class="w-20 rounded-full align-middle justify-center"
				/>
			</button>
		{/if}
	</div>

	{#if $viewDocumentEditor && isCurrentUser}
		<div id="editor" class="ml-4 mr-4">
			<input
				bind:value={enteredtitle}
				type="text"
				placeholder="Enter a Title"
				class="input input-bordered input-secondary w-min mb-4 rounded-none"
			/>
			{#if typeof window !== 'undefined'}
				<DocumentEditor bind:this={editor} />
			{/if}
			<button on:click={postContent} class="btn btn-primary mt-4">Post</button>
			<button on:click={saveDraft} class="btn btn-secondary mt-4">Save Draft</button>
			<button on:click={closeEditor} class="btn btn-error mt-4">Cancel</button>
		</div>
	{/if}
</div>
