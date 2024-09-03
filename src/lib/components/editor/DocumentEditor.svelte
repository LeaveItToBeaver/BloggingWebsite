<script lang="ts">
  import { onMount } from 'svelte';
  let quill: any = null;
  let editorContainer: HTMLElement;

  // Check if running in the browser environment
  const isBrowser = typeof window !== 'undefined';

  onMount(() => {
    if (isBrowser && editorContainer) {
      import('quill').then(({ default: Quill }) => {
        import('quill/dist/quill.snow.css');

        quill = new Quill(editorContainer, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['clean']
            ]
          }
        });
      }).catch(error => {
        console.error('Error loading Quill:', error);
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

{#if isBrowser}
  <div bind:this={editorContainer}></div>
{/if}
