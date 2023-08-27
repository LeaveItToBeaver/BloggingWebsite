<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	let validationError = writable('');
	let fName = '';
	let lName = '';
	let enteredUserName = '';

	async function isUsernameTaken(username: string) {
		const { data, error } = await supabase
			.from('User')
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
				.from('User')
				.select('id')
				.eq('id', userID)
				.limit(1);

			if (profileError) throw profileError;
			if (existingProfile && existingProfile.length > 0) {
				const { data, error } = await supabase
					.from('Users')
					.update({
						username: enteredUserName,
						first_name: fName,
						last_name: lName
					})
					.eq('id', userID)
					.select();
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
			}
		} catch (e) {
			console.error(e);
			validationError.set('An error occurred. Please try in a little bit.');
		}
	}
</script>

<div class="flex justify-center items-center h-screen bg-transparent">
	<div class="card w-96 h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
		<div class="card-body flex flex-col items-center">
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
				<button class="btn btn-outline btn-primary" on:click={submitInfo}>Sign In</button>
				<a href="/signup" class="btn btn-outline btn-primary">Sign Up</a>
			</div>
			<p class="text-red-500">{$validationError}</p>
		</div>
	</div>
</div>
