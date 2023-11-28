<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	let validationError = writable('');
	let fName = '';
	let lName = '';
	let enteredUserName = '';
	let blogName = '';
	let profileImageUrl = '/default/path/to/image.png'; // Default image

	async function isUsernameTaken(username: string) {
		const { data, error } = await supabase
			.from('Users')
			.select('username')
			.eq('username', username)
			.limit(1);

		if (error) throw error;
		return data && data.length > 0;
	}

	async function submitInfo() {
		try {
			const currentUser = supabase.auth.getUser();
			if (!currentUser) {
				validationError.set('User is not authenticated. Check your email.');
				return;
			}

			const userID = (await currentUser).data.user?.id;
			const userNameExists = await isUsernameTaken(enteredUserName);

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
				console.log("Updating first name to " 
				 + fName 
				 + ", last name to " 
				 + lName
				 + " and username to: " 
				 + enteredUserName)
				const { data, error } = await supabase
					.from('Users')
					.update({
						username: enteredUserName,
						first_name: fName,
						last_name: lName
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
							last_name: lName
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
			.select('username, first_name, last_name, profile_image_url, blog_name')
			.eq('id', userID)
			.single();

		if (data) {
			enteredUserName = data.username;
			fName = data.first_name;
			lName = data.last_name;
			profileImageUrl = data.profile_image_url;
			blogName = data.blog_name;
		}
		if (error) {
			console.log(error.message);
		}
	}

	async function uploadImage(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		const file = inputElement.files?.[0];
		if (!file) return;

		const filePath = `profile_images/${file.name}`;
		let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

		if (uploadError) {
			console.error(uploadError);
		} else {
			profileImageUrl = filePath; // Update the URL in your state
		}
	}

	loadUserInfo();
</script>

<div class="flex justify-center items-center h-screen bg-transparent">
	<div class="card w-96 h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
		<div class="card-body flex flex-col items-center">
			<div class="mb-4">
				<label for="file">
					<!-- svelte-ignore a11y-img-redundant-alt -->
					<img
						src={profileImageUrl}
						alt="User's profile picture"
						class="h-32 w-32 rounded-full cursor-pointer"
					/>
				</label>
				<input id="file" type="file" class="hidden" on:change={uploadImage} />
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
			<div class="h-4" />

			<div class="flex flex-row min-w-full justify-around">
				<button class="btn btn-outline btn-primary" on:click={submitInfo}>Continue</button>
			</div>
			<p class="text-red-500">{$validationError}</p>
		</div>
	</div>
</div>
