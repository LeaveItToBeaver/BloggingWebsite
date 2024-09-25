import { writable, type Writable } from 'svelte/store';
import { supabase } from '../supabaseClient';

type Like = {
    user_id: string;
    post_id: string;
    comment_id?: string;
};

type LikeStore = {
    subscribe: Writable<Like[] | null>['subscribe'];
    addLike: (post_id: string) => Promise<void>;
    removeLike: (post_id: string) => Promise<void>;
    checkIfLiked: (post_id: string) => Promise<boolean>;
    fetchLikesForPost: (post_id: string) => Promise<Like[]>;
};

function createLikeStore(): LikeStore {
    const likesStore = writable<Like[] | null>(null);

    return {
        subscribe: likesStore.subscribe,

        // Add a like
        addLike: async (post_id: string) => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('likes')
                .insert({ user_id: userData.user.id, post_id });

            if (error) throw error;

            // Update store locally
            likesStore.update((likes) => (likes ? [...likes, { user_id: userData.user.id, post_id }] : [{ user_id: userData.user.id, post_id }]));
        },

        // Remove a like
        removeLike: async (post_id: string) => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('user_id', userData.user.id)
                .eq('post_id', post_id);

            if (error) throw error;

            // Update store locally
            likesStore.update((likes) => likes?.filter((like) => like.post_id !== post_id) || []);
        },

        // Check if the user liked a post
        checkIfLiked: async (post_id: string): Promise<boolean> => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('likes')
                .select('post_id')
                .eq('user_id', userData.user.id)
                .eq('post_id', post_id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            return Boolean(data);
        },

        // Fetch likes for a post (to get like counts)
        fetchLikesForPost: async (post_id: string) => {
            const { data, error } = await supabase
                .from('likes')
                .select('*')
                .eq('post_id', post_id);

            if (error) throw error;

            return data;
        },
    };
}

export const likeStore = createLikeStore();
