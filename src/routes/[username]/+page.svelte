<script lang="ts">
	import UserDashboard from '$lib/components/user-components/UserDashboard.svelte';
	import DocumentEditor from '$lib/components/editor/DocumentEditor.svelte';
	import add_icon from '$lib/icons/add_icon.svg';
	import { onDestroy, onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { userStore } from '$lib/stores/UserStore';
  
	let editor: DocumentEditor;
	let viewDocumentEditor = false;
	let enteredtitle = '';
	let dirty = false;
	let isPost = false; // Initialize isPost
  
	$: user = $userStore;
  
	function openDocumentBuilder() {
	  viewDocumentEditor = true;
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
				save_state: isPost ? null : contentObject,
				created_at: currentTimestamp,
				last_save_date: currentTimestamp,
				user_id: user?.id,
				title: enteredtitle,
				content: isPost ? contentObject : null
			  }
			])
			.select();
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
	  isPost = false; // Set to false to save as draft
	  await saveOrPostContent();
	}
  
	async function postContent() {
	  isPost = true; // Set to true to post the content
	  await saveOrPostContent();
	}
  
	function closeEditor() {
	  if (dirty && confirm('You have unsaved changes, would you like to save them as a draft?')) {
		saveDraft();
	  }
	  viewDocumentEditor = false;
	}
  
	onMount(async () => {
	  await userStore.checkSession();
  
	  window.addEventListener('beforeunload', handleBeforeUnload);
  
	  if (viewDocumentEditor && editor) {
		editor.setContent('<p>Initial content</p>');
		editor.$on('text-change', () => {
		  dirty = true;
		});
	  }
	});
  
	onDestroy(() => {
	  window.removeEventListener('beforeunload', handleBeforeUnload);
	});
  
	function handleBeforeUnload(event: Event) {
	  if (dirty) {
		event.preventDefault();
	  }
	}
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
  