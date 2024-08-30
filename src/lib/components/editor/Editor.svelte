<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Quill from 'quill';
    import 'quill/dist/quill.snow.css';
  
    export let readOnly = false;
    export let defaultValue;
    export let onTextChange;
    export let onSelectionChange;
  
    let containerRef: HTMLDivElement;
    let quill: Quill | null = null;
  
    onMount(() => {
      const editorContainer = document.createElement('div');
      containerRef.appendChild(editorContainer);
  
      quill = new Quill(editorContainer, {
        theme: 'snow',
      });
  
      if (defaultValue) {
        quill.setContents(defaultValue);
      }
  
      quill.on('text-change', (...args) => {
        if (onTextChange) {
          onTextChange(...args);
        }
      });
  
      quill.on('selection-change', (...args) => {
        if (onSelectionChange) {
          onSelectionChange(...args);
        }
      });
  
      return () => {
        quill = null;
        containerRef.innerHTML = '';
      };
    });
  
    $: if (quill) {
      quill.enable(!readOnly);
    }
  </script>
  
  <div bind:this={containerRef}></div>
  