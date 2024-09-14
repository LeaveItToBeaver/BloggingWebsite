import { writable, type Writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export interface Post {
	id: string;
	created_at: string;
	user_id: string;
	title: string;
	content: string | { html: string };
	image_url: string | null;
	likes: number;
	save_state: any | null;
	last_save_date: string;
}

interface PostStore {
	subscribe: Writable<Post[]>['subscribe'];
	fetchPosts: (userId: string) => Promise<void>;
	addPost: (newPost: Post) => void;
	updatePost: (updatedPost: Post) => void;
	deletePost: (postId: string) => void;
	likePost: (postId: string) => void;
	clearPosts: () => void;
}

function createPostStore(): PostStore {
	const { subscribe, set, update } = writable<Post[]>([]);

	return {
		subscribe,
		fetchPosts: async (userId: string) => {
			const { data, error } = await supabase
				.from('Posts')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching posts:', error);
			} else {
				set(data as Post[]);
			}
		},
		addPost: (newPost: Post) => {
			update((posts) => [newPost, ...posts]);
		},
		updatePost: (updatedPost: Post) => {
			update((posts) => posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
		},
		deletePost: (postId: string) => {
			update((posts) => posts.filter((post) => post.id !== postId));
		},
		likePost: (postId: string) => {
			update((posts) =>
				posts.map((post) => {
					if (post.id === postId) {
						return { ...post, likes: post.likes + 1 };
					}
					return post;
				})
			);
		},
		clearPosts: () => {
			set([]);
		}
	};
}

export const postStore = createPostStore();
