import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

interface UserProfile {
	id: string;
	username: string;
	profile_image_url: string;
}

function createUserRepository() {
	const { subscribe, set, update } = writable<Record<string, UserProfile>>({});

	return {
		subscribe,
		fetchUser: async (userId: string) => {
			const { data, error } = await supabase
				.from('Users')
				.select('id, username, profile_image_url')
				.eq('id', userId)
				.single();

			if (error) {
				console.error('Error fetching user:', error);
			} else if (data) {
				update((users) => ({ ...users, [userId]: data }));
				return data;
			}
		},
		getUser: (userId: string) => {
			return new Promise<UserProfile | null>((resolve) => {
				subscribe((users) => {
					if (users[userId]) {
						resolve(users[userId]);
					} else {
						resolve(null);
					}
				})();
			});
		}
	};
}

export const userRepository = createUserRepository();
