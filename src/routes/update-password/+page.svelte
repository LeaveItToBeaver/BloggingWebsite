<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { writable } from 'svelte/store';

	let validationError = writable('');
	let password: string = '';
	let confirmPassword: string = '';

	function isValidPassword(password: string) {
		return password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password);
	}

	async function updatePassword() {
		if (password !== confirmPassword) {
			validationError.set('Passwords do not match');
			return;
		}

		if (!isValidPassword(password)) {
			validationError.set('Password must be at least 6 characters, contain at least one uppercase letter and one number');
			return;
		}

		const { error } = await supabase.auth.updateUser({ password: password });

		if (error) {
			validationError.set(error.message);
		} else {
			validationError.set('Password updated successfully!');
			// Optionally redirect to login or dashboard after a successful password update
		}
	}
</script>

<div class="flex w-full h-screen bg-transparent justify-center items-center text-white">
	<div class="card w-auto h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
		<div class="card-body flex flex-col items-center">
			<h2 class="text-2xl font-bold mb-6 text-center">Update Password</h2>

			<input type="password" bind:value={password} placeholder="New Password" class="input input-bordered input-primary w-full max-w-sm text-white" />
			<input type="password" bind:value={confirmPassword} placeholder="Confirm New Password" class="input input-bordered input-primary w-full max-w-sm text-white" />

			<div class="h-4"></div>

			<button class="btn btn-outline btn-primary" on:click={updatePassword}>Update Password</button>

			<p class="text-red-500">{$validationError}</p>
		</div>
	</div>
</div>
