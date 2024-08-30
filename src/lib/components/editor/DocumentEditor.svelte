<script lang="ts">
  import { onMount } from 'svelte';
  import Quill from 'quill';
  import 'quill/dist/quill.snow.css'; // Ensure this is included
  
  let quill: Quill;
  let editorContainer: HTMLElement;

  onMount(() => {
    if (editorContainer) {
      quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });
    }
  });

  export function getContent() {
    return quill ? quill.root.innerHTML : '';
  }

  export function setContent(content: string) {
    if (quill) {
      quill.root.innerHTML = content;
    }
  }
</script>

<div bind:this={editorContainer}></div>

