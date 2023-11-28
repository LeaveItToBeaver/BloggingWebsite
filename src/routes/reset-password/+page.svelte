<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { writable } from 'svelte/store';

	let validationError = writable('');
	let email: string = '';

	function isValidEmail(email: string) {
		const regex = /^\S+@\S+\.\S+$/;
		return regex.test(email);
	}

	async function requestPasswordReset() {
		if (!isValidEmail(email)) {
			validationError.set('Please enter a valid email.');
			return;
		}

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: 'http://localhost:3000/update-password'
		});

		if (error) {
			validationError.set(error.message);
		} else {
			validationError.set('Check your email, we just sent a reset link, do not forget it this time. :)');
		}
	}
</script>

<div class="flex w-full h-screen bg-transparent justify-center items-center text-white">
	<div class="card w-auto h-auto bg-white rounded-lg p-8 shadow-lg text-black max-w-lg mx-auto">
		<div class="card-body flex flex-col items-center">
			<h2 class="text-2xl font-bold mb-6 text-center">Reset Password</h2>
			<input type="text" bind:value={email} placeholder="Enter your email" class="input input-bordered input-primary w-full max-w-sm text-white" />

			<div class="h-4"></div>

			<button class="btn btn-outline btn-primary" on:click={requestPasswordReset}>Request Reset</button>
			<a href="/login" class="btn btn-outline btn-secondary">Back to Login</a>

			<p class="text-red-500">{$validationError}</p>
		</div>
	</div>
</div>
