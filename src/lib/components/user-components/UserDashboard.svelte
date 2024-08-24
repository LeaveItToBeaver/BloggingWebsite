<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import account_circle from '../../icons/account_circle.svg';
	import { onMount } from 'svelte';

	let validationError = writable('');
	let fName = '';
	let lName = '';
	let enteredUserName = '';
	let globalUserID = '';
	let blogName = '';
	let bio = '';
	let profile_image_url = account_circle; // Default image

	async function loadUserInfo() {
		const currentUser = supabase.auth.getUser();
		const userID = (await currentUser).data.user?.id;

		if (!userID) {
			console.error('User ID is undefined. Cannot load user information.');
			return;
		}

		const { data, error } = await supabase
			.from('Users')
			.select('username, first_name, last_name, profile_image_url, blog_name, bio')
			.eq('id', userID)
			.single();

		if (data) {
			enteredUserName = data.username;
			fName = data.first_name;
			lName = data.last_name;

			// Check if `profile_image_url` is already a full URL
			if (data.profile_image_url && !data.profile_image_url.startsWith('http')) {
				// If it's not a full URL, generate it using Supabase's storage URL generator
				profile_image_url = supabase.storage.from('avatars').getPublicUrl(data.profile_image_url)
					.data.publicUrl;
			} else {
				// If it is already a full URL, use it directly
				profile_image_url = data.profile_image_url || account_circle;
			}

			blogName = data.blog_name;
			bio = data.bio;

			console.log('URL Retrieved', profile_image_url);
		}

		if (error) {
			console.error('Error loading user information:', error.message);
		}
	}

	onMount(() => {
		loadUserInfo();
	});
</script>

<div class="flex flex-col items-center">
	<div
		class="card bg-white w-4/5 max-w-2xl mx-auto my-4 flex flex-row items-center"
		style="height: fit-content; max-height: 50%"
	>
		<div class="flex flex-col justify-center items-center w-1/4 h-full my-3 mx-2">
			<img
				src={profile_image_url}
				alt="User Photo"
				class="user-photo rounded-full mb-3"
				style="width: 70%; height: auto; max-height: 70%;"
				aria-hidden="true"
			/>
			<div>
				<h2 class=" text-black text-lg font-semibold text-center">{fName} {lName}</h2>
			</div>
		</div>
		<div class="flex flex-col justify-center w-3/4 h-full py-3 px-2">
			<div
				class="flex flex-row bg-slate-50 rounded-lg justify-center text-center py-1 drop-shadow-xl min-w-max">
				<h3 class="text-black text-xl font-semibold m-2 text-center">{blogName}</h3>
			</div>

			<div class="bio text-sm text-center">
				<p class="text-slate-950 font-semibold text-lg p-1">{bio}</p>
			</div>
		</div>
	</div>
</div>
