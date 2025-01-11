import { writable, type Writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

type UserImage = {
    url: string;
    alt: string;
};

type ExtendedUser = User & {
    image?: UserImage | null;
    userName?: string | null;
};

type UserStore = {
    subscribe: Writable<ExtendedUser | null>['subscribe'];
    setUser: (user: ExtendedUser | null) => void;
    clearUser: () => void;
    updateUser: (data: Partial<ExtendedUser>) => void;
    setImage: (image: UserImage | null) => void;
    clearImage: () => void;
    updateImage: (data: Partial<UserImage>) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
};

function createUserStore(): UserStore {
    const userStore = writable<ExtendedUser | null>(null);

    async function updateUserData(user: ExtendedUser) {
        const { data: userData, error } = await supabase
            .from('Users')
            .select('profile_image_url, username')
            .eq('id', user.id)
            .single();

        if (!error && userData) {
            let profileImageUrl = userData.profile_image_url;
            
            if (profileImageUrl && !profileImageUrl.startsWith('http')) {
                const { publicUrl } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(profileImageUrl)
                    .data;
                profileImageUrl = publicUrl;
            }

            user.image = profileImageUrl ? {
                url: profileImageUrl,
                alt: 'User Profile Image',
            } : null;
            user.userName = userData.username;
        }
        
        return user;
    }

    return {
        subscribe: userStore.subscribe,
        setUser: async (user: ExtendedUser | null) => {
            if (user) {
                const updatedUser = await updateUserData(user);
                userStore.set(updatedUser);
            } else {
                userStore.set(null);
            }
        },
        clearUser: () => userStore.set(null),
        updateUser: (data: Partial<ExtendedUser>) =>
            userStore.update((user) => (user ? { ...user, ...data } : null)),
        setImage: (image: UserImage | null) =>
            userStore.update((user) => (user ? { ...user, image } : null)),
        clearImage: () =>
            userStore.update((user) => (user ? { ...user, image: null } : null)),
        updateImage: (data: Partial<UserImage>) =>
            userStore.update((user) => (user && user.image ? { ...user, image: { ...user.image, ...data } } : user)),
        login: async (email: string, password: string) => {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            userStore.set(data.user);
        },
        logout: async () => {
            await supabase.auth.signOut();
            userStore.set(null);
        },
        checkSession: async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                const user = data.session.user as ExtendedUser;
                const updatedUser = await updateUserData(user);
                userStore.set(updatedUser);
            } else {
                userStore.set(null);
            }
        },
    };
}

export const userStore = createUserStore();
