// quillStore.ts
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Range } from 'quill';
import Sources from 'quill'

type QuillStore = {
  quill: any;
  range: Range | null;
  lastChange: any | null;
  initialize: (container: HTMLElement) => void;
};

export function createQuillStore(): Writable<QuillStore> & QuillStore {
  const { subscribe, set, update } = writable<QuillStore>({
    quill: null,
    range: null,
    lastChange: null,
    initialize: () => {}
  });

  return {
    subscribe,
    set,
    update,
    quill: null,
    range: null,
    lastChange: null,
    initialize: async (container: HTMLElement) => {
      const Quill = (await import('quill')).default;
      const Delta = (await import('quill-delta')).default;

      const quill = new Quill(container, {
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

      quill.on('text-change', (delta: typeof Delta, oldContents: typeof Delta, source: Sources) => {
        update(store => ({ ...store, lastChange: delta }));
      });

      quill.on('selection-change', (range: Range | null) => {
        update(store => ({ ...store, range }));
      });

      update(store => ({ ...store, quill }));
    }
  };
}