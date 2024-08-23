<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import account_circle from '../icons/account_circle.svg';
	import ImageUploader from '$lib/components/misc/ImageUploader.svelte';
	import { userStore } from '$lib/stores/UserStore';

	let validationError = writable('');
	let fName = '';
	let lName = '';
	let enteredUserName = '';
	let globalUserID = '';
	let blogName = '';
	let bio = '';
	let profile_image_url: string | undefined; // Default image
    $: user = $userStore;

	let showUploader = writable(false);

	function openUploader() {
		showUploader.set(true);
	}

	async function isUsernameTaken(username: string, currentUserID: string) {
		const { data, error } = await supabase
			.from('Users')
			.select('username')
			.eq('username', username)
			.limit(1);

		if (data && data.length > 0) {
			const { data, error } = await supabase
				.from('Users')
				.select('username, id')
				.eq('username', username)
				.single();
			if (error) throw error;
			return data.id != currentUserID;
		}
	}

	async function submitInfo() {
		try {
			const currentUser = supabase.auth.getUser();
			const userID = (await currentUser).data.user?.id;
			userID == null ? null : (globalUserID = userID);
			const userNameExists = await isUsernameTaken(enteredUserName, globalUserID);

			if (!currentUser) {
				validationError.set('User is not authenticated. Check your email.');
				return;
			}

			if (userNameExists) {
				validationError.set('Username already exsists.');
				return;
			}

			const { data: existingProfile, error: profileError } = await supabase
				.from('Users')
				.select('id')
				.eq('id', userID)
				.limit(1);

			if (profileError) throw profileError;
			if (existingProfile && existingProfile.length > 0) {
				console.log(
					'Updating first name to ' +
						fName +
						', last name to ' +
						lName +
						' and username to: ' +
						enteredUserName
				);

				const { data, error } = await supabase
					.from('Users')
					.update({
						id: userID,
						username: enteredUserName,
						first_name: fName,
						last_name: lName,
						blog_name: blogName,
						bio: bio
					})
					.eq('id', userID)
					.select('id');

				console.log('Data Updated successfully: ', data);
				if (error) {
					console.log('Error updating data: ', error);
				}

				goto(`/${enteredUserName}`);
			} else {
				const { data, error } = await supabase
					.from('Users')
					.insert([
						{
							id: userID,
							username: enteredUserName,
							first_name: fName,
							last_name: lName,
							blog_name: blogName,
							bio: bio
						}
					])
					.select();

				console.log('Data Inserted successfully: ', data);
				goto(`/${enteredUserName}`);

				if (error) {
					console.log('Error updating data: ', error);
				}
			}
		} catch (e) {
			console.error(e);
			validationError.set('An error occurred. Please try in a little bit.');
		}
	}

	async function loadUserInfo() {
		const currentUser = supabase.auth.getUser();
		const userID = (await currentUser).data.user?.id;
		const { data, error } = await supabase
			.from('Users')
			.select('username, first_name, last_name, profile_image_url, blog_name, bio')
			.eq('id', userID)
			.single();

		if (data) {
			enteredUserName = data.username;
			fName = data.first_name;
			lName = data.last_name;
			profile_image_url = user?.image?.url;
			blogName = data.blog_name;
			bio = data.bio;
		}

		if (error) {
			console.log(error.message);
		}
	}

	loadUserInfo();
</script>

<div class="flex justify-center items-center h-screen bg-transparent">
	<div class="card w-96 h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
		<div class="card-body flex flex-col items-center">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="mb-4">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img
					src={profile_image_url}
					alt="User's profile picture"
					class="profile-picture h-32 rounded-full cursor-pointer"
					on:click={openUploader}
				/>
		
				{#if $showUploader}
					<ImageUploader bind:profileImageUrl={profile_image_url} on:close={() => showUploader.set(false)} />
				{/if}
			</div>
			<h2 class="card-title text-3xl">Welcome back!</h2>
			<input
				bind:value={fName}
				type="text"
				placeholder="Enter First Name"
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<input
				bind:value={lName}
				type="text"
				placeholder="Enter Last Name"
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<input
				bind:value={enteredUserName}
				type="text"
				placeholder="Enter Username"
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<input
				bind:value={blogName}
				type="text"
				placeholder="Enter Name of Blog"
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<textarea
				bind:value={bio}
				rows="5"
				cols="80"
				placeholder="Enter bio..."
				class="input input-bordered input-primary w-full max-w-sm text-white"
			/>
			<div class="h-4" />

			<div class="flex flex-row min-w-full justify-around">
				<button class="btn btn-outline btn-primary" on:click={submitInfo}>Continue</button>
			</div>
			<p class="text-red-500">{$validationError}</p>
		</div>
	</div>
</div>
