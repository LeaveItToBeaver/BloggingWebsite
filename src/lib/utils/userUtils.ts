import { supabase } from '$lib/supabaseClient';

export async function fetchUserInfo(username: string) {
	const { data, error } = await supabase
		.from('Users')
		.select('username, first_name, last_name, profile_image_url, blog_name, bio, id')
		.eq('username', username)
		.single();

	if (error) {
		console.error('Error fetching user information:', error);
		return null;
	}
	return data;
}

export async function getLoggedInUserId() {
	const currentUser = await supabase.auth.getUser();
	return currentUser.data.user?.id;
}
